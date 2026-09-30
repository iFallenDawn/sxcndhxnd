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

export interface ProjectEntry {
  kind: 'project'
  id: string
  title: string
  products: ProductsBaseSchema[]
}

export type DisplayEntry = SingleEntry | ProjectEntry

/**
 * Groups a sorted product list into display entries: products sharing a
 * `project_id` collapse into one `ProjectEntry`, placed where its first
 * member sorts — since the sort is bucket-first, that is its best
 * availability bucket, so a project with any available item still leads even
 * if some of its sizes/pieces have sold out. A product with no project, or
 * whose project isn't in `projectTitles` (e.g. still loading), stays
 * standalone.
 */
export function groupForDisplay(
  products: ProductsBaseSchema[],
  sort: SortOption,
  projectTitles: Map<string, string>,
): DisplayEntry[] {
  const entries: DisplayEntry[] = []
  const projects = new Map<string, ProjectEntry>()

  for (const product of sortProducts(products, sort)) {
    const title = product.project_id ? projectTitles.get(product.project_id) : undefined
    if (!product.project_id || !title) {
      entries.push({ kind: 'single', product })
      continue
    }
    const project = projects.get(product.project_id)
    if (project) {
      project.products.push(product)
    } else {
      const entry: ProjectEntry = { kind: 'project', id: product.project_id, title, products: [product] }
      projects.set(product.project_id, entry)
      entries.push(entry)
    }
  }

  return entries
}
