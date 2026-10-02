import { Link } from 'react-router'
import { ImagePlaceholder } from '@/components/home/ImagePlaceholder'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProjectsBaseSchema } from '@/types/api'

// `timeZone: 'UTC'` matters: `project.date` is stored as UTC midnight for a
// date-only pick (see `ProjectForm`), so formatting in the viewer's local
// zone would render it a day early for anyone west of UTC.
const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' })

interface ProjectCardProps {
  project: ProjectsBaseSchema
  /** First product photo for this project, computed by the listing page — projects don't carry their own image. */
  image: string | null
}

/** Projects listing card (issue #12). Mirrors `ProductCard`'s layout without the price/status badge. */
export function ProjectCard({ project, image }: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder label={project.title} className="h-full w-full border-none" />
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{project.title}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {dateFormat.format(new Date(project.date))}
        </span>
      </div>
    </Link>
  )
}

/** Loading placeholder matching `ProjectCard`'s layout. */
export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}
