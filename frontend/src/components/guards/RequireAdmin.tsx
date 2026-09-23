import { Navigate, Outlet } from 'react-router'
import { useIsAdmin } from '@/hooks/use-is-admin'

/**
 * Layout-route guard: renders its children (`<Outlet />`) only once the
 * current user is confirmed to be an admin.
 *
 * There is no `role` field anywhere in the API (see `api/admin.ts`), so
 * "confirmed" here means "an admin-only route didn't 403 us" — see
 * `useIsAdmin`. Non-admins are redirected rather than shown a
 * broken/erroring page. Only mount this under `RequireAuth`, which handles
 * hydration and the signed-out redirect.
 */
export function RequireAdmin() {
  const { data: isAdmin, isPending } = useIsAdmin()

  if (isPending) {
    return null
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
