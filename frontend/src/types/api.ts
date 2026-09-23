/**
 * TypeScript mirrors of the backend Pydantic models in `backend/entities/models.py`.
 *
 * Keep this file in sync whenever `entities/models.py` is regenerated. Field
 * names, nullability, and shapes here should match that file, not the issue
 * body that first described the endpoints.
 *
 * Notes:
 * - `price` is a Python `Decimal` serialized to JSON as a string. Keep it a
 *   `string` here and format at the display edge — do not parse it into a
 *   number, since that loses precision.
 * - UUID4 fields are typed as `string` (they arrive as JSON strings).
 * - `datetime.datetime` fields are typed as `string` (ISO 8601 over the wire).
 */

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

/** Mirrors `entities.models.ProductStatus`. */
export const PRODUCT_STATUSES = ['available', 'reserved', 'sold', 'display', 'archive'] as const

export type ProductStatus = (typeof PRODUCT_STATUSES)[number]

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

/** Mirrors `entities.models.ProductsBaseSchema`. */
export interface ProductsBaseSchema {
  id: string
  category: string | null
  commission_id: string | null
  created_at: string
  created_by: string | null
  description: string
  drop_item: boolean | null
  drop_title: string | null
  image_urls: string[]
  paid: boolean | null
  /** Decimal over the wire — keep as string, format at the edge. */
  price: string
  size: string | null
  /** `str` in the backend model, but every API write path validates it as `ProductStatus`. */
  status: ProductStatus
  title: string
  updated_at: string
  updated_by: string | null
  user_id: string | null
}

/** Mirrors `entities.models.ProductsInsert`. Sent to `POST /products/`. */
export interface ProductsInsert {
  description: string
  image_urls: string[]
  /** Decimal over the wire — send as a numeric string. */
  price: string
  title: string
  category?: string | null
  commission_id?: string | null
  drop_item?: boolean | null
  drop_title?: string | null
  paid?: boolean | null
  size?: string | null
  status?: ProductStatus | null
  user_id?: string | null
}

/** Mirrors `entities.models.ProductsUpdate`. Sent to `PATCH /products/{id}`. */
export interface ProductsUpdate {
  category?: string | null
  commission_id?: string | null
  description?: string | null
  drop_item?: boolean | null
  drop_title?: string | null
  image_urls?: string[] | null
  paid?: boolean | null
  price?: string | null
  size?: string | null
  status?: ProductStatus | null
  title?: string | null
  user_id?: string | null
}

/** Response of `POST /products/upload-image`. */
export interface ProductImageUploadResponse {
  image_url: string
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

/** Mirrors `entities.models.GalleryImagesBaseSchema`. */
export interface GalleryImagesBaseSchema {
  id: string
  image_url: string
  description: string | null
  created_by: string | null
  created_at: string
}

/** Mirrors `entities.models.GalleryResponse`. Response of `GET /gallery/`. */
export interface GalleryResponse {
  products: ProductsBaseSchema[]
  gallery_images: GalleryImagesBaseSchema[]
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

/** Mirrors `entities.models.UsersBaseSchema`. Response of `GET /users/me`. */
export interface UsersBaseSchema {
  id: string
  created_at: string
  email: string
  first_name: string
  instagram: string
  last_name: string
  updated_at: string
}

/** Mirrors `entities.models.UsersPublicProfile`. Response of `GET /users/{id}`. */
export interface UsersPublicProfile {
  id: string
  first_name: string
  last_name: string
  instagram: string
}

/** Mirrors `entities.models.UsersUpdate`. Sent to `PATCH /users/me`. */
export interface UsersUpdate {
  first_name?: string | null
  instagram?: string | null
  last_name?: string | null
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

/** Sent to `POST /auth/sign-in`. Mirrors `entities.models.AuthSignIn`. */
export interface AuthSignInPayload {
  email: string
  password: string
}

/**
 * Response of `POST /auth/sign-in`. Built ad hoc as a dict in
 * `data/auth_util.py::sign_in` — not a Pydantic model.
 */
export interface AuthSignInResponse {
  access_token: string
  refresh_token: string
  user_id: string
}

/** Sent to `POST /auth/register`. Mirrors `entities.models.AuthRegister`. */
export interface AuthRegisterPayload {
  email: string
  first_name: string
  last_name: string
  instagram: string
  password: string
}

/**
 * Response of `POST /auth/register`. Built ad hoc as a dict in
 * `data/auth_util.py::create_user_from_auth` — not a Pydantic model.
 */
export interface AuthRegisterResponse {
  detail: string
  user_id: string
}

/**
 * Sent to `POST /auth/refresh`. Mirrors `entities.models.AuthRefresh`.
 *
 * The response is the same ad hoc shape as `POST /auth/sign-in` (see
 * `AuthSignInResponse`) — `data/auth_util.py::refresh_session` builds it
 * identically. Supabase rotates refresh tokens on every use, so the
 * `refresh_token` in the response must replace the one that was sent.
 */
export interface AuthRefreshPayload {
  refresh_token: string
}

/**
 * Sent to `POST /auth/confirm`. Mirrors `entities.models.AuthConfirm`.
 *
 * The response is the same ad hoc shape as `POST /auth/sign-in` (see
 * `AuthSignInResponse`) — `data/auth_util.py::confirm` builds it identically.
 */
export interface AuthConfirmPayload {
  token_hash: string
  type: 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change' | 'email'
}

/** Sent to `PATCH /auth/email`. Mirrors `entities.models.AuthUpdateEmail`. */
export interface AuthUpdateEmailPayload {
  new_email: string
  refresh_token: string
}

/** Sent to `PATCH /auth/password`. Mirrors `entities.models.AuthChangePassword`. */
export interface AuthChangePasswordPayload {
  current_password: string
  new_password: string
  refresh_token: string
}

/** Generic `{ detail: string }` shape returned by several auth/util endpoints. */
export interface DetailResponse {
  detail: string
}
