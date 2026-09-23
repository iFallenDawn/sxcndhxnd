import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { PageMeta } from '@/components/seo/PageMeta'

export function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <PageMeta title="Page not found" />
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="heading-display text-3xl sm:text-4xl">Not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Button asChild size="sm">
        <Link to="/">Back home</Link>
      </Button>
    </div>
  )
}
