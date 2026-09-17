import { useState } from 'react'
import { toast } from 'sonner'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Toaster } from '@/components/ui/sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const NEUTRAL_TOKENS = [
  'background',
  'foreground',
  'card',
  'popover',
  'primary',
  'secondary',
  'muted',
  'accent',
  'destructive',
  'border',
  'input',
  'ring',
]

const BRAND_TOKENS = ['brand-clay', 'brand-moss', 'brand-sand']

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 border-b border-border py-10">
      <h2 className="heading-display text-xl">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function Swatch({ token }: { token: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-full border border-border"
        style={{ backgroundColor: `var(--color-${token})` }}
      />
      <code className="font-mono text-xs text-muted-foreground">
        --color-{token}
      </code>
    </div>
  )
}

/**
 * Dev-only route. Renders every design token and primitive from this ticket
 * so the palette/type scale/components can be sanity-checked in one place.
 * Excluded from production builds — see the conditional route registration
 * in src/router.tsx.
 */
export function Styleguide() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-6 pb-24">
      <header className="flex flex-col gap-2 border-b border-border py-10">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="heading-display text-2xl">sxcndhxnd</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Dev-only styleguide — palette, type scale, and base primitives.
        </p>
      </header>

      <Section title="Palette — neutrals">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {NEUTRAL_TOKENS.map((token) => (
            <Swatch key={token} token={token} />
          ))}
        </div>
      </Section>

      <Section title="Palette — earth-tone accents">
        <p className="text-sm text-muted-foreground">
          Used sparingly — a status dot, a small badge, a highlight detail.
          Never a primary/secondary surface.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {BRAND_TOKENS.map((token) => (
            <Swatch key={token} token={token} />
          ))}
        </div>
      </Section>

      <Section title="Type scale">
        <div className="flex flex-col gap-4">
          <p className="heading-display text-5xl">Display / 5xl</p>
          <p className="heading-display text-3xl">Display / 3xl</p>
          <p className="heading-display text-xl">Display / xl</p>
          <p className="text-base font-normal">
            Body / base — clean, simple, sans. This is the register for
            paragraphs, descriptions, and everything a customer reads.
          </p>
          <p className="text-base font-bold">
            Body / bold — contrasted against the light display weights above.
          </p>
          <p className="font-mono text-sm text-muted-foreground">
            font-mono / typewriter accent — SXCN-0042 · $185.00 · 2026-09-17.
            Restrained use only: prices, SKUs, timestamps, form hints.
          </p>
        </div>
      </Section>

      <Section title="Radius register">
        <div className="flex flex-wrap items-center gap-4">
          <Button>Primary CTA (rounded-none)</Button>
          <Badge>Filter pill (rounded-full)</Badge>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </Section>

      <Section title="Inputs">
        <div className="flex max-w-sm flex-col gap-3">
          <Input placeholder="Input" />
          <Textarea placeholder="Textarea" />
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one">One</SelectItem>
              <SelectItem value="two">Two</SelectItem>
              <SelectItem value="three">Three</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Section title="Dialog / Sheet / Dropdown / Toast">
        <div className="flex flex-wrap gap-3">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog title</DialogTitle>
                <DialogDescription>
                  Dialog description text for the styleguide.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sheet title</SheetTitle>
                <SheetDescription>
                  Sheet description text for the styleguide.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open dropdown</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            onClick={() => toast('Toast from the styleguide')}
          >
            Fire toast
          </Button>
          <Toaster />
        </div>
      </Section>

      <Section title="Skeleton">
        <div className="flex max-w-sm flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Section>
    </div>
  )
}
