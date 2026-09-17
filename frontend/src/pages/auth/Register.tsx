import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { SiInstagram } from '@icons-pack/react-simple-icons'
import { PageMeta } from '@/components/seo/PageMeta'
import { FormField } from '@/components/auth/FormField'
import { Button } from '@/components/ui/button'
import { registerUser } from '@/api/auth'
import { ApiError } from '@/lib/api-error'
import { registerSchema, type RegisterFormValues } from '@/lib/auth-validation'

/**
 * `/register` — deliberately requires an Instagram handle: the client's own
 * note was that the old site's biggest failure was not capturing a contact
 * method, since the entire commission/reservation process finishes over IG
 * DM. The callout box below is here so that's obvious in the UI, not just
 * enforced by validation.
 */
export function Register() {
  const [formError, setFormError] = useState<string | null>(null)
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { first_name: '', last_name: '', email: '', instagram: '', password: '' },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(null)
    try {
      await registerUser(values)
      setRegisteredEmail(values.email)
    } catch (error) {
      if (error instanceof ApiError && error.isConflict) {
        setFormError('An account with that email already exists. Try signing in instead.')
      } else if (error instanceof ApiError) {
        setFormError(error.detail ?? 'Could not create your account. Please try again.')
      } else {
        setFormError('Could not create your account. Please try again.')
      }
    }
  }

  if (registeredEmail) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <PageMeta title="Confirm your email" />
        <div className="w-full max-w-sm text-center">
          <h1 className="heading-display text-2xl">Check your email</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            We sent a confirmation link to <span className="font-medium text-foreground">{registeredEmail}</span>.
            Confirm your email before signing in — your account isn't active yet.
          </p>
          <Button asChild size="lg" variant="outline" className="mt-8 h-11 w-full">
            <Link to="/sign-in">Go to sign in</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
      <PageMeta title="Register" />
      <div className="w-full max-w-sm">
        <h1 className="heading-display text-2xl">Register</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/sign-in" className="font-medium text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="First name"
              htmlFor="register-first-name"
              autoComplete="given-name"
              error={errors.first_name?.message}
              {...register('first_name')}
            />
            <FormField
              label="Last name"
              htmlFor="register-last-name"
              autoComplete="family-name"
              error={errors.last_name?.message}
              {...register('last_name')}
            />
          </div>

          <FormField
            label="Email"
            htmlFor="register-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="flex flex-col gap-2 border border-border bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <SiInstagram className="size-4 shrink-0" />
              Instagram handle required
            </div>
            <p className="text-sm text-muted-foreground">
              Commissions and reservations are finished over Instagram DM — we need a way to reach you.
            </p>
            <FormField
              label="Instagram handle"
              htmlFor="register-instagram"
              placeholder="yourhandle"
              autoComplete="off"
              error={errors.instagram?.message}
              {...register('instagram')}
            />
          </div>

          <FormField
            label="Password"
            htmlFor="register-password"
            type="password"
            autoComplete="new-password"
            hint="At least 8 characters."
            error={errors.password?.message}
            {...register('password')}
          />

          {formError ? (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          ) : null}

          <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1 h-11 w-full">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
      </div>
    </div>
  )
}
