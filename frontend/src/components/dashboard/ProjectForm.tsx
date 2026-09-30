import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FormField } from '@/components/auth/FormField'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { projectFormSchema, type ProjectFormValues } from '@/lib/project-validation'
import type { ProjectsBaseSchema, ProjectsInsert } from '@/types/api'

interface ProjectFormProps {
  project?: ProjectsBaseSchema
  onSubmit: (payload: ProjectsInsert) => Promise<void>
  onCancel: () => void
  submitLabel: string
}

/** Shared create/edit form for the projects panel — see `components/dashboard/ProductForm.tsx` for the sibling pattern. */
export function ProjectForm({ project, onSubmit, onCancel, submitLabel }: ProjectFormProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title ?? '',
      description: project?.description ?? '',
      // `date` is a full ISO datetime over the wire; the native date input only wants the date part.
      date: project?.date ? project.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    },
  })

  const submit = async (values: ProjectFormValues) => {
    setFormError(null)
    try {
      await onSubmit({
        title: values.title,
        description: values.description,
        date: `${values.date}T00:00:00.000Z`,
      })
    } catch {
      setFormError('Could not save this project. Check your connection and try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-5">
      <FormField
        label="Title"
        htmlFor="project-title"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="project-description" className="text-sm font-medium text-foreground">
          Description
        </label>
        <Textarea id="project-description" rows={4} {...register('description')} />
        {errors.description ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <FormField
        label="Date"
        htmlFor="project-date"
        type="date"
        error={errors.date?.message}
        {...register('date')}
      />

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
