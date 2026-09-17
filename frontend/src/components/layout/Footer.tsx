const INSTAGRAM_URL = 'https://instagram.com/sxcndhxnd'

/**
 * The `lucide-react` version pinned in this repo (1.x) ships no brand/logo
 * icons — Lucide dropped them for trademark reasons and now points brand
 * marks at the separate `simple-icons` package, which isn't a dependency
 * here. Rather than pull in a new package for one glyph, this is a small
 * hand-drawn Instagram mark using Lucide's own stroke conventions
 * (`currentColor`, `strokeWidth="2"`, rounded caps/joins) so it reads as part
 * of the same icon set.
 */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

/**
 * Simple copyright + socials row, carried over from v1's footer (which was
 * just this). The client specifically asked for an icon pointing customers
 * at his socials — Instagram only, for now.
 */
export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <p>&copy; {new Date().getFullYear()} sxcndhxnd. All rights reserved.</p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="sxcndhxnd on Instagram"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <InstagramIcon className="size-5" />
        </a>
      </div>
    </footer>
  )
}
