import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ProjectForm } from '@/components/dashboard/ProjectForm'
import { useCreateProject, useUpdateProject } from '@/hooks/use-projects'
import type { ProjectsBaseSchema, ProjectsInsert } from '@/types/api'

export type ProjectDialogState = { mode: 'create' } | { mode: 'edit'; project: ProjectsBaseSchema }

interface ProjectFormDialogProps {
  state: ProjectDialogState
  onClose: () => void
}

/** Dialog wrapping `ProjectForm` for both create and edit. Mount it only while open. */
export function ProjectFormDialog({ state, onClose }: ProjectFormDialogProps) {
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const project = state.mode === 'edit' ? state.project : undefined

  const handleSubmit = async (payload: ProjectsInsert) => {
    if (project) {
      await updateProject.mutateAsync({ id: project.id, payload })
      toast.success('Project updated.')
    } else {
      await createProject.mutateAsync(payload)
      toast.success('Project added.')
    }
    onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit project' : 'Add project'}</DialogTitle>
          <DialogDescription>
            {project
              ? 'Changes apply to the store and product form immediately.'
              : 'You can assign products to it from the product form once it’s saved.'}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm
          project={project}
          submitLabel={project ? 'Save changes' : 'Add project'}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
