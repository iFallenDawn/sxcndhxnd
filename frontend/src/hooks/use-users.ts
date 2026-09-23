import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser, updateCurrentUser } from '@/api/users'
import { useAuthStore } from '@/stores/auth-store'
import { queryKeys } from '@/lib/query-keys'
import type { UsersUpdate } from '@/types/api'

/** `GET /users/me`. Bearer required — only runs once a session exists. */
export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())

  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
  })
}

/** `PATCH /users/me`. Bearer required. Also updates the auth store's cached user. */
export function useUpdateCurrentUser() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: (payload: UsersUpdate) => updateCurrentUser(payload),
    onSuccess: (user) => {
      setUser(user)
      queryClient.setQueryData(queryKeys.users.me(), user)
    },
  })
}
