import { useEffect, useState, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { PageMeta } from '@/components/seo/PageMeta'
import { FormField } from '@/components/auth/FormField'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser, useUpdateCurrentUser } from '@/hooks/use-users'
import { changePassword, updateEmail } from '@/api/auth'
import { useAuthStore } from '@/stores/auth-store'
import {
  changeEmailSchema,
  changePasswordSchema,
  friendlyAuthErrorMessage,
  profileSchema,
  type ChangeEmailFormValues,
  type ChangePasswordFormValues,
  type ProfileFormValues,
} from '@/lib/auth-validation'

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="border border-border p-4 sm:p-6">
      <h2 className="heading-display text-lg">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  )
}

function ProfileSection() {
  const { data: user, isPending } = useCurrentUser()
  const updateUser = useUpdateCurrentUser()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { first_name: '', last_name: '', instagram: '' },
  })

  // Seed the form once the user loads (and whenever it's refetched from
  // elsewhere), without clobbering in-progress edits.
  useEffect(() => {
    if (user) {
      reset({ first_name: user.first_name, last_name: user.last_name, instagram: user.instagram })
    }
  }, [user, reset])

  if (isPending || !user) {
    return (
      <SectionCard title="Profile">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </SectionCard>
    )
  }

  const onSubmit = async (values: ProfileFormValues) => {
    setSuccessMessage(null)
    try {
      await updateUser.mutateAsync(values)
      setSuccessMessage('Profile updated.')
    } catch {
      // Surfaced below via updateUser.isError / error.
    }
  }

  return (
    <SectionCard title="Profile" description="Your name and Instagram handle.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <p className="text-sm text-muted-foreground">
          Email: <span className="font-medium text-foreground">{user.email}</span>
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="First name"
            htmlFor="account-first-name"
            autoComplete="given-name"
            error={errors.first_name?.message}
            {...register('first_name')}
          />
          <FormField
            label="Last name"
            htmlFor="account-last-name"
            autoComplete="family-name"
            error={errors.last_name?.message}
            {...register('last_name')}
          />
        </div>

        <FormField
          label="Instagram handle"
          htmlFor="account-instagram"
          autoComplete="off"
          hint="How we reach you about commissions and reservations."
          error={errors.instagram?.message}
          {...register('instagram')}
        />

        {updateUser.isError ? (
          <p role="alert" className="text-sm text-destructive">
            Could not update your profile. Please try again.
          </p>
        ) : null}
        {successMessage ? <p className="text-sm text-brand-moss">{successMessage}</p> : null}

        <Button
          type="submit"
          size="lg"
          disabled={!isDirty || updateUser.isPending}
          className="h-11 w-full sm:w-auto"
        >
          {updateUser.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </SectionCard>
  )
}

function ChangeEmailSection() {
  const refreshToken = useAuthStore((state) => state.refreshToken)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { new_email: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: ChangeEmailFormValues) => {
      if (!refreshToken) throw new Error('No active session')
      return updateEmail({ new_email: values.new_email, refresh_token: refreshToken })
    },
    onSuccess: () => reset(),
  })

  const errorMessage = mutation.isError
    ? friendlyAuthErrorMessage(mutation.error, 'Could not update your email.')
    : null

  return (
    <SectionCard title="Change email" description="You'll need to confirm the new address before it takes effect.">
      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        noValidate
        className="flex flex-col gap-5"
      >
        <FormField
          label="New email"
          htmlFor="account-new-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          error={errors.new_email?.message}
          {...register('new_email')}
        />

        {errorMessage ? (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
        {mutation.isSuccess ? (
          <p className="text-sm text-brand-moss">Confirmation email sent to your new address.</p>
        ) : null}

        <Button type="submit" size="lg" disabled={mutation.isPending} className="h-11 w-full sm:w-auto">
          {mutation.isPending ? 'Sending…' : 'Update email'}
        </Button>
      </form>
    </SectionCard>
  )
}

function ChangePasswordSection() {
  const refreshToken = useAuthStore((state) => state.refreshToken)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current_password: '', new_password: '', confirm_password: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: ChangePasswordFormValues) => {
      if (!refreshToken) throw new Error('No active session')
      return changePassword({
        current_password: values.current_password,
        new_password: values.new_password,
        refresh_token: refreshToken,
      })
    },
    onSuccess: () => reset(),
  })

  const errorMessage = mutation.isError
    ? friendlyAuthErrorMessage(mutation.error, 'Could not change your password.')
    : null

  return (
    <SectionCard title="Change password">
      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        noValidate
        className="flex flex-col gap-5"
      >
        <FormField
          label="Current password"
          htmlFor="account-current-password"
          type="password"
          autoComplete="current-password"
          error={errors.current_password?.message}
          {...register('current_password')}
        />
        <FormField
          label="New password"
          htmlFor="account-new-password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters."
          error={errors.new_password?.message}
          {...register('new_password')}
        />
        <FormField
          label="Confirm new password"
          htmlFor="account-confirm-password"
          type="password"
          autoComplete="new-password"
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />

        {errorMessage ? (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
        {mutation.isSuccess ? <p className="text-sm text-brand-moss">Password changed.</p> : null}

        <Button type="submit" size="lg" disabled={mutation.isPending} className="h-11 w-full sm:w-auto">
          {mutation.isPending ? 'Changing…' : 'Change password'}
        </Button>
      </form>
    </SectionCard>
  )
}

/** `/account` — view/edit profile, change email, change password. Requires auth (see router). */
export function Account() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-12 sm:px-6">
      <PageMeta title="Account" />
      <h1 className="heading-display text-2xl">Account</h1>
      <ProfileSection />
      <ChangeEmailSection />
      <ChangePasswordSection />
    </div>
  )
}
