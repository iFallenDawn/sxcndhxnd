import { Link, useParams } from 'react-router'
import { Fragment } from 'react'
import { CheckIcon } from 'lucide-react'
import { toast } from 'sonner'
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
import { useReservationBagStore } from '@/stores/reservation-bag-store'
import type { ProductStatus, ProductsBaseSchema } from '@/types/api'

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
  productId: string
  status: ProductStatus
  bucket: ProductBucket
}

/**
 * Status-driven CTA (issue #10).
 *
 * Adding to the bag is enabled **only** for `available`. Every other status
 * gets an explanation on its own opaque chip rather than a disabled button:
 * "why can't I have this?" is the question, and a greyed-out button doesn't
 * answer it.
 *
 * The button itself doesn't call the API — it drops the product id into the
 * local bag (`stores/reservation-bag-store.ts`) and the drawer's checkout
 * does the reserving, because a reservation needs an Instagram handle that
 * this page has nowhere sensible to collect.
 */
function ProductCta({ productId, status, bucket }: ProductCtaProps) {
  const inBag = useReservationBagStore((state) =>
    state.productIds.includes(productId),
  )
  const add = useReservationBagStore((state) => state.add)

  if (bucket === 'available') {
    return (
      <div className="flex flex-col gap-1.5">
        <Button
          type="button"
          className="w-fit"
          disabled={inBag}
          aria-disabled={inBag}
          onClick={() => {
            add(productId)
            toast.success('Added to your reservations.')
          }}
        >
          {inBag ? (
            <>
              <CheckIcon data-icon="inline-start" aria-hidden="true" />
              In your reservations
            </>
          ) : (
            'Reserve this piece'
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          {inBag
            ? 'Open the bag in the top bar to confirm it.'
            : 'No payment — reserving holds it, then Nico DMs you on Instagram.'}
        </p>
      </div>
    )
  }

  // Opaque, tone-differentiated chips per CLAUDE.md, plus the reason in plain
  // words. `reserved` is distinct from the archive statuses because it's the
  // one a customer might come back for.
  if (bucket === 'reserved') {
    return (
      <div className="flex flex-col gap-1.5">
        <Badge className={BUCKET_BADGE_ON_SURFACE.reserved}>
          {BUCKET_LABEL.reserved} — spoken for
        </Badge>
        <p className="text-xs text-muted-foreground">
          Someone already reserved this one, and it’s one of one.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Badge className={BUCKET_BADGE_ON_SURFACE.archive}>
        {status === 'sold' ? 'Sold' : BUCKET_LABEL.archive}
      </Badge>
      <p className="text-xs text-muted-foreground">
        {status === 'sold'
          ? 'This one has found its owner — it isn’t available to reserve.'
          : 'This piece isn’t up for reservation.'}
      </p>
    </div>
  )
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
            <h1 className="heading-display text-3xl sm:text-4xl">
              {product.title}
            </h1>
            <Badge className={BUCKET_BADGE_ON_SURFACE[bucket]}>
              {BUCKET_LABEL[bucket]}
            </Badge>
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

          <p className="font-mono text-lg text-foreground">
            {formatPrice(product.price)}
          </p>
        </div>

        <p className="max-w-prose text-sm whitespace-pre-line text-muted-foreground">
          {product.description}
        </p>

        <ProductCta
          productId={product.id}
          status={product.status}
          bucket={bucket}
        />
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
          {error instanceof ApiError
            ? error.message
            : 'Something went wrong loading this piece.'}
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
