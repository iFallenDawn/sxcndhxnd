import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'sxcndhxnd'

interface PageMetaProps {
  /** Rendered as `"{title} — sxcndhxnd"`. Omit to fall back to the bare site name. */
  title?: string
  description?: string
}

/**
 * Per-route document title/meta, replacing v1's App Router `export const
 * metadata`. Drop `<PageMeta title="Store" />` at the top of any page
 * component; `react-helmet-async` merges/dedupes across the render tree so
 * later, more specific tags (e.g. a product page setting its own title) win.
 */
export function PageMeta({ title, description }: PageMetaProps) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
    </Helmet>
  )
}
