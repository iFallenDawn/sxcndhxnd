import { Link, useRouteError } from 'react-router'
import { Button } from '@/components/ui/button'
import { PageMeta } from '@/components/seo/PageMeta'

/**
 * Root error boundary, wired via `errorElement` on the router's top-level
 * route. `createBrowserRouter`/`RouterProvider` catch render, loader, and
 * action errors anywhere in the route tree and render this in place of the
 * whole tree — including the navbar/footer, so it deliberately re-renders
 * its own minimal chrome rather than assuming `RootLayout` is safe to reuse.
 */
export function RouteError() {
  const error = useRouteError()

  if (import.meta.env.DEV) {
    console.error(error)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-8 text-center text-foreground">
      <PageMeta title="Something went wrong" />
      <h1 className="heading-display text-2xl">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        An unexpected error occurred. Try heading back home.
      </p>
      <Button asChild size="sm">
        <Link to="/">Back home</Link>
      </Button>
    </div>
  )
}
