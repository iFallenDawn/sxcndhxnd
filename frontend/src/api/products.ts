import { apiFetch } from '@/lib/api-client'
import { uploadWithProgress } from '@/lib/upload-with-progress'
import type {
  ProductImageUploadResponse,
  ProductsBaseSchema,
  ProductsInsert,
  ProductsUpdate,
} from '@/types/api'

/** `GET /products/`. Public. */
export function getAllProducts() {
  return apiFetch<ProductsBaseSchema[]>('/products/', { authenticated: false })
}

/** `GET /products/{id}`. Public. */
export function getProductById(productId: string) {
  return apiFetch<ProductsBaseSchema>(`/products/${productId}`, { authenticated: false })
}

/** `POST /products/`. Admin only. */
export function createProduct(payload: ProductsInsert) {
  return apiFetch<ProductsBaseSchema>('/products/', {
    method: 'POST',
    body: payload,
  })
}

/** `PATCH /products/{id}`. Admin only. */
export function updateProduct(productId: string, payload: ProductsUpdate) {
  return apiFetch<ProductsBaseSchema>(`/products/${productId}`, {
    method: 'PATCH',
    body: payload,
  })
}

/** `DELETE /products/{id}`. Admin only. */
export function deleteProduct(productId: string) {
  return apiFetch<ProductsBaseSchema>(`/products/${productId}`, {
    method: 'DELETE',
  })
}

/**
 * `POST /products/upload-image` (multipart). Admin only. Uses
 * `XMLHttpRequest` so the dashboard's upload queue can show real per-file
 * progress (see `lib/upload-with-progress.ts`).
 */
export function uploadProductImageWithProgress(
  file: File,
  onProgress: (percent: number) => void,
  signal: AbortSignal,
) {
  const formData = new FormData()
  formData.append('file', file)
  return uploadWithProgress<ProductImageUploadResponse>(
    '/products/upload-image',
    formData,
    onProgress,
    signal,
  )
}
