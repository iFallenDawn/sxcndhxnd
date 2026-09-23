import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ImagePlaceholder } from '@/components/home/ImagePlaceholder'
import { cn } from '@/lib/utils'
import { formatPrice, getProductBucket, BUCKET_LABEL, BUCKET_BADGE_ON_IMAGE } from '@/lib/products'
import type { ProductsBaseSchema } from '@/types/api'


interface ProductCardProps {
  product: ProductsBaseSchema
}

/**
 * Storefront card: image, title, price, status badge. Archived/sold items
 * stay browsable but visually de-emphasize (reduced opacity, muted badge)
 * per the client's "still showing what used to be in stock" request.
 *
 * `image_urls` may be empty — no real product photography exists yet — so
 * this falls back to the same `ImagePlaceholder` built for issue #7 rather
 * than a second placeholder style. Real images are never hotlinked; the
 * first URL in `image_urls` (expected to be Supabase Storage-hosted) is used
 * as-is when present.
 */
export function ProductCard({ product }: ProductCardProps) {
  const bucket = getProductBucket(product.status)
  const isArchived = bucket === 'archive'
  const [firstImage] = product.image_urls

  return (
    <Link
      to={`/store/${product.id}`}
      className={cn(
        'group flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        isArchived && 'opacity-70 grayscale-[0.4] transition-opacity hover:opacity-100 hover:grayscale-0',
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder label={product.title} className="h-full w-full border-none" />
        )}
        <Badge
          className={cn(
            'absolute top-2 left-2 uppercase tracking-wide',
            BUCKET_BADGE_ON_IMAGE[bucket],
          )}
        >
          {BUCKET_LABEL[bucket]}
        </Badge>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{product.title}</span>
        <span className="font-mono text-sm text-muted-foreground">{formatPrice(product.price)}</span>
      </div>
    </Link>
  )
}

/** Loading placeholder matching `ProductCard`'s layout. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  )
}
