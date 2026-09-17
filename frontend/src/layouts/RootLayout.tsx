import { Link, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/store', label: 'Store' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/projects', label: 'Projects' },
  { to: '/commissions/request', label: 'Commissions' },
  { to: '/contact', label: 'Contact' },
  { to: '/sign-in', label: 'Sign in' },
]

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="flex flex-wrap items-center gap-4 border-b border-border px-6 py-4">
        <span className="text-lg font-semibold">sxcndhxnd</span>
        <nav className="flex flex-wrap items-center gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm" className="ml-auto">
          <Link to="/register">Register</Link>
        </Button>
      </header>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
