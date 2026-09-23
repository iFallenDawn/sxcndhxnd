import { ApiError } from '@/lib/api-error'
import { API_BASE_URL } from '@/lib/api-base-url'

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

/** The slice of `useAuthStore` state this client needs. */
interface Session {
  accessToken: string | null
  refreshToken: string | null
  /** Rotates the token pair; rejects (having signed out locally) if the session is dead. */
  refresh: () => Promise<void>
}

let getSession: () => Session | null = () => null

/**
 * Called once by `stores/auth-store.ts` to hand this client its tokens, so
 * the dependency only runs store → client and never back.
 */
export function connectSession(get: () => Session) {
  getSession = get
}

/** The current refresh token, for the auth endpoints that take it in the body. */
export function currentRefreshToken() {
  return getSession()?.refreshToken ?? null
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

/** Single attempt at the request — no 401-retry logic. See `apiFetch` below. */
async function performFetch<T>(
  path: string,
  options: ApiFetchOptions,
): Promise<T> {
  const {
    method = 'GET',
    body,
    formData,
    headers = {},
    authenticated = true,
    signal,
  } = options

  const requestHeaders: Record<string, string> = { ...headers }

  if (authenticated) {
    const accessToken = getSession()?.accessToken
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

  const response = await fetch(`${API_BASE_URL}${path}`, {
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

/**
 * Thin fetch wrapper for the FastAPI backend.
 *
 * Handles base-URL joining, JSON (de)serialization, multipart passthrough
 * for uploads, bearer-token attachment from the auth store, and mapping
 * non-2xx responses to a typed `ApiError` (see `lib/api-error.ts`).
 *
 * On a 401 from an authenticated request, retries **once**: it refreshes the
 * token pair (see `useAuthStore.refresh`, which is stampede-guarded and
 * signs out locally if the session is dead) and replays the original
 * request with the new token. If the refresh fails, the original 401 is
 * rethrown for the caller to handle.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  try {
    return await performFetch<T>(path, options)
  } catch (error) {
    const session = getSession()
    const canRetry =
      error instanceof ApiError &&
      error.isUnauthorized &&
      options.authenticated !== false &&
      session?.refreshToken

    if (!canRetry) {
      throw error
    }

    try {
      await session.refresh()
    } catch {
      throw error
    }

    return performFetch<T>(path, options)
  }
}
