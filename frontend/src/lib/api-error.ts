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

  /**
   * True when slowapi's rate limiter rejected the request
   * (`core/rate_limit.py`, e.g. `@limiter.limit("5/minute")` on
   * `POST /products/{id}/reserve`).
   *
   * Note that these responses do **not** carry a `detail` — slowapi's
   * `_rate_limit_exceeded_handler` answers with `{ "error": "Rate limit
   * exceeded: ..." }` — so `detail` is null here and callers must supply
   * their own human-readable message rather than falling back to `message`.
   */
  get isRateLimited() {
    return this.status === 429
  }
}

/**
 * Human-readable message for a failed reservation attempt.
 *
 * The two cases worth wording carefully, because both are normal rather than
 * exceptional in this flow:
 * - **409** — the atomic `available → reserved` guard in
 *   `products_util.reserve_product` lost the race, i.e. somebody else got
 *   this exact piece first. Every piece is one-of-one, so there is no "try a
 *   smaller quantity" consolation to offer.
 * - **429** — the endpoint is capped at 5/minute per IP, which a bag of six
 *   will hit legitimately. Say so, and say the rest of the bag was kept.
 */
export function reservationErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return 'Something went wrong. Check your connection and try again.'
  }
  if (error.isConflict) {
    return 'Someone else reserved this one first — every piece is one of one, so it’s gone.'
  }
  if (error.isRateLimited) {
    return 'Too many reservations too quickly. Wait a minute, then try the rest of your bag.'
  }
  if (error.isNotFound) {
    return 'This piece is no longer listed.'
  }
  return error.detail ?? 'Could not reserve this piece. Please try again.'
}
