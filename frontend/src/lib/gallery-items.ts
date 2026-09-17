import { deriveGalleryTimestamp, deriveGalleryYear } from '@/lib/gallery-date'
import type { GalleryResponse } from '@/types/api'

/** One photo in the unified archive stream, regardless of whether it came from `gallery_images` or a product's `image_urls`. */
export interface GalleryItem {
  id: string
  imageUrl: string
  year: number
  /** Sort key within a year (see `deriveGalleryTimestamp`). */
  timestamp: number
}

/**
 * Flattens `GET /gallery/`'s two collections (`products`, `gallery_images`)
 * into one stream of photos, per the issue's "render both as one unified
 * stream" requirement. Products can carry several photos in `image_urls`;
 * each becomes its own tile rather than only showing the first, since this
 * page is explicitly meant to be a photo dump, not a product listing.
 *
 * Sorted newest-first overall; callers regroup by `year` via
 * `groupGalleryItemsByYear`.
 */
export function buildGalleryItems(data: GalleryResponse): GalleryItem[] {
  const fromGalleryImages: GalleryItem[] = data.gallery_images.map((image) => ({
    id: `gallery-${image.id}`,
    imageUrl: image.image_url,
    year: deriveGalleryYear(image.image_url, image.created_at),
    timestamp: deriveGalleryTimestamp(image.image_url, image.created_at),
  }))

  const fromProducts: GalleryItem[] = data.products.flatMap((product) =>
    product.image_urls.map((imageUrl, index) => ({
      id: `product-${product.id}-${index}`,
      imageUrl,
      year: deriveGalleryYear(imageUrl, product.created_at),
      timestamp: deriveGalleryTimestamp(imageUrl, product.created_at),
    })),
  )

  return [...fromGalleryImages, ...fromProducts].sort((a, b) => b.timestamp - a.timestamp)
}

/** Groups an already-flattened, already-sorted item list by year, newest year first. */
export function groupGalleryItemsByYear(items: GalleryItem[]): Array<[number, GalleryItem[]]> {
  const byYear = new Map<number, GalleryItem[]>()

  for (const item of items) {
    const bucket = byYear.get(item.year)
    if (bucket) {
      bucket.push(item)
    } else {
      byYear.set(item.year, [item])
    }
  }

  return Array.from(byYear.entries()).sort(([yearA], [yearB]) => yearB - yearA)
}
