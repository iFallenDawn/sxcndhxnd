import { PageMeta } from '@/components/seo/PageMeta'
import { RouteHasHero } from '@/lib/hero-context'
import { Hero } from '@/components/home/Hero'
import { Philosophy } from '@/components/home/Philosophy'
import { Collections } from '@/components/home/Collections'
import { CommissionCta } from '@/components/home/CommissionCta'
import { About } from '@/components/home/About'

/**
 * The real home page (issue #7), replacing the `Placeholder` that stood in
 * for it. `RouteHasHero` is mounted first and unconditionally — this is
 * currently the only route in the app with a hero, so it's the sole
 * consumer of `src/lib/hero-context.tsx`'s transparent-over-hero navbar
 * behavior.
 */
export function Home() {
  return (
    <>
      <RouteHasHero />
      <PageMeta
        title="Home"
        description="Custom and upcycled one-of-a-kind garments, made from secondhand materials."
      />
      <Hero />
      <Philosophy />
      <Collections />
      <CommissionCta />
      <About />
    </>
  )
}
