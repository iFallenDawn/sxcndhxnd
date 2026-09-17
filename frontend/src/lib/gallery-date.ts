/**
 * Year/date derivation for the gallery archive (issue #11).
 *
 * ---------------------------------------------------------------------------
 * BACKEND GAP — read before touching this file
 * ---------------------------------------------------------------------------
 * `GalleryImagesBaseSchema.created_at` (and `ProductsBaseSchema.created_at`)
 * is *upload* time, not when the piece was actually made. The whole point of
 * this page is showing the client's growth chronologically, so keying year
 * grouping off upload time is wrong the moment a backlog of older photos gets
 * bulk-uploaded in one sitting — they'd all collapse into "this year".
 *
 * The client's real archive filenames encode the true capture date instead,
 * e.g. `sxcndhxnd-20230102_213615-4187824369.jpg` (2023-01-02). So: prefer a
 * `YYYYMMDD`-style date found in the image URL/filename, and only fall back
 * to `created_at` when no such date is present.
 *
 * This is a stopgap. The real fix is an explicit `year` or `completed_at`
 * column on the gallery/product tables, set at upload time by whoever is
 * archiving the piece — flagged in issue #11 and in this PR's report. When
 * that column exists, replace the body of `deriveGalleryYear` /
 * `deriveGalleryTimestamp` with a direct read of it; every call site in this
 * app (see `src/lib/gallery-items.ts`) goes through these two functions, so
 * nothing else needs to change.
 * ---------------------------------------------------------------------------
 */

// Matches an 8-digit YYYYMMDD run anywhere in the string (optionally followed
// by `_HHMMSS` or similar, which we ignore). Requires a 20xx year to avoid
// false positives on unrelated numeric IDs in the filename.
const FILENAME_DATE_RE = /(20\d{2})(\d{2})(\d{2})(?:[_-]?\d{1,6})?/

function parseFilenameDate(source: string): { year: number; isoDate: string } | null {
  const match = source.match(FILENAME_DATE_RE)
  if (!match) return null

  const [, yearStr, monthStr, dayStr] = match
  const year = Number(yearStr)
  const month = Number(monthStr)
  const day = Number(dayStr)
  if (month < 1 || month > 12 || day < 1 || day > 31) return null

  return { year, isoDate: `${yearStr}-${monthStr}-${dayStr}` }
}

/** The calendar year a gallery photo should be grouped under. */
export function deriveGalleryYear(imageUrl: string, createdAt: string): number {
  const fromFilename = parseFilenameDate(imageUrl)
  if (fromFilename) return fromFilename.year

  const fallback = new Date(createdAt)
  if (!Number.isNaN(fallback.getTime())) return fallback.getFullYear()

  return new Date().getFullYear()
}

/** A sortable millisecond timestamp for ordering photos within a year group. */
export function deriveGalleryTimestamp(imageUrl: string, createdAt: string): number {
  const fromFilename = parseFilenameDate(imageUrl)
  if (fromFilename) {
    const parsed = Date.parse(`${fromFilename.isoDate}T00:00:00Z`)
    if (!Number.isNaN(parsed)) return parsed
  }

  const fallback = Date.parse(createdAt)
  return Number.isNaN(fallback) ? 0 : fallback
}
