import { useEffect, useRef } from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface ImageLightboxProps {
  images: string[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

/** Minimum horizontal swipe distance (px) before it counts as a navigation gesture. */
const SWIPE_THRESHOLD_PX = 48

/**
 * Generic fullscreen image viewer over a plain list of image URLs — same
 * chrome-free, edge-to-edge pattern as `components/gallery/GalleryLightbox.tsx`
 * (built on the bare Radix Dialog primitive rather than `ui/dialog.tsx`'s
 * `DialogContent`, which is sized for small popovers/forms), generalized
 * since this one has no `GalleryItem`-specific caption and is used from
 * `ProductImageUploader` to preview both already-uploaded and newly-staged
 * (not-yet-uploaded, local `blob:`) product photos in one combined list.
 *
 * Deliberately nests inside whatever dialog is already open (the product
 * form) rather than closing it first — Radix dialogs stack fine, and the
 * admin shouldn't lose their in-progress form just to look at a photo.
 */
export function ImageLightbox({ images, index, onIndexChange, onClose }: ImageLightboxProps) {
  const src = images[index]
  const touchStartX = useRef<number | null>(null)

  const goPrev = () => onIndexChange((index - 1 + images.length) % images.length)
  const goNext = () => onIndexChange((index + 1) % images.length)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') goPrev()
      else if (event.key === 'ArrowRight') goNext()
      // Escape is handled by Radix's Dialog itself (closes + restores focus).
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goPrev/goNext close over index/images.length, both listed.
  }, [index, images.length])

  if (!src) return null

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
            Image viewer, {index + 1} of {images.length}
          </DialogPrimitive.Title>

          <div className="flex h-12 shrink-0 items-center justify-between bg-foreground px-4 text-background">
            <span className="font-mono text-xs tracking-wide">
              {index + 1} / {images.length}
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
              src={src}
              alt={`Image ${index + 1} of ${images.length}`}
              className="max-h-full max-w-full object-contain"
            />

            {images.length > 1 ? (
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

          {/* Mouse-first top-bar close button is a long one-handed thumb-stretch
              on a phone; mobile also gets a bottom-anchored close control. */}
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
