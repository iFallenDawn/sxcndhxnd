import { useCallback, useEffect, useRef, useState } from 'react'
import { resizeImageForUpload } from '@/lib/image-resize'
import { ApiError } from '@/lib/api-error'
import { ALLOWED_IMAGE_TYPES } from '@/lib/constants'

export interface QueuedUpload<TResult> {
  id: string
  /** Kept so a failed upload can be retried without re-picking the file. */
  file: File
  /**
   * `URL.createObjectURL(file)` — a local, instant preview of the picked
   * file before it's resized or uploaded anywhere. Revoked (see `dismiss`,
   * `clearDone`, and the unmount effect below) once nothing needs it, since
   * these URLs otherwise leak for the page's lifetime.
   */
  previewUrl: string
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

function uploadErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    // A 401 only reaches here once the automatic token refresh has failed.
    if (error.isUnauthorized) return 'Your session expired — sign in again, then retry.'
    if (error.isForbidden) return "You don't have permission to upload this."
    return error.detail ?? 'Upload failed.'
  }
  return error instanceof Error ? error.message : 'Upload failed.'
}

let nextId = 0
function newId() {
  nextId += 1
  return `upload-${nextId}`
}

/** Outcome of a single `runOne`, returned (not just patched into state) so a caller like `runAll` can react without waiting on a re-render. */
type RunOneOutcome<TResult> = { status: 'done'; result: TResult } | { status: 'error'; error: string }

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
  options: {
    /**
     * When false, `enqueue` only stages files (status `'queued'`) without
     * starting the network request — nothing is uploaded until `runAll` is
     * called. Used by `ProductImageUploader` so a photo only reaches the
     * Supabase bucket once the product form is actually submitted, not the
     * moment it's picked (picking it and then cancelling the form used to
     * leave the file orphaned in storage forever). Defaults to `true`,
     * matching the gallery's "dump it in immediately" flow.
     */
    autoStart?: boolean
  } = {},
) {
  const { autoStart = true } = options
  const [items, setItems] = useState<QueuedUpload<TResult>[]>([])
  const controllers = useRef(new Map<string, AbortController>())
  // Every object URL ever created, so the unmount effect below can revoke
  // whatever `dismiss`/`clearDone` didn't already clean up (e.g. the form
  // was cancelled outright rather than removing items one by one).
  const previewUrls = useRef(new Set<string>())

  // Belt-and-suspenders: revoke anything still outstanding when this hook's
  // owner unmounts, since object URLs otherwise live until the page unloads.
  useEffect(() => {
    const urls = previewUrls.current
    return () => {
      for (const url of urls) URL.revokeObjectURL(url)
      urls.clear()
    }
  }, [])

  const patch = useCallback((id: string, partial: Partial<QueuedUpload<TResult>>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...partial } : item)))
  }, [])

  const runOne = useCallback(
    async (id: string, file: File): Promise<RunOneOutcome<TResult>> => {
      const controller = new AbortController()
      controllers.current.set(id, controller)

      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        const error = `"${file.name}" isn't a supported image type. Use JPEG, PNG, WEBP, or GIF.`
        patch(id, { status: 'error', error })
        return { status: 'error', error }
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
        return { status: 'done', result }
      } catch (error) {
        const message =
          error instanceof DOMException && error.name === 'AbortError' ? 'Cancelled.' : uploadErrorMessage(error)
        patch(id, { status: 'error', error: message })
        return { status: 'error', error: message }
      } finally {
        controllers.current.delete(id)
      }
    },
    [patch, uploadFn],
  )

  const enqueue = useCallback(
    (files: File[]) => {
      const newItems: QueuedUpload<TResult>[] = files.map((file) => {
        const previewUrl = URL.createObjectURL(file)
        previewUrls.current.add(previewUrl)
        return {
          id: newId(),
          file,
          previewUrl,
          fileName: file.name,
          originalBytes: file.size,
          resizedBytes: null,
          originalDimensions: null,
          resizedDimensions: null,
          status: 'queued',
          progress: 0,
          error: null,
          result: null,
        }
      })
      setItems((prev) => [...prev, ...newItems])

      if (!autoStart) return

      // Sequential, not parallel: a few hundred large photos uploading at
      // once would saturate a phone's upload bandwidth and make every one
      // of them crawl. One at a time keeps progress meaningful per file.
      void (async () => {
        for (let i = 0; i < files.length; i++) {
          await runOne(newItems[i].id, files[i])
        }
      })()
    },
    [autoStart, runOne],
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

  /**
   * Resets a failed item back to `'queued'` without immediately starting the
   * upload (contrast `retry`, which restarts it right away). For
   * `autoStart: false` queues, this just clears the error so the item's next
   * chance to upload is the next `runAll` call — re-uploading it here on the
   * spot would defeat the point of deferring, since it could still be
   * orphaned if the form is cancelled right after.
   */
  const requeue = useCallback(
    (id: string) => {
      patch(id, { status: 'queued', error: null, progress: 0 })
    },
    [patch],
  )

  const dismiss = useCallback((id: string) => {
    controllers.current.get(id)?.abort()
    setItems((prev) => {
      const item = prev.find((it) => it.id === id)
      if (item) {
        URL.revokeObjectURL(item.previewUrl)
        previewUrls.current.delete(item.previewUrl)
      }
      return prev.filter((it) => it.id !== id)
    })
  }, [])

  const clearDone = useCallback(() => {
    setItems((prev) => {
      for (const item of prev) {
        if (item.status !== 'done') continue
        URL.revokeObjectURL(item.previewUrl)
        previewUrls.current.delete(item.previewUrl)
      }
      return prev.filter((item) => item.status !== 'done')
    })
  }, [])

  /**
   * Runs every item that hasn't already succeeded (`'queued'` or a
   * previously failed `'error'`), sequentially, and returns their results in
   * queue order. Used with `autoStart: false` to perform every staged
   * upload at once — right before the product is actually created/updated —
   * instead of as each file is picked.
   *
   * Stops at the first failure (its `error` is thrown) rather than
   * continuing to burn through the rest of the batch: the caller should
   * leave the failed item's retry button for the admin rather than silently
   * dropping a photo from the product.
   */
  const runAll = useCallback(async (): Promise<TResult[]> => {
    const results = new Map<string, TResult>()
    for (const item of items) {
      if (item.status === 'done') {
        results.set(item.id, item.result as TResult)
        continue
      }
      const outcome = await runOne(item.id, item.file)
      if (outcome.status === 'error') {
        throw new Error(outcome.error)
      }
      results.set(item.id, outcome.result)
    }
    // Reconstructed from the original `items` order (not completion order),
    // since order here is display order (first photo = the storefront cover).
    return items.map((item) => results.get(item.id) as TResult)
  }, [items, runOne])

  return { items, enqueue, retry, requeue, dismiss, clearDone, runAll }
}
