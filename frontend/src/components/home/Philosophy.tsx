import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { Reveal } from './reveal'

const MISSION_STATEMENT =
  'SXCNDHXND is a harmonious synergy between craft, work and artistry giving a second life to previously forgotten garments. We were taught to discard anything imperfect, but it is our imperfections that make us unique. Instead of hiding our blemishes, we should be proud of our wear and tear. Like us, our garments can tell a story.'

/**
 * Centered mission statement (v1: `philosophy-section.tsx`). Copy is used
 * verbatim per the client's brief — do not paraphrase.
 */
export function Philosophy() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-4 py-24 text-center sm:px-6 sm:py-32">
      <Reveal>
        <p className="heading-display text-xs text-muted-foreground">Our philosophy</p>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-xl leading-relaxed font-light text-foreground sm:text-2xl">
          {MISSION_STATEMENT}
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
        >
          See the work behind it
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  )
}
