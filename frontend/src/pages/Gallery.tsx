import { useMemo, useState } from 'react'
import { PageMeta } from '@/components/seo/PageMeta'
import { Skeleton } from '@/components/ui/skeleton'
import { GalleryMasonryGrid } from '@/components/gallery/GalleryMasonryGrid'
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox'
import { useGallery } from '@/hooks/use-gallery'
import { ApiError } from '@/lib/api-error'
import { buildGalleryItems, groupGalleryItemsByYear, type GalleryItem } from '@/lib/gallery-items'
import { cn } from '@/lib/utils'

/** Varied skeleton heights so the loading state hints at the masonry layout instead of a uniform grid. */
const SKELETON_HEIGHTS = ['h-64', 'h-44', 'h-56', 'h-72', 'h-48'] as const

function GallerySkeleton() {
  return (
    <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
      {Array.from({ length: 12 }, (_, index) => (
        <Skeleton
          key={index}
          className={cn('mb-3 w-full break-inside-avoid', SKELETON_HEIGHTS[index % SKELETON_HEIGHTS.length])}
        />
      ))}
    </div>
  )
}

interface YearNavProps {
  years: number[]
}

/**
 * Sticky year jump links. `top-14` clears the fixed 56px navbar (see
 * `RootLayout`'s `pt-14`); this bar sits below it in the same solid register
 * (`bg-background`, no transparency) so it stays legible as photos scroll
 * underneath it — it overlays imagery just like anything inside the lightbox.
 */
function YearNav({ years }: YearNavProps) {
  if (years.length < 2) return null

  return (
    <nav
      aria-label="Jump to year"
      className="sticky top-14 z-30 -mx-4 flex gap-2 overflow-x-auto border-b border-border bg-background px-4 py-3 sm:mx-0 sm:px-0"
    >
      {years.map((year) => (
        <a
          key={year}
          href={`#year-${year}`}
          className="inline-flex h-7 shrink-0 items-center rounded-full border border-border bg-background px-3 text-xs font-medium whitespace-nowrap text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {year}
        </a>
      ))}
    </nav>
  )
}

export function Gallery() {
  const { data, isLoading, isError, error } = useGallery()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Flatten once, then group. `items` stays the single flat list the
  // lightbox navigates over so arrow/swipe nav can cross year boundaries.
  const items: GalleryItem[] = useMemo(() => (data ? buildGalleryItems(data) : []), [data])
  const groups = useMemo(() => groupGalleryItemsByYear(items), [items])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16">
      <PageMeta
        title="Gallery"
        description="An archive of past commissions and one-of-a-kind pieces, browsable by year."
      />

      <div className="flex flex-col gap-2">
        <p className="eyebrow text-muted-foreground">Archive</p>
        <h1 className="heading-display text-3xl sm:text-4xl">Gallery</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Every commission and one-off, dumped here as it's made.
        </p>
      </div>

      {isLoading ? (
        <GallerySkeleton />
      ) : isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-10 text-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : 'Something went wrong loading the gallery.'}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-md border border-dashed border-border px-4 py-16 text-center text-sm text-muted-foreground">
          Nothing archived yet — check back soon.
        </div>
      ) : (
        <>
          <YearNav years={groups.map(([year]) => year)} />

          <div className="flex flex-col gap-14">
            {groups.map(([year, yearItems]) => (
              <section key={year} id={`year-${year}`} className="flex scroll-mt-28 flex-col gap-4">
                <h2 className="heading-display text-xl sm:text-2xl">{year}</h2>
                <GalleryMasonryGrid
                  items={yearItems}
                  onOpen={(indexInYear) => setActiveIndex(items.indexOf(yearItems[indexInYear]))}
                />
              </section>
            ))}
          </div>
        </>
      )}

      {activeIndex !== null ? (
        <GalleryLightbox
          items={items}
          index={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
        />
      ) : null}
    </div>
  )
}
