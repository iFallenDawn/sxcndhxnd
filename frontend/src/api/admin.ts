import { apiFetch } from '@/lib/api-client'
import { ApiError } from '@/lib/api-error'
import type { UsersBaseSchema } from '@/types/api'

/** `GET /admin/users/{id}`. Admin only. */
export function getUserAsAdmin(userId: string) {
  return apiFetch<UsersBaseSchema>(`/admin/users/${userId}`)
}

/**
 * There is no endpoint that reports whether the current user is an admin
 * (see issue #5 "No role exposure" — `GET /users/me` would be the right
 * place to add a `role` field). Until then, the only way to know is to
 * probe an admin-only route and read the status code.
 *
 * We probe `GET /admin/users/{ownId}`, which is admin-gated by
 * `require_admin` but read-only, so the check can never mutate anything.
 * Requesting the caller's own id means the row is guaranteed to exist, and
 * an admin gets a plain 200 rather than an error we have to interpret.
 */
export async function probeIsAdmin(userId: string): Promise<boolean> {
  try {
    await getUserAsAdmin(userId)
    return true
  } catch (error) {
    // A 403 means "not an admin"; any other status (401 expired session,
    // 404, 500, ...) is inconclusive, so fail closed rather than granting
    // admin UI on an ambiguous response.
    if (error instanceof ApiError) {
      return false
    }
    throw error
  }
}
