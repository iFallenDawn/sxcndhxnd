/**
 * Typed error thrown by `apiFetch` for any non-2xx response.
 *
 * The backend's exception handlers (`backend/core/exception_handlers.py`)
 * always respond with a JSON body shaped like `{ detail: string }` (or, for
 * request validation failures, `{ detail: string, errors: unknown[] }`), so
 * we can reliably surface `detail` as a human-readable message instead of
 * exposing the raw JSON blob to callers.
 */
export class ApiError extends Error {
  /** HTTP status code of the response. */
  status: number
  /** Raw `detail` string parsed from the response body, if present. */
  detail: string | null
  /** Field-level validation errors, present on 422 responses. */
  errors: unknown[] | null

  constructor(status: number, detail: string | null, errors: unknown[] | null = null) {
    super(detail ?? `Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
    this.errors = errors
  }

  /** True when the backend's `NotFoundError` mapped to this response. */
  get isNotFound() {
    return this.status === 404
  }

  /** True when the backend's `ConflictError` (or Postgres `23505`) mapped to this response. */
  get isConflict() {
    return this.status === 409
  }

  /** True when the backend's `UnauthorizedError` mapped to this response. */
  get isUnauthorized() {
    return this.status === 401
  }

  /** True when the backend's `ForbiddenError` (or Postgres `42501`) mapped to this response. */
  get isForbidden() {
    return this.status === 403
  }
}
