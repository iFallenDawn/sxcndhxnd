import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ProductForm } from '@/components/dashboard/ProductForm'
import { useCreateProduct, useUpdateProduct } from '@/hooks/use-products'
import type { ProductsBaseSchema, ProductsInsert } from '@/types/api'

export type ProductDialogState = { mode: 'create' } | { mode: 'edit'; product: ProductsBaseSchema }

interface ProductFormDialogProps {
  state: ProductDialogState
  onClose: () => void
}

/** Dialog wrapping `ProductForm` for both create and edit. Mount it only while open. */
export function ProductFormDialog({ state, onClose }: ProductFormDialogProps) {
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const product = state.mode === 'edit' ? state.product : undefined
  // While true, `ProductForm` is mid-upload or mid-save — refuse to close
  // (Escape, the overlay, the corner X all route through `onOpenChange`).
  // Closing then wouldn't just lose typed input: a photo that just finished
  // uploading to the bucket would have no product row to attach to.
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (payload: ProductsInsert) => {
    if (product) {
      await updateProduct.mutateAsync({ id: product.id, payload })
      toast.success('Product updated.')
    } else {
      await createProduct.mutateAsync(payload)
      toast.success('Product added.')
    }
    onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && !busy && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit product' : 'Add product'}</DialogTitle>
          <DialogDescription>
            {product
              ? 'Changes save to the live store as soon as you hit save.'
              : 'This goes live on the store immediately once saved.'}
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          product={product}
          submitLabel={product ? 'Save changes' : 'Add product'}
          onCancel={onClose}
          onSubmit={handleSubmit}
          onBusyChange={setBusy}
        />
      </DialogContent>
    </Dialog>
  )
}
