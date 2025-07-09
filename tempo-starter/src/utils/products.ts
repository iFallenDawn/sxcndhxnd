import { createClient } from '../../supabase/server'
import { Database } from '../types/supabase';
import validation from '../utils/validation'

type Product = Database['public']['Tables']['products']['Row']

const exportedMethods = {
  async getAllProducts() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('products').select()
    if (data == null || data.length == 0) throw `No products found`
    if (error) throw error
    return data
  },
  async getProductById(
    id: string
  ): Promise<Product> {
    id = validation.checkId(id)
    const supabase = await createClient()
    const { data, error } = await supabase.from('products').select().eq('id', id)
    if (data == null || data.length == 0) throw `Product with id '${id}' not found`
    if (error) throw error
    return data[0]
  },
  async createProduct(
    id: string,
    user_id: string | null,
    commission_id: string | null,
    title: string,
    description: string,
    image_url: string | null,
    price: Number,
    status: string,
    paid: boolean | null,
    drop_item: boolean | null,
    drop_title: string | null
  ): Promise<Product> {

  }
}

export default exportedMethods