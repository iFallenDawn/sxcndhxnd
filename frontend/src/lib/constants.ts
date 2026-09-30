/**
 * Mirrors `backend/core/constants.py::ALLOWED_CONTENT_TYPES`. Checked
 * client-side before an upload is attempted so a rejected file produces an
 * immediate, human message instead of a round trip that comes back a 400.
 * The backend remains the source of truth and re-validates independently.
 */
export const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

/** Mirrors `backend/core/constants.py::PRODUCT_GALLERY_STATUSES` (raw DB statuses that bucket to "Archive" in the UI). */
export const PRODUCT_GALLERY_STATUSES = ['archive', 'sold', 'display']

/**
 * The brand's Instagram. Reservations are not payments — checkout is a
 * handoff to a DM (issue #10), so this link is the entire follow-up channel
 * and appears in the reservation confirmation as well as the footer. Kept
 * here so the two can't drift apart.
 */
export const INSTAGRAM_URL = 'https://www.instagram.com/sxcndhxnd/'

/** The handle itself, for copy that names it ("DM @sxcndhxnd"). */
export const INSTAGRAM_HANDLE = 'sxcndhxnd'

/** Prefix for a customer's own profile, e.g. `${INSTAGRAM_PROFILE_BASE}${handle}`. */
export const INSTAGRAM_PROFILE_BASE = 'https://www.instagram.com/'
