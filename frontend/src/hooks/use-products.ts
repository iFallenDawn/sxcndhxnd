import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '@/api/products'
import { queryKeys } from '@/lib/query-keys'
import type { ProductsBaseSchema, ProductsInsert, ProductsUpdate } from '@/types/api'

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

/**
 * `PATCH /products/{id}`. Admin only.
 *
 * Optimistically patches both the list cache and the detail cache so an
 * admin editing status/price/etc sees the change immediately; if the request
 * fails, the previous snapshots are restored (`onError`) so the UI never
 * shows a change that didn't actually save.
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductsUpdate }) => updateProduct(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.list() })
      await queryClient.cancelQueries({ queryKey: queryKeys.products.detail(id) })

      const previousList = queryClient.getQueryData<ProductsBaseSchema[]>(queryKeys.products.list())
      const previousDetail = queryClient.getQueryData<ProductsBaseSchema>(
        queryKeys.products.detail(id),
      )

      // `payload` is `ProductsUpdate` (fields optional/nullable for a PATCH);
      // merging it onto the cached `ProductsBaseSchema` is safe in practice
      // (the form never actually sends `description: null`) but not
      // type-identical, hence the cast.
      queryClient.setQueryData<ProductsBaseSchema[]>(queryKeys.products.list(), (old) =>
        old?.map((product) =>
          product.id === id ? ({ ...product, ...payload } as ProductsBaseSchema) : product,
        ),
      )
      queryClient.setQueryData<ProductsBaseSchema>(queryKeys.products.detail(id), (old) =>
        old ? ({ ...old, ...payload } as ProductsBaseSchema) : old,
      )

      return { previousList, previousDetail }
    },
    onError: (_error, { id }, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(queryKeys.products.list(), context.previousList)
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(queryKeys.products.detail(id), context.previousDetail)
      }
    },
    onSuccess: (product, { id }) => {
      queryClient.setQueryData(queryKeys.products.detail(id), product)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.list() })
    },
  })
}

/**
 * `DELETE /products/{id}`. Admin only.
 *
 * Optimistically removes the product from the list cache; restores it on
 * failure. This is paired with a destructive confirmation dialog in the UI
 * (see `components/dashboard/DeleteProductDialog.tsx`) since the backend
 * also removes the associated storage objects — the request itself is not
 * undoable, only the optimistic UI state is.
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.list() })
      const previousList = queryClient.getQueryData<ProductsBaseSchema[]>(queryKeys.products.list())
      queryClient.setQueryData<ProductsBaseSchema[]>(queryKeys.products.list(), (old) =>
        old?.filter((product) => product.id !== productId),
      )
      return { previousList }
    },
    onError: (_error, _productId, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(queryKeys.products.list(), context.previousList)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.list() })
    },
  })
}
