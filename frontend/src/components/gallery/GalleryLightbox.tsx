import { useEffect, useRef } from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryItem } from '@/lib/gallery-items'

interface GalleryLightboxProps {
  items: GalleryItem[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

/** Minimum horizontal swipe distance (px) before it counts as a navigation gesture. */
const SWIPE_THRESHOLD_PX = 48

/**
 * Fullscreen photo viewer. Built on the bare Radix Dialog primitive (not
 * `ui/dialog.tsx`'s `DialogContent`) because that component is deliberately
 * sized for small popovers/forms (`max-w-sm`) — this needs an edge-to-edge,
 * near-black viewer instead. Radix still gives us focus trapping and
 * Escape-to-close for free; arrow keys and swipe are added on top.
 *
 * Every control here sits directly on top of an unpredictable photo, so per
 * CLAUDE.md's imagery rule each one gets a fully opaque `bg-foreground`
 * surface rather than a translucent/gradient scrim.
 */
export function GalleryLightbox({ items, index, onIndexChange, onClose }: GalleryLightboxProps) {
  const item = items[index]
  const touchStartX = useRef<number | null>(null)

  const goPrev = () => onIndexChange((index - 1 + items.length) % items.length)
  const goNext = () => onIndexChange((index + 1) % items.length)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') goPrev()
      else if (event.key === 'ArrowRight') goNext()
      // Escape is handled by Radix's Dialog itself (closes + restores focus).
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goPrev/goNext close over index/items.length, both listed.
  }, [index, items.length])

  if (!item) return null

  return (
    <DialogPrimitive.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex flex-col outline-none"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return
            const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current
            if (delta > SWIPE_THRESHOLD_PX) goPrev()
            else if (delta < -SWIPE_THRESHOLD_PX) goNext()
            touchStartX.current = null
          }}
        >
          {/* Radix requires an accessible title; this viewer is intentionally
              chrome-free, so it's visually hidden rather than shown. */}
          <DialogPrimitive.Title className="sr-only">
            Gallery image viewer, {index + 1} of {items.length}
          </DialogPrimitive.Title>

          <div className="flex h-12 shrink-0 items-center justify-between bg-foreground px-4 text-background">
            <span className="font-mono text-xs tracking-wide">
              {index + 1} / {items.length} &middot; {item.year}
            </span>
            <DialogPrimitive.Close
              aria-label="Close"
              className="inline-flex size-9 items-center justify-center rounded-full hover:bg-background/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/60"
            >
              <X className="size-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-foreground">
            <img
              src={item.imageUrl}
              alt={`Archived piece, ${item.year}`}
              className="max-h-full max-w-full object-contain"
            />

            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous image"
                  className="absolute top-1/2 left-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-background ring-1 ring-background/30 hover:bg-background/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/60"
                >
                  <ChevronLeft className="size-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next image"
                  className="absolute top-1/2 right-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-background ring-1 ring-background/30 hover:bg-background/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/60"
                >
                  <ChevronRight className="size-6" aria-hidden="true" />
                </button>
              </>
            ) : null}
          </div>

          {/* The top-bar close button is a mouse-first convention that's a long
              thumb-stretch one-handed on a phone. Mobile gets a second, bigger
              close control anchored to the bottom of the screen instead — the
              part of the viewport a thumb reaches easiest. */}
          <DialogPrimitive.Close
            aria-label="Close"
            className="mx-auto mb-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background ring-1 ring-background/30 sm:hidden"
          >
            <X className="size-4" aria-hidden="true" />
            Close
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
