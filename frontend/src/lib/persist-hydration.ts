/**
 * Shared `onRehydrateStorage` for zustand `persist` stores that expose a
 * `_setHasHydrated` action (see `stores/auth-store.ts` and
 * `stores/reservation-bag-store.ts`).
 *
 * Always marks hydration complete, even when the storage read/parse failed —
 * zustand's `persist` middleware passes that failure as an `error` argument,
 * which a naive `(state) => state?._setHasHydrated(true)` callback silently
 * drops. Left unhandled, a corrupted value, a blocked store (private
 * browsing) or a quota error can leave `hasHydrated` stuck at `false`
 * forever, which permanently and silently hides any UI gated on it — e.g.
 * the reservation bag trigger in `ReservationBagSheet`. The initial in-memory
 * state (always defined; it's the store's own actions, not what's read back
 * from storage) is what `_setHasHydrated` is called on, so this works
 * whether or not the read succeeded.
 */
export function createHydrationHandler<T extends { _setHasHydrated: (value: boolean) => void }>(
  storeName: string,
) {
  return (initialState: T | undefined) => (_persistedState: T | undefined, error: unknown) => {
    if (error) {
      console.error(`Failed to rehydrate "${storeName}" from storage:`, error)
    }
    initialState?._setHasHydrated(true)
  }
}
