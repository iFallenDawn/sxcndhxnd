import { z } from 'zod/v4'
import { Database } from '../types/supabase'
import { createClient } from '../../supabase/server'

type User = Database['public']['Tables']['users']['Row'];
type Product = Database['public']['Tables']['products']['Row']
const zodNoEmptyString = z.string().min(1, `cannot be an empty string`).trim()

const PublicUserSchema = z.object({
  id: z.uuid(),
  first_name: zodNoEmptyString,
  last_name: zodNoEmptyString,
  email: z.email().toLowerCase(),
  instagram: zodNoEmptyString,
  updated_at: z.coerce.date().transform(date => date.toISOString()),
  created_at: z.coerce.date().transform(date => date.toISOString())
})

const ProductSchema = z.object({
  id: z.uuid(),
  user_id: zodNoEmptyString.nullable(),
  commission_id: zodNoEmptyString.nullable(),
  title: zodNoEmptyString,
  description: zodNoEmptyString,
  image_url: zodNoEmptyString.nullable(),
  price: z.coerce.number().gt(0),
  status: zodNoEmptyString,
  paid: z.coerce.boolean().nullable(),
  drop_item: z.coerce.boolean().nullable(),
  drop_title: zodNoEmptyString.nullable(),
  updated_at: z.coerce.date().transform(date => date.toISOString()),
  created_at: z.coerce.date().transform(date => date.toISOString())
})

const exportedMethods = {
  checkId(id: string): string {
    const schema = z.uuid()
    const result = schema.safeParse(id)
    if (!result.success) throw z.prettifyError(result.error)
    return result.data
  },
  checkString(strVal: string, varName: string): string {
    const schema = z.string()
      .min(1, `${varName} cannot be an empty string`)
      .trim()
    const result = schema.safeParse(strVal)
    if (!result.success) throw z.prettifyError(result.error)
    return result.data
  },
  checkPassword(password: string): void {
    const schema = z.string()
      .min(6, 'password must be at least 6 characters long')
    const result = schema.safeParse(password)
    if (!result.success) throw z.prettifyError(result.error)
  },
  checkBoolean(bool: string): boolean {
    const schema = z.coerce.boolean()
    const result = schema.safeParse(bool)
    if (!result.success) throw z.prettifyError(result.error)
    return result.data
  },
  checkEmail(email: string): string {
    const schema = z.email().toLowerCase()
    const result = schema.safeParse(email)
    if (!result.success) throw z.prettifyError(result.error)
    return result.data
  },
  checkNumber(number: string): Number {
    const schema = z.coerce.number()
    const result = schema.safeParse(number)
    if (!result.success) throw z.prettifyError(result.error)
    return result.data
  },
  checkPrice(price: string): Number {
    // price cannot be less than 0
    const schema = z.coerce.number().gt(0)
    const result = schema.safeParse(price)
    if (!result.success) throw z.prettifyError(result.error)
    return result.data
  },
  checkPublicUser(userData: User): User {
    const result = PublicUserSchema.safeParse(userData)
    if (!result.success) throw z.prettifyError(result.error)
    return result.data
  },
  async checkIsUserSignedIn() {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    //user must be signed in to update
    if (!user) {
      throw `User is not signed in!`
    }
    return user
  },
  checkProduct(productData: Product): Product {
    const result = ProductSchema.safeParse(productData)
    if (!result.success) throw z.prettifyError(result.error)
    return result.data
  }
}

export default exportedMethods