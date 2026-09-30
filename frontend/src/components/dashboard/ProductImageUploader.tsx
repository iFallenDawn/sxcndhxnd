import { type Dispatch, type SetStateAction } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageFilePicker } from '@/components/dashboard/ImageFilePicker'
import { ImageUploadQueueList } from '@/components/dashboard/ImageUploadQueueList'
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
   * (`onFiles`/`enqueue`) and displays their progress once the form actually
   * starts uploading them.
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
 */
export function ProductImageUploader({
  imageUrls,
  onChange,
  queuedItems,
  onFiles,
  onRetry,
  onDismiss,
}: ProductImageUploaderProps) {
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

  return (
    <div className="flex flex-col gap-3">
      {imageUrls.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {imageUrls.map((url, index) => (
            <li key={url} className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted">
              <img src={url} alt={`Product photo ${index + 1}`} className="h-full w-full object-cover" />
              {index === 0 ? (
                <span className="absolute top-1.5 left-1.5 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium tracking-wide text-background uppercase">
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
        </ul>
      ) : null}

      <ImageUploadQueueList items={queuedItems} onRetry={onRetry} onDismiss={onDismiss} />

      <div>
        <ImageFilePicker variant="outline" size="sm" onFiles={onFiles}>
          Add photos
        </ImageFilePicker>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Photos upload when you save — nothing is sent until then.
        </p>
      </div>
    </div>
  )
}
