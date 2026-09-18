import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDeleteProduct } from '@/hooks/use-products'
import { ApiError } from '@/lib/api-error'
import type { ProductsBaseSchema } from '@/types/api'

interface DeleteProductDialogProps {
  product: ProductsBaseSchema | null
  onOpenChange: (open: boolean) => void
}

/**
 * Destructive delete confirmation. Per issue #15's explicit requirement:
 * the backend also removes the associated storage objects on delete, so
 * this is not recoverable — that consequence is stated plainly, in plain
 * language, not just "are you sure?".
 */
export function DeleteProductDialog({ product, onOpenChange }: DeleteProductDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const deleteProduct = useDeleteProduct()

  const handleDelete = async () => {
    if (!product) return
    setError(null)
    try {
      await deleteProduct.mutateAsync(product.id)
      toast.success(`"${product.title}" was deleted.`)
      onOpenChange(false)
    } catch (deleteError) {
      setError(
        deleteError instanceof ApiError
          ? (deleteError.detail ?? 'Could not delete this product.')
          : 'Could not delete this product. Check your connection and try again.',
      )
    }
  }

  return (
    <Dialog open={product !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete this product for good?</DialogTitle>
          <DialogDescription>
            {product ? (
              <>
                This permanently deletes <span className="font-medium text-foreground">"{product.title}"</span>{' '}
                and its photos. This can't be undone — there is no trash or recovery.
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleteProduct.isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteProduct.isPending}>
            {deleteProduct.isPending ? 'Deleting…' : 'Delete permanently'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
