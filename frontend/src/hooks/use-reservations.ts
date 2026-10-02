import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteReservation,
  getAllReservations,
  getMyReservations,
  reserveProduct,
  updateReservation,
} from '@/api/reservations'
import { useProducts } from '@/hooks/use-products'
import { useIsAdmin } from '@/hooks/use-is-admin'
import { ApiError, reservationErrorMessage } from '@/lib/api-error'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/stores/auth-store'
import { useReservationBagStore } from '@/stores/reservation-bag-store'
import type { ProductsBaseSchema, ReservationsBaseSchema, ReservationsUpdate } from '@/types/api'

/** `GET /reservations/`. Admin only — only runs once the admin probe passes. */
export function useReservations() {
  const { data: isAdmin } = useIsAdmin()

  return useQuery({
    queryKey: queryKeys.reservations.list(),
    queryFn: getAllReservations,
    enabled: isAdmin === true,
  })
}

/** `GET /reservations/me`. Bearer required — only runs once a session exists. */
export function useMyReservations() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())

  return useQuery({
    queryKey: queryKeys.reservations.mine(),
    queryFn: getMyReservations,
    enabled: isAuthenticated,
  })
}

/**
 * `PATCH /reservations/{id}`. Admin only.
 *
 * Patches the cached reservations lists in place with the row the backend
 * returned, rather than invalidating and refetching them — editing a handle
 * doesn't change anything else a refetch could catch.
 */
export function useUpdateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: ReservationsUpdate
    }) => updateReservation(id, payload),
    onSuccess: (updated) => {
      const patch = (list: ReservationsBaseSchema[] | undefined) =>
        list?.map((reservation) => (reservation.id === updated.id ? updated : reservation))
      queryClient.setQueryData(queryKeys.reservations.list(), patch)
      queryClient.setQueryData(queryKeys.reservations.mine(), patch)
    },
  })
}

/**
 * `DELETE /reservations/{id}`. Admin only.
 *
 * The backend puts the product back on sale as part of the same call
 * (`reservations_util.delete_reservation` sets `status: 'available'`). Both
 * effects are patched into the cache directly from the response — dropping
 * the reservation row, flipping the matching product's status — instead of
 * invalidating the full reservations and products lists for a one-row
 * change.
 */
export function useDeleteReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reservationId: string) => deleteReservation(reservationId),
    onSuccess: (deleted) => {
      const dropReservation = (list: ReservationsBaseSchema[] | undefined) =>
        list?.filter((reservation) => reservation.id !== deleted.id)
      queryClient.setQueryData(queryKeys.reservations.list(), dropReservation)
      queryClient.setQueryData(queryKeys.reservations.mine(), dropReservation)

      const markAvailable = (product: ProductsBaseSchema): ProductsBaseSchema =>
        product.id === deleted.product_id ? { ...product, status: 'available' } : product
      queryClient.setQueryData(queryKeys.products.list(), (list: ProductsBaseSchema[] | undefined) =>
        list?.map(markAvailable),
      )
      queryClient.setQueryData(
        queryKeys.products.detail(deleted.product_id),
        (product: ProductsBaseSchema | undefined) => (product ? markAvailable(product) : product),
      )
    },
  })
}

/**
 * Resolves the bag's stored product ids against the live products list.
 *
 * The bag persists ids only (see `stores/reservation-bag-store.ts`), so this
 * is where they become real products — always at current price and status.
 * `missing` collects ids the products list doesn't contain any more (a
 * listing deleted while the bag sat in localStorage); the drawer shows those
 * as unavailable rather than silently dropping them, so the count in the
 * navbar never disagrees with what's in the drawer.
 */
export function useBagProducts() {
  const productIds = useReservationBagStore((state) => state.productIds)
  const { data: products, isLoading, isError } = useProducts()

  const { items, missingIds } = useMemo(() => {
    if (!products)
      return { items: [] as ProductsBaseSchema[], missingIds: [] as string[] }
    const byId = new Map(products.map((product) => [product.id, product]))
    const found: ProductsBaseSchema[] = []
    const missing: string[] = []
    for (const id of productIds) {
      const product = byId.get(id)
      if (product) found.push(product)
      else missing.push(id)
    }
    return { items: found, missingIds: missing }
  }, [products, productIds])

  return { items, missingIds, isLoading, isError }
}

/** Per-item outcome of a checkout, in the order the bag held them. */
export interface ReservationAttempt {
  productId: string
  title: string
  outcome: 'reserved' | 'taken' | 'failed'
  /** Human-readable reason, present for anything that isn't `reserved`. */
  message?: string
}

/**
 * Reserves every product in the bag, one request at a time.
 *
 * Sequential rather than `Promise.all` for two reasons: the endpoint is rate
 * limited to 5/minute per IP, and a partial failure has to be attributable to
 * a specific piece — parallel requests would make "which one was taken?"
 * guesswork. One failure does **not** abort the rest: the customer asked for
 * all of them, and each row is independent.
 *
 * Bag bookkeeping, per outcome:
 * - `reserved` — removed from the bag, it's theirs now.
 * - `taken` (409, the atomic guard lost the race) — also removed, because the
 *   piece is one-of-one and that request can never succeed on a retry.
 *   Reported by title so the customer knows exactly what they didn't get.
 * - `failed` (429, network, anything else) — **kept** in the bag, since
 *   retrying is the right next move.
 */
export function useReserveBag() {
  const queryClient = useQueryClient()
  const removeMany = useReservationBagStore((state) => state.removeMany)

  return useMutation({
    mutationFn: async ({
      products,
      instagram,
    }: {
      products: ProductsBaseSchema[]
      instagram: string
    }): Promise<ReservationAttempt[]> => {
      const attempts: ReservationAttempt[] = []
      // Collected and applied to the bag store in one write after the loop,
      // rather than per-item as each request settles — the latter re-renders
      // every subscriber (navbar badge, drawer list) once per attempt and
      // can visibly shrink the "reservable" list while the checkout it
      // belongs to is still in flight.
      const toRemove: string[] = []

      for (const product of products) {
        try {
          await reserveProduct(product.id, { instagram })
          attempts.push({
            productId: product.id,
            title: product.title,
            outcome: 'reserved',
          })
          toRemove.push(product.id)
        } catch (error) {
          const taken = error instanceof ApiError && error.isConflict
          attempts.push({
            productId: product.id,
            title: product.title,
            outcome: taken ? 'taken' : 'failed',
            message: reservationErrorMessage(error),
          })
          if (taken) toRemove.push(product.id)
        }
      }

      if (toRemove.length > 0) removeMany(toRemove)

      return attempts
    },
    // Invalidated whether or not every item succeeded: a 409 means the row is
    // `reserved` too (by someone else), so the cached list is stale either
    // way. This is what makes /store and the product page show `reserved`
    // with no manual refresh.
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all() })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.all(),
      })
    },
  })
}
