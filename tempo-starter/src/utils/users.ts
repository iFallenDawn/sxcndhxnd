import { createClient } from '../../supabase/server'
import { Database } from '../types/supabase';

type User = Database['public']['Tables']['users']['Row'];
type UserUpdateRequest = {
  id: string,
} & Partial<Pick<User, 'email' | 'first_name' | 'last_name' | 'full_name' | 'instagram'>>

const exportedMethods = {
  async getUserById(
    id: string
  ): Promise<User> {
    const supabase = await createClient()
    const { data, error } = await supabase.from('users').select().eq('id', id)
    if (data == null || data.length == 0) throw `Error: User with id '${id}' not found`
    if (error) throw error
    return data[0]
  },
  async updateUser(
    newUserInfo: UserUpdateRequest
  ) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    //user must be signed in to update
    if (!user) {
      throw `Error: User is not signed in!`
    }
    const publicUsersData = await this.getUserById(newUserInfo.id)
    interface updateData {
      first_name?: string;
      last_name?: string;
      full_name?: string;
      instagram?: string;
    }
    const email = newUserInfo.email
    const firstName = newUserInfo.first_name
    const lastName = newUserInfo.last_name
    const instagram = newUserInfo.instagram
    const updatedData: updateData = {}
    if (firstName) updatedData.first_name = firstName
    if (lastName) updatedData.last_name = lastName
    if (firstName && lastName) {
      updatedData.full_name = `${firstName} ${lastName}`
    }
    else if (publicUsersData.first_name && lastName) {
      updatedData.full_name = `${publicUsersData.first_name} ${lastName}`
    }
    else if (firstName && publicUsersData.last_name) {
      updatedData.full_name = `${firstName} ${publicUsersData.last_name}`
    }
    if (instagram) updatedData.instagram = instagram
    const { data, error } = await supabase.auth.updateUser({
      email: email ? email : user.email,
      data: {
        ...updatedData
      }
    })
    if (error) throw `Error: ${error}`
    return await this.getUserById(newUserInfo.id)
  }
}
export default exportedMethods