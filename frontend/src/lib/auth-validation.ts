import { z } from 'zod'
import { ApiError } from '@/lib/api-error'

/**
 * Shared field-level schemas for the auth forms (`/sign-in`, `/register`,
 * `/account`). Password minimum is 8 characters to match the backend
 * (Supabase's own default minimum) — do not tighten this without checking
 * `backend/entities/models.py` first.
 */
export const emailSchema = z.string().trim().min(1, 'Email is required').email('Enter a valid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')

export const instagramSchema = z
  .string()
  .trim()
  .min(1, 'Instagram handle is required so we can reach you about commissions')
  .transform((value) => value.replace(/^@/, ''))

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export type SignInFormValues = z.infer<typeof signInSchema>

export const registerSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required'),
  last_name: z.string().trim().min(1, 'Last name is required'),
  email: emailSchema,
  instagram: instagramSchema,
  password: passwordSchema,
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export const profileSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required'),
  last_name: z.string().trim().min(1, 'Last name is required'),
  instagram: instagramSchema,
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export const changeEmailSchema = z.object({
  new_email: emailSchema,
})

export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: passwordSchema,
    confirm_password: z.string().min(1, 'Confirm your new password'),
  })
  .refine((values) => values.new_password === values.confirm_password, {
    message: "New passwords don't match",
    path: ['confirm_password'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

/**
 * Best-effort mapping of an auth request's failure to user-facing copy.
 * Supabase Auth error strings arrive as the `detail` on an `ApiError` (see
 * `core/exception_handlers.py`'s `AuthApiError` handler, which passes
 * Supabase's message straight through); known ones get friendlier wording,
 * any other detail is shown as-is, and errors without one get `fallback`.
 */
export function friendlyAuthErrorMessage(error: unknown, fallback: string): string {
  const detail = error instanceof ApiError ? error.detail : null
  if (!detail) return fallback

  if (detail === 'Email not confirmed') {
    return 'Please confirm your email before signing in — check your inbox for the confirmation link.'
  }

  const lower = detail.toLowerCase()
  if (lower.includes('invalid') && (lower.includes('credential') || lower.includes('password') || lower.includes('email'))) {
    return 'Incorrect email or password.'
  }

  return detail
}
