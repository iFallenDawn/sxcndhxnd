import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { PageMeta } from '@/components/seo/PageMeta'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { confirm as confirmAuth } from '@/api/auth'
import { ApiError } from '@/lib/api-error'
import { friendlyAuthErrorMessage } from '@/lib/auth-validation'
import type { AuthConfirmPayload } from '@/types/api'

type Status = 'processing' | 'success' | 'error'

const CONFIRM_TYPES = new Set<AuthConfirmPayload['type']>([
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
])

function isConfirmType(value: string | null): value is AuthConfirmPayload['type'] {
  return value !== null && CONFIRM_TYPES.has(value as AuthConfirmPayload['type'])
}

/**
 * `/auth/callback` — the single landing spot for both shapes a Supabase
 * confirmation/magic-link email can currently produce:
 *
 *  1. **Implicit flow** (today's default): Supabase's own `/auth/v1/verify`
 *     redirects here with the session already minted, as a `#access_token=…`
 *     URL *fragment*. We read it, hand the tokens to the auth store, and —
 *     critically — strip the fragment with `history.replaceState` before
 *     anything else can observe it or it can land in history. See issue #18.
 *  2. **Token-hash flow** (after the email template is changed to point
 *     `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`
 *     here instead): a `?token_hash=&type=` *query string*, which we
 *     exchange for a session via `POST /auth/confirm`.
 *
 * Both paths strip the sensitive part of the URL immediately — including on
 * failure, so a malformed or expired link never leaves a token sitting in
 * the address bar or browser history either.
 */
export function AuthCallback() {
  const setSession = useAuthStore((state) => state.setSession)
  const [status, setStatus] = useState<Status>('processing')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // StrictMode double-invokes effects in dev; guard so we don't try to
  // consume (and strip) the same fragment/query twice.
  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    const rawHash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash
    const hashParams = new URLSearchParams(rawHash)
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')

    const searchParams = new URLSearchParams(window.location.search)
    const tokenHash = searchParams.get('token_hash')
    const confirmType = searchParams.get('type')

    // Strip whatever sensitive data is in the URL *before* awaiting
    // anything, using replaceState (never pushState) so the tokened URL
    // never becomes a navigable history entry — regardless of whether the
    // exchange below succeeds.
    window.history.replaceState(null, '', window.location.pathname)

    async function run() {
      try {
        if (accessToken && refreshToken) {
          await setSession({ access_token: accessToken, refresh_token: refreshToken })
          setStatus('success')
          return
        }

        if (tokenHash && isConfirmType(confirmType)) {
          const session = await confirmAuth({ token_hash: tokenHash, type: confirmType })
          await setSession(session)
          setStatus('success')
          return
        }

        setErrorMessage('This confirmation link is missing or malformed.')
        setStatus('error')
      } catch (error) {
        if (error instanceof ApiError) {
          setErrorMessage(
            friendlyAuthErrorMessage(error.detail, 'This confirmation link has expired or already been used.'),
          )
        } else {
          setErrorMessage('This confirmation link has expired or already been used.')
        }
        setStatus('error')
      }
    }

    void run()
  }, [setSession])

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
      <PageMeta title="Confirming Account" />
      <div className="w-full max-w-sm text-center">
        {status === 'processing' ? (
          <>
            <h1 className="heading-display text-2xl">Confirming your account…</h1>
            <p className="mt-2 text-sm text-muted-foreground">This will just take a moment.</p>
          </>
        ) : null}

        {status === 'success' ? (
          <>
            <h1 className="heading-display text-2xl">You're confirmed</h1>
            <p className="mt-2 text-sm text-muted-foreground">Your account is verified and you're signed in.</p>
            <Button asChild size="lg" className="mt-8 h-11 w-full">
              <Link to="/" replace>
                Continue
              </Link>
            </Button>
          </>
        ) : null}

        {status === 'error' ? (
          <>
            <h1 className="heading-display text-2xl">Confirmation failed</h1>
            <p role="alert" className="mt-2 text-sm text-destructive">
              {errorMessage}
            </p>
            <Button asChild size="lg" className="mt-8 h-11 w-full">
              <Link to="/sign-in" replace>
                Go to sign in
              </Link>
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )
}
