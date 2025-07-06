import { z } from 'zod/v4'
import { Database } from '../types/supabase'

type User = Database['public']['Tables']['users']['Row'];
const zodUserString = z.string().min(1, `cannot be an empty string`).trim()

const PublicUserSchema = z.object({
  id: z.uuid(),
  first_name: zodUserString,
  last_name: zodUserString,
  full_name: zodUserString,
  email: z.email().toLowerCase(),
  instagram: zodUserString,
  updated_at: z.coerce.date().transform(date => date.toISOString()),
  created_at: z.coerce.date().transform(date => date.toISOString())
})

const exportedMethods = {
  checkId(id: string): string {
    z.uuid(id)
    return id
  },
  checkString(strVal: string, varName: string): string {
    const schema = z.string()
      .min(1, `${varName} cannot be an empty string`)
      .trim()
    return schema.parse(strVal)
  },
  checkPassword(password: string): string {
    const schema = z.string()
      .min(6, 'password must be at least 6 characters long')
    return schema.parse(password)
  },
  checkBoolean(bool: string): boolean {
    const schema = z.coerce.boolean()
    return schema.parse(bool)
  },
  checkEmail(email: string): string {
    const schema = z.email().toLowerCase()
    return schema.parse(email)
  },
  checkPublicUser(userData: User): User {
    return PublicUserSchema.parse(userData)
  }
}

export default exportedMethods