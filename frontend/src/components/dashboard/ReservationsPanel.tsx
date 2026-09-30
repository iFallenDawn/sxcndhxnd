import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { SearchIcon } from 'lucide-react'
import { SiInstagram } from '@icons-pack/react-simple-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ConfirmDeleteDialog } from '@/components/dashboard/ConfirmDeleteDialog'
import { ImagePlaceholder } from '@/components/home/ImagePlaceholder'
import { useProducts } from '@/hooks/use-products'
import {
  useDeleteReservation,
  useReservations,
  useUpdateReservation,
} from '@/hooks/use-reservations'
import { ApiError } from '@/lib/api-error'
import { INSTAGRAM_PROFILE_BASE } from '@/lib/constants'
import {
  BUCKET_BADGE_ON_SURFACE,
  PRODUCT_STATUS_LABEL,
  formatPrice,
  getProductBucket,
} from '@/lib/products'
import type { ProductsBaseSchema, ReservationsBaseSchema } from '@/types/api'

/** A reservation paired with the product it's for, resolved client-side. */
interface ReservationRow {
  reservation: ReservationsBaseSchema
  /**
   * Null when the products list has no row with that `product_id` — a product
   * deleted out from under its reservation. Shown as such rather than hidden,
   * so the count here always matches what the backend holds.
   */
  product: ProductsBaseSchema | null
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function formatReservedAt(createdAt: string): string {
  const parsed = Date.parse(createdAt)
  return Number.isNaN(parsed) ? '—' : dateFormat.format(parsed)
}

/** Edits the one field the backend lets an admin change (`ReservationsUpdate`). */
function EditHandleDialog({
  row,
  onOpenChange,
}: {
  row: ReservationRow | null
  onOpenChange: (open: boolean) => void
}) {
  const updateReservation = useUpdateReservation()
  const [handle, setHandle] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Reset the field each time a different reservation is opened.
  const [lastId, setLastId] = useState<string | null>(null)
  if (row && row.reservation.id !== lastId) {
    setLastId(row.reservation.id)
    setHandle(row.reservation.instagram)
    setError(null)
  }

  const save = async () => {
    if (!row) return
    const trimmed = handle.trim().replace(/^@/, '')
    if (trimmed === '') {
      setError('A handle is needed — it’s how you reach them.')
      return
    }
    setError(null)
    try {
      await updateReservation.mutateAsync({
        id: row.reservation.id,
        payload: { instagram: trimmed },
      })
      toast.success('Handle updated.')
      onOpenChange(false)
    } catch (saveError) {
      setError(
        saveError instanceof ApiError
          ? (saveError.detail ?? 'Could not save that handle.')
          : 'Could not save that handle. Check your connection and try again.',
      )
    }
  }

  return (
    <Dialog open={row !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Fix the Instagram handle</DialogTitle>
          <DialogDescription>
            {row?.product
              ? `Whoever reserved “${row.product.title}”.`
              : 'Whoever made this reservation.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="reservation-handle"
            className="text-sm font-medium text-foreground"
          >
            Instagram handle
          </label>
          <Input
            id="reservation-handle"
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            placeholder="theirhandle"
            aria-invalid={Boolean(error)}
            className="h-10"
          />
          <p className="text-xs text-muted-foreground">
            The @ is optional — it gets stripped.
          </p>
        </div>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateReservation.isPending}
          >
            Cancel
          </Button>
          <Button onClick={save} disabled={updateReservation.isPending}>
            {updateReservation.isPending ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ReservationRowItem({
  row,
  onEdit,
  onDelete,
}: {
  row: ReservationRow
  onEdit: () => void
  onDelete: () => void
}) {
  const { reservation, product } = row
  const firstImage = product?.image_urls[0]
  const handle = reservation.instagram

  return (
    <li className="flex flex-col gap-3 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
          {firstImage ? (
            <img
              src={firstImage}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlaceholder
              label="No photo"
              className="h-full w-full border-none"
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium text-foreground">
              {product ? product.title : 'Product no longer listed'}
            </span>
            {product ? (
              <Badge
                className={
                  BUCKET_BADGE_ON_SURFACE[getProductBucket(product.status)]
                }
              >
                {PRODUCT_STATUS_LABEL[product.status]}
              </Badge>
            ) : null}
          </div>

          <a
            href={`${INSTAGRAM_PROFILE_BASE}${handle}`}
            target="_blank"
            rel="noreferrer noopener"
            className="flex w-fit items-center gap-1.5 text-sm text-foreground underline-offset-4 hover:underline"
          >
            <SiInstagram className="size-3.5 shrink-0" aria-hidden="true" />@
            {handle}
          </a>

          <span className="font-mono text-xs text-muted-foreground">
            {formatReservedAt(reservation.created_at)}
            {product ? ` · ${formatPrice(product.price)}` : null}
            {reservation.user_id ? null : ' · no account'}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <Button type="button" size="sm" variant="outline" onClick={onEdit}>
          Edit handle
        </Button>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={onDelete}
        >
          Cancel
        </Button>
      </div>
    </li>
  )
}

/**
 * Who has asked to hold what. Nico's side of the reservation flow (issue #10):
 * no payments to reconcile, so the only things that matter per row are which
 * piece it is, which Instagram account to DM, and the ability to let a piece
 * go again.
 *
 * `ReservationsBaseSchema` carries no embedded product — just a `product_id` —
 * so rows are joined against the products list that the Products tab already
 * loads. A raw uuid in this panel would be useless to him.
 */
export function ReservationsPanel() {
  const {
    data: reservations,
    isLoading: reservationsLoading,
    isError: reservationsError,
    error,
  } = useReservations()
  const { data: products, isLoading: productsLoading } = useProducts()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<ReservationRow | null>(null)
  const [cancelling, setCancelling] = useState<ReservationRow | null>(null)
  const deleteReservation = useDeleteReservation()

  const rows = useMemo<ReservationRow[]>(() => {
    if (!reservations) return []
    const byId = new Map(
      (products ?? []).map((product) => [product.id, product]),
    )
    return (
      reservations
        .map((reservation) => ({
          reservation,
          product: byId.get(reservation.product_id) ?? null,
        }))
        // Newest first: the ones needing a DM are the ones that just came in.
        .sort(
          (a, b) =>
            Date.parse(b.reservation.created_at) -
            Date.parse(a.reservation.created_at),
        )
    )
  }, [reservations, products])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase().replace(/^@/, '')
    if (!query) return rows
    return rows.filter(
      (row) =>
        row.reservation.instagram.toLowerCase().includes(query) ||
        (row.product?.title.toLowerCase().includes(query) ?? false),
    )
  }, [rows, search])

  const isLoading = reservationsLoading || productsLoading

  return (
    <div className="flex flex-col gap-4">
      <div className="relative sm:max-w-xs">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by handle or piece…"
          className="h-9 pl-8"
          aria-label="Search reservations by Instagram handle or product title"
        />
      </div>

      {isLoading ? (
        <ul className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <li key={index} className="flex items-center gap-3">
              <Skeleton className="size-16 rounded-md" />
              <Skeleton className="h-4 flex-1" />
            </li>
          ))}
        </ul>
      ) : reservationsError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-8 text-center text-sm text-destructive">
          {error instanceof ApiError
            ? error.message
            : 'Could not load reservations.'}
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          {rows.length > 0
            ? 'Nothing matches your search.'
            : 'Nobody has reserved anything yet. They’ll show up here the moment they do.'}
        </p>
      ) : (
        <ul>
          {filtered.map((row) => (
            <ReservationRowItem
              key={row.reservation.id}
              row={row}
              onEdit={() => setEditing(row)}
              onDelete={() => setCancelling(row)}
            />
          ))}
        </ul>
      )}

      <EditHandleDialog
        row={editing}
        onOpenChange={(open) => !open && setEditing(null)}
      />

      <ConfirmDeleteDialog
        open={cancelling !== null}
        onOpenChange={(open) => !open && setCancelling(null)}
        title="Let this piece go again?"
        description={
          <>
            {cancelling?.product ? (
              <>
                <span className="font-medium text-foreground">
                  {cancelling.product.title}
                </span>{' '}
                goes straight back on sale and anyone can reserve it.{' '}
              </>
            ) : (
              'The piece goes straight back on sale and anyone can reserve it. '
            )}
            This deletes @{cancelling?.reservation.instagram}’s reservation for
            good — they will not be told, so message them first if you want them
            to know.
          </>
        }
        errorMessage="Could not cancel this reservation."
        onConfirm={async () => {
          if (!cancelling) return
          await deleteReservation.mutateAsync(cancelling.reservation.id)
          toast.success('Reservation cancelled — the piece is back on sale.')
        }}
      />
    </div>
  )
}
