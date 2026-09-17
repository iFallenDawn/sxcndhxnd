import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold text-foreground">404</h1>
      <p className="text-sm text-muted-foreground">This page does not exist.</p>
      <Button asChild size="sm">
        <Link to="/">Back home</Link>
      </Button>
    </div>
  )
}
