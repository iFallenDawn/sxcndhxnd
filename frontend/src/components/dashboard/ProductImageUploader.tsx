import { useState, type Dispatch, type SetStateAction } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, Loader2Icon, RotateCwIcon, TriangleAlertIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageFilePicker } from '@/components/dashboard/ImageFilePicker'
import { ImageLightbox } from '@/components/dashboard/ImageLightbox'
import { cn } from '@/lib/utils'
import type { QueuedUpload } from '@/hooks/use-upload-queue'
import type { ProductImageUploadResponse } from '@/types/api'

interface ProductImageUploaderProps {
  /** Already-uploaded image URLs, in display order. First image is the cover shown on the store. */
  imageUrls: string[]
  onChange: Dispatch<SetStateAction<string[]>>
  /**
   * Files staged for upload but not yet sent anywhere — the queue itself
   * lives in `ProductForm` (see that file for why) so its `runAll` can be
   * awaited from the submit handler. This component only stages files
   * (`onFiles`/`enqueue`) and previews them (via each item's local
   * `previewUrl`) once the form actually starts uploading them.
   */
  queuedItems: QueuedUpload<ProductImageUploadResponse>[]
  onFiles: (files: File[]) => void
  onRetry: (id: string) => void
  onDismiss: (id: string) => void
}

/**
 * Multi-image uploader for a product.
 *
 * Picking (or dropping) files only stages them locally — nothing is sent to
 * the Supabase bucket yet, so cancelling the form leaves nothing behind.
 * `ProductForm`'s submit handler resizes and uploads every staged file (via
 * the queue's `runAll`) right before actually creating/updating the
 * product, then appends the resulting URLs here. Existing (already-uploaded)
 * images can be reordered — first = cover on the storefront — or removed;
 * staged-but-not-yet-uploaded files can only be removed, matching the order
 * they'll be appended in once uploaded.
 *
 * Staged files render as plain thumbnails (via `previewUrl`, a local
 * `URL.createObjectURL`) right alongside the already-uploaded ones, not as a
 * separate status list — while composing the form every staged file just
 * sits at `'queued'` (uploads don't start until submit), so a persistent
 * spinner/"Queued…" row per file was pure noise. The only extra chrome shown
 * on a staged tile is a small spinner badge while it's actively
 * resizing/uploading (during submit) and an error ring + retry affordance if
 * it failed. Every tile — staged or saved — opens the shared lightbox on
 * click so the admin can actually inspect a photo before saving.
 */
export function ProductImageUploader({
  imageUrls,
  onChange,
  queuedItems,
  onFiles,
  onRetry,
  onDismiss,
}: ProductImageUploaderProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= imageUrls.length) return
    const next = [...imageUrls]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    onChange(next)
  }

  const removeImage = (index: number) => {
    onChange(imageUrls.filter((_, i) => i !== index))
  }

  // One combined list so the lightbox can page through every photo attached
  // to this product — saved and staged — not just whichever group was clicked.
  const lightboxImages = [...imageUrls, ...queuedItems.map((item) => item.previewUrl)]

  return (
    <div className="flex flex-col gap-3">
      {imageUrls.length > 0 || queuedItems.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {imageUrls.map((url, index) => (
            <li key={url} className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted">
              <button
                type="button"
                className="block h-full w-full cursor-zoom-in"
                onClick={() => setLightboxIndex(index)}
                aria-label={`View photo ${index + 1} larger`}
              >
                <img src={url} alt={`Product photo ${index + 1}`} className="h-full w-full object-cover" />
              </button>
              {index === 0 ? (
                <span className="pointer-events-none absolute top-1.5 left-1.5 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium tracking-wide text-background uppercase">
                  Cover
                </span>
              ) : null}
              <div className="absolute right-1.5 bottom-1.5 flex gap-1">
                {index > 0 ? (
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="secondary"
                    className="bg-background/90 text-foreground hover:bg-background"
                    onClick={() => moveImage(index, -1)}
                    aria-label="Move earlier"
                  >
                    <ArrowLeftIcon className="size-3.5" />
                  </Button>
                ) : null}
                {index < imageUrls.length - 1 ? (
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="secondary"
                    className="bg-background/90 text-foreground hover:bg-background"
                    onClick={() => moveImage(index, 1)}
                    aria-label="Move later"
                  >
                    <ArrowRightIcon className="size-3.5" />
                  </Button>
                ) : null}
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  className="bg-background/90 text-destructive hover:bg-background"
                  onClick={() => removeImage(index)}
                  aria-label="Remove photo"
                >
                  <XIcon className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}

          {queuedItems.map((item, queuedIndex) => {
            const isBusy = item.status === 'resizing' || item.status === 'uploading'
            return (
              <li
                key={item.id}
                className={cn(
                  'relative aspect-square overflow-hidden rounded-md border bg-muted',
                  item.status === 'error' ? 'border-destructive' : 'border-border',
                )}
              >
                <button
                  type="button"
                  className="block h-full w-full cursor-zoom-in"
                  onClick={() => setLightboxIndex(imageUrls.length + queuedIndex)}
                  aria-label={`View ${item.fileName} larger`}
                >
                  <img src={item.previewUrl} alt={item.fileName} className="h-full w-full object-cover" />
                </button>

                {isBusy ? (
                  <span className="pointer-events-none absolute top-1.5 left-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-background">
                    <Loader2Icon className="size-3 animate-spin" />
                  </span>
                ) : null}

                {item.status === 'error' ? (
                  <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-destructive/90 px-1.5 py-1 text-background">
                    <TriangleAlertIcon className="size-3 shrink-0" aria-hidden="true" />
                    <span className="truncate text-[10px]" title={item.error ?? undefined}>
                      {item.error ?? 'Upload failed'}
                    </span>
                  </div>
                ) : null}

                <div className="absolute right-1.5 top-1.5 flex gap-1">
                  {item.status === 'error' ? (
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="secondary"
                      className="bg-background/90 text-foreground hover:bg-background"
                      onClick={() => onRetry(item.id)}
                      aria-label={`Retry ${item.fileName}`}
                    >
                      <RotateCwIcon className="size-3.5" />
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="secondary"
                    className="bg-background/90 text-destructive hover:bg-background"
                    onClick={() => onDismiss(item.id)}
                    aria-label={`Remove ${item.fileName}`}
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      ) : null}

      <div>
        <ImageFilePicker variant="outline" size="sm" onFiles={onFiles}>
          Add photos
        </ImageFilePicker>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Photos upload when you save — nothing is sent until then.
        </p>
      </div>

      {lightboxIndex !== null ? (
        <ImageLightbox
          images={lightboxImages}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </div>
  )
}
