import { createClient } from '../../supabase/server'
import { Database } from '../types/supabase';
import validation from './validation'

type Product = Database['public']['Tables']['products']['Row']

const exportedMethods = {
  /**
   * Gets all the products in the products table
   * @returns All the products in the products table
   */
  async getAllProducts() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('products').select()
    if (data == null || data.length == 0) throw new Error(`No products found`)
    if (error) throw error
    return data
  },
  /**
   * Gets product by id
   * @param id 
   * @returns The product with the specified id
   */
  async getProductById(
    id: string
  ): Promise<Product> {
    id = validation.checkId(id)
    const supabase = await createClient()
    const { data, error } = await supabase.from('products').select().eq('id', id)
    if (data == null || data.length == 0) throw new Error(`Product with id '${id}' not found`)
    if (error) throw error
    return data[0]
  },
  /**
   * Bare minimum, Nico needs title, description, price, status, and 
   * image_url to create a product
   * @param user_id 
   * @param commission_id 
   * @param title 
   * @param description 
   * @param image_urls 
   * @param price 
   * @param status 
   * @param paid 
   * @param drop_item 
   * @param drop_title 
   * @returns The created product
   */
  async createProduct(
    user_id: string | null,
    commission_id: string | null,
    title: string,
    description: string,
    image_urls: string[],
    price: number,
    status: string, //sold, reserved, display, or available
    paid: boolean | null,
    drop_item: boolean | null,
    drop_title: string | null,
    category: string | null,
    size: string | null
  ): Promise<Product> {
    const supabase = await createClient()
    const adminId = await validation.checkAdminUser()
    const id = crypto.randomUUID()
    let newProduct: Product = {
      id: id,
      user_id: user_id ?? null,
      commission_id: commission_id ?? null,
      title: title,
      description: description,
      image_urls: image_urls,
      price: price,
      status: status,
      paid: paid ?? null,
      drop_item: drop_item ?? null,
      drop_title: drop_title ?? null,
      category: category,
      size: size ?? null,
      created_by: adminId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    newProduct = validation.checkProduct(newProduct)
    const result = await supabase
      .from('products')
      .insert({ ...newProduct })
    if (result.error) throw new Error(result.error.message)
    return await this.getProductById(id)
  },
  /**
   * Updates a product. If fields aren't provided, it will default to the old values.
   * @param id 
   * @param user_id 
   * @param commission_id 
   * @param title 
   * @param description 
   * @param image_urls 
   * @param price 
   * @param status 
   * @param paid 
   * @param drop_item 
   * @param drop_title 
   * @param category 
   * @param size 
   * @returns The updated product
   */
  async updateProduct(
    id: string,
    user_id: string | null,
    commission_id: string | null,
    title: string,
    description: string,
    image_urls: string[],
    price: number,
    status: string, //sold, reserved, display, or available
    paid: boolean | null,
    drop_item: boolean | null,
    drop_title: string | null,
    category: string | null,
    size: string | null
  ) {
    id = validation.checkId(id)
    const oldProduct = await this.getProductById(id)
    let updatedProduct: Product = {
      id: id,
      user_id: user_id ? user_id : oldProduct.user_id,
      commission_id: commission_id ? commission_id : oldProduct.commission_id,
      title: title ? title : oldProduct.title,
      description: description ? description : oldProduct.description,
      image_urls: image_urls ? image_urls : oldProduct.image_urls,
      price: price ? price : oldProduct.price,
      status: status ? status : oldProduct.status,
      paid: paid ? paid : oldProduct.paid,
      drop_item: drop_item ? drop_item : oldProduct.drop_item,
      drop_title: drop_title ? drop_title : oldProduct.drop_title,
      created_at: oldProduct.created_at,
      created_by: oldProduct.created_by,
      updated_at: new Date().toISOString(),
      category: category ? category : oldProduct.category,
      size: size ? size : oldProduct.size
    }
    updatedProduct = validation.checkProduct(updatedProduct)

    const supabase = await createClient()
    const { data, error } = await supabase.from('products')
      .update(updatedProduct)
      .eq('id', id)
    if (error) throw new Error(error.message)
    return await this.getProductById(id)
  },
  /**
   * Deletes a product and returns its data
   * @param id 
   * @returns The deleted product
   */
  async deleteProduct(id: string): Promise<Product> {
    id = validation.checkId(id)
    const product = await this.getProductById(id)
    const supabase = await createClient()
    const response = await supabase.from('products').delete().eq('id', id)
    return product
  }
}

export default exportedMethods