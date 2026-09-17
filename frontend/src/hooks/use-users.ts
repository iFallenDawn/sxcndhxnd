import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser, getPublicUser, updateCurrentUser } from '@/api/users'
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

/** `GET /users/{id}`. Bearer required (any authenticated user). */
export function usePublicUser(userId: string | undefined) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())

  return useQuery({
    queryKey: queryKeys.users.public(userId ?? ''),
    queryFn: () => getPublicUser(userId as string),
    enabled: isAuthenticated && userId !== undefined,
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
