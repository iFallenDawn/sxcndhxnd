import { Schema, z } from 'zod'
import { Database } from '../types/supabase'
import { createClient } from '../../supabase/server'

type User = Database['public']['Tables']['users']['Row'];
type Product = Database['public']['Tables']['products']['Row']
type Commission = Database['public']['Tables']['commissions']['Row']
const zodNoEmptyString = z.string().min(1, `cannot be an empty string`).trim()

const PublicUserSchema = z.object({
  id: z.string().uuid(),
  first_name: zodNoEmptyString,
  last_name: zodNoEmptyString,
  email: z.string().email().toLowerCase(),
  instagram: zodNoEmptyString,
  updated_at: z.coerce.date().transform(date => date.toISOString()),
  created_at: z.coerce.date().transform(date => date.toISOString())
})

const ProductSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  commission_id: z.string().uuid().nullable(),
  title: zodNoEmptyString,
  description: zodNoEmptyString,
  image_urls: z.array(z.string().min(1, `cannot be an empty string`)),
  price: z.coerce.number().gt(0),
  status: zodNoEmptyString,
  paid: z.coerce.boolean().nullable(),
  drop_item: z.coerce.boolean().nullable(),
  drop_title: z.string().nullable(),
  updated_at: z.coerce.date().transform(date => date.toISOString()),
  created_at: z.coerce.date().transform(date => date.toISOString()),
  created_by: z.string().uuid(),
  category: zodNoEmptyString,
  size: z.string().nullable()
})

const CommissionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  product_id: z.string().uuid().nullable(),
  first_name: zodNoEmptyString,
  last_name: zodNoEmptyString,
  email: zodNoEmptyString,
  commission_type: zodNoEmptyString,
  piece_vision: zodNoEmptyString,
  base_material: z.coerce.boolean(),
  creative_control: z.coerce.boolean(),
  colors: zodNoEmptyString,
  fabrics: zodNoEmptyString,
  shape_patterns: zodNoEmptyString,
  distress: z.coerce.boolean(),
  retailor: z.coerce.boolean(),
  updated_at: z.coerce.date().transform(date => date.toISOString()),
  created_at: z.coerce.date().transform(date => date.toISOString()),
  pockets: z.coerce.boolean(),
  weekly_checkins: z.coerce.boolean(),
  extra: z.string().nullable(),
  symmetry_type: zodNoEmptyString
})

const exportedMethods = {
  checkId(id: string): string {
    const schema = z.string().uuid()
    const result = schema.safeParse(id)
    if (!result.success) throw new Error(result.error.message)
    return result.data
  },
  checkString(strVal: string, varName: string): string {
    const schema = z.string()
      .min(1, `${varName} cannot be an empty string`)
      .trim()
    const result = schema.safeParse(strVal)
    if (!result.success) throw new Error(result.error.message)
    return result.data
  },
  checkArrayOfStrings(stringArray: string[], varName: string) {
    const schema = z.array(z.string().min(1, "String cannot be empty"))
      .min(1, "Array cannot be empty");
    const result = schema.safeParse(stringArray)
    if (!result.success) throw new Error(`Invalid array of ${varName}`)
    return result.data
  },
  checkPassword(password: string): void {
    const schema = z.string()
      .min(6, 'password must be at least 6 characters long')
    const result = schema.safeParse(password)
    if (!result.success) throw new Error(result.error.message)
  },
  checkBoolean(bool: string): boolean {
    const schema = z.coerce.boolean()
    const result = schema.safeParse(bool)
    if (!result.success) throw new Error(result.error.message)
    return result.data
  },
  checkEmail(email: string): string {
    const schema = z.string().email().toLowerCase()
    const result = schema.safeParse(email)
    if (!result.success) throw new Error(result.error.message)
    return result.data
  },
  checkNumber(number: string): Number {
    const schema = z.coerce.number()
    const result = schema.safeParse(number)
    if (!result.success) throw new Error(result.error.message)
    return result.data
  },
  checkPrice(price: string): number {
    // price cannot be less than 0
    const schema = z.coerce.number().gt(0)
    const result = schema.safeParse(price)
    if (!result.success) throw new Error('Price cannot be less than $0')
    return result.data
  },
  checkPublicUser(userData: User): User {
    const result = PublicUserSchema.safeParse(userData)
    if (!result.success) throw new Error(result.error.message)
    return result.data
  },
  async checkIsUserSignedIn() {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    //user must be signed in to update
    if (!user) {
      throw new Error(`User is not signed in!`)
    }
    return user
  },
  checkStatus(status: string): string {
    this.checkString(status, 'status')
    const schema = z.enum(['sold', 'reserved', 'archive', 'available'])
    const result = schema.safeParse(status.toLowerCase())
    if (!result.success) throw new Error('Status must be one of the following: Sold, Reserved, Display, or Available')
    return result.data
  },
  checkProduct(productData: Product): Product {
    const result = ProductSchema.safeParse(productData)
    if (!result.success) throw new Error(result.error.message)
    return result.data
  },
  checkImageType(image: File): File {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedImageTypes.includes(image.type)) {
      throw new Error('Invalid file type. Only jpeg, jpg, png, webp, and gif are allowed')
    }
    return image
  },
  async checkAdminUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (!user || error) {
      throw new Error('User is not signed in')
    }
    const result = await supabase.from('users_roles').select().eq('id', user.id)
    if (!result || result?.data?.length == 0) {
      throw new Error('Insufficient permissions to upload an image')
    }
    return user.id
  },
  checkCommissionType(commissionType: string): string {
    this.checkString(commissionType, 'commission type')
    const schema = z.enum(['pants', 'outerwear', 'tops', 'accessories', 'patchwork', 'hemming', 'other'])
    const result = schema.safeParse(commissionType.toLowerCase())
    if (!result.success) throw new Error('Commission type must be one of the following: Pants, Outerwear, Tops, Accessories, Patchwork, Hemming, or Other')
    return result.data
  },
  checkCommission(commission: Commission): Commission {
    const result = CommissionSchema.safeParse(commission)
    if (!result.success) throw new Error(result.error.message)
    return result.data
  },
  checkSymmetryType(symmetryType: string): string {
    this.checkString(symmetryType, 'piece vision')
    const schema = z.enum(['symmetrical', 'asymmetrical', 'mix', 'other'])
    const result = schema.safeParse(symmetryType.toLowerCase())
    if (!result.success) throw new Error('Symmetry type must be one of the following: Symmetrical, Asymmetrical, Mix, or Other')
    return result.data
  }
}

export default exportedMethods