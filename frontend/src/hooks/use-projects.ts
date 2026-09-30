import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectProducts,
  updateProject,
} from '@/api/projects'
import { queryKeys } from '@/lib/query-keys'
import type { ProjectsBaseSchema, ProjectsInsert, ProjectsUpdate } from '@/types/api'

/** `GET /projects/`. Public. */
export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.list(),
    queryFn: getAllProjects,
  })
}

/** `GET /projects/{project_id}/products`. Public. Its own query key, since a project's products are a different view than the full store list. */
export function useProjectProducts(projectId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.projects.products(projectId ?? ''),
    queryFn: () => getProjectProducts(projectId as string),
    enabled: projectId !== undefined,
  })
}

/**
 * `POST /projects/`. Admin only.
 *
 * Appends the new project straight into the `projects.list()` cache rather
 * than only invalidating it: `ProductForm`'s inline "New project" flow picks
 * the new project immediately after creating it, and the resulting refetch
 * is async, so relying on invalidation alone left a window where the Select
 * had no matching option yet and looked like the pick hadn't taken.
 */
export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProjectsInsert) => createProject(payload),
    onSuccess: (project) => {
      queryClient.setQueryData(
        queryKeys.projects.list(),
        (list: ProjectsBaseSchema[] | undefined) => (list ? [...list, project] : [project]),
      )
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.list() })
    },
  })
}

/**
 * `PATCH /projects/{id}`. Admin only.
 *
 * Also invalidates the products list/detail caches: this is how a product
 * moves between projects (see `ProductsUpdate.project_id`), so anything that
 * reads a product's `project_id` needs a refetch too.
 */
export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProjectsUpdate }) => updateProject(id, payload),
    onSuccess: (project) => {
      queryClient.setQueryData(queryKeys.projects.detail(project.id), project)
    },
    onSettled: (_project, _error, { id }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.list() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.products(id) })
    },
  })
}

/**
 * `DELETE /projects/{id}`. Admin only.
 *
 * `products.project_id` is `ON DELETE SET NULL`, so deleting a project
 * quietly changes its products too — invalidate the products cache as well
 * as the projects one so the store/dashboard reflect that without a manual
 * refresh.
 */
export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.list() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.list() })
    },
  })
}

/** Convenience map for grouping products by project title — see `lib/store-grouping.ts`. */
export function projectTitleMap(projects: ProjectsBaseSchema[] | undefined): Map<string, string> {
  return new Map((projects ?? []).map((project) => [project.id, project.title]))
}
