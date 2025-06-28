import { createClient } from '../../supabase/server'
import { Database } from '../types/supabase';

type User = Database['public']['Tables']['users']['Row'];

const exportedMethods = {
  async getUserById(
    id: string
  ) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('users').select().eq('id', id)
    if (data == null || data.length == 0) throw `Error: User with id '${id}' not found`
    if (error) throw error
    return data[0]
  },
  async updateUser(
    userInfo: User
  ) {
    await this.getUserById(userInfo.id)
    const supabase = await createClient()
    const { error } = await supabase.from('users').update(userInfo).eq('id', userInfo.id)
    if (error) throw `Error: ${error}`
    return userInfo
  }
}
export default exportedMethods