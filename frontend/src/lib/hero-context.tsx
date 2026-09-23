import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface HeroContextValue {
  hasHero: boolean
  setHasHero: (value: boolean) => void
}

/**
 * Shared "does the current route have a hero" flag, consumed by `Navbar` to
 * decide whether it should start transparent (over a hero) or solid
 * (everywhere else). It defaults to `false`; a route opts in by mounting
 * `<RouteHasHero />` (today only the home page, `pages/Home.tsx`). While
 * transparent, every navbar control carries its own opaque chip, since the
 * hero photo behind it can be any colour.
 */
const HeroContext = createContext<HeroContextValue | null>(null)

export function HeroProvider({ children }: { children: ReactNode }) {
  const [hasHero, setHasHero] = useState(false)
  const value = useMemo(() => ({ hasHero, setHasHero }), [hasHero])
  return <HeroContext.Provider value={value}>{children}</HeroContext.Provider>
}

function useHeroContext() {
  const ctx = useContext(HeroContext)
  if (!ctx) {
    throw new Error('useHeroContext must be used within a HeroProvider')
  }
  return ctx
}

/** Read-only: whether the currently rendered route declares a hero. */
export function useHasHero() {
  return useHeroContext().hasHero
}

/**
 * Mount this once, near the top of any route's page component, to declare
 * "this page renders a full-bleed hero at the top." It renders nothing
 * itself — the hero markup is a separate component (e.g.
 * `components/home/Hero.tsx`) — it only
 * flips the shared flag for as long as it stays mounted, so the navbar knows
 * to render transparent-over-hero instead of solid-from-first-paint. The
 * flag resets automatically on unmount (i.e. on route change), so nothing
 * needs to reset it manually.
 *
 * Usage (as in `pages/Home.tsx`):
 *   function Home() {
 *     return (
 *       <>
 *         <RouteHasHero />
 *         <Hero />
 *         ...
 *       </>
 *     )
 *   }
 */
export function RouteHasHero() {
  const { setHasHero } = useHeroContext()

  useEffect(() => {
    setHasHero(true)
    return () => setHasHero(false)
  }, [setHasHero])

  return null
}
