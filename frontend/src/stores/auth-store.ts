import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiFetch } from '@/lib/api-client'
import { refreshSession } from '@/api/auth'
import type {
  AuthSignInPayload,
  AuthSignInResponse,
  UsersBaseSchema,
} from '@/types/api'

interface SignOutOptions {
  /**
   * Whether to best-effort notify the backend via `POST /auth/sign-out`
   * before clearing local state. Set to `false` when signing out because a
   * refresh already failed (the refresh token is known-dead, and calling
   * the backend would itself 401 and re-enter the refresh path — see
   * `lib/api-client.ts`). Defaults to `true`.
   */
  notifyBackend?: boolean
}

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
  signOut: (options?: SignOutOptions) => Promise<void>
  /**
   * Exchanges the stored refresh token for a new access/refresh token pair
   * via `POST /auth/refresh` and persists both (Supabase rotates refresh
   * tokens on every use, so the old one is single-use). Throws if there is
   * no refresh token or the exchange fails — callers (see `apiFetch`) treat
   * that as "the session is dead" and sign out.
   */
  refresh: () => Promise<void>
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

      signOut: async (options) => {
        const { notifyBackend = true } = options ?? {}
        const { refreshToken } = get()

        if (notifyBackend && refreshToken) {
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

      refresh: async () => {
        const { refreshToken } = get()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const session = await refreshSession({ refresh_token: refreshToken })

        // Supabase rotates refresh tokens on every use — always persist the
        // newly returned one, never reuse the one we sent.
        set({
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
        })
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
