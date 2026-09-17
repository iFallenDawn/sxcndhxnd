import { useRef } from 'react'
import { Link } from 'react-router'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
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

      {/* Scrim so the headline and the transparent navbar's light text stay
          legible over the bright studio backdrop. v1 used roughly 0.2/0.4/0.6
          top-to-bottom; measured against this photo (light grey seamless
          backdrop) that left the navbar/logo area under 3:1 contrast, so the
          top stop is raised to 0.45 here — verified by pixel-sampling the
          rendered page (see report). */}
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
            <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/85">
              <Link to="/store">Shop the store</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-background bg-transparent text-background hover:bg-background/10 hover:text-background"
            >
              <Link to="/commissions/request">Start a commission</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
