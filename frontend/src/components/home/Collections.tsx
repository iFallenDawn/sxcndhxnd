import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal, RevealGroup, RevealItem } from './reveal'

interface Collection {
  name: string
  /** Category query param for `/store?category=…`, matching v1's linking. */
  category: string
  image: string
  imageWidth: number
  imageHeight: number
  alt: string
  /** Grid span, driving the asymmetrical layout (v1: `collections-section.tsx`). */
  spanClassName: string
}

// "Show don't tell" per the design notes — imagery carries each category, so
// there's deliberately no copy beyond the name itself. Tops runs 2x2 and fills
// the left block, Bottoms and Tote Bags stack down the right column, and
// Accessories runs full width beneath as a band — keeping v1's asymmetry
// without leaving an empty cell in the grid.
const COLLECTIONS: Collection[] = [
  {
    name: 'Tops',
    category: 'tops',
    image: '/img/collections/tops.jpg',
    imageWidth: 900,
    imageHeight: 1350,
    alt: 'Patchwork cardigan made from upcycled fabric',
    spanClassName: 'sm:col-span-2 sm:row-span-2',
  },
  {
    name: 'Bottoms',
    category: 'bottoms',
    image: '/img/collections/bottoms.jpg',
    imageWidth: 900,
    imageHeight: 1125,
    alt: 'Patched denim shorts made from upcycled denim',
    spanClassName: 'sm:col-span-1',
  },
  {
    name: 'Tote Bags',
    category: 'tote-bags',
    image: '/img/collections/tote-bags.jpg',
    imageWidth: 900,
    imageHeight: 1125,
    alt: 'Patchwork tote bag made from upcycled fabric scraps',
    spanClassName: 'sm:col-span-1',
  },
  {
    name: 'Accessories',
    category: 'accessories',
    image: '/img/collections/accessories.jpg',
    imageWidth: 900,
    imageHeight: 1125,
    alt: 'Tote bag upcycled from a rice bag',
    spanClassName: 'sm:col-span-3 sm:h-[340px]',
  },
]

function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <RevealItem className={cn('group relative overflow-hidden', collection.spanClassName)}>
      <Link to={`/store?category=${collection.category}`} className="block h-full">
        <div className="relative h-full min-h-[220px] w-full">
          <img
            src={collection.image}
            alt={collection.alt}
            width={collection.imageWidth}
            height={collection.imageHeight}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        <p className="eyebrow text-muted-foreground">Collections</p>
        <h2 className="heading-display text-4xl sm:text-5xl">Shop by category</h2>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:grid-rows-[repeat(2,minmax(0,1fr))_auto]">
        {COLLECTIONS.map((collection) => (
          <CollectionCard key={collection.name} collection={collection} />
        ))}
      </RevealGroup>
    </section>
  )
}
