import firebaseApp from '@/firebase/firebase'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { userData } from '@/data/index'
import validation from '@/data/validation'
import { NextResponse } from 'next/server'

//logging user in
export async function POST(req) {
  let reqBody = null
  try {
    const auth = getAuth(firebaseApp)
    if (auth.currentUser) throw 'User already logged in!'
    reqBody = await req.json()
    if (!reqBody || Object.keys(reqBody).length == 0) {
      return NextResponse.json(
        { error: "There are no fields in the request body" },
        { status: 400 }
      )
    }
    //validate email and password
    try {
      reqBody.email = validation.checkEmail(reqBody.email)
      reqBody.password = validation.checkPassword(reqBody.password)
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 400 })
    }
    //login the user
    try {
      await signInWithEmailAndPassword(auth, reqBody.email, reqBody.password)
    } catch (e) {
      let error = 'Unknown error'
      if (e.code === 'auth/invalid-email')
        error = 'This email is not valid'
      if (e.code === 'auth/user-disabled')
        error = 'This email has been disabled'
      if (e.code === 'auth/user-not-found')
        error = 'There is no user with this email'
      if (e.code === 'auth/wrong-password')
        error = 'Invalid password'
      if (e.code === 'auth/invalid-credential')
        error = 'Invalid credentials'
      return NextResponse.json({ error: error }, { status: 400 })
    }
    //return the user data
    try {
      const loggedUser = await userData.getUserByEmail(reqBody.email)
      return NextResponse.json(loggedUser, { status: 200 })
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 404 })
    }
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { error: e },
      { status: 400 }
    )
  }
}