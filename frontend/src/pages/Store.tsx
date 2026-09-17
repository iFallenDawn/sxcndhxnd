import { useMemo, useState } from 'react'
import { PageMeta } from '@/components/seo/PageMeta'
import { StoreFilters } from '@/components/store/StoreFilters'
import { ProductEntryGrid } from '@/components/store/ProductEntryGrid'
import { ProductCardSkeleton } from '@/components/store/ProductCard'
import { useProducts } from '@/hooks/use-products'
import { ApiError } from '@/lib/api-error'
import { isCommissionProduct, getProductBucket, type ProductBucket } from '@/lib/products'
import { groupForDisplay, type SortOption } from '@/lib/store-grouping'
import type { ProductsBaseSchema } from '@/types/api'

const SKELETON_COUNT = 8

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

interface StoreSectionProps {
  title: string
  description: string
  products: ProductsBaseSchema[]
  category: string | null
  bucket: ProductBucket | null
  sort: SortOption
}

/** One storefront section (Commissions or Capsules): filters, sorts, groups, and renders its own product slice. */
function StoreSection({ title, description, products, category, bucket, sort }: StoreSectionProps) {
  const filtered = products.filter((product) => {
    if (category !== null && product.category !== category) return false
    if (bucket !== null && getProductBucket(product.status) !== bucket) return false
    return true
  })

  const entries = useMemo(() => groupForDisplay(filtered, sort), [filtered, sort])

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="heading-display text-2xl sm:text-3xl">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {entries.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No {title.toLowerCase()} match these filters.
        </p>
      ) : (
        <ProductEntryGrid entries={entries} />
      )}
    </section>
  )
}

export function Store() {
  const { data: products, isLoading, isError, error } = useProducts()

  const [category, setCategory] = useState<string | null>(null)
  const [bucket, setBucket] = useState<ProductBucket | null>(null)
  const [sort, setSort] = useState<SortOption>('featured')

  const categories = useMemo(() => {
    if (!products) return []
    const unique = new Set<string>()
    for (const product of products) {
      if (product.category) unique.add(product.category)
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b))
  }, [products])

  const commissions = useMemo(
    () => (products ?? []).filter((product) => isCommissionProduct(product)),
    [products],
  )
  const capsules = useMemo(
    () => (products ?? []).filter((product) => !isCommissionProduct(product)),
    [products],
  )

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-16">
      <PageMeta
        title="Store"
        description="Made-to-order commissions and pre-made capsule pieces, one of a kind."
      />

      <div className="flex flex-col gap-2">
        <p className="eyebrow text-muted-foreground">Store</p>
        <h1 className="heading-display text-3xl sm:text-4xl">Commissions &amp; capsules</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Every piece we've made stays listed here, even once it's gone — currently available work
          leads, past drops trail behind it.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-10">
          <SkeletonGrid />
          <SkeletonGrid />
        </div>
      ) : isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-10 text-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : 'Something went wrong loading the store.'}
        </div>
      ) : !products || products.length === 0 ? (
        <div className="rounded-md border border-dashed border-border px-4 py-16 text-center text-sm text-muted-foreground">
          Nothing's listed yet — check back soon.
        </div>
      ) : (
        <>
          <StoreFilters
            categories={categories}
            category={category}
            onCategoryChange={setCategory}
            bucket={bucket}
            onBucketChange={setBucket}
            sort={sort}
            onSortChange={setSort}
          />

          <div className="flex flex-col gap-16">
            <StoreSection
              title="Commissions"
              description="Made to order, built around you."
              products={commissions}
              category={category}
              bucket={bucket}
              sort={sort}
            />
            <StoreSection
              title="Capsules"
              description="Pre-made, one-of-a-kind, sold as-is."
              products={capsules}
              category={category}
              bucket={bucket}
              sort={sort}
            />
          </div>
        </>
      )}
    </div>
  )
}
