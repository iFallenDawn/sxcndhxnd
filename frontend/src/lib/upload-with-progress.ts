import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/stores/auth-store'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Multipart upload with real upload-progress events, via `XMLHttpRequest`
 * (the `fetch`-based `apiFetch` in `lib/api-client.ts` has no progress
 * event). Used by the dashboard's image uploaders so a bulk upload of a few
 * hundred gallery photos shows visible per-file progress instead of a single
 * opaque spinner.
 *
 * Intentionally does not carry `apiFetch`'s 401-refresh-and-retry logic —
 * these uploads are short admin sessions; a stale token here surfaces as a
 * plain "session expired" error the caller can show and let the admin
 * retry after signing back in.
 */
export function uploadWithProgress<T>(
  path: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${BASE_URL}${path}`)

    const accessToken = useAuthStore.getState().accessToken
    if (accessToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
    }

    if (signal) {
      if (signal.aborted) {
        reject(new DOMException('Aborted', 'AbortError'))
        return
      }
      signal.addEventListener('abort', () => xhr.abort())
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onabort = () => reject(new DOMException('Aborted', 'AbortError'))
    xhr.onerror = () => reject(new ApiError(0, 'Network error — check your connection and try again.'))

    xhr.onload = () => {
      const text = xhr.responseText
      if (xhr.status >= 200 && xhr.status < 300) {
        if (!text) {
          resolve(undefined as T)
          return
        }
        try {
          resolve(JSON.parse(text) as T)
        } catch {
          resolve(undefined as T)
        }
        return
      }

      let detail: string | null = null
      let errors: unknown[] | null = null
      try {
        const data: unknown = JSON.parse(text)
        if (data && typeof data === 'object') {
          const record = data as Record<string, unknown>
          if (typeof record.detail === 'string') detail = record.detail
          if (Array.isArray(record.errors)) errors = record.errors
        }
      } catch {
        detail = text || null
      }
      reject(new ApiError(xhr.status, detail, errors))
    }

    xhr.send(formData)
  })
}
