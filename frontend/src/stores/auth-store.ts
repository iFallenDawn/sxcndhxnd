import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiFetch, connectSession } from '@/lib/api-client'
import { createHydrationHandler } from '@/lib/persist-hydration'
import * as authApi from '@/api/auth'
import { useReservationBagStore } from '@/stores/reservation-bag-store'
import type { AuthSignInPayload, UsersMeSchema } from '@/types/api'

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
  user: UsersMeSchema | null
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
  setUser: (user: UsersMeSchema) => void
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
        const user = await apiFetch<UsersMeSchema>('/users/me', {
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
        // The reservation bag is per-account intent (an item's reserver is
        // stamped with the checkout-time handle), not a generic client-side
        // preference, and it persists independently of auth state in its own
        // localStorage key. Left uncleared, the next person to sign in on
        // this device would inherit the previous customer's bag.
        useReservationBagStore.getState().clear()
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
            // would need the very token that just failed. Same bag-leak
            // reasoning as signOut() above applies here too.
            set({ accessToken: null, refreshToken: null, user: null })
            useReservationBagStore.getState().clear()
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
      onRehydrateStorage: createHydrationHandler<AuthState>('sxcndhxnd-auth'),
    },
  ),
)

connectSession(useAuthStore.getState)

/**
 * Cross-tab sync for the persisted session.
 *
 * Supabase rotates the refresh token on every use (see `refresh` above), so
 * without this, a second tab left open with the pre-rotation token pair
 * would try to use it after another tab already burned it, get a genuine
 * 401, fail its own refresh (the token was already rotated), and sign
 * itself out locally — surfacing as e.g. an admin dashboard that
 * "randomly" disappears in one tab right after signing in or refreshing in
 * another. `storage` only fires in *other* tabs/windows, never the one that
 * made the write, so this can't loop against this tab's own updates.
 */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'sxcndhxnd-auth') {
      void useAuthStore.persist.rehydrate()
    }
  })
}
