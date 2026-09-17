import { ImagePlaceholder } from './ImagePlaceholder'
import { Reveal } from './reveal'

/**
 * Short "about" section (v1 had one; the client asked to keep it). Kept
 * brief and personal rather than a full bio page — a portrait placeholder
 * paired with a few sentences in the brand's "confidently introspective"
 * voice.
 */
export function About() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-24 sm:flex-row sm:px-6 sm:py-32">
      <Reveal className="w-full sm:w-2/5">
        <ImagePlaceholder label="Portrait — Nico at work" className="aspect-[4/5] w-full" />
      </Reveal>

      <Reveal delay={0.1} className="flex w-full flex-col gap-4 sm:w-3/5">
        <p className="heading-display text-xs text-muted-foreground">Behind sxcndhxnd</p>
        <h2 className="heading-display text-2xl sm:text-3xl">Nico Monte</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          I didn't set out to build a brand — I set out to stop watching
          good garments get thrown away. Every piece that comes through
          here already has a history. My job is just to listen to it, then
          give it a reason to keep being worn.
        </p>
      </Reveal>
    </section>
  )
}
