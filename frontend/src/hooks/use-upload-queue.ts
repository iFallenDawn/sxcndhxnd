import { useCallback, useRef, useState } from 'react'
import { resizeImageForUpload } from '@/lib/image-resize'
import { ApiError } from '@/lib/api-error'
import { ALLOWED_IMAGE_TYPES } from '@/lib/constants'

export interface QueuedUpload<TResult> {
  id: string
  /** Kept so a failed upload can be retried without re-picking the file. */
  file: File
  fileName: string
  originalBytes: number
  resizedBytes: number | null
  originalDimensions: { width: number; height: number } | null
  resizedDimensions: { width: number; height: number } | null
  status: 'queued' | 'resizing' | 'uploading' | 'done' | 'error'
  progress: number
  error: string | null
  result: TResult | null
}

let nextId = 0
function newId() {
  nextId += 1
  return `upload-${nextId}`
}

/**
 * Runs a batch of image files through resize-then-upload, one at a time,
 * tracking per-file progress/state so bulk uploads (dozens to a few hundred
 * gallery photos) give visible feedback instead of one opaque spinner.
 *
 * Rejects unsupported content types up front with a plain-language message
 * rather than letting them hit the backend and come back as a raw 400.
 */
export function useUploadQueue<TResult>(
  uploadFn: (file: File, onProgress: (percent: number) => void, signal: AbortSignal) => Promise<TResult>,
) {
  const [items, setItems] = useState<QueuedUpload<TResult>[]>([])
  const controllers = useRef(new Map<string, AbortController>())

  const patch = useCallback((id: string, partial: Partial<QueuedUpload<TResult>>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...partial } : item)))
  }, [])

  const runOne = useCallback(
    async (id: string, file: File) => {
      const controller = new AbortController()
      controllers.current.set(id, controller)

      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        patch(id, {
          status: 'error',
          error: `"${file.name}" isn't a supported image type. Use JPEG, PNG, WEBP, or GIF.`,
        })
        return
      }

      patch(id, { status: 'resizing' })
      try {
        const resized = await resizeImageForUpload(file)
        patch(id, {
          resizedBytes: resized.resizedBytes,
          originalDimensions: resized.originalDimensions,
          resizedDimensions: resized.resizedDimensions,
          status: 'uploading',
        })

        const result = await uploadFn(
          resized.file,
          (percent) => patch(id, { progress: percent }),
          controller.signal,
        )
        patch(id, { status: 'done', progress: 100, result })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          patch(id, { status: 'error', error: 'Cancelled.' })
          return
        }
        const message =
          error instanceof ApiError
            ? error.isForbidden
              ? "You don't have permission to upload this — sign-in may have expired."
              : (error.detail ?? 'Upload failed.')
            : error instanceof Error
              ? error.message
              : 'Upload failed.'
        patch(id, { status: 'error', error: message })
      } finally {
        controllers.current.delete(id)
      }
    },
    [patch, uploadFn],
  )

  const enqueue = useCallback(
    (files: File[]) => {
      const newItems: QueuedUpload<TResult>[] = files.map((file) => ({
        id: newId(),
        file,
        fileName: file.name,
        originalBytes: file.size,
        resizedBytes: null,
        originalDimensions: null,
        resizedDimensions: null,
        status: 'queued',
        progress: 0,
        error: null,
        result: null,
      }))
      setItems((prev) => [...prev, ...newItems])

      // Sequential, not parallel: a few hundred large photos uploading at
      // once would saturate a phone's upload bandwidth and make every one
      // of them crawl. One at a time keeps progress meaningful per file.
      void (async () => {
        for (let i = 0; i < files.length; i++) {
          await runOne(newItems[i].id, files[i])
        }
      })()
    },
    [runOne],
  )

  const retry = useCallback(
    (id: string) => {
      const item = items.find((it) => it.id === id)
      if (!item) return
      patch(id, { status: 'queued', error: null, progress: 0 })
      void runOne(id, item.file)
    },
    [items, patch, runOne],
  )

  const dismiss = useCallback((id: string) => {
    controllers.current.get(id)?.abort()
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearDone = useCallback(() => {
    setItems((prev) => prev.filter((item) => item.status !== 'done'))
  }, [])

  return { items, enqueue, retry, dismiss, clearDone }
}
