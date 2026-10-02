import { z } from 'zod'
import { PRODUCT_STATUSES } from '@/types/api'

/**
 * Validates the price as a plain decimal string (matches the backend's
 * `Decimal` field — see `types/api.ts`'s note on `price`). Never parsed to
 * `Number` here either; only checked with a regex and compared as text.
 */
const priceSchema = z
  .string()
  .trim()
  .min(1, 'Price is required')
  .regex(/^\d+(\.\d{1,2})?$/, 'Enter a price like 120 or 120.00')

export const productFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  price: priceSchema,
  category: z.string().trim(),
  size: z.string().trim(),
  status: z.enum(PRODUCT_STATUSES),
  drop_item: z.boolean(),
  drop_title: z.string().trim(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
