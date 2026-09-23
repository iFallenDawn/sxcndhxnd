import { toast } from 'sonner'
import { ConfirmDeleteDialog } from '@/components/dashboard/ConfirmDeleteDialog'
import { useDeleteProduct } from '@/hooks/use-products'
import type { ProductsBaseSchema } from '@/types/api'

interface DeleteProductDialogProps {
  product: ProductsBaseSchema | null
  onOpenChange: (open: boolean) => void
}

/** Per issue #15, states plainly that the product and its photos are gone for good. */
export function DeleteProductDialog({ product, onOpenChange }: DeleteProductDialogProps) {
  const deleteProduct = useDeleteProduct()

  return (
    <ConfirmDeleteDialog
      open={product !== null}
      onOpenChange={onOpenChange}
      title="Delete this product for good?"
      description={
        product ? (
          <>
            This permanently deletes <span className="font-medium text-foreground">"{product.title}"</span>{' '}
            and its photos. This can't be undone — there is no trash or recovery.
          </>
        ) : null
      }
      errorMessage="Could not delete this product."
      onConfirm={async () => {
        if (!product) return
        await deleteProduct.mutateAsync(product.id)
        toast.success(`"${product.title}" was deleted.`)
      }}
    />
  )
}
