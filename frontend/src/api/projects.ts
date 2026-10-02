import { apiFetch } from '@/lib/api-client'
import type {
  ProductsBaseSchema,
  ProjectsBaseSchema,
  ProjectsInsert,
  ProjectsUpdate,
} from '@/types/api'

/** `GET /projects/`. Public. */
export function getAllProjects() {
  return apiFetch<ProjectsBaseSchema[]>('/projects/', { authenticated: false })
}

/** `GET /projects/{id}`. Public. */
export function getProjectById(projectId: string) {
  return apiFetch<ProjectsBaseSchema>(`/projects/${projectId}`, { authenticated: false })
}

/** `GET /projects/{project_id}/products`. Public. 404 for an unknown project, `[]` for an empty one. */
export function getProjectProducts(projectId: string) {
  return apiFetch<ProductsBaseSchema[]>(`/projects/${projectId}/products`, { authenticated: false })
}

/** `POST /projects/`. Admin only. */
export function createProject(payload: ProjectsInsert) {
  return apiFetch<ProjectsBaseSchema>('/projects/', {
    method: 'POST',
    body: payload,
  })
}

/** `PATCH /projects/{id}`. Admin only. */
export function updateProject(projectId: string, payload: ProjectsUpdate) {
  return apiFetch<ProjectsBaseSchema>(`/projects/${projectId}`, {
    method: 'PATCH',
    body: payload,
  })
}

/** `DELETE /projects/{id}`. Admin only. */
export function deleteProject(projectId: string) {
  return apiFetch<ProjectsBaseSchema>(`/projects/${projectId}`, {
    method: 'DELETE',
  })
}
