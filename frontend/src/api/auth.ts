import { apiFetch } from '@/lib/api-client'
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

/**
 * `POST /auth/confirm`. Public. Used by the `/auth/callback` route to
 * exchange a `token_hash` (from the query-string form of a confirmation
 * link) for a session, once Supabase's email template points there directly.
 *
 * Not verified end-to-end against a live Supabase project as of writing —
 * the email template change is a manual dashboard step that hasn't happened
 * yet. See `lib/api-client.ts` for the same caveat on `/auth/refresh`.
 */
export function confirm(payload: AuthConfirmPayload) {
  return apiFetch<AuthSignInResponse>('/auth/confirm', {
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
