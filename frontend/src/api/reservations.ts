import { apiFetch } from '@/lib/api-client'
import type {
  ProductsBaseSchema,
  ReservationsBaseSchema,
  ReservationsUpdate,
  ReserveProductRequest,
} from '@/types/api'

/**
 * `POST /products/{id}/reserve`.
 *
 * Auth is **optional** on this endpoint (`get_optional_user_id` /
 * `get_optional_access_token` in `backend/routers/products_router.py`), so it
 * is sent `authenticated: true` on purpose: a bearer token is attached when
 * there is a session — which is what makes the backend record `user_id` and
 * email the customer a confirmation — and simply omitted when there isn't,
 * letting guests reserve with just an Instagram handle.
 *
 * Returns the *product* (now `reserved`), not the reservation row. Rejects
 * with a 409 when the product was no longer `available` — the atomic
 * `available → reserved` guard in `products_util.reserve_product` losing the
 * race. Rate limited to 5/minute per IP, i.e. a 429 is expected for a large
 * bag; see `reserveBagSequentially` in `hooks/use-reservations.ts`.
 */
export function reserveProduct(
  productId: string,
  payload: ReserveProductRequest,
) {
  return apiFetch<ProductsBaseSchema>(`/products/${productId}/reserve`, {
    method: 'POST',
    body: payload,
  })
}

/** `GET /reservations/`. Admin only. */
export function getAllReservations() {
  return apiFetch<ReservationsBaseSchema[]>('/reservations/')
}

/** `GET /reservations/{id}`. Admin only. */
export function getReservationById(reservationId: string) {
  return apiFetch<ReservationsBaseSchema>(`/reservations/${reservationId}`)
}

/** `GET /reservations/me`. Any authenticated user. */
export function getMyReservations() {
  return apiFetch<ReservationsBaseSchema[]>('/reservations/me')
}

/** `PATCH /reservations/{id}`. Admin only — `instagram` is the only editable field. */
export function updateReservation(
  reservationId: string,
  payload: ReservationsUpdate,
) {
  return apiFetch<ReservationsBaseSchema>(`/reservations/${reservationId}`, {
    method: 'PATCH',
    body: payload,
  })
}

/**
 * `DELETE /reservations/{id}`. Admin only.
 *
 * The backend also flips the product back to `available`
 * (`reservations_util.delete_reservation`), so callers must invalidate the
 * products queries too, not just the reservations list.
 */
export function deleteReservation(reservationId: string) {
  return apiFetch<ReservationsBaseSchema>(`/reservations/${reservationId}`, {
    method: 'DELETE',
  })
}
