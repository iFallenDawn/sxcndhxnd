import { createClient } from '../../supabase/server'
import { Database } from '../types/supabase';
import validation from '../utils/validation'

type User = Database['public']['Tables']['users']['Row'];

const exportedMethods = {
  async getUserById(
    id: string
  ): Promise<User> {
    id = validation.checkId(id)
    const supabase = await createClient()
    const { data, error } = await supabase.from('users').select().eq('id', id)
    if (data == null || data.length == 0) throw `User with id '${id}' not found`
    if (error) throw error
    return data[0]
  },
  async getUserByEmail(
    email: string
  ): Promise<User> {
    email = validation.checkEmail(email)
    const supabase = await createClient()
    const { data, error } = await supabase.from('users').select().eq('email', email)
    if (data == null || data.length == 0) throw `User with email '${email}' not found`
    if (error) throw error
    return data[0]
  },
  async createUserFromAuth(
    first_name: string,
    last_name: string,
    instagram: string,
    email: string,
    password: string
  ) {
    first_name = validation.checkString(first_name, 'First name')
    last_name = validation.checkString(last_name, 'Last name')
    instagram = validation.checkString(instagram, 'Instagram')
    email = validation.checkEmail(email)
    password = validation.checkString(password, 'Password')
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error.message
    const id = user?.id || ''
    validation.checkId(id)
    return await this.createPublicUser(id, first_name, last_name, instagram, email)
  },
  async createPublicUser(
    id: string,
    first_name: string,
    last_name: string,
    instagram: string,
    email: string
  ): Promise<User> {
    const newUser: User = {
      id: id,
      first_name: first_name,
      last_name: last_name,
      instagram: instagram,
      email: email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    validation.checkPublicUser(newUser)
    const supabase = await createClient()
    const { error } = await supabase
      .from('users')
      .insert({ ...newUser })
    if (error) throw error.message
    return await this.getUserById(newUser.id)
  },
  async updateUserNoEmail(
    id: string,
    first_name: string,
    last_name: string,
    instagram: string,
  ) {
    const supabase = await createClient()
    const user = await validation.checkUserSignedIn()
    if (user.id !== id) {
      throw `You are not signed in as this user`
    }

    const updateData = {
      id: validation.checkId(id),
      first_name: validation.checkString(first_name, 'First name'),
      last_name: validation.checkString(last_name, 'Last name'),
      instagram: validation.checkString(instagram, 'Instagram')
    }

    // handle email update in a separate method
    const updatePublicUsers = await supabase.from('users')
      .update(updateData)
      .eq('id', user.id)
    if (updatePublicUsers.error) throw updatePublicUsers.error.message
    return await this.getUserById(id)
  }
}
export default exportedMethods