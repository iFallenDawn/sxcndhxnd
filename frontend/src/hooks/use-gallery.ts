import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteGalleryImage, getGallery } from '@/api/gallery'
import { queryKeys } from '@/lib/query-keys'
import type { GalleryResponse } from '@/types/api'

/** `GET /gallery/`. Public. */
export function useGallery() {
  return useQuery({
    queryKey: queryKeys.gallery.list(),
    queryFn: getGallery,
  })
}

/**
 * `DELETE /gallery/{id}`. Admin only.
 *
 * Optimistically removes the image from the gallery list cache; restores it
 * on failure. Paired with a destructive confirmation in the UI — the
 * backend also removes the storage object, so the request itself cannot be
 * undone, only the optimistic UI state.
 */
export function useDeleteGalleryImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (galleryImageId: string) => deleteGalleryImage(galleryImageId),
    onMutate: async (galleryImageId: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.gallery.list() })
      const previous = queryClient.getQueryData<GalleryResponse>(queryKeys.gallery.list())
      queryClient.setQueryData<GalleryResponse>(queryKeys.gallery.list(), (old) =>
        old
          ? {
              ...old,
              gallery_images: old.gallery_images.filter((image) => image.id !== galleryImageId),
            }
          : old,
      )
      return { previous }
    },
    onError: (_error, _galleryImageId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.gallery.list(), context.previous)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.gallery.list() })
    },
  })
}
