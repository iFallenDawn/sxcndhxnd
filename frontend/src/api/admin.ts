import { updateProduct } from '@/api/products'
import { ApiError } from '@/lib/api-error'

/**
 * There is no endpoint that reports whether the current user is an admin
 * (see issue #5 "No role exposure" — `GET /users/me` would be the right
 * place to add a `role` field). Until then, the only way to know is to
 * probe an admin-only route and read the status code.
 *
 * We probe with `PATCH /products/{random-uuid}` and an empty update body:
 * - `require_admin` runs as a FastAPI dependency before any product lookup,
 *   so a non-admin gets a 403 without the backend touching a row.
 * - An admin passes the dependency, then `products_util.update_product`
 *   looks up a product that (with overwhelming probability) doesn't exist
 *   and raises `NotFoundError` -> 404. No row is ever mutated either way.
 *
 * This is a pragmatic workaround, not a substitute for real role exposure —
 * it costs an extra round trip and depends on `/products/{id}` staying
 * admin-gated for writes.
 */
export async function probeIsAdmin(): Promise<boolean> {
  try {
    await updateProduct(crypto.randomUUID(), {})
    // Empty update matched and "succeeded" against a real product — still means the admin gate passed.
    return true
  } catch (error) {
    if (!(error instanceof ApiError)) {
      // Network/parse error: we can't tell, so fail closed.
      throw error
    }
    if (error.isForbidden) {
      return false
    }
    if (error.isNotFound) {
      // Passed the admin dependency, failed on the lookup — exactly the
      // expected outcome for an admin probing with a random id.
      return true
    }
    // Any other status (401 expired session, 422, 500, ...) is inconclusive.
    // Fail closed rather than granting admin UI on an ambiguous response.
    return false
  }
}
