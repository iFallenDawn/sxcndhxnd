import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiFetch } from '@/lib/api-client'
import type {
  AuthSignInPayload,
  AuthSignInResponse,
  UsersBaseSchema,
} from '@/types/api'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UsersBaseSchema | null
  /** True once the persisted store has been read back from storage on load. */
  hasHydrated: boolean
  isAuthenticated: () => boolean
  /** Signs in and populates `user` from `GET /users/me`. Throws `ApiError` on failure. */
  signIn: (payload: AuthSignInPayload) => Promise<void>
  /**
   * Clears local session state and best-effort notifies the backend via
   * `POST /auth/sign-out`. Local state is cleared even if that call fails,
   * since an expired/invalid token would otherwise strand the user signed in
   * on the client.
   */
  signOut: () => Promise<void>
  setUser: (user: UsersBaseSchema | null) => void
  /** Internal: called by the `persist` middleware once storage has been read. */
  _setHasHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hasHydrated: false,

      isAuthenticated: () => get().accessToken !== null,

      signIn: async (payload) => {
        const session = await apiFetch<AuthSignInResponse>('/auth/sign-in', {
          method: 'POST',
          body: payload,
          authenticated: false,
        })

        set({
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
        })

        const user = await apiFetch<UsersBaseSchema>('/users/me')
        set({ user })
      },

      signOut: async () => {
        const { refreshToken } = get()
        if (refreshToken) {
          try {
            await apiFetch('/auth/sign-out', {
              method: 'POST',
              body: { refresh_token: refreshToken },
            })
          } catch {
            // Ignore: the token may already be invalid/expired. We still
            // clear local state below so the user is signed out client-side.
          }
        }

        set({ accessToken: null, refreshToken: null, user: null })
      },

      setUser: (user) => set({ user }),

      _setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'sxcndhxnd-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true)
      },
    },
  ),
)

/*
 * TODO(refresh): There is no `POST /auth/refresh` endpoint on the backend
 * yet, so the `refreshToken` above is stored but never exchanged — once the
 * Supabase access token expires (default ~1h), authenticated requests will
 * start failing with 401 until the user signs in again.
 *
 * Options to fix this properly (tracked on issue #5):
 *   1. Add `POST /auth/refresh` to the backend that calls
 *      `client.auth.refresh_session(refresh_token)` and returns a new
 *      `{ access_token, refresh_token }` pair — mirrors the existing
 *      `sign_in` response shape and keeps the frontend backend-agnostic.
 *   2. Drive refresh directly from the client via `supabase-js`
 *      (`supabase.auth.refreshSession()`), which would mean this frontend
 *      talks to Supabase Auth directly instead of only through the FastAPI
 *      layer — a bigger architectural shift with its own tradeoffs (two
 *      sources of truth for the session, needs the anon key on the client).
 *
 * Once either lands, wire it in here — e.g. have `apiFetch` retry once on a
 * 401 by calling a new `refresh()` action before re-attempting the request.
 */
