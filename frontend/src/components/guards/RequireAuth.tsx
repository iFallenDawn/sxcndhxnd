import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Layout-route guard: renders its children (`<Outlet />`) only for a
 * signed-in session, otherwise redirects to `/sign-in`.
 *
 * Waits for the persisted auth store to hydrate before deciding, so a
 * signed-in user isn't briefly bounced to `/sign-in` on page refresh while
 * `localStorage` is still being read.
 */
export function RequireAuth() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  const location = useLocation()

  if (!hasHydrated) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  return <Outlet />
}
