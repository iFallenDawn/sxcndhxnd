import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiFetch, connectSession } from '@/lib/api-client'
import * as authApi from '@/api/auth'
import type { AuthSignInPayload, UsersBaseSchema } from '@/types/api'

/**
 * Shared in-flight refresh. When several requests 401 at once (e.g. a page
 * firing multiple queries right as the access token expires), they all
 * await this *same* promise instead of each spending the single-use refresh
 * token on their own `POST /auth/refresh`. Resets once it settles.
 */
let refreshInFlight: Promise<void> | null = null

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UsersBaseSchema | null
  /** True once the persisted store has been read back from storage on load. */
  hasHydrated: boolean
  /** True only when both the tokens and `user` are present — see `setSession`. */
  isAuthenticated: () => boolean
  /** Signs in via `setSession`. Throws `ApiError` on failure. */
  signIn: (payload: AuthSignInPayload) => Promise<void>
  /**
   * Stores an already-issued access/refresh token pair (e.g. from the
   * `/auth/callback` route, which never calls `/auth/sign-in` itself)
   * together with `user` from `GET /users/me`, in one update. Throws if
   * fetching the user fails, in which case nothing is stored; callers should
   * treat that as "the tokens were bad."
   */
  setSession: (session: { access_token: string; refresh_token: string }) => Promise<void>
  /**
   * Clears local session state and best-effort notifies the backend via
   * `POST /auth/sign-out`. Local state is cleared even if that call fails,
   * since an expired/invalid token would otherwise strand the user signed in
   * on the client.
   */
  signOut: () => Promise<void>
  /**
   * Exchanges the stored refresh token for a new access/refresh token pair
   * via `POST /auth/refresh` and persists both (Supabase rotates refresh
   * tokens on every use, so the old one is single-use). If there is no
   * refresh token or the exchange fails, the session is dead: local state is
   * cleared and the promise rejects. Called by `apiFetch` on a 401.
   */
  refresh: () => Promise<void>
  setUser: (user: UsersBaseSchema) => void
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

      isAuthenticated: () => get().accessToken !== null && get().user !== null,

      signIn: async (payload) => get().setSession(await authApi.signIn(payload)),

      setSession: async (session) => {
        // Fetch the user with the new token *before* committing anything.
        const user = await apiFetch<UsersBaseSchema>('/users/me', {
          authenticated: false,
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        set({ accessToken: session.access_token, refreshToken: session.refresh_token, user })
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

      refresh: () => {
        refreshInFlight ??= (async () => {
          const { refreshToken } = get()
          try {
            if (!refreshToken) {
              throw new Error('No refresh token available')
            }
            const session = await authApi.refreshSession({ refresh_token: refreshToken })
            // Supabase rotates refresh tokens on every use — always persist
            // the newly returned one, never reuse the one we sent.
            set({ accessToken: session.access_token, refreshToken: session.refresh_token })
          } catch (error) {
            // The session is dead. Sign out locally only: telling the backend
            // would need the very token that just failed.
            set({ accessToken: null, refreshToken: null, user: null })
            throw error
          }
        })().finally(() => {
          refreshInFlight = null
        })
        return refreshInFlight
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

connectSession(useAuthStore.getState)
