import { datetime } from 'zod/v4/core/regexes';
import { createClient } from '../../supabase/server'
import { Database } from '../types/supabase';
import validation from '../utils/validation'

type User = Database['public']['Tables']['users']['Row'];

const exportedMethods = {
  async getUserById(
    id: string
  ): Promise<User> {
    validation.checkId(id)
    const supabase = await createClient()
    const { data, error } = await supabase.from('users').select().eq('id', id)
    if (data == null || data.length == 0) throw `User with id '${id}' not found`
    if (error) throw error
    return data[0]
  },
  async getUserByEmail(
    email: string
  ): Promise<User> {
    validation.checkEmail(email)
    const supabase = await createClient()
    const { data, error } = await supabase.from('users').select().eq('email', email)
    if (data == null || data.length == 0) throw `User with email '${email}' not found`
    if (error) throw error
    return data[0]
  },
  async createUserFromAuth(
    firstName: string,
    lastName: string,
    instagram: string,
    email: string,
    password: string
  ) {
    validation.checkString(firstName, 'First name')
    validation.checkString(lastName, 'Last name')
    validation.checkString(instagram, 'Instagram')
    validation.checkString(email, 'Email')
    validation.checkString(password, 'Password')
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error.message
    const id = user?.id || ''
    validation.checkId(id)
    return await this.createPublicUser(id, firstName, lastName, instagram, email, password)
  },
  async createPublicUser(
    id: string,
    firstName: string,
    lastName: string,
    instagram: string,
    email: string,
    password: string
  ): Promise<User> {
    validation.checkPassword(password)
    const newUser: User = {
      id: id,
      first_name: firstName,
      last_name: lastName,
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
  async updateUser(
    newUserInfo: User
  ) {
    validation.checkPublicUser(newUserInfo)
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    //user must be signed in to update
    if (!user) {
      throw `User is not signed in!`
    }
    // cannot handle email update from here, have to do it in a trigger
    const { email, ...newUserInfoNoEmail } = newUserInfo
    const updatePublicUsers = await supabase.from('users')
      .update(newUserInfoNoEmail)
      .eq('id', user.id)
    if (updatePublicUsers.error) throw updatePublicUsers.error.message
    return await this.getUserById(newUserInfo.id)
  }
}
export default exportedMethods