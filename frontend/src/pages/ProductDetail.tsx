import { Link, useParams } from 'react-router'
import { Fragment } from 'react'
import { PageMeta } from '@/components/seo/PageMeta'
import { ProductGallery } from '@/components/store/ProductGallery'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProduct } from '@/hooks/use-products'
import { ApiError } from '@/lib/api-error'
import {
  BUCKET_BADGE_ON_SURFACE,
  BUCKET_LABEL,
  formatPrice,
  getProductBucket,
  isCommissionProduct,
  type ProductBucket,
} from '@/lib/products'
import type { ProductsBaseSchema } from '@/types/api'

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-9 w-40" />
      </div>
    </div>
  )
}

interface ProductNotFoundProps {
  message?: string
}

function ProductNotFound({ message }: ProductNotFoundProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <PageMeta title="Product not found" />
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="heading-display text-3xl sm:text-4xl">Piece not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {message ?? "This listing doesn't exist or has been taken down."}
      </p>
      <Button asChild size="sm">
        <Link to="/store">Back to store</Link>
      </Button>
    </div>
  )
}

interface ProductCtaProps {
  bucket: ProductBucket
}

/**
 * Status-driven CTA. Reservation itself is issue #10 and is **blocked** —
 * there is no customer-facing reserve endpoint yet (`PATCH /products/{id}`
 * is admin-only) — so this only ever renders the correct *state*, never a
 * working submit. Do not wire this up before #10 ships a real endpoint.
 */
function ProductCta({ bucket }: ProductCtaProps) {
  if (bucket === 'available') {
    return (
      <div className="flex flex-col gap-1.5">
        {/* TODO(#10): wire this to the customer reservation endpoint once it
            exists. Intentionally disabled — there is nothing to submit to. */}
        <Button type="button" disabled aria-disabled="true" className="w-fit">
          Reserve this piece
        </Button>
        <p className="text-xs text-muted-foreground">Reservations are opening soon.</p>
      </div>
    )
  }

  if (bucket === 'reserved') {
    return (
      <Badge className={BUCKET_BADGE_ON_SURFACE.reserved}>{BUCKET_LABEL.reserved} — spoken for</Badge>
    )
  }

  return <p className="text-sm text-muted-foreground">No longer available.</p>
}

interface ProductDetailViewProps {
  product: ProductsBaseSchema
}

function ProductDetailView({ product }: ProductDetailViewProps) {
  const bucket = getProductBucket(product.status)
  const commission = isCommissionProduct(product)
  const backHref = commission ? '/store#commissions' : '/store#capsules'
  const backLabel = commission ? 'Commissions' : 'Capsules'

  const metaBits = [product.category, product.size].filter(
    (bit): bit is string => Boolean(bit),
  )

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16 lg:grid lg:grid-cols-2 lg:gap-16">
      <PageMeta title={product.title} description={product.description} />

      <ProductGallery images={product.image_urls} title={product.title} />

      <div className="flex flex-col gap-5">
        <Link
          to={backHref}
          className="eyebrow w-fit text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to {backLabel}
        </Link>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="heading-display text-3xl sm:text-4xl">{product.title}</h1>
            <Badge className={BUCKET_BADGE_ON_SURFACE[bucket]}>{BUCKET_LABEL[bucket]}</Badge>
          </div>

          {metaBits.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              {metaBits.map((bit, i) => (
                <Fragment key={bit}>
                  {i > 0 ? ' · ' : null}
                  {bit}
                </Fragment>
              ))}
            </p>
          ) : null}

          <p className="font-mono text-lg text-foreground">{formatPrice(product.price)}</p>
        </div>

        <p className="max-w-prose text-sm whitespace-pre-line text-muted-foreground">
          {product.description}
        </p>

        <ProductCta bucket={bucket} />
      </div>
    </div>
  )
}

export function ProductDetail() {
  const { productId } = useParams<{ productId: string }>()
  const { data: product, isLoading, isError, error } = useProduct(productId)

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (isError) {
    if (error instanceof ApiError && error.isNotFound) {
      return <ProductNotFound />
    }
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <PageMeta title="Something went wrong" />
        <p className="max-w-sm text-sm text-destructive">
          {error instanceof ApiError ? error.message : 'Something went wrong loading this piece.'}
        </p>
        <Button asChild size="sm" variant="outline">
          <Link to="/store">Back to store</Link>
        </Button>
      </div>
    )
  }

  if (!product) {
    return <ProductNotFound />
  }

  return <ProductDetailView product={product} />
}
