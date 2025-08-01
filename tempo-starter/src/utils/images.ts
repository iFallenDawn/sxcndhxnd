import { createClient } from '../../supabase/server'
import { v4 as uuidv4 } from 'uuid'
import validation from './validation'

const exportedMethods = {
  async getPublicImageUrl(filePath: string): Promise<string> {
    validation.checkString(filePath, 'Image file path')
    const supabase = await createClient()
    const { data } = supabase.storage.from('product-images').getPublicUrl(
      filePath
    )
    return data.publicUrl
  },
  async createImage(image: File, id: string | null) {
    validation.checkImageType(image)
    await validation.checkAdminUser()

    if (!id) id = uuidv4()

    const fileExtension = image.name.split('.').pop()
    const fileName = `${id}.${fileExtension}`
    const filePath = `products/${fileName}`

    const supabase = await createClient()
    const { data, error } = await supabase.storage.from('product-images').upload(
      filePath, image, {
      cacheControl: '3600',
      upsert: false
    })
    if (error) throw new Error(error.message)
    const publicUrl = await this.getPublicImageUrl(filePath)
    return {
      ...data,
      publicUrl: publicUrl
    }
  }
}

export default exportedMethods