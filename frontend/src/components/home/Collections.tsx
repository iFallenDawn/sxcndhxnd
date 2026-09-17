import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ImagePlaceholder } from './ImagePlaceholder'
import { Reveal, RevealGroup, RevealItem } from './reveal'

interface Collection {
  name: string
  accentClassName: string
  /** Grid span, driving the asymmetrical layout (v1: `collections-section.tsx`). */
  spanClassName: string
}

// "Show don't tell" per the design notes — imagery carries each category, so
// there's deliberately no copy beyond the name itself. One card (Tops) runs
// larger to keep the grid asymmetrical rather than a uniform 2x2, matching
// v1's layout.
const COLLECTIONS: Collection[] = [
  { name: 'Tops', accentClassName: 'bg-brand-clay', spanClassName: 'sm:col-span-2 sm:row-span-2' },
  { name: 'Bottoms', accentClassName: 'bg-brand-moss', spanClassName: 'sm:col-span-1' },
  { name: 'Tote Bags', accentClassName: 'bg-brand-sand', spanClassName: 'sm:col-span-1' },
  { name: 'Accessories', accentClassName: 'bg-foreground', spanClassName: 'sm:col-span-2' },
]

function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <RevealItem className={cn('group relative overflow-hidden', collection.spanClassName)}>
      <Link to="/store" className="block h-full">
        <div className="relative h-full min-h-[220px] w-full">
          <ImagePlaceholder
            label={`${collection.name} — collection imagery`}
            className="h-full w-full border-none transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className={cn('absolute top-0 left-0 h-1 w-10', collection.accentClassName)}
            aria-hidden="true"
          />
          {/* Hover reveal, per v1: name + affordance stay dim until interaction. */}
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/70 via-foreground/0 to-foreground/0 p-5 opacity-90 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex w-full items-center justify-between">
              <span className="heading-display text-lg text-background sm:text-xl">
                {collection.name}
              </span>
              <ArrowUpRight
                className="size-5 text-background opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Link>
    </RevealItem>
  )
}

/** Asymmetrical collections teaser (v1: `collections-section.tsx`). */
export function Collections() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-24 sm:px-6 sm:py-32">
      <Reveal className="flex flex-col gap-2 text-center">
        <p className="heading-display text-xs text-muted-foreground">Collections</p>
        <h2 className="heading-display text-3xl sm:text-4xl">Shop by category</h2>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:grid-rows-2">
        {COLLECTIONS.map((collection) => (
          <CollectionCard key={collection.name} collection={collection} />
        ))}
      </RevealGroup>
    </section>
  )
}
