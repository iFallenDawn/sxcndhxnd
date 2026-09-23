import type { ProductStatus, ProductsBaseSchema } from '@/types/api'

// ---------------------------------------------------------------------------
// COMMISSION vs. CAPSULE CLASSIFICATION — READ BEFORE CHANGING (issue #8)
// ---------------------------------------------------------------------------
// `ProductsBaseSchema` has no field that cleanly means "this is commission
// work" vs. "this is a pre-made capsule good." The candidate fields are
// `category`, `commission_id`, `drop_item`, `drop_title`, `status`, `size`,
// `price` — none of them are documented as a listing-type discriminator.
//
// This implementation treats `commission_id` as the discriminator: a
// product with a non-null, non-empty `commission_id` is commission work made
// for a specific client; a product without one is a capsule good, pre-made
// and sold as-is.
//
// Verified against the backend (not just assumed):
//   - `backend/supabasedb/migrations/products.sql` defines `commission_id`
//     as a bare nullable `text` column — there is no `commissions` table and
//     no foreign key, so nothing in the schema enforces what goes in it.
//   - `backend/data/products_util.py` never reads, validates, or branches on
//     `commission_id` — it is only ever carried through verbatim on
//     insert/update. The backend does not use it as a type flag either.
//
// So this is the most defensible *inferred* reading given what exists today,
// not a verified contract: nothing stops a capsule product from carrying a
// stray non-null `commission_id`, or a commissioned piece from shipping
// without one set. It is deliberately isolated in this single function
// (rather than duplicated per-component) so the rule is trivial to change
// once a real field exists.
//
// FLAG FOR BACKEND: this needs an explicit, enforced discriminator — e.g. a
// `listing_type: 'commission' | 'capsule'` enum column, or a real FK to a
// `commissions` table — rather than being inferred from a loosely-typed
// text column. Recommend a follow-up backend ticket.
export function isCommissionProduct(product: Pick<ProductsBaseSchema, 'commission_id'>): boolean {
  return product.commission_id != null && product.commission_id.trim() !== ''
}

// ---------------------------------------------------------------------------
// Statuses and buckets
// ---------------------------------------------------------------------------
/** Raw DB status labels — the admin edits these directly. */
export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
  display: 'Display',
  archive: 'Archive',
}

// The client simplified the DB's finer-grained `status` values into three
// user-facing buckets, verbatim: "Sold and display should just all
// automatically lump into the archive." So `available` and `reserved` stay
// distinct, and `sold`, `display` and `archive` collapse into `archive`.

/** Bucket display order — earlier buckets lead, later ones trail/de-emphasize. */
export const BUCKET_ORDER = ['available', 'reserved', 'archive'] as const

export type ProductBucket = (typeof BUCKET_ORDER)[number]

export const BUCKET_LABEL: Record<ProductBucket, string> = {
  available: 'Available',
  reserved: 'Reserved',
  archive: 'Archive',
}

/**
 * Status badge surfaces. Split by context because the two are genuinely
 * different problems:
 *
 * - `ON_IMAGE` sits on product photography, which can be any colour, so every
 *   variant needs its own opaque fill and states are told apart by tone
 *   (dark chip / light chip / muted chip). A border would be unreliable here.
 * - `ON_SURFACE` sits on the page background. There, a white `bg-background`
 *   chip is invisible, so `reserved` carries a visible border instead.
 *
 * Kept here rather than duplicated per-component — the storefront card, the
 * product page and the admin dashboard each used to carry a copy, and they drifted.
 */
export const BUCKET_BADGE_ON_IMAGE: Record<ProductBucket, string> = {
  available: 'border-transparent bg-foreground text-background',
  reserved: 'border-transparent bg-background text-foreground',
  archive: 'border-transparent bg-muted text-muted-foreground',
}

export const BUCKET_BADGE_ON_SURFACE: Record<ProductBucket, string> = {
  available: 'border-transparent bg-foreground text-background',
  reserved: 'border-border bg-background text-foreground',
  archive: 'border-transparent bg-muted text-muted-foreground',
}

const STATUS_BUCKET: Record<ProductStatus, ProductBucket> = {
  available: 'available',
  reserved: 'reserved',
  sold: 'archive',
  display: 'archive',
  archive: 'archive',
}

export function getProductBucket(status: ProductStatus): ProductBucket {
  return STATUS_BUCKET[status]
}

export function bucketRank(status: ProductStatus): number {
  return BUCKET_ORDER.indexOf(getProductBucket(status))
}

// ---------------------------------------------------------------------------
// Price formatting
// ---------------------------------------------------------------------------
// `price` arrives as a string (Python Decimal serialized over JSON). Format
// it purely with string manipulation — never `Number(price)` — so we never
// round-trip through a float and risk precision loss.
export function formatPrice(price: string): string {
  const negative = price.trim().startsWith('-')
  const unsigned = negative ? price.trim().slice(1) : price.trim()
  const [wholeRaw, fractionRaw = ''] = unsigned.split('.')
  const whole = wholeRaw.replace(/\D/g, '') || '0'
  const fraction = (fractionRaw.replace(/\D/g, '') + '00').slice(0, 2)
  const withThousands = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${negative ? '-' : ''}$${withThousands}.${fraction}`
}

/**
 * Lossless ascending price comparator for sort controls. Converts each
 * decimal string into a fixed-point `bigint` (6 decimal places of headroom)
 * instead of parsing to `Number`, so comparisons never lose precision.
 */
export function comparePriceAsc(a: string, b: string): number {
  const toFixedPoint = (price: string): bigint => {
    const negative = price.trim().startsWith('-')
    const unsigned = negative ? price.trim().slice(1) : price.trim()
    const [wholeRaw, fractionRaw = ''] = unsigned.split('.')
    const whole = wholeRaw.replace(/\D/g, '') || '0'
    const fraction = (fractionRaw.replace(/\D/g, '') + '000000').slice(0, 6)
    const magnitude = BigInt(whole) * 1_000_000n + BigInt(fraction || '0')
    return negative ? -magnitude : magnitude
  }

  const diff = toFixedPoint(a) - toFixedPoint(b)
  if (diff < 0n) return -1
  if (diff > 0n) return 1
  return 0
}
