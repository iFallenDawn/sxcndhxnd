import { useState, type ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/lib/api-error'

interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  /** Shown when the delete fails and the server gave no detail, e.g. "Could not delete this photo." */
  errorMessage: string
  /** Performs the delete. The dialog closes when it resolves and shows an error if it throws. */
  onConfirm: () => Promise<void>
}

/**
 * Destructive delete confirmation. Deletes also remove the associated storage
 * objects on the backend, so they aren't recoverable — callers should state
 * that consequence plainly in `description`, not just "are you sure?".
 */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  errorMessage,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setError(null)
    setIsPending(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (confirmError) {
      setError(
        confirmError instanceof ApiError
          ? (confirmError.detail ?? errorMessage)
          : `${errorMessage} Check your connection and try again.`,
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Deleting…' : 'Delete permanently'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
