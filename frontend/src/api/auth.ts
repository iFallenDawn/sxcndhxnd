import { apiFetch } from '@/lib/api-client'
import type {
  AuthChangePasswordPayload,
  AuthRefreshPayload,
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

/**
 * `POST /auth/refresh`. Public (no bearer needed — the refresh token itself
 * is the credential). Prefer `useAuthStore().refresh()` over calling this
 * directly, since the store also persists the rotated tokens.
 *
 * Not verified end-to-end against a live Supabase project as of writing —
 * see `lib/api-client.ts` for details.
 */
export function refreshSession(payload: AuthRefreshPayload) {
  return apiFetch<AuthSignInResponse>('/auth/refresh', {
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
