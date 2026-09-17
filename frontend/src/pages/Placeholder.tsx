import { PageMeta } from '@/components/seo/PageMeta'

interface PlaceholderProps {
  name: string
}

/**
 * Generic placeholder page. Every route in the site map renders this with
 * its own name so navigation is visibly testable before real UI lands.
 */
export function Placeholder({ name }: PlaceholderProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
      <PageMeta title={name} />
      <h1 className="text-2xl font-semibold text-foreground">{name}</h1>
      <p className="text-sm text-muted-foreground">
        Placeholder route — {name}
      </p>
    </div>
  )
}
