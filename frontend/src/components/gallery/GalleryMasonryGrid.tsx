import type { GalleryItem } from '@/lib/gallery-items'

interface GalleryMasonryGridProps {
  items: GalleryItem[]
  /** Called with the item's index in this grid's `items` array. */
  onOpen: (index: number) => void
}

/**
 * CSS-columns masonry. These are phone photos in portrait, landscape and
 * square — a rigid `aspect-square`/`aspect-[4/5]` grid (like the storefront
 * grid) would crop a meaningful number of them. `columns-*` + `break-inside-
 * avoid` lets each `<img>` render at its own intrinsic aspect ratio (no
 * `aspect-*` class, no `object-cover`) and the browser handles reflow across
 * breakpoints for free — no masonry library, no measured-layout JS.
 */
export function GalleryMasonryGrid({ items, onOpen }: GalleryMasonryGridProps) {
  return (
    <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onOpen(index)}
          className="group mb-3 block w-full break-inside-avoid overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <img
            src={item.imageUrl}
            alt={`Archived piece, ${item.year}`}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full transition-opacity duration-300 group-hover:opacity-90"
          />
        </button>
      ))}
    </div>
  )
}
