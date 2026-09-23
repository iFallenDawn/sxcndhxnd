import { Outlet } from 'react-router'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollRestoration } from '@/components/layout/ScrollRestoration'
import { HeroProvider, useHasHero } from '@/lib/hero-context'
import { cn } from '@/lib/utils'

// The navbar is fixed, so ordinarily content needs top padding to clear it.
// A hero page is the one exception: its hero art is meant to run full-bleed
// behind the transparent nav (see `useHasHero`/`RouteHasHero`), so it opts
// out of that padding instead of leaving a visible gap above the hero.
function MainContent() {
  const hasHero = useHasHero()

  return (
    <main className={cn('flex flex-1 flex-col', !hasHero && 'pt-14')}>
      <Outlet />
    </main>
  )
}

export function RootLayout() {
  return (
    <HeroProvider>
      <div className="flex min-h-svh flex-col bg-background text-foreground">
        <ScrollRestoration />
        <Navbar />
        <MainContent />
        <Footer />
      </div>
    </HeroProvider>
  )
}
