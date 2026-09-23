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
 * that column exists, replace the body of `deriveGalleryDate` with a direct
 * read of it; every call site in this app (see `src/lib/gallery-items.ts`)
 * goes through that function, so nothing else needs to change.
 * ---------------------------------------------------------------------------
 */

// Matches an 8-digit YYYYMMDD run anywhere in the string. Requires a 20xx
// year to avoid false positives on unrelated numeric IDs in the filename.
const FILENAME_DATE_RE = /(20\d{2})(\d{2})(\d{2})/

/**
 * When a gallery photo was made, as a UTC millisecond timestamp (the sort key
 * within a year group), plus the UTC calendar year it's grouped under. The
 * year is read off the timestamp so the two can never disagree.
 */
export function deriveGalleryDate(imageUrl: string, createdAt: string): { year: number; timestamp: number } {
  const timestamp = parseFilenameDate(imageUrl) ?? parseCreatedAt(createdAt)
  return { year: new Date(timestamp).getUTCFullYear(), timestamp }
}

function parseFilenameDate(source: string): number | null {
  const match = source.match(FILENAME_DATE_RE)
  if (!match) return null

  const [, year, month, day] = match.map(Number)
  if (month < 1 || month > 12 || day < 1 || day > 31) return null

  return Date.UTC(year, month - 1, day)
}

function parseCreatedAt(createdAt: string): number {
  const parsed = Date.parse(createdAt)
  return Number.isNaN(parsed) ? Date.now() : parsed
}
