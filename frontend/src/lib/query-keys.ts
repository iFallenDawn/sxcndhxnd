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
  projects: {
    all: () => ['projects'] as const,
    list: () => [...queryKeys.projects.all(), 'list'] as const,
    detail: (projectId: string) => [...queryKeys.projects.all(), 'detail', projectId] as const,
    /** A project's products (`GET /projects/{id}/products`) — kept separate from `products.list()`. */
    products: (projectId: string) => [...queryKeys.projects.all(), 'products', projectId] as const,
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
}
