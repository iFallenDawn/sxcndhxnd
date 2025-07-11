import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '../../../../../supabase/server'
import usersUtil from '../../../../utils/users'
import validation from '../../../../utils/validation'

export async function POST(request: NextRequest) {
  let reqBody = null
  const supabase = await createClient()
  try {
    reqBody = await request.json()
    if (!reqBody || Object.keys(reqBody).length == 0)
      throw `There are no fields in the request body`

    try {
      reqBody.first_name = validation.checkString(reqBody.first_name, 'First name')
      reqBody.last_name = validation.checkString(reqBody.last_name, 'Last name')
      reqBody.instagram = validation.checkString(reqBody.instagram, 'Instagram')
      reqBody.email = validation.checkEmail(reqBody.email)
      validation.checkPassword(reqBody.password)
      const userExists = await usersUtil.checkUserWithEmailExists(reqBody.email)
      if (userExists) throw `User with email ${reqBody.email} already exists`
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 400 })
    }

    const { data: { user }, error } = await supabase.auth.signUp({
      email: reqBody.email,
      password: reqBody.password
    })

    if (error) {
      console.log(error)
      throw error.message
    }

    const id = user?.id || ''
    validation.checkId(id)

    let newUser = await usersUtil.createPublicUser(
      id,
      reqBody.first_name,
      reqBody.last_name,
      reqBody.instagram,
      reqBody.email
    )
    return NextResponse.json(newUser, { status: 200 })
  } catch (e) {
    return NextResponse.json(
      { error: e },
      { status: 400 }
    )
  }
}