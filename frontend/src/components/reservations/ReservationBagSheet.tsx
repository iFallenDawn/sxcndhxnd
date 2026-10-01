import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CheckIcon,
  ShoppingBagIcon,
  TrashIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { SiInstagram } from '@icons-pack/react-simple-icons'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/auth/FormField'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ImagePlaceholder } from '@/components/home/ImagePlaceholder'
import {
  useBagProducts,
  useReserveBag,
  type ReservationAttempt,
} from '@/hooks/use-reservations'
import { useReservationBagStore } from '@/stores/reservation-bag-store'
import { useAuthStore } from '@/stores/auth-store'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/lib/constants'
import {
  BUCKET_BADGE_ON_SURFACE,
  BUCKET_LABEL,
  formatPrice,
  getProductBucket,
} from '@/lib/products'
import { cn } from '@/lib/utils'
import type { ProductsBaseSchema } from '@/types/api'

/**
 * The handle is the only thing collected at checkout, because it's the only
 * thing the flow needs: there is no payment, and `POST /products/{id}/reserve`
 * takes nothing else. Leading `@` is stripped so `@nico` and `nico` are stored
 * identically (same transform as `instagramSchema` in `auth-validation.ts`,
 * with reservation-specific wording on the error).
 */
const checkoutSchema = z.object({
  instagram: z
    .string()
    .trim()
    .min(
      1,
      'We need your Instagram handle — it’s the only way Nico can reach you',
    )
    .transform((value) => value.replace(/^@/, '')),
})

type CheckoutFormValues = z.input<typeof checkoutSchema>

/** `bag` → review and remove, `checkout` → confirm the DM handoff, `result` → per-item outcome. */
type Step = 'bag' | 'checkout' | 'result'

function BagRow({
  product,
  onRemove,
}: {
  product: ProductsBaseSchema
  onRemove: () => void
}) {
  const bucket = getProductBucket(product.status)
  const [firstImage] = product.image_urls

  return (
    <li className="flex items-center gap-3 border-b border-border py-3 last:border-b-0">
      <Link
        to={`/store/${product.id}`}
        className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted"
      >
        {firstImage ? (
          <img src={firstImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlaceholder
            label="No photo"
            className="h-full w-full border-none"
          />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          to={`/store/${product.id}`}
          className="truncate font-medium text-foreground"
        >
          {product.title}
        </Link>
        <span className="font-mono text-sm text-muted-foreground">
          {formatPrice(product.price)}
        </span>
        {/* The bag persists across sessions, so a piece in it can have been
            taken by someone else in the meantime. Say so here rather than
            letting checkout be the first the customer hears of it. */}
        {bucket !== 'available' ? (
          <span
            className={cn(
              'w-fit rounded-sm border px-1.5 py-0.5 text-[11px]',
              BUCKET_BADGE_ON_SURFACE[bucket],
            )}
          >
            {bucket === 'reserved' ? 'Already reserved' : BUCKET_LABEL[bucket]}
          </span>
        ) : null}
      </div>

      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        onClick={onRemove}
        aria-label={`Remove ${product.title} from your bag`}
        className="shrink-0"
      >
        <TrashIcon className="size-3.5" />
      </Button>
    </li>
  )
}

/** The unmissable part: reservations are settled in a DM, not on this site. */
function InstagramHandoffNotice() {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-foreground bg-muted p-4">
      <div className="flex items-center gap-2">
        <SiInstagram
          className="size-5 shrink-0 text-foreground"
          aria-hidden="true"
        />
        <p className="font-medium text-foreground">
          Everything after this happens in a DM
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Nothing is paid here. Reserving holds the piece under your name, then
        Nico messages you on Instagram to sort out price, sizing and delivery.
        If you don’t hear back, DM{' '}
        <span className="font-medium text-foreground">@{INSTAGRAM_HANDLE}</span>{' '}
        directly.
      </p>
      <Button asChild className="w-fit">
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer noopener">
          <SiInstagram data-icon="inline-start" aria-hidden="true" />
          Open @{INSTAGRAM_HANDLE} on Instagram
        </a>
      </Button>
    </div>
  )
}

const OUTCOME_STYLE: Record<ReservationAttempt['outcome'], string> = {
  reserved: 'text-foreground',
  taken: 'text-destructive',
  failed: 'text-destructive',
}

function ResultList({ attempts }: { attempts: ReservationAttempt[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {attempts.map((attempt) => (
        <li key={attempt.productId} className="flex gap-2">
          {attempt.outcome === 'reserved' ? (
            <CheckIcon
              className="mt-0.5 size-4 shrink-0 text-foreground"
              aria-hidden="true"
            />
          ) : (
            <TriangleAlertIcon
              className="mt-0.5 size-4 shrink-0 text-destructive"
              aria-hidden="true"
            />
          )}
          <div className="flex min-w-0 flex-col">
            <span
              className={cn(
                'text-sm font-medium',
                OUTCOME_STYLE[attempt.outcome],
              )}
            >
              {attempt.title}
            </span>
            <span className="text-sm text-muted-foreground">
              {attempt.outcome === 'reserved'
                ? 'Reserved for you.'
                : attempt.message}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

function BagSheetBody({
  step,
  setStep,
  onClose,
}: {
  step: Step
  setStep: (step: Step) => void
  onClose: () => void
}) {
  const { items, missingIds, isLoading, isError } = useBagProducts()
  const bagCount = useReservationBagStore((state) => state.productIds.length)
  const remove = useReservationBagStore((state) => state.remove)
  const user = useAuthStore((state) => state.user)
  const reserveBag = useReserveBag()
  const [attempts, setAttempts] = useState<ReservationAttempt[] | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { instagram: '' },
  })

  // Prefill from the signed-in customer's profile handle (the same field
  // `/account` edits). Guests get an empty field — reserving does not require
  // an account, the endpoint's auth is optional.
  useEffect(() => {
    if (user?.instagram) reset({ instagram: user.instagram })
  }, [user?.instagram, reset])

  // Only pieces that are still `available` can be reserved; the backend's
  // guard would reject the rest anyway, so they aren't even attempted.
  const reservable = items.filter(
    (product) => getProductBucket(product.status) === 'available',
  )

  const onSubmit = async (values: CheckoutFormValues) => {
    const parsed = checkoutSchema.parse(values)
    const result = await reserveBag.mutateAsync({
      products: reservable,
      instagram: parsed.instagram,
    })
    setAttempts(result)
    setStep('result')
  }

  if (step === 'result' && attempts) {
    const reservedCount = attempts.filter(
      (a) => a.outcome === 'reserved',
    ).length
    return (
      <>
        <SheetHeader>
          <SheetTitle>
            {reservedCount === attempts.length
              ? reservedCount === 1
                ? 'Reserved'
                : `All ${reservedCount} reserved`
              : `${reservedCount} of ${attempts.length} reserved`}
          </SheetTitle>
          <SheetDescription>
            {reservedCount === attempts.length
              ? 'Held under your name. Nico takes it from here on Instagram.'
              : 'Anything that couldn’t be reserved is listed below with the reason.'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          <ResultList attempts={attempts} />
          {reservedCount > 0 ? (
            <div className="mt-4">
              <InstagramHandoffNotice />
            </div>
          ) : null}
        </div>

        <SheetFooter>
          <Button type="button" onClick={onClose}>
            Done
          </Button>
        </SheetFooter>
      </>
    )
  }

  if (step === 'checkout') {
    return (
      <>
        <SheetHeader>
          <SheetTitle>Confirm your reservation</SheetTitle>
          <SheetDescription>
            {reservable.length === 1
              ? 'One piece, held under your name.'
              : `${reservable.length} pieces, held under your name.`}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
            <InstagramHandoffNotice />

            <FormField
              label="Your Instagram handle"
              htmlFor="reserve-instagram"
              autoComplete="off"
              placeholder="yourhandle"
              hint="This is where Nico will message you. The @ is optional."
              error={errors.instagram?.message}
              {...register('instagram')}
            />

            <ul className="flex flex-col gap-1">
              {reservable.map((product) => (
                <li
                  key={product.id}
                  className="flex items-baseline justify-between gap-3 text-sm"
                >
                  <span className="min-w-0 truncate text-foreground">
                    {product.title}
                  </span>
                  <span className="shrink-0 font-mono text-muted-foreground">
                    {formatPrice(product.price)}
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-muted-foreground">
              Reserving doesn’t charge you anything and isn’t a purchase.
            </p>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={reserveBag.isPending}>
              {reserveBag.isPending
                ? 'Reserving…'
                : reservable.length === 1
                  ? 'Reserve this piece'
                  : `Reserve ${reservable.length} pieces`}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('bag')}
              disabled={reserveBag.isPending}
            >
              Back to bag
            </Button>
          </SheetFooter>
        </form>
      </>
    )
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>Your reservations</SheetTitle>
        <SheetDescription>
          Holding pieces, not buying them — checkout hands off to an Instagram
          DM.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-4">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading your bag…
          </p>
        ) : isError ? (
          // Distinct from the empty-bag state below: a failed fetch resolves
          // every id to "missing" the same way an actually-empty bag would,
          // so without this branch a products outage looked like the bag had
          // been wiped rather than that it couldn't be loaded.
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-10 text-center text-sm text-destructive">
            Couldn’t load your bag. Check your connection and try again.
          </p>
        ) : items.length === 0 && missingIds.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            Nothing here yet. Add a piece from the store.
          </p>
        ) : (
          <>
            <ul>
              {items.map((product) => (
                <BagRow
                  key={product.id}
                  product={product}
                  onRemove={() => remove(product.id)}
                />
              ))}
            </ul>
            {missingIds.length > 0 ? (
              <div className="mt-3 flex flex-col gap-2">
                {missingIds.map((id) => (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-muted-foreground">
                      One piece is no longer listed.
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => remove(id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>

      <SheetFooter>
        {reservable.length > 0 ? (
          <Button type="button" onClick={() => setStep('checkout')}>
            Continue
          </Button>
        ) : null}
        <Button type="button" variant="outline" asChild>
          {/* Keyed off the stored count rather than the resolved `items`, so
              the label doesn't read "Go to the store" (i.e. "your bag is
              empty") during the products fetch that resolves the bag. */}
          <Link to="/store" onClick={onClose}>
            {bagCount > 0 ? 'Keep browsing' : 'Go to the store'}
          </Link>
        </Button>
      </SheetFooter>
    </>
  )
}

/**
 * The reservation bag drawer plus its navbar trigger (issue #10).
 *
 * The trigger renders only while the bag holds something — an always-visible
 * empty bag icon is dead UI in a navbar this sparse, and the store's
 * add-to-bag button is the only entry point that matters. `hasHydrated` gates
 * the first render so a persisted bag doesn't flash a count of zero on load.
 *
 * The drawer stays mounted whenever it's open, *even at a count of zero*.
 * That is load-bearing, not defensive: a checkout in which everything
 * succeeded empties the bag, and gating the whole component on the count
 * unmounted the sheet mid-flow — the customer's confirmation, the list of
 * what they got and the Instagram handoff all vanished the instant the
 * reservation went through. Caught by driving the real flow in a browser.
 *
 * `triggerClassName` exists so the navbar can hand this its own opaque chip
 * while the nav is transparent over the hero photo: per CLAUDE.md nothing
 * over an image may rely on the page background, and the tokens for that live
 * with the navbar rather than being duplicated here.
 */
export function ReservationBagSheet({
  triggerClassName,
}: {
  triggerClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('bag')
  const hasHydrated = useReservationBagStore((state) => state.hasHydrated)
  const count = useReservationBagStore((state) => state.productIds.length)

  // Always land on the bag itself, never on a stale result screen from a
  // previous checkout.
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    setStep('bag')
  }

  if (!hasHydrated || (count === 0 && !open)) return null

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {count > 0 ? (
        <SheetTrigger asChild>
          <Button
            type="button"
            size="sm"
            className={triggerClassName}
            aria-label={`Your reservations (${count})`}
          >
            <ShoppingBagIcon data-icon="inline-start" aria-hidden="true" />
            {count}
          </Button>
        </SheetTrigger>
      ) : null}
      <SheetContent side="right" className="flex flex-col gap-4">
        <BagSheetBody
          step={step}
          setStep={setStep}
          onClose={() => handleOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
