import { useCallback, type Dispatch, type SetStateAction } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageFilePicker } from '@/components/dashboard/ImageFilePicker'
import { ImageUploadQueueList } from '@/components/dashboard/ImageUploadQueueList'
import { useUploadQueue } from '@/hooks/use-upload-queue'
import { uploadProductImageWithProgress } from '@/api/products'

interface ProductImageUploaderProps {
  /** Already-uploaded image URLs, in display order. First image is the cover shown on the store. */
  imageUrls: string[]
  onChange: Dispatch<SetStateAction<string[]>>
}

/**
 * Multi-image uploader for a product: pick files (or drop them), each one
 * is resized in the browser (see `lib/image-resize.ts`) then uploaded with
 * visible progress, and successful uploads are appended to `imageUrls`.
 * Existing images can be reordered (first = cover on the storefront) or
 * removed.
 */
export function ProductImageUploader({ imageUrls, onChange }: ProductImageUploaderProps) {
  const uploadFn = useCallback(
    async (file: File, onProgress: (percent: number) => void, signal: AbortSignal) => {
      const result = await uploadProductImageWithProgress(file, onProgress, signal)
      // Updater form: uploads in a batch finish asynchronously, so appending
      // to a closed-over `imageUrls` could drop a sibling upload's URL.
      onChange((prev) => [...prev, result.image_url])
      return result
    },
    [onChange],
  )

  const { items, enqueue, retry, dismiss } = useUploadQueue(uploadFn)

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

      <ImageUploadQueueList items={items} onRetry={retry} onDismiss={dismiss} />

      <div>
        <ImageFilePicker variant="outline" size="sm" onFiles={enqueue}>
          Add photos
        </ImageFilePicker>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Photos are automatically shrunk before upload — this can take a moment on slow connections.
        </p>
      </div>
    </div>
  )
}
