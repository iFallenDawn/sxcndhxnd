import { apiFetch } from '@/lib/api-client'
import { uploadWithProgress } from '@/lib/upload-with-progress'
import type { GalleryImagesBaseSchema, GalleryResponse } from '@/types/api'

/** `GET /gallery/`. Public. */
export function getGallery() {
  return apiFetch<GalleryResponse>('/gallery/', { authenticated: false })
}

/** `GET /gallery/{id}`. Public. */
export function getGalleryImageById(galleryImageId: string) {
  return apiFetch<GalleryImagesBaseSchema>(`/gallery/${galleryImageId}`, {
    authenticated: false,
  })
}

/** `POST /gallery/` (multipart `file`, form `description?`). Admin only. */
export function uploadGalleryImage(file: File, description?: string) {
  const formData = new FormData()
  formData.append('file', file)
  if (description !== undefined) {
    formData.append('description', description)
  }

  return apiFetch<GalleryImagesBaseSchema>('/gallery/', {
    method: 'POST',
    formData,
  })
}

/**
 * Same endpoint as {@link uploadGalleryImage}, via `XMLHttpRequest` so bulk
 * uploads can show real per-file progress (see `lib/upload-with-progress.ts`).
 */
export function uploadGalleryImageWithProgress(
  file: File,
  description: string | undefined,
  onProgress: (percent: number) => void,
  signal: AbortSignal,
) {
  const formData = new FormData()
  formData.append('file', file)
  if (description !== undefined && description !== '') {
    formData.append('description', description)
  }
  return uploadWithProgress<GalleryImagesBaseSchema>('/gallery/', formData, onProgress, signal)
}

/** `DELETE /gallery/{id}`. Admin only. */
export function deleteGalleryImage(galleryImageId: string) {
  return apiFetch<GalleryImagesBaseSchema>(`/gallery/${galleryImageId}`, {
    method: 'DELETE',
  })
}
