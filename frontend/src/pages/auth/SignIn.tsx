import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { PageMeta } from '@/components/seo/PageMeta'
import { FormField } from '@/components/auth/FormField'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { ApiError } from '@/lib/api-error'
import { friendlyAuthErrorMessage, signInSchema, type SignInFormValues } from '@/lib/auth-validation'

interface LocationState {
  from?: { pathname: string }
}

/** `/sign-in` — email + password, redirects back to wherever the user was headed. */
export function SignIn() {
  const signIn = useAuthStore((state) => state.signIn)
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? '/'

  const onSubmit = async (values: SignInFormValues) => {
    setFormError(null)
    try {
      await signIn(values)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(friendlyAuthErrorMessage(error.detail, 'Could not sign in. Please try again.'))
      } else {
        setFormError('Could not sign in. Please try again.')
      }
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
      <PageMeta title="Sign In" />
      <div className="w-full max-w-sm">
        <h1 className="heading-display text-2xl">Sign In</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          New here?{' '}
          <Link to="/register" className="font-medium text-foreground underline underline-offset-4">
            Create an account
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-5">
          <FormField
            label="Email"
            htmlFor="sign-in-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <FormField
            label="Password"
            htmlFor="sign-in-password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          {formError ? (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          ) : null}

          <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1 h-11 w-full">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
