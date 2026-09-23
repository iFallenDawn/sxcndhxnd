import { ApiError } from '@/lib/api-error'
import { authHeader, parseResponse, withSessionRefresh } from '@/lib/api-client'
import { API_BASE_URL } from '@/lib/api-base-url'

/**
 * Multipart upload with real upload-progress events, via `XMLHttpRequest`
 * (the `fetch`-based `apiFetch` in `lib/api-client.ts` has no progress
 * event). Used by the dashboard's image uploaders so a bulk upload of a few
 * hundred gallery photos shows visible per-file progress instead of a single
 * opaque spinner.
 *
 * Shares `apiFetch`'s auth header, error parsing and 401 refresh-and-retry,
 * so a batch that outlives the access token keeps going.
 */
export function uploadWithProgress<T>(
  path: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal,
): Promise<T> {
  return withSessionRefresh(() => send<T>(path, formData, onProgress, signal))
}

function send<T>(
  path: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${API_BASE_URL}${path}`)

    for (const [name, value] of Object.entries(authHeader())) {
      xhr.setRequestHeader(name, value)
    }

    if (signal) {
      if (signal.aborted) {
        reject(new DOMException('Aborted', 'AbortError'))
        return
      }
      signal.addEventListener('abort', () => xhr.abort(), { once: true })
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onabort = () => reject(new DOMException('Aborted', 'AbortError'))
    xhr.onerror = () =>
      reject(
        new ApiError(0, 'Network error — check your connection and try again.'),
      )

    xhr.onload = () => {
      try {
        resolve(parseResponse<T>(xhr.status, xhr.responseText))
      } catch (error) {
        reject(error)
      }
    }

    xhr.send(formData)
  })
}
