import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteGalleryImage,
  getGallery,
  getGalleryImageById,
  uploadGalleryImage,
} from '@/api/gallery'
import { queryKeys } from '@/lib/query-keys'

/** `GET /gallery/`. Public. */
export function useGallery() {
  return useQuery({
    queryKey: queryKeys.gallery.list(),
    queryFn: getGallery,
  })
}

/** `GET /gallery/{id}`. Public. */
export function useGalleryImage(galleryImageId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.gallery.detail(galleryImageId ?? ''),
    queryFn: () => getGalleryImageById(galleryImageId as string),
    enabled: galleryImageId !== undefined,
  })
}

/** `POST /gallery/` (multipart). Admin only. */
export function useUploadGalleryImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ file, description }: { file: File; description?: string }) =>
      uploadGalleryImage(file, description),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.gallery.list() })
    },
  })
}

/** `DELETE /gallery/{id}`. Admin only. */
export function useDeleteGalleryImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (galleryImageId: string) => deleteGalleryImage(galleryImageId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.gallery.list() })
    },
  })
}
