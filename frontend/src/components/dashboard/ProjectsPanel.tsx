import { useMemo, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectFormDialog, type ProjectDialogState } from '@/components/dashboard/ProjectFormDialog'
import { DeleteProjectDialog } from '@/components/dashboard/DeleteProjectDialog'
import { useProjects } from '@/hooks/use-projects'
import { useProducts } from '@/hooks/use-products'
import { ApiError } from '@/lib/api-error'
import type { ProjectsBaseSchema } from '@/types/api'

// `timeZone: 'UTC'` matters: `project.date` is stored as UTC midnight for a
// date-only pick (see `ProjectForm`), so formatting in the viewer's local
// zone would render it a day early for anyone west of UTC.
const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' })

function ProjectRow({
  project,
  productCount,
  onEdit,
  onDelete,
}: {
  project: ProjectsBaseSchema
  productCount: number
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <li className="flex items-center gap-3 border-b border-border py-3 last:border-b-0">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-medium text-foreground">{project.title}</span>
          {productCount === 0 ? (
            <Badge className="border-border bg-background text-foreground">Empty</Badge>
          ) : (
            <Badge className="border-transparent bg-muted text-muted-foreground">
              {productCount} {productCount === 1 ? 'product' : 'products'}
            </Badge>
          )}
        </div>
        <span className="text-sm text-muted-foreground">{dateFormat.format(new Date(project.date))}</span>
      </div>

      <div className="flex shrink-0 gap-2">
        <Button type="button" size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
        <Button type="button" size="sm" variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </li>
  )
}

/** Projects list with create/edit/delete entry points, following `ProductsPanel`. */
export function ProjectsPanel() {
  const { data: projects, isLoading, isError, error } = useProjects()
  const { data: products } = useProducts()
  const [projectDialog, setProjectDialog] = useState<ProjectDialogState | null>(null)
  const [deletingProject, setDeletingProject] = useState<ProjectsBaseSchema | null>(null)

  const productCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const product of products ?? []) {
      if (!product.project_id) continue
      counts.set(product.project_id, (counts.get(product.project_id) ?? 0) + 1)
    }
    return counts
  }, [products])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Assigning products to a project still happens from the product form.
        </p>
        <Button type="button" onClick={() => setProjectDialog({ mode: 'create' })}>
          <PlusIcon data-icon="inline-start" />
          Add project
        </Button>
      </div>

      {isLoading ? (
        <ul className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <li key={index} className="flex items-center gap-3">
              <Skeleton className="h-4 flex-1" />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-8 text-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : 'Could not load projects.'}
        </p>
      ) : !projects || projects.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No projects yet — add one, or create one straight from the product form.
        </p>
      ) : (
        <ul>
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              productCount={productCounts.get(project.id) ?? 0}
              onEdit={() => setProjectDialog({ mode: 'edit', project })}
              onDelete={() => setDeletingProject(project)}
            />
          ))}
        </ul>
      )}

      {projectDialog ? (
        <ProjectFormDialog state={projectDialog} onClose={() => setProjectDialog(null)} />
      ) : null}
      <DeleteProjectDialog project={deletingProject} onOpenChange={(open) => !open && setDeletingProject(null)} />
    </div>
  )
}
