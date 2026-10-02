import { useMemo } from 'react'
import { toast } from 'sonner'
import { ImageIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useProducts, useUpdateProduct } from '@/hooks/use-products'
import { useProjects } from '@/hooks/use-projects'
import { ApiError } from '@/lib/api-error'
import type { ProductsBaseSchema } from '@/types/api'

// Radix `SelectItem` can't take an empty-string value, so "no project" needs
// a sentinel rather than mapping directly to `project_id === null`.
const NO_PROJECT = 'none'

interface ProjectProductsListProps {
  projectId: string
}

/**
 * Products currently assigned to a project, shown inside "Edit project" (see
 * `ProjectFormDialog`) so moving a product to a different project — or
 * taking it out of this one entirely — doesn't require opening that
 * product's own form.
 *
 * Reuses `useProducts()` (already cached by `ProjectsPanel`, which renders
 * this dialog's parent) and filters client-side, rather than fetching via
 * `useProjectProducts`'s separate `GET /projects/{id}/products` — that way
 * `useUpdateProduct`'s optimistic patch onto `products.list()` updates this
 * list immediately when a product is moved/removed, instead of waiting on a
 * refetch of a second endpoint.
 */
export function ProjectProductsList({ projectId }: ProjectProductsListProps) {
  const { data: products, isLoading } = useProducts()
  const { data: projects } = useProjects()
  const updateProduct = useUpdateProduct()

  const projectProducts = useMemo(
    () => (products ?? []).filter((product) => product.project_id === projectId),
    [products, projectId],
  )

  const handleChange = async (product: ProductsBaseSchema, value: string) => {
    const nextProjectId = value === NO_PROJECT ? null : value
    if (nextProjectId === product.project_id) return
    try {
      await updateProduct.mutateAsync({ id: product.id, payload: { project_id: nextProjectId } })
      toast.success(nextProjectId ? 'Moved to project.' : 'Removed from project.')
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Could not update this product.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 2 }, (_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    )
  }

  if (projectProducts.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
        No products assigned to this project yet.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {projectProducts.map((product) => {
        const [firstImage] = product.image_urls
        return (
          <li
            key={product.id}
            className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
          >
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-muted">
              {firstImage ? (
                <img src={firstImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="size-4 text-muted-foreground" aria-hidden="true" />
              )}
            </div>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
              {product.title}
            </span>
            <Select
              value={product.project_id ?? NO_PROJECT}
              onValueChange={(value) => void handleChange(product, value)}
            >
              <SelectTrigger size="sm" className="w-40 shrink-0" aria-label={`Project for ${product.title}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PROJECT}>No project</SelectItem>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </li>
        )
      })}
    </ul>
  )
}
