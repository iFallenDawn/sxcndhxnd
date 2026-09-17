import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  uploadProductImage,
} from '@/api/products'
import { queryKeys } from '@/lib/query-keys'
import type { ProductsInsert, ProductsUpdate } from '@/types/api'

/** `GET /products/`. Public. */
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.list(),
    queryFn: getAllProducts,
  })
}

/** `GET /products/{id}`. Public. */
export function useProduct(productId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.detail(productId ?? ''),
    queryFn: () => getProductById(productId as string),
    enabled: productId !== undefined,
  })
}

/** `POST /products/`. Admin only. */
export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProductsInsert) => createProduct(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.list() })
    },
  })
}

/** `PATCH /products/{id}`. Admin only. */
export function useUpdateProduct(productId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProductsUpdate) => updateProduct(productId, payload),
    onSuccess: (product) => {
      queryClient.setQueryData(queryKeys.products.detail(productId), product)
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.list() })
    },
  })
}

/** `DELETE /products/{id}`. Admin only. */
export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.list() })
    },
  })
}

/** `POST /products/upload-image` (multipart). Admin only. */
export function useUploadProductImage() {
  return useMutation({
    mutationFn: (file: File) => uploadProductImage(file),
  })
}
