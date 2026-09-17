import { useCallback, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ImagePlaceholder } from '@/components/home/ImagePlaceholder'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  title: string
}

/**
 * Product detail image gallery (issue #9).
 *
 * Mobile: the track is a native horizontally-scrolling, scroll-snapped strip
 * — one finger swipe per image, no JS gesture handling needed, and it keeps
 * working even if JS layout math is off.
 *
 * Desktop: the frame is a single `tabIndex=0` region; ArrowLeft/ArrowRight
 * call the same `goTo` used by the prev/next buttons and thumbnails, which
 * both updates state and scrolls the track (`scrollIntoView`), so keyboard,
 * pointer, and touch all converge on one source of truth (`index`).
 *
 * `image_urls` may be empty (no photography shot yet) — fall back to the
 * shared `ImagePlaceholder` rather than inventing a second placeholder.
 *
 * Every control here (prev/next buttons, the dot strip) sits on top of
 * arbitrary product photography, so each one carries its own fully opaque
 * `bg-foreground` surface — never a transparent/outline treatment — per the
 * project's "overlaying an image" rule. Confirmed by sampling rendered
 * pixels with Playwright, not by reading these class names.
 */
export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(images.length - 1, next))
      setIndex(clamped)
      const track = trackRef.current
      const target = track?.children[clamped]
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
      }
    },
    [images.length],
  )

  const handleScroll = () => {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return
    const nextIndex = Math.round(track.scrollLeft / track.clientWidth)
    setIndex((current) => (current === nextIndex ? current : nextIndex))
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(index - 1)
    }
  }

  if (images.length === 0) {
    return <ImagePlaceholder label={title} className="aspect-[4/5] w-full" />
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${title} — image ${index + 1} of ${images.length}`}
        onKeyDown={handleKeyDown}
      >
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <img
              key={`${src}-${i}`}
              src={src}
              alt={`${title} — view ${i + 1} of ${images.length}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="h-full w-full flex-none snap-start object-cover"
            />
          ))}
        </div>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous image"
              className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-background transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-40"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index === images.length - 1}
              aria-label="Next image"
              className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-background transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-40"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>

            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-foreground px-2 py-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={cn('size-1.5 rounded-full bg-background', i !== index && 'opacity-40')}
                  aria-hidden="true"
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={`${src}-thumb-${i}`}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'size-14 flex-none overflow-hidden border transition-opacity',
                i === index ? 'border-foreground' : 'border-border opacity-60 hover:opacity-100',
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
