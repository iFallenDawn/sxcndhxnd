import { createClient } from '../../supabase/server'
import validation from './validation'

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  price: string;
  size?: string;
  status: 'available' | 'sold' | 'reserved';
  original_brand?: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
}

const exportedMethods = {
  /**
   * Gets all gallery items
   * @returns All the gallery items
   */
  async getAllGalleryItems() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('gallery_items').select().order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  /**
   * Gets gallery item by id
   * @param id 
   * @returns The gallery item with the specified id
   */
  async getGalleryItemById(id: string): Promise<GalleryItem> {
    id = validation.checkId(id)
    const supabase = await createClient()
    const { data, error } = await supabase.from('gallery_items').select().eq('id', id).single()
    if (!data) throw new Error(`Gallery item with id '${id}' not found`)
    if (error) throw error
    return data
  },

  /**
   * Creates a gallery item
   * @param title 
   * @param description 
   * @param category 
   * @param price 
   * @param size 
   * @param status 
   * @param original_brand 
   * @param image_urls 
   * @returns The created gallery item
   */
  async createGalleryItem(
    title: string,
    description: string,
    category: string,
    price: string,
    size: string | null,
    status: 'available' | 'sold' | 'reserved',
    original_brand: string | null,
    image_urls: string[]
  ): Promise<GalleryItem> {
    const supabase = await createClient()
    const adminId = await validation.checkAdminUser()
    
    const newItem = {
      title,
      description,
      category,
      price,
      size: size || null,
      status,
      original_brand: original_brand || null,
      image_urls,
      created_by: adminId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('gallery_items')
      .insert(newItem)
      .select()
      .single()
      
    if (error) throw new Error(error.message)
    return data
  },

  /**
   * Updates a gallery item
   * @param id 
   * @param updates 
   * @returns The updated gallery item
   */
  async updateGalleryItem(
    id: string,
    updates: Partial<Omit<GalleryItem, 'id' | 'created_at' | 'created_by'>>
  ): Promise<GalleryItem> {
    id = validation.checkId(id)
    await validation.checkAdminUser()
    
    const supabase = await createClient()
    
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('gallery_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
      
    if (error) throw new Error(error.message)
    return data
  },

  /**
   * Deletes a gallery item
   * @param id 
   * @returns Success message
   */
  async deleteGalleryItem(id: string) {
    id = validation.checkId(id)
    await validation.checkAdminUser()
    
    const supabase = await createClient()
    const { error } = await supabase
      .from('gallery_items')
      .delete()
      .eq('id', id)
      
    if (error) throw new Error(error.message)
    return { success: true, message: 'Gallery item deleted successfully' }
  }
}

export default exportedMethods