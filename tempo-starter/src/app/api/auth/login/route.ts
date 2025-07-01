import { NextResponse } from "next/server"
import { createClient } from "../../../../../supabase/server"
import usersUtil from '../../../../utils/users'

export async function POST(request: Request) {
  let reqBody = null
  const supabase = await createClient()
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (user) throw `Error: User is already logged in!`
    reqBody = await request.json()
    if (!reqBody || Object.keys(reqBody).length == 0)
      throw `Error: There are no fields in the request body`
    const { error } = await supabase.auth.signInWithPassword({
      email: reqBody.email,
      password: reqBody.password
    })
    if (error) throw `Error: ${error}`
    try {
      const loggedUser = await usersUtil.getUserByEmail(reqBody.email)
      return NextResponse.json(loggedUser, { status: 200 })
    } catch (e) {
      return NextResponse.json({ error: `User with email ${reqBody.email} not found` }, { status: 404 })
    }
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { error: e },
      { status: 400 }
    )
  }
}
