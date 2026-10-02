import { toast } from 'sonner'
import { ConfirmDeleteDialog } from '@/components/dashboard/ConfirmDeleteDialog'
import { useDeleteProject } from '@/hooks/use-projects'
import type { ProjectsBaseSchema } from '@/types/api'

interface DeleteProjectDialogProps {
  project: ProjectsBaseSchema | null
  onOpenChange: (open: boolean) => void
}

/**
 * `products.project_id` is `ON DELETE SET NULL`, so deleting a project
 * doesn't touch its products — it only ungroups them back to standalone
 * pieces. That's a meaningfully different consequence than the product
 * delete dialog, so it gets its own copy rather than reusing that wording.
 */
export function DeleteProjectDialog({ project, onOpenChange }: DeleteProjectDialogProps) {
  const deleteProject = useDeleteProject()

  return (
    <ConfirmDeleteDialog
      open={project !== null}
      onOpenChange={onOpenChange}
      title="Delete this project?"
      description={
        project ? (
          <>
            This deletes <span className="font-medium text-foreground">"{project.title}"</span>. Its
            products aren't deleted — they go back to being standalone pieces in the store.
          </>
        ) : null
      }
      errorMessage="Could not delete this project."
      onConfirm={async () => {
        if (!project) return
        await deleteProject.mutateAsync(project.id)
        toast.success(`"${project.title}" was deleted.`)
      }}
    />
  )
}
