import { apiFetch } from '@/lib/api-client'
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

/** `DELETE /gallery/{id}`. Admin only. */
export function deleteGalleryImage(galleryImageId: string) {
  return apiFetch<GalleryImagesBaseSchema>(`/gallery/${galleryImageId}`, {
    method: 'DELETE',
  })
}
