import { useQuery } from '@tanstack/react-query'
import { probeIsAdmin } from '@/api/admin'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Whether the current user is an admin, determined by probing an
 * admin-only route (see `api/admin.ts::probeIsAdmin` for why — there is no
 * endpoint that reports role directly). Cached indefinitely per user id
 * since a role change mid-session is not something this app needs to react
 * to live; signing out clears `user.id` and the cache key changes.
 */
export function useIsAdmin() {
  const userId = useAuthStore((state) => state.user?.id)

  return useQuery({
    queryKey: queryKeys.auth.adminProbe(userId),
    queryFn: () => probeIsAdmin(userId!),
    enabled: userId !== undefined,
    staleTime: Infinity,
    retry: false,
  })
}
