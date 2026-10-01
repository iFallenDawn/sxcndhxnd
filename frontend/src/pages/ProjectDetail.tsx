import { Link, useParams } from 'react-router'
import { PageMeta } from '@/components/seo/PageMeta'
import { ProductCard, ProductCardSkeleton } from '@/components/store/ProductCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProject, useProjectProducts } from '@/hooks/use-projects'
import { ApiError } from '@/lib/api-error'
import type { ProjectsBaseSchema } from '@/types/api'

// `timeZone: 'UTC'` matters: `project.date` is stored as UTC midnight for a
// date the admin picked with no time component (see `ProjectForm`), so
// formatting in the viewer's local zone would render it a day early for
// anyone west of UTC.
const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' })

function ProjectDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-20 w-full max-w-prose" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

function ProjectNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <PageMeta title="Project not found" />
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="heading-display text-3xl sm:text-4xl">Project not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This project doesn't exist or has been taken down.
      </p>
      <Button asChild size="sm">
        <Link to="/projects">Back to projects</Link>
      </Button>
    </div>
  )
}

interface ProjectDetailViewProps {
  project: ProjectsBaseSchema
}

/**
 * `/projects/:id` — a project's products, newest first (issue #12).
 *
 * Video is explicitly deferred (`core/constants.py`'s `ALLOWED_CONTENT_TYPES`
 * is still images-only), so this only ever renders photo grids — no video
 * player to build or guard with `prefers-reduced-motion` yet.
 *
 * Link previews (OG/Twitter meta with a representative image) are handled
 * server-side in `backend/routers/meta_router.py`, which injects per-project
 * meta tags into the same built `index.html` before this component ever
 * mounts — crawlers never run this client-side `PageMeta`.
 */
function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const { data: products, isLoading, isError, error } = useProjectProducts(project.id)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16">
      <PageMeta title={project.title} description={project.description || undefined} />

      <div className="flex flex-col gap-3">
        <Link
          to="/projects"
          className="eyebrow w-fit text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to Projects
        </Link>
        <h1 className="heading-display text-3xl sm:text-4xl">{project.title}</h1>
        <p className="font-mono text-sm text-muted-foreground">
          {dateFormat.format(new Date(project.date))}
        </p>
        {project.description ? (
          <p className="max-w-prose text-sm whitespace-pre-line text-muted-foreground">
            {project.description}
          </p>
        ) : null}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-10 text-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : 'Something went wrong loading these pieces.'}
        </div>
      ) : !products || products.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Nothing posted under this project yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project, isLoading, isError, error } = useProject(projectId)

  if (isLoading) {
    return <ProjectDetailSkeleton />
  }

  if (isError) {
    if (error instanceof ApiError && error.isNotFound) {
      return <ProjectNotFound />
    }
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <PageMeta title="Something went wrong" />
        <p className="max-w-sm text-sm text-destructive">
          {error instanceof ApiError ? error.message : 'Something went wrong loading this project.'}
        </p>
        <Button asChild size="sm" variant="outline">
          <Link to="/projects">Back to projects</Link>
        </Button>
      </div>
    )
  }

  if (!project) {
    return <ProjectNotFound />
  }

  return <ProjectDetailView project={project} />
}
