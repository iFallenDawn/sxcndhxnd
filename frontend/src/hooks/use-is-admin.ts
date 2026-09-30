import { useAuthStore } from '@/stores/auth-store'

/**
 * Whether the current user is an admin.
 *
 * `GET /users/me` (and `PATCH /users/me`) now return a `role` field
 * (`entities.models.UsersMeSchema` on the backend), so this reads straight
 * off the auth store's cached `user` instead of the old probe-an-admin-route
 * pattern (`api/admin.ts::probeIsAdmin`, now unused for this purpose).
 *
 * That old approach inferred admin status from whether `GET
 * /admin/users/{ownId}` 403'd, cached the result indefinitely per user id,
 * and — because `probeIsAdmin` treated *any* `ApiError` (a stray 401, a
 * 5xx, a rate limit) the same as a real 403 — a single transient failure
 * would get cached as a permanent "not admin" for the rest of the browser
 * session, making the dashboard nav/route intermittently disappear for
 * genuine admins. Reading `role` directly removes the network round trip
 * (and the failure mode) entirely: it's exactly as fresh as the session.
 *
 * `isPending` is true only while the persisted auth store hasn't finished
 * reading back from storage yet, mirroring the shape callers previously got
 * from `useQuery` (`{ data, isPending }`).
 */
export function useIsAdmin() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const role = useAuthStore((state) => state.user?.role)

  return {
    data: hasHydrated ? role === 'admin' : undefined,
    isPending: !hasHydrated,
  }
}
