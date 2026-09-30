import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * The local reservation bag (issue #10).
 *
 * WHY THIS HOLDS IDS AND HAS NO QUANTITY — READ BEFORE CHANGING
 * -------------------------------------------------------------
 * Issue #10 describes "a cart" and "automatically remove x1 from whatever
 * they reserved", which reads like a quantity-based cart. It isn't one, and
 * modelling it as one would be a lie the UI can't keep:
 *
 * - Every piece is one-of-one. `products.status` is a single column on a
 *   single row; `products_util.reserve_product` flips exactly one row from
 *   `available` to `reserved`. There is no stock count anywhere in the
 *   schema to decrement, so quantity could only ever be 1.
 * - `POST /products/{product_id}/reserve` reserves exactly one product per
 *   call and takes no quantity, so a bag of N is N sequential requests that
 *   can each independently succeed or fail (someone else may have taken one
 *   of them in the meantime).
 *
 * So the bag is a **set of product ids** — the intent to reserve, nothing
 * more. Ids rather than product snapshots on purpose: a persisted snapshot
 * would go stale in localStorage (price edited, piece reserved by someone
 * else, listing deleted) and the bag would then confidently show wrong
 * prices. Instead every id is resolved against the live
 * `queryKeys.products.list()` cache at render time, so the drawer always
 * shows current titles, prices and statuses — see `useBagProducts`.
 */
interface ReservationBagState {
  /** Product ids, in the order they were added. */
  productIds: string[]
  /** True once the persisted bag has been read back from storage on load. */
  hasHydrated: boolean
  add: (productId: string) => void
  remove: (productId: string) => void
  /** Drops everything — used after a checkout in which every item succeeded. */
  clear: () => void
  has: (productId: string) => boolean
  /** Internal: called by the `persist` middleware once storage has been read. */
  _setHasHydrated: (value: boolean) => void
}

export const useReservationBagStore = create<ReservationBagState>()(
  persist(
    (set, get) => ({
      productIds: [],
      hasHydrated: false,

      // Idempotent: a piece is one-of-one, so adding it twice is meaningless
      // and must not produce two reserve calls for the same row (the second
      // would 409 against our own first one).
      add: (productId) =>
        set((state) =>
          state.productIds.includes(productId)
            ? state
            : { productIds: [...state.productIds, productId] },
        ),

      remove: (productId) =>
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        })),

      clear: () => set({ productIds: [] }),

      has: (productId) => get().productIds.includes(productId),

      _setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'sxcndhxnd-reservation-bag',
      partialize: (state) => ({ productIds: state.productIds }),
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true)
      },
    },
  ),
)
