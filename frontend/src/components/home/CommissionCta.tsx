import { Link } from 'react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { MessageCircle, Ruler, Scissors, PackageCheck, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Reveal, RevealGroup, RevealItem } from './reveal'

interface Step {
  icon: LucideIcon
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    icon: MessageCircle,
    title: 'Tell us the idea',
    description: 'Share the garment, the fit, the story you want it to carry.',
  },
  {
    icon: Ruler,
    title: 'We plan the piece',
    description: 'Materials get sourced secondhand and measurements confirmed.',
  },
  {
    icon: Scissors,
    title: 'It gets made',
    description: 'Cut, reworked, and finished by hand, one piece at a time.',
  },
  {
    icon: PackageCheck,
    title: 'It comes home to you',
    description: 'A garment that already has a past, and now has your name on it.',
  },
]

// Purely decorative, floating in the background of the section — hidden from
// assistive tech and skipped entirely under reduced motion.
const FLOATING_ICONS: { icon: LucideIcon; className: string; duration: number }[] = [
  { icon: Scissors, className: 'top-6 left-[8%] size-8 -rotate-12', duration: 7 },
  { icon: Ruler, className: 'top-1/3 right-[10%] size-9 rotate-6', duration: 8.5 },
  { icon: PackageCheck, className: 'bottom-10 left-[18%] size-7 rotate-3', duration: 6.5 },
]

function FloatingIcons() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden opacity-[0.08] sm:block" aria-hidden="true">
      {FLOATING_ICONS.map(({ icon: Icon, className, duration }, index) => (
        <motion.div
          key={index}
          className={cn('absolute', className)}
          animate={{ y: [0, -16, 0] }}
          transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon className="size-full" />
        </motion.div>
      ))}
    </div>
  )
}

/** The 4-step commission process (v1: `commission-cta.tsx`). */
export function CommissionCta() {
  return (
    <section className="relative overflow-hidden bg-secondary py-24 sm:py-32">
      <FloatingIcons />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <p className="heading-display text-xs text-muted-foreground">Commissions</p>
          <h2 className="heading-display text-3xl sm:text-4xl">
            A one-of-one garment, made for you
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            No two commissions leave here the same. Here's how one comes together.
          </p>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <RevealItem key={step.title} className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <step.icon className="size-5 text-foreground" aria-hidden="true" />
              </div>
              <h3 className="text-base font-medium text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="flex justify-center">
          <Button asChild size="lg">
            <Link to="/commissions/request">Request a commission</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
