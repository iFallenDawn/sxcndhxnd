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

/** `Authorization: Bearer <token>` for the current session, or nothing when signed out. */
export function authHeader(): Record<string, string> {
  const accessToken = getSession()?.accessToken
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
}

/**
 * Turns a raw response into the parsed JSON body (or `undefined` when
 * empty), throwing an `ApiError` for any non-2xx status.
 *
 * Every exception handler in `backend/core/exception_handlers.py` responds
 * with `{ detail: string }` (validation errors additionally include
 * `errors`), so an error body is read as that shape, falling back to the raw
 * text if it isn't JSON.
 */
export function parseResponse<T>(status: number, text: string): T {
  if (status >= 200 && status < 300) {
    return (text ? JSON.parse(text) : undefined) as T
  }

  let data: { detail?: unknown; errors?: unknown } | null
  try {
    data = JSON.parse(text)
  } catch {
    throw new ApiError(status, text || null)
  }
  throw new ApiError(
    status,
    typeof data?.detail === 'string' ? data.detail : null,
    Array.isArray(data?.errors) ? data.errors : null,
  )
}

/**
 * Runs an authenticated request, retrying it **once** on a 401: the token
 * pair is refreshed first (see `useAuthStore.refresh`, which is
 * stampede-guarded and signs out locally if the session is dead). If the
 * refresh fails, the original 401 is rethrown for the caller to handle.
 */
export async function withSessionRefresh<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request()
  } catch (error) {
    const session = getSession()
    if (!(error instanceof ApiError && error.isUnauthorized && session?.refreshToken)) {
      throw error
    }

    try {
      await session.refresh()
    } catch {
      throw error
    }

    return request()
  }
}

async function performFetch<T>(path: string, options: ApiFetchOptions): Promise<T> {
  const { method = 'GET', body, formData, headers = {}, authenticated = true, signal } = options

  const requestHeaders: Record<string, string> = {
    ...headers,
    ...(authenticated ? authHeader() : {}),
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

  return parseResponse<T>(response.status, await response.text())
}

/**
 * Thin fetch wrapper for the FastAPI backend.
 *
 * Handles base-URL joining, JSON (de)serialization, multipart passthrough,
 * bearer-token attachment, mapping non-2xx responses to a typed `ApiError`
 * (see `lib/api-error.ts`), and — for authenticated requests — one
 * refresh-and-retry on a 401 (see `withSessionRefresh`).
 */
export function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const request = () => performFetch<T>(path, options)
  return options.authenticated === false ? request() : withSessionRefresh(request)
}
