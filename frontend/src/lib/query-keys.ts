/**
 * Centralized TanStack Query key scheme, one factory per resource.
 *
 * Keeping these here (rather than inlined at each `useQuery` call) makes
 * invalidation after mutations unambiguous, e.g.
 * `queryClient.invalidateQueries({ queryKey: queryKeys.products.all() })`.
 */
export const queryKeys = {
  products: {
    all: () => ['products'] as const,
    list: () => [...queryKeys.products.all(), 'list'] as const,
    detail: (productId: string) => [...queryKeys.products.all(), 'detail', productId] as const,
  },
  reservations: {
    all: () => ['reservations'] as const,
    /** `GET /reservations/` — admin only. */
    list: () => [...queryKeys.reservations.all(), 'list'] as const,
    /** `GET /reservations/me` — the signed-in customer's own reservations. */
    mine: () => [...queryKeys.reservations.all(), 'mine'] as const,
  },
  gallery: {
    all: () => ['gallery'] as const,
    list: () => [...queryKeys.gallery.all(), 'list'] as const,
  },
  users: {
    all: () => ['users'] as const,
    me: () => [...queryKeys.users.all(), 'me'] as const,
  },
  auth: {
    /** Result of probing an admin-only route (see `api/admin.ts::probeIsAdmin`). */
    adminProbe: (userId: string | undefined) => ['auth', 'admin-probe', userId] as const,
  },
}
