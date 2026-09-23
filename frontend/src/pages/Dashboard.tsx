import { useState } from 'react'
import { PageMeta } from '@/components/seo/PageMeta'
import { ProductsPanel } from '@/components/dashboard/ProductsPanel'
import { GalleryPanel } from '@/components/dashboard/GalleryPanel'
import { cn } from '@/lib/utils'

type DashboardTab = 'products' | 'gallery'

const TABS: { id: DashboardTab; label: string; description: string }[] = [
  { id: 'products', label: 'Products', description: 'Add, edit, and archive what’s in the store.' },
  { id: 'gallery', label: 'Gallery', description: 'Dump commission photos here — bulk upload works.' },
]

/**
 * `/dashboard` — behind `RequireAdmin` in `router.tsx`. Nico's own words on
 * what he needs: "the technical stuff will go over my head... I'm more of a
 * visual guy." So this stays two flat panels (no nested nav, no jargon) with
 * big obvious buttons and plain-language confirmations for anything
 * destructive.
 */
export function Dashboard() {
  const [tab, setTab] = useState<DashboardTab>('products')

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
      <PageMeta title="Dashboard" description="Manage products and the gallery." />

      <div className="flex flex-col gap-1">
        <p className="eyebrow text-muted-foreground">Dashboard</p>
        <h1 className="heading-display text-3xl sm:text-4xl">Run the store</h1>
      </div>

      <div className="flex gap-2 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              '-mb-px border-b-2 px-1 py-2 text-sm font-medium transition-colors',
              tab === t.id
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{TABS.find((t) => t.id === tab)?.description}</p>

      {tab === 'products' ? <ProductsPanel /> : <GalleryPanel />}
    </div>
  )
}
