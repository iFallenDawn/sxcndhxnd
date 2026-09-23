/**
 * Downscales an image in the browser before it is ever sent to the backend.
 *
 * Why this exists (issue #15): `ALLOWED_CONTENT_TYPES` in
 * `backend/core/constants.py` validates content type only — there is no size
 * limit anywhere in the pipeline. The live Supabase bucket already has a
 * 45MB product image and 6-8MB gallery images, which is the confirmed cause
 * of the gallery loading slowly. Supabase's on-the-fly image transform
 * endpoint 403s on this project's plan, so this cannot be fixed at serve
 * time — it has to happen before the bytes leave the browser.
 *
 * This is the default path for every upload in the dashboard, not an opt-in
 * checkbox Nico could forget to tick (he's about to bulk-upload the entire
 * archive through this screen).
 */

/** Plenty for full-bleed display; well past what any viewport needs. */
const MAX_EDGE = 2000
const JPEG_QUALITY = 0.82

export interface ResizeResult {
  /** The file to actually upload — resized, or the original if resizing was skipped. */
  file: File
  originalBytes: number
  resizedBytes: number
  originalDimensions: { width: number; height: number }
  resizedDimensions: { width: number; height: number }
  /** True when the file was re-encoded. False for animated GIFs (see below) and files already under the cap. */
  wasResized: boolean
}

function readDimensions(file: File | Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read that image — it may be corrupted.'))
    }
    img.src = url
  })
}

/**
 * Resizes a single image file for upload. Handles EXIF orientation via
 * `createImageBitmap(..., { imageOrientation: 'from-image' })` so phone
 * photos come out right-side-up instead of rotated.
 *
 * Animated GIFs are passed through untouched: a <canvas> re-encode collapses
 * a GIF to its first frame, which would silently destroy the animation.
 * GIFs are rare in this pipeline (product/gallery photography, not memes),
 * so this tradeoff is deliberate.
 */
export async function resizeImageForUpload(file: File): Promise<ResizeResult> {
  const originalBytes = file.size

  if (file.type === 'image/gif') {
    const dims = await readDimensions(file)
    return {
      file,
      originalBytes,
      resizedBytes: originalBytes,
      originalDimensions: dims,
      resizedDimensions: dims,
      wasResized: false,
    }
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error('Could not read that image — it may be corrupted or an unsupported format.')
  }

  const originalDimensions = { width: bitmap.width, height: bitmap.height }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const targetWidth = Math.max(1, Math.round(bitmap.width * scale))
  const targetHeight = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('This browser cannot resize images. Try updating it, or a different device.')
  }
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)
  bitmap.close()

  // Re-encode as JPEG regardless of source format. Product/gallery images
  // are photography, not logos or screenshots with transparency worth
  // preserving, and JPEG at this quality is dramatically smaller than PNG
  // for photos with no visible difference.
  const mimeType = 'image/jpeg'
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('Could not encode the resized image.'))),
      mimeType,
      JPEG_QUALITY,
    )
  })

  const baseName = file.name.replace(/\.[^./\\]+$/, '') || 'image'
  const resizedFile = new File([blob], `${baseName}.jpg`, { type: mimeType })

  return {
    file: resizedFile,
    originalBytes,
    resizedBytes: resizedFile.size,
    originalDimensions,
    resizedDimensions: { width: targetWidth, height: targetHeight },
    wasResized: true,
  }
}

/** Human-readable byte count, e.g. "4.2 MB". */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`
}
