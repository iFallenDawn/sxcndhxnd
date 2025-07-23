import { NextResponse, NextRequest } from "next/server"
import { createClient } from "../../../../../supabase/server"
import usersUtil from '../../../../utils/users'
import validation from '../../../../utils/validation'

export async function POST(request: NextRequest) {
  let reqBody = null
  const supabase = await createClient()
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (user) throw `User is already logged in!`
    reqBody = await request.json()

    if (!reqBody || Object.keys(reqBody).length == 0)
      throw `There are no fields in the request body`

    try {
      reqBody.email = validation.checkEmail(reqBody.email)
      reqBody.pasword = validation.checkPassword(reqBody.password)
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 400 })
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: reqBody.email,
      password: reqBody.password
    })

    if (error) throw error.message

    try {
      const loggedUser = await usersUtil.getUserByEmail(reqBody.email)
      return NextResponse.json(loggedUser, { status: 200 })
    } catch (e) {
      console.log(e)
      return NextResponse.json({ error: `User with email ${reqBody.email} not found` }, { status: 404 })
    }
  } catch (e) {
    return NextResponse.json(
      { error: e },
      { status: 400 }
    )
  }
}
