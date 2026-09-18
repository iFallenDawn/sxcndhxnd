/**
 * Mirrors `backend/core/constants.py::ALLOWED_CONTENT_TYPES`. Checked
 * client-side before an upload is attempted so a rejected file produces an
 * immediate, human message instead of a round trip that comes back a 400.
 * The backend remains the source of truth and re-validates independently.
 */
export const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

/** Mirrors `backend/core/constants.py::PRODUCT_GALLERY_STATUSES` (raw DB statuses that bucket to "Archive" in the UI). */
export const PRODUCT_GALLERY_STATUSES = ['archive', 'sold', 'display']
