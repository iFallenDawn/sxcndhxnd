import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useHasHero } from '@/lib/hero-context'
import { useAuthStore } from '@/stores/auth-store'
import { useIsAdmin } from '@/hooks/use-is-admin'

const PRIMARY_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/store', label: 'Store' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/projects', label: 'Projects' },
  { to: '/commissions/request', label: 'Commissions' },
  { to: '/contact', label: 'Contact' },
]

/** Scroll distance (px) past which the nav is considered "scrolled". */
const SCROLL_THRESHOLD = 8

function useIsScrolled() {
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > SCROLL_THRESHOLD)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return isScrolled
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {PRIMARY_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'text-sm transition-colors',
              isActive
                ? 'font-medium text-current'
                : 'text-current/70 hover:text-current',
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </>
  )
}

function AuthLinks({ onNavigate }: { onNavigate?: () => void }) {
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const { data: isAdmin } = useIsAdmin()
  const navigate = useNavigate()

  // Avoid a flash of the signed-out state while the persisted store is
  // still being read back from storage on first load.
  if (!hasHydrated) {
    return <div className="h-7 w-16" aria-hidden="true" />
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link
          to="/sign-in"
          onClick={onNavigate}
          className="text-sm text-current/70 hover:text-current"
        >
          Sign in
        </Link>
        <Button asChild size="sm" variant="outline" className="border-current bg-transparent text-current hover:bg-current/10 hover:text-current">
          <Link to="/register" onClick={onNavigate}>
            Register
          </Link>
        </Button>
      </div>
    )
  }

  const handleSignOut = async () => {
    onNavigate?.()
    await signOut()
    navigate('/')
  }

  return (
    <div className="flex items-center gap-3">
      {isAdmin ? (
        <NavLink
          to="/dashboard"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'text-sm transition-colors',
              isActive ? 'font-medium text-current' : 'text-current/70 hover:text-current',
            )
          }
        >
          Dashboard
        </NavLink>
      ) : null}
      <Link
        to="/account"
        onClick={onNavigate}
        className="text-sm text-current/70 hover:text-current"
      >
        {user?.email}
      </Link>
      <Button size="sm" variant="outline" className="border-current bg-transparent text-current hover:bg-current/10 hover:text-current" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  )
}

/**
 * Site-wide fixed navbar: transparent while over a hero, solid on scroll (or
 * on any route without a hero). Collapsed into a single client component —
 * v1 split this four ways purely to dodge Next's SSR hydration split, which
 * doesn't apply here.
 */
export function Navbar() {
  const hasHero = useHasHero()
  const isScrolled = useIsScrolled()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Solid whenever there's no hero to sit over, or once the page has
  // scrolled past it. Transparent only in the narrow "hero, unscrolled" case.
  const isSolid = !hasHero || isScrolled

  // Close the mobile menu on route change. Adjusted during render (rather
  // than in an effect) per https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes.
  const [priorPathname, setPriorPathname] = useState(location.pathname)
  if (location.pathname !== priorPathname) {
    setPriorPathname(location.pathname)
    setIsMenuOpen(false)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-200',
        isSolid
          ? 'border-b border-border bg-background text-foreground'
          : 'border-b border-transparent bg-transparent text-primary-foreground',
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Wordmark rather than the face mark, following v1: it inherits the
            nav's current color, so it stays legible over the hero without the
            figurative mark needing a backing or a colour flip. */}
        <Link to="/" className="flex items-center" aria-label="sxcndhxnd home">
          <span className="heading-display text-xl text-current sm:text-2xl">
            sxcndhxnd
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLinks />
        </nav>

        <div className="hidden md:flex">
          <AuthLinks />
        </div>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-current hover:text-current md:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 px-4">
              <NavLinks onNavigate={() => setIsMenuOpen(false)} />
            </nav>
            <div className="mt-auto border-t border-border px-4 py-4">
              <AuthLinks onNavigate={() => setIsMenuOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
