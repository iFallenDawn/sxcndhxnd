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
import type { ProductsBaseSchema, ProductsInsert, ProductsUpdate } from '@/types/api'

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Omit to create a new product; pass an existing one to edit it. */
  product?: ProductsBaseSchema
}

/** Dialog wrapping `ProductForm` for both create and edit. */
export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct(product?.id ?? '')

  const handleSubmit = async (payload: ProductsInsert | ProductsUpdate) => {
    if (product) {
      await updateProduct.mutateAsync(payload as ProductsUpdate)
      toast.success('Product updated.')
    } else {
      await createProduct.mutateAsync(payload as ProductsInsert)
      toast.success('Product added.')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          key={product?.id ?? 'new'}
          product={product}
          submitLabel={product ? 'Save changes' : 'Add product'}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
