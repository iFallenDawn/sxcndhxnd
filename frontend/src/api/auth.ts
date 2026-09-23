import { apiFetch, currentRefreshToken } from '@/lib/api-client'
import type {
  AuthChangePasswordPayload,
  AuthConfirmPayload,
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
 */
export function refreshSession(payload: AuthRefreshPayload) {
  return apiFetch<AuthSignInResponse>('/auth/refresh', {
    method: 'POST',
    body: payload,
    authenticated: false,
  })
}

/**
 * `POST /auth/confirm`. Public. Used by the `/auth/callback` route to
 * exchange a `token_hash` (from the query-string form of a confirmation
 * link) for a session, once Supabase's email template points there directly.
 */
export function confirm(payload: AuthConfirmPayload) {
  return apiFetch<AuthSignInResponse>('/auth/confirm', {
    method: 'POST',
    body: payload,
    authenticated: false,
  })
}

/** `PATCH /auth/email`. Bearer required; the refresh token is read from the session. */
export function updateEmail({ new_email }: Omit<AuthUpdateEmailPayload, 'refresh_token'>) {
  return apiFetch<DetailResponse>('/auth/email', {
    method: 'PATCH',
    body: { new_email, refresh_token: currentRefreshToken() },
  })
}

/** `PATCH /auth/password`. Bearer required; the refresh token is read from the session. */
export function changePassword({
  current_password,
  new_password,
}: Omit<AuthChangePasswordPayload, 'refresh_token'>) {
  return apiFetch<DetailResponse>('/auth/password', {
    method: 'PATCH',
    body: { current_password, new_password, refresh_token: currentRefreshToken() },
  })
}
