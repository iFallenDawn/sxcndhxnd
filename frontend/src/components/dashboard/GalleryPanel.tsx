import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { ImageFilePicker } from '@/components/dashboard/ImageFilePicker'
import { ImageUploadQueueList } from '@/components/dashboard/ImageUploadQueueList'
import { useUploadQueue } from '@/hooks/use-upload-queue'
import { useGallery, useDeleteGalleryImage } from '@/hooks/use-gallery'
import { uploadGalleryImageWithProgress } from '@/api/gallery'
import { ApiError } from '@/lib/api-error'
import { queryKeys } from '@/lib/query-keys'
import type { GalleryImagesBaseSchema } from '@/types/api'

/**
 * Gallery is explicitly a "dump every commission" surface — Nico has a few
 * hundred photos to get through — so bulk upload is the primary path here,
 * not an afterthought. One shared, optional description applies to every
 * file in a batch (per-file captions aren't worth the extra taps for a
 * few-hundred-photo dump).
 */
export function GalleryPanel() {
  const { data: gallery, isLoading, isError } = useGallery()
  const queryClient = useQueryClient()
  const [description, setDescription] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<GalleryImagesBaseSchema | null>(null)
  const deleteGalleryImage = useDeleteGalleryImage()
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Captured when a batch is picked, so every file in it gets the same
  // description even if the field is edited mid-upload.
  const uploadFn = useCallback(
    (file: File, onProgress: (percent: number) => void, signal: AbortSignal) =>
      uploadGalleryImageWithProgress(file, description, onProgress, signal),
    [description],
  )

  const { items, enqueue, retry, dismiss, clearDone } = useUploadQueue(uploadFn)

  // Refetch the gallery once when a batch settles, not after every file — a
  // few-hundred-photo dump would otherwise fire a few hundred `GET /gallery/`s.
  const isUploading = items.some((item) => item.status !== 'done' && item.status !== 'error')
  const wasUploading = useRef(false)
  useEffect(() => {
    if (wasUploading.current && !isUploading) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.gallery.list() })
    }
    wasUploading.current = isUploading
  }, [isUploading, queryClient])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteError(null)
    try {
      await deleteGalleryImage.mutateAsync(deleteTarget.id)
      toast.success('Photo deleted.')
      setDeleteTarget(null)
    } catch (error) {
      setDeleteError(
        error instanceof ApiError ? (error.detail ?? 'Could not delete this photo.') : 'Could not delete this photo.',
      )
    }
  }

  const doneCount = items.filter((item) => item.status === 'done').length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-md border border-dashed border-border p-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="gallery-description" className="text-sm font-medium text-foreground">
            Description for this batch (optional)
          </label>
          <Input
            id="gallery-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="e.g. Commission for @handle, denim rework"
            className="h-9"
          />
        </div>

        <div>
          <ImageFilePicker onFiles={enqueue}>Upload photos</ImageFilePicker>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Pick as many as you want at once — each one is shrunk before upload, then sent one at a time
            so progress stays accurate.
          </p>
        </div>

        {items.length > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {doneCount} of {items.length} uploaded
              </span>
              {doneCount > 0 ? (
                <Button type="button" size="sm" variant="ghost" onClick={clearDone}>
                  Clear finished
                </Button>
              ) : null}
            </div>
            <ImageUploadQueueList items={items} onRetry={retry} onDismiss={dismiss} />
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="aspect-square" />
          ))}
        </div>
      ) : isError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-8 text-center text-sm text-destructive">
          Could not load the gallery.
        </p>
      ) : !gallery || gallery.gallery_images.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No gallery photos yet — upload some above.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {gallery.gallery_images.map((image) => (
            <li key={image.id} className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted">
              <img src={image.image_url} alt={image.description ?? ''} className="h-full w-full object-cover" />
              <Button
                type="button"
                size="icon-sm"
                variant="secondary"
                className="absolute top-1.5 right-1.5 bg-background/90 text-destructive hover:bg-background"
                onClick={() => setDeleteTarget(image)}
                aria-label="Delete this photo"
              >
                <TrashIcon className="size-3.5" />
              </Button>
              {image.description ? (
                <span className="absolute inset-x-0 bottom-0 truncate bg-foreground/80 px-2 py-1 text-[11px] text-background">
                  {image.description}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this photo for good?</DialogTitle>
            <DialogDescription>
              This permanently removes it from the gallery and storage. This can't be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteError ? (
            <p role="alert" className="text-sm text-destructive">
              {deleteError}
            </p>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleteGalleryImage.isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteGalleryImage.isPending}>
              {deleteGalleryImage.isPending ? 'Deleting…' : 'Delete permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
