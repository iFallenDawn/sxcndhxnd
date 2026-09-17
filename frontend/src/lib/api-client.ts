import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/stores/auth-store'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  /** JSON-serializable request body. Ignored if `formData` is set. */
  body?: unknown
  /** Multipart form body, passed through as-is (no `Content-Type` header is set so the browser adds the boundary). */
  formData?: FormData
  /** Extra headers to merge in. `Authorization` and `Content-Type` are set automatically. */
  headers?: Record<string, string>
  /** Attach the current access token as `Authorization: Bearer <token>`. Defaults to true. */
  authenticated?: boolean
  signal?: AbortSignal
}

/**
 * Parses a backend error response into an `ApiError`.
 *
 * Every exception handler in `backend/core/exception_handlers.py` responds
 * with `{ detail: string }` (validation errors additionally include
 * `errors`), so we always try that shape first and fall back to the raw text
 * if the body isn't JSON.
 */
async function toApiError(response: Response): Promise<ApiError> {
  let detail: string | null = null
  let errors: unknown[] | null = null

  try {
    const data: unknown = await response.clone().json()
    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>
      if (typeof record.detail === 'string') {
        detail = record.detail
      }
      if (Array.isArray(record.errors)) {
        errors = record.errors
      }
    }
  } catch {
    try {
      const text = await response.text()
      detail = text || null
    } catch {
      detail = null
    }
  }

  return new ApiError(response.status, detail, errors)
}

/**
 * Thin fetch wrapper for the FastAPI backend.
 *
 * Handles base-URL joining, JSON (de)serialization, multipart passthrough
 * for uploads, bearer-token attachment from the auth store, and mapping
 * non-2xx responses to a typed `ApiError` (see `lib/api-error.ts`).
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = 'GET', body, formData, headers = {}, authenticated = true, signal } = options

  const requestHeaders: Record<string, string> = { ...headers }

  if (authenticated) {
    const accessToken = useAuthStore.getState().accessToken
    if (accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`
    }
  }

  let requestBody: BodyInit | undefined

  if (formData) {
    requestBody = formData
    // Do not set Content-Type: the browser fills in the multipart boundary.
  } else if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
    requestBody = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: requestBody,
    signal,
  })

  if (!response.ok) {
    throw await toApiError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}
