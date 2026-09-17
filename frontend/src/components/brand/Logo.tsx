import { cn } from '@/lib/utils'

/**
 * PLACEHOLDER BRAND MARK — not the real sxcndhxnd logo.
 *
 * The real mark lives in the client's Google Drive and was not available
 * when this design system was built. This is a deliberately plain
 * typographic stand-in (a monogram in a bordered square, using only theme
 * tokens) so every place the logo is used renders *something* legible
 * rather than nothing, without inventing a lookalike of the real brand.
 *
 * To swap in the real asset later: replace the contents of this file with
 * the real SVG/markup (keeping the same export signature), and separately
 * replace `public/favicon.svg` (see the comment in that file) — every
 * consumer of `<Logo />` picks up the change automatically since this is
 * the single import path for the brand mark.
 */
interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="sxcndhxnd (placeholder logo)"
      className={cn('h-8 w-8', className)}
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <text
        x="16"
        y="16"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontFamily="var(--font-sans)"
        fontWeight="300"
        fontSize="15"
        letterSpacing="-0.02em"
      >
        s
      </text>
    </svg>
  )
}
