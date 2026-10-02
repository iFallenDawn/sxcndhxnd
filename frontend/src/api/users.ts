import { apiFetch } from '@/lib/api-client'
import type { UsersBaseSchema, UsersUpdate } from '@/types/api'

/** `GET /users/me`. Bearer required. */
export function getCurrentUser() {
  return apiFetch<UsersBaseSchema>('/users/me')
}

/** `PATCH /users/me`. Bearer required. */
export function updateCurrentUser(payload: UsersUpdate) {
  return apiFetch<UsersBaseSchema>('/users/me', {
    method: 'PATCH',
    body: payload,
  })
}
