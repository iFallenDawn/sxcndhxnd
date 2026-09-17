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
  gallery: {
    all: () => ['gallery'] as const,
    list: () => [...queryKeys.gallery.all(), 'list'] as const,
    detail: (galleryImageId: string) =>
      [...queryKeys.gallery.all(), 'detail', galleryImageId] as const,
  },
  users: {
    all: () => ['users'] as const,
    me: () => [...queryKeys.users.all(), 'me'] as const,
    public: (userId: string) => [...queryKeys.users.all(), 'public', userId] as const,
  },
  auth: {
    /** Result of probing an admin-only route (see `api/admin.ts::probeIsAdmin`). */
    adminProbe: (userId: string | undefined) => ['auth', 'admin-probe', userId] as const,
  },
}
