import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/stores/auth-store'
import { useIsAdmin } from '@/hooks/use-is-admin'

/**
 * Layout-route guard: renders its children (`<Outlet />`) only once the
 * current user is confirmed to be an admin.
 *
 * There is no `role` field anywhere in the API (see `api/admin.ts`), so
 * "confirmed" here means "an admin-only route didn't 403 us" — see
 * `useIsAdmin`. Non-admins (and signed-out users) are redirected rather than
 * shown a broken/erroring page. Nest this under `RequireAuth` (or otherwise
 * ensure a session exists first) so the redirect target on failure is
 * unambiguous.
 */
export function RequireAdmin() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  const location = useLocation()
  const { data: isAdmin, isPending } = useIsAdmin()

  if (!hasHydrated) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  if (isPending) {
    return null
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
