import { apiFetch } from '@/lib/api-client'
import type {
  AuthChangePasswordPayload,
  AuthRegisterPayload,
  AuthRegisterResponse,
  AuthSignInPayload,
  AuthSignInResponse,
  AuthUpdateEmailPayload,
  DetailResponse,
} from '@/types/api'

/**
 * `POST /auth/register`. Public. Requires email confirmation before the
 * account can sign in.
 */
export function registerUser(payload: AuthRegisterPayload) {
  return apiFetch<AuthRegisterResponse>('/auth/register', {
    method: 'POST',
    body: payload,
    authenticated: false,
  })
}

/**
 * `POST /auth/sign-in`. Public.
 *
 * Prefer `useAuthStore().signIn()` over calling this directly — the store
 * wraps it and also populates the current user.
 */
export function signIn(payload: AuthSignInPayload) {
  return apiFetch<AuthSignInResponse>('/auth/sign-in', {
    method: 'POST',
    body: payload,
    authenticated: false,
  })
}

/** `PATCH /auth/email`. Bearer required. */
export function updateEmail(payload: AuthUpdateEmailPayload) {
  return apiFetch<DetailResponse>('/auth/email', {
    method: 'PATCH',
    body: payload,
  })
}

/** `PATCH /auth/password`. Bearer required. */
export function changePassword(payload: AuthChangePasswordPayload) {
  return apiFetch<DetailResponse>('/auth/password', {
    method: 'PATCH',
    body: payload,
  })
}
