import { CheckIcon, Loader2Icon, TriangleAlertIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatBytes } from '@/lib/image-resize'
import { cn } from '@/lib/utils'
import type { QueuedUpload } from '@/hooks/use-upload-queue'

interface ImageUploadQueueListProps<T> {
  items: QueuedUpload<T>[]
  onRetry: (id: string) => void
  onDismiss: (id: string) => void
}

/**
 * Shared progress list for both the product-image and gallery uploaders.
 * Shows the resize before/after byte counts per file — this is the visible
 * proof to Nico that resizing is actually happening, not a silent no-op.
 */
export function ImageUploadQueueList<T>({ items, onRetry, onDismiss }: ImageUploadQueueListProps<T>) {
  if (items.length === 0) return null

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2 text-sm"
        >
          <div
            className={cn(
              'flex size-6 shrink-0 items-center justify-center rounded-full',
              item.status === 'error'
                ? 'bg-destructive/10 text-destructive'
                : item.status === 'done'
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground',
            )}
          >
            {item.status === 'error' ? (
              <TriangleAlertIcon className="size-3.5" />
            ) : item.status === 'done' ? (
              <CheckIcon className="size-3.5" />
            ) : (
              <Loader2Icon className="size-3.5 animate-spin" />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate font-medium text-foreground">{item.fileName}</span>
            {item.status === 'error' ? (
              <span className="text-xs text-destructive">{item.error}</span>
            ) : item.status === 'resizing' ? (
              <span className="text-xs text-muted-foreground">Shrinking image…</span>
            ) : item.status === 'uploading' ? (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-foreground transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-muted-foreground">{item.progress}%</span>
              </div>
            ) : item.status === 'done' && item.resizedBytes !== null ? (
              <span className="font-mono text-xs text-muted-foreground">
                {formatBytes(item.originalBytes)} → {formatBytes(item.resizedBytes)}
                {item.originalDimensions && item.resizedDimensions
                  ? ` · ${item.originalDimensions.width}×${item.originalDimensions.height} → ${item.resizedDimensions.width}×${item.resizedDimensions.height}`
                  : ''}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">Queued…</span>
            )}
          </div>

          {item.status === 'error' ? (
            <Button type="button" size="sm" variant="outline" onClick={() => onRetry(item.id)}>
              Retry
            </Button>
          ) : null}
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => onDismiss(item.id)}
            aria-label={`Remove ${item.fileName} from the upload list`}
          >
            <XIcon className="size-3.5" />
          </Button>
        </li>
      ))}
    </ul>
  )
}
