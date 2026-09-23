import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface FilterPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean
}

/**
 * Filter toggle in the `rounded-full` pill register (see `Badge` /
 * `/styleguide`'s "Radius register" section) — deliberately distinct from
 * `Button`'s `rounded-none` CTA register. Used for the category/status
 * filter controls, never for primary actions.
 */
export function FilterPill({ active, className, ...props }: FilterPillProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      data-active={active}
      className={cn(
        'inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        active
          ? 'border-transparent bg-primary text-primary-foreground'
          : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
        className,
      )}
      {...props}
    />
  )
}
