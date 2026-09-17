import { useRef } from 'react'
import { Link } from 'react-router'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ImagePlaceholder } from './ImagePlaceholder'
import { Reveal } from './reveal'

/**
 * Full-screen hero, parallaxed over a banner image (v1: `hero.tsx`). The
 * banner itself is a placeholder (see `ImagePlaceholder`) — client suggested
 * drop photography or a looping video here; whichever lands first should
 * replace the `ImagePlaceholder` below one-for-one, keeping the absolute
 * positioning and the `motion.div` it's wrapped in for the parallax.
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
        <ImagePlaceholder
          label="Hero banner — full-bleed drop photography, or a short looping video"
          tone="dark"
          className="h-full w-full border-none"
        />
      </motion.div>

      {/* Scrim so the headline and the transparent navbar's light text stay
          legible over whatever ends up in the banner. */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/20" />

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
