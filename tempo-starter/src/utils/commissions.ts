import { createClient } from '../../supabase/server'
import { Database } from '../types/supabase'
import validation from './validation'

type Commission = Database['public']['Tables']['commissions']['Row']

const exportedMethods = {
  /**
   * Gets all the commissions in the commissions table
   * @returns All the commissions in the commissions table
   */
  async getAllCommissions() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('commissions').select()
    if (data == null || data.length == 0) throw new Error('No commissions found')
    if (error) throw error
    return data
  },
  /**
   * Gets commission by id
   * @param id 
   * @returns The commission with the specified id
   */
  async getCommissionById(
    id: string
  ) {
    id = validation.checkId(id)
    const supabase = await createClient()
    const { data, error } = await supabase.from('commissions').select().eq('id', id)
    if (data == null || data.length == 0) throw new Error(`Commission with id '${id}' not found`)
    if (error) throw error
    return data[0]
  },
  /**
   * Creates a commission 
   * @param user_id 
   * @param product_id 
   * @param first_name 
   * @param last_name 
   * @param email 
   * @param commission_type 
   * @param piece_vision 
   * @param base_material 
   * @param creative_control 
   * @param colors 
   * @param fabrics 
   * @param shape_patterns 
   * @param distress 
   * @param retailor 
   * @returns The created commission
   */
  async createCommission(
    user_id: string | null,
    product_id: string | null,
    first_name: string,
    last_name: string,
    email: string,
    commission_type: string,
    piece_vision: string,
    base_material: boolean,
    creative_control: boolean,
    colors: string,
    fabrics: string,
    shape_patterns: string,
    distress: boolean,
    retailor: boolean
  ) {
    const supabase = await createClient()
    const id = crypto.randomUUID()
    let newCommission: Commission = {
      id: id,
      user_id: user_id ?? null,
      product_id: product_id ?? null,
      first_name: first_name,
      last_name: last_name,
      email: email,
      commission_type: commission_type,
      piece_vision: piece_vision,
      base_material: base_material,
      creative_control: creative_control,
      colors: colors,
      fabrics: fabrics,
      shape_patterns: shape_patterns,
      distress: distress,
      retailor: retailor,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    newCommission = validation.checkCommission(newCommission)
    const result = await supabase
      .from('commissions')
      .insert({ ...newCommission })
    if (result.error) throw new Error(result.error.message)
    return await this.getCommissionById(id)
  },
  /**
   * Updates a commission. If fields aren't provided, it will default to the old values
   * @param id 
   * @param user_id 
   * @param product_id 
   * @param first_name 
   * @param last_name 
   * @param email 
   * @param commission_type 
   * @param piece_vision 
   * @param base_material 
   * @param creative_control 
   * @param colors 
   * @param fabrics 
   * @param shape_patterns 
   * @param distress 
   * @param retailor 
   * @returns 
   */
  async updateCommission(
    id: string,
    user_id: string | null,
    product_id: string | null,
    first_name: string,
    last_name: string,
    email: string,
    commission_type: string,
    piece_vision: string,
    base_material: boolean,
    creative_control: boolean,
    colors: string,
    fabrics: string,
    shape_patterns: string,
    distress: boolean,
    retailor: boolean
  ) {
    id = validation.checkId(id)
    const oldCommission = await this.getCommissionById(id)
    let updatedCommission: Commission = {
      id: id,
      user_id: user_id ? user_id : oldCommission.user_id,
      product_id: product_id ? product_id : oldCommission.product_id,
      first_name: first_name ? first_name : oldCommission.first_name,
      last_name: last_name ? last_name : oldCommission.last_name,
      email: email ? email : oldCommission.email,
      commission_type: commission_type ? commission_type : oldCommission.commission_type,
      piece_vision: piece_vision ? piece_vision : oldCommission.piece_vision,
      base_material: base_material ? base_material : oldCommission.base_material,
      creative_control: creative_control ? creative_control : oldCommission.creative_control,
      colors: colors ? colors : oldCommission.colors,
      fabrics: fabrics ? fabrics : oldCommission.fabrics,
      shape_patterns: shape_patterns ? shape_patterns : oldCommission.shape_patterns,
      distress: distress ? distress : oldCommission.distress,
      retailor: retailor ? retailor : oldCommission.retailor,
      created_at: oldCommission.created_at,
      updated_at: new Date().toISOString()
    }
    updatedCommission = validation.checkCommission(updatedCommission)
    const supabase = await createClient()
    const { data, error } = await supabase.from('commissions')
      .update(updatedCommission)
      .eq('id', id)
    if (error) throw new Error(error.message)
    return await this.getCommissionById(id)
  },
  /**
   * Deletes a commission and return its data
   * @param id 
   * @returns The deleted commission
   */
  async deleteCommission(id: string): Promise<Commission> {
    id = validation.checkId(id)
    await validation.checkAdminUser()
    const commission = await this.getCommissionById(id)
    const supabase = await createClient()
    const response = await supabase.from('commissions').delete().eq('id', id)
    return commission
  }
}

export default exportedMethods