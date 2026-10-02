import { SiInstagram } from '@icons-pack/react-simple-icons'

const INSTAGRAM_URL = 'https://instagram.com/sxcndhxnd'

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
          <SiInstagram className="size-5" aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
