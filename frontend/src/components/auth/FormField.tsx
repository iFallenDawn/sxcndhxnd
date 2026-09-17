import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FormFieldProps extends ComponentProps<typeof Input> {
  label: string
  htmlFor: string
  error?: string
  hint?: string
}

/**
 * Labeled input + error/hint row shared by the auth forms. There is no
 * `components/ui/label.tsx` in this repo yet, and adding one is out of scope
 * here (per CLAUDE.md, `components/ui/` primitives aren't touched by this
 * ticket) — so this renders a plain `<label>` styled inline instead.
 */
export function FormField({ label, htmlFor, error, hint, className, ...inputProps }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <Input
        id={htmlFor}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined}
        className={cn('h-11 text-base', className)}
        {...inputProps}
      />
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
