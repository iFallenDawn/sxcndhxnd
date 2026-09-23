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

/**
 * Opaque surfaces for controls that sit directly on the hero photo while the
 * nav is transparent (CLAUDE.md: anything overlaying an image carries its own
 * opaque surface). Tone-differentiated, never transparent — the photo behind
 * can be any colour, so nothing here may lean on it or on the hero's scrim.
 * Hovers stay opaque too (a different solid token, not an alpha).
 */
const OVER_HERO_CHIP = {
  dark: 'bg-foreground text-background',
  light: 'bg-background text-foreground hover:bg-muted hover:text-foreground',
  muted: 'bg-muted-foreground text-background hover:bg-foreground hover:text-background',
}

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

/**
 * Layout-specific classes for `AuthLinks`, so the two layouts differ in one
 * place rather than via per-element conditionals.
 *
 * - `row`: the desktop navbar's single horizontal row.
 * - `stack`: the mobile menu sheet's footer — one control per line, full
 *   width, each at least 44px tall, so a long email can't push Sign out off
 *   a narrow screen.
 *
 * The email truncates in both layouts.
 */
const AUTH_LAYOUT = {
  row: {
    container: 'flex min-w-0 items-center gap-3',
    link: 'text-sm',
    email: 'min-w-0 max-w-48 truncate text-sm',
    button: '',
  },
  stack: {
    container: 'flex w-full flex-col gap-2',
    link: 'flex min-h-11 w-full items-center text-sm',
    email: 'block min-h-11 w-full min-w-0 truncate py-3 text-sm leading-5',
    button: 'h-11 w-full text-sm',
  },
} as const

type AuthLayout = keyof typeof AUTH_LAYOUT

function AuthLinks({
  onNavigate,
  overHero = false,
  layout = 'row',
}: {
  onNavigate?: () => void
  /** Sitting on the hero photo: render the buttons as opaque chips. */
  overHero?: boolean
  layout?: AuthLayout
}) {
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const { data: isAdmin } = useIsAdmin()
  const navigate = useNavigate()
  const styles = AUTH_LAYOUT[layout]

  // Avoid a flash of the signed-out state while the persisted store is
  // still being read back from storage on first load.
  if (!hasHydrated) {
    return <div className="h-7 w-16" aria-hidden="true" />
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <Link
          to="/sign-in"
          onClick={onNavigate}
          className={cn(styles.link, 'text-current/70 hover:text-current')}
        >
          Sign in
        </Link>
        <Button
          asChild
          size="sm"
          variant="outline"
          className={cn(
            styles.button,
            overHero
              ? cn('border-transparent', OVER_HERO_CHIP.light)
              : 'border-current bg-transparent text-current hover:bg-current/10 hover:text-current',
          )}
        >
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
    <div className={styles.container}>
      {isAdmin ? (
        <NavLink
          to="/dashboard"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              styles.link,
              'transition-colors',
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
        title={user?.email}
        className={cn(styles.email, 'text-current/70 hover:text-current')}
      >
        {user?.email}
      </Link>
      <Button
        size="sm"
        variant="outline"
        className={cn(
          styles.button,
          overHero
            ? cn('border-transparent', OVER_HERO_CHIP.muted)
            : 'border-current bg-transparent text-current hover:bg-current/10 hover:text-current',
        )}
        onClick={handleSignOut}
      >
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
  const overHero = !isSolid

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
        {/* Wordmark rather than the face mark, following v1. Over the hero
            it sits on a dark chip (the photo behind it can be any colour);
            in the solid nav it's plain text in the nav's current colour. */}
        <Link
          to="/"
          className={cn('flex items-center', overHero && cn(OVER_HERO_CHIP.dark, 'px-2 py-0.5'))}
          aria-label="sxcndhxnd home"
        >
          <span className="heading-display text-xl text-current sm:text-2xl">
            sxcndhxnd
          </span>
        </Link>

        {/* Over the hero, the links and the auth cluster each get a dark
            chip; the Register/Sign out buttons inside are light/muted chips
            so they still read as buttons against it. */}
        <nav
          className={cn(
            'hidden items-center gap-6 md:flex',
            overHero && cn(OVER_HERO_CHIP.dark, 'px-4 py-1.5'),
          )}
        >
          <NavLinks />
        </nav>

        <div className={cn('hidden md:flex', overHero && cn(OVER_HERO_CHIP.dark, 'py-1 pr-1 pl-3'))}>
          <AuthLinks overHero={overHero} />
        </div>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant={overHero ? 'default' : 'ghost'}
              size="icon"
              className={cn(
                'md:hidden',
                overHero
                  ? 'bg-foreground text-background hover:bg-primary hover:text-background'
                  : 'text-current hover:text-current',
              )}
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
              <AuthLinks layout="stack" onNavigate={() => setIsMenuOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
