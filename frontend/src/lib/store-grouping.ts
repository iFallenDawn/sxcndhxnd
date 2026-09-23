import type { ProductsBaseSchema } from '@/types/api'
import { bucketRank, comparePriceAsc } from '@/lib/products'

export type SortOption = 'featured' | 'price-asc' | 'price-desc'

export const SORT_LABEL: Record<SortOption, string> = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
}

/**
 * Orders products within a bucket. Availability bucket order (see
 * `bucketRank`) always wins first — this only breaks ties inside a bucket,
 * so a sort control can never pull an archived item above an available one.
 */
function secondaryCompare(a: ProductsBaseSchema, b: ProductsBaseSchema, sort: SortOption): number {
  if (sort === 'price-asc') return comparePriceAsc(a.price, b.price)
  if (sort === 'price-desc') return comparePriceAsc(b.price, a.price)
  // 'featured': most recently created first.
  return b.created_at.localeCompare(a.created_at)
}

/**
 * Sorts a product list so available items always lead and archived items
 * always trail (per the client's explicit ordering request), with the
 * chosen sort control only deciding order *within* a bucket.
 */
export function sortProducts(products: ProductsBaseSchema[], sort: SortOption): ProductsBaseSchema[] {
  return [...products].sort((a, b) => {
    const bucketDiff = bucketRank(a.status) - bucketRank(b.status)
    if (bucketDiff !== 0) return bucketDiff
    return secondaryCompare(a, b, sort)
  })
}

export interface SingleEntry {
  kind: 'single'
  product: ProductsBaseSchema
}

export interface DropEntry {
  kind: 'drop'
  title: string
  products: ProductsBaseSchema[]
}

export type DisplayEntry = SingleEntry | DropEntry

/**
 * Groups a sorted product list into display entries: products sharing a
 * `drop_title` (with `drop_item` set) collapse into one `DropEntry`, placed
 * where its first member sorts — since the sort is bucket-first, that is its
 * best availability bucket, so a drop with any available item still leads
 * even if some of its sizes/pieces have sold out. Everything else stays a
 * standalone entry.
 */
export function groupForDisplay(products: ProductsBaseSchema[], sort: SortOption): DisplayEntry[] {
  const entries: DisplayEntry[] = []
  const drops = new Map<string, DropEntry>()

  for (const product of sortProducts(products, sort)) {
    if (!product.drop_item || !product.drop_title) {
      entries.push({ kind: 'single', product })
      continue
    }
    const drop = drops.get(product.drop_title)
    if (drop) {
      drop.products.push(product)
    } else {
      const entry: DropEntry = { kind: 'drop', title: product.drop_title, products: [product] }
      drops.set(product.drop_title, entry)
      entries.push(entry)
    }
  }

  return entries
}
