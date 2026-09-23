import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FormField } from '@/components/auth/FormField'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProductImageUploader } from '@/components/dashboard/ProductImageUploader'
import { productFormSchema, type ProductFormValues } from '@/lib/product-validation'
import { PRODUCT_STATUS_LABEL } from '@/lib/products'
import { PRODUCT_STATUSES, type ProductsBaseSchema, type ProductsInsert, type ProductsUpdate } from '@/types/api'

interface ProductFormProps {
  product?: ProductsBaseSchema
  onSubmit: (payload: ProductsInsert | ProductsUpdate) => Promise<void>
  onCancel: () => void
  submitLabel: string
}

/**
 * Shared create/edit form. `image_urls` is tracked separately from
 * react-hook-form since it's populated by the async upload queue rather
 * than typed input — see `ProductImageUploader`.
 */
export function ProductForm({ product, onSubmit, onCancel, submitLabel }: ProductFormProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(product?.image_urls ?? [])
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: product?.title ?? '',
      description: product?.description ?? '',
      price: product?.price ?? '',
      category: product?.category ?? '',
      size: product?.size ?? '',
      status: product?.status ?? 'available',
      drop_item: product?.drop_item ?? false,
      drop_title: product?.drop_title ?? '',
    },
  })

  const dropItem = watch('drop_item')
  const status = watch('status')

  const submit = async (values: ProductFormValues) => {
    setFormError(null)
    if (imageUrls.length === 0) {
      setFormError('Add at least one photo before saving.')
      return
    }
    try {
      await onSubmit({
        title: values.title,
        description: values.description,
        price: values.price,
        category: values.category || null,
        size: values.size || null,
        status: values.status,
        drop_item: values.drop_item,
        drop_title: values.drop_item ? values.drop_title || null : null,
        image_urls: imageUrls,
      })
    } catch {
      setFormError('Could not save this product. Check your connection and try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">Photos</span>
        <ProductImageUploader imageUrls={imageUrls} onChange={setImageUrls} />
      </div>

      <FormField
        label="Title"
        htmlFor="product-title"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="product-description" className="text-sm font-medium text-foreground">
          Description
        </label>
        <Textarea id="product-description" rows={4} {...register('description')} />
        {errors.description ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Price (USD)"
          htmlFor="product-price"
          inputMode="decimal"
          placeholder="120.00"
          hint="Numbers only, e.g. 120 or 120.00."
          error={errors.price?.message}
          {...register('price')}
        />
        <FormField
          label="Size"
          htmlFor="product-size"
          placeholder="e.g. M, One size"
          error={errors.size?.message}
          {...register('size')}
        />
      </div>

      <FormField
        label="Category"
        htmlFor="product-category"
        placeholder="e.g. Outerwear"
        hint="Used to group and filter the store."
        error={errors.category?.message}
        {...register('category')}
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Status</span>
        <Select value={status} onValueChange={(value) => setValue('status', value as ProductFormValues['status'])}>
          <SelectTrigger className="h-11 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_STATUSES.map((option) => (
              <SelectItem key={option} value={option}>
                {PRODUCT_STATUS_LABEL[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Sold and display pieces show under Archive in the store — they stay listed but fade to the
          back.
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <input
          type="checkbox"
          className="size-4 rounded border-input"
          {...register('drop_item')}
        />
        Part of a drop
      </label>

      {dropItem ? (
        <FormField
          label="Drop title"
          htmlFor="product-drop-title"
          placeholder="e.g. Fall 2026 Capsule"
          error={errors.drop_title?.message}
          {...register('drop_title')}
        />
      ) : null}

      {formError ? (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" size="lg" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
