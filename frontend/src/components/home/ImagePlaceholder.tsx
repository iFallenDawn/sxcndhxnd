import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImagePlaceholderProps {
  /** Short caption describing what real asset belongs here. */
  label: string
  className?: string
  /**
   * `dark` sits under light/white text (e.g. the hero, over the transparent
   * navbar) — `light` is the default, for placeholders that sit on the
   * page's normal white surface.
   */
  tone?: 'light' | 'dark'
}

/**
 * Typographic/geometric stand-in for photography that doesn't exist yet (see
 * issue #7: no real drop photography, nothing hotlinked, nothing invented).
 * Built entirely from existing theme tokens — a diagonal hairline pattern
 * plus a labeled caption — so it reads unmistakably as "image goes here"
 * rather than as a finished design, and can be swapped for a real
 * `<img>`/`<video>` later without touching any surrounding layout.
 */
export function ImagePlaceholder({ label, className, tone = 'light' }: ImagePlaceholderProps) {
  const isDark = tone === 'dark'
  const lineColor = isDark ? 'var(--background)' : 'var(--border)'

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden border border-dashed',
        isDark ? 'border-background/30 bg-foreground' : 'border-border bg-muted',
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, ${lineColor} 0px, ${lineColor} 1px, transparent 1px, transparent 12px)`,
        }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <ImageIcon
          className={cn('size-6', isDark ? 'text-background/70' : 'text-muted-foreground')}
          aria-hidden="true"
        />
        <span
          className={cn(
            'font-mono text-xs tracking-wide uppercase',
            isDark ? 'text-background/70' : 'text-muted-foreground',
          )}
        >
          {label}
        </span>
      </div>
    </div>
  )
}
