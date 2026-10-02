import { useRef } from 'react'
import { Link } from 'react-router'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { COMMISSIONS_ENABLED } from '@/lib/constants'
import { Reveal } from './reveal'

/**
 * Full-screen hero, parallaxed over a banner image (v1: `hero.tsx`). The
 * banner is the bright studio group shot from the campaign shoot
 * (`/img/hero-group.jpg`, 2400px, with a 1200px variant for small
 * viewports) — a full-bleed background behind the dark scrim below, per
 * v1's approach.
 *
 * `useScroll`'s `target` is this section, so the parallax only tracks
 * movement while the hero itself is scrolling through the viewport (v1's
 * behavior), not the whole page. Parallax is skipped outright under
 * `prefers-reduced-motion`.
 */
export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ['0%', '0%'] : ['0%', '20%'])

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh min-h-[560px] w-full items-end overflow-hidden bg-foreground"
    >
      <motion.div style={{ y }} className="absolute inset-0 -top-[10%] h-[120%] w-full">
        <img
          src="/img/hero-group.jpg"
          srcSet="/img/hero-group-1200.jpg 1200w, /img/hero-group.jpg 2400w"
          sizes="100vw"
          width={2400}
          height={1600}
          alt="Four models in a studio wearing custom and upcycled sxcndhxnd garments"
          className="h-full w-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
      </motion.div>

      {/* Scrim for the headline and body copy over the bright studio
          backdrop. v1 used roughly 0.2/0.4/0.6 top-to-bottom; the top stop is
          raised to 0.45 here for this photo's light grey seamless. The
          controls (both CTAs below, and the navbar while it's transparent)
          don't rely on it: each carries its own opaque chip, per the overlay
          rule in CLAUDE.md. */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/50 to-foreground/45" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16 sm:px-6 sm:pb-24">
        <Reveal>
          <h1 className="heading-display max-w-3xl text-4xl text-background sm:text-6xl md:text-7xl">
            Change the way
            <br />
            you fashion
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="max-w-md text-base text-background/80">
            Custom and upcycled, one of one. Every piece here already lived a
            life — we just gave it another.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex flex-wrap gap-3">
            {/* Tone-differentiated chips (light = primary, dark = secondary),
                hovers included — never outline/ghost over the photo. Each
                has a contrasting 1px edge so its shape survives a backdrop
                of its own tone (the fill is what carries the text contrast,
                not the edge). Deliberately not fully opaque (85%) per a
                design call — CLAUDE.md's opaque-surface rule exists because
                anything more transparent than this has previously gone
                illegible against a light patch of a hero photo; don't push
                these lower without checking against the actual photo in use. */}
            <Button
              asChild
              size="lg"
              className="rounded-full border-foreground bg-background/85 text-foreground hover:bg-muted"
            >
              <Link to="/store">Shop the store</Link>
            </Button>
            {/* Commissions paused (see COMMISSIONS_ENABLED in
                lib/constants.ts). The remaining "Shop the store" button
                keeps its own opaque light chip, so it stays legible on the
                photo on its own; the wrapper is still `flex-wrap` so it
                can't overflow at phone width. */}
            {COMMISSIONS_ENABLED ? (
              <Button
                asChild
                size="lg"
                className="border-background bg-foreground text-background hover:bg-primary hover:text-background"
              >
                <Link to="/commissions/request">Start a commission</Link>
              </Button>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
