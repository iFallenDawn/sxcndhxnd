import { apiFetch } from '@/lib/api-client'
import type { UsersMeSchema, UsersUpdate } from '@/types/api'

/** `GET /users/me`. Bearer required. */
export function getCurrentUser() {
  return apiFetch<UsersMeSchema>('/users/me')
}

/** `PATCH /users/me`. Bearer required. */
export function updateCurrentUser(payload: UsersUpdate) {
  return apiFetch<UsersMeSchema>('/users/me', {
    method: 'PATCH',
    body: payload,
  })
}
