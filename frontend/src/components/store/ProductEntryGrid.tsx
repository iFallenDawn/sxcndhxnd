import type { ReactNode } from 'react'
import { ProductCard } from '@/components/store/ProductCard'
import type { DisplayEntry } from '@/lib/store-grouping'

const GRID_CLASSNAME = 'grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4'

/**
 * Renders a list of `DisplayEntry` — standalone products interleaved with
 * `drop_title` groups. Consecutive standalone products are batched into one
 * shared grid so they flow together normally; a drop group instead renders
 * as its own labeled sub-grid so the pieces from one drop stay visually
 * together, while both still take part in the overall available-first
 * ordering produced by `groupForDisplay`.
 */
export function ProductEntryGrid({ entries }: { entries: DisplayEntry[] }) {
  const blocks: { key: string; content: ReactNode }[] = []
  let pendingSingles: DisplayEntry[] = []

  const flushSingles = () => {
    if (pendingSingles.length === 0) return
    blocks.push({
      key: `singles-${blocks.length}`,
      content: (
        <div className={GRID_CLASSNAME}>
          {pendingSingles.map((entry) =>
            entry.kind === 'single' ? <ProductCard key={entry.product.id} product={entry.product} /> : null,
          )}
        </div>
      ),
    })
    pendingSingles = []
  }

  for (const entry of entries) {
    if (entry.kind === 'drop') {
      flushSingles()
      blocks.push({
        key: `drop-${entry.title}`,
        content: (
          <div className="flex flex-col gap-3">
            <p className="heading-display text-xs text-muted-foreground">Drop — {entry.title}</p>
            <div className={GRID_CLASSNAME}>
              {entry.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ),
      })
    } else {
      pendingSingles.push(entry)
    }
  }
  flushSingles()

  return (
    <div className="flex flex-col gap-8">
      {blocks.map((block) => (
        <div key={block.key}>{block.content}</div>
      ))}
    </div>
  )
}
