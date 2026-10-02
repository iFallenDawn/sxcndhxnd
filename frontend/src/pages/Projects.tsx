import { useMemo } from 'react'
import { PageMeta } from '@/components/seo/PageMeta'
import { ProjectCard, ProjectCardSkeleton } from '@/components/projects/ProjectCard'
import { useProjects } from '@/hooks/use-projects'
import { useProducts } from '@/hooks/use-products'
import { ApiError } from '@/lib/api-error'

const SKELETON_COUNT = 6

/**
 * `/projects` — every past promo/showcase, newest first (issue #12).
 *
 * Projects don't carry their own photo, only their products do, so the
 * representative image per card is computed here from the shared product
 * list (already fetched/cached elsewhere, e.g. the store) instead of an
 * extra request per project.
 */
export function Projects() {
  const { data: projects, isLoading: projectsLoading, isError, error } = useProjects()
  const { data: products, isLoading: productsLoading } = useProducts()
  const isLoading = projectsLoading || productsLoading

  const representativeImages = useMemo(() => {
    // Newest product first, matching the backend's choice for the
    // server-rendered link preview (`GET /projects/{id}/products` orders by
    // `created_at desc`) — `GET /products/` itself is unordered.
    const sorted = [...(products ?? [])].sort((a, b) => b.created_at.localeCompare(a.created_at))
    const images = new Map<string, string>()
    for (const product of sorted) {
      if (!product.project_id || images.has(product.project_id)) continue
      const [firstImage] = product.image_urls
      if (firstImage) images.set(product.project_id, firstImage)
    }
    return images
  }, [products])

  const sortedProjects = useMemo(
    () => [...(projects ?? [])].sort((a, b) => b.date.localeCompare(a.date)),
    [projects],
  )

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-16">
      <PageMeta
        title="Projects"
        description="Every drop and showcase sxcndhxnd has put out, archived here."
      />

      <div className="flex flex-col gap-2">
        <p className="eyebrow text-muted-foreground">Projects</p>
        <h1 className="heading-display text-3xl sm:text-4xl">Drops &amp; showcases</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Everything we've put out, start to finish.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-10 text-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : 'Something went wrong loading projects.'}
        </div>
      ) : sortedProjects.length === 0 ? (
        <div className="rounded-md border border-dashed border-border px-4 py-16 text-center text-sm text-muted-foreground">
          Nothing posted yet — check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              image={representativeImages.get(project.id) ?? null}
            />
          ))}
        </div>
      )}
    </div>
  )
}
