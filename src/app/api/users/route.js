import firebaseApp from '@/firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, validatePassword } from 'firebase/auth'
import { userData } from '@/data/index'
import { NextResponse } from "next/server"
import validation from "@/data/validation"

export async function GET(req) {
  try {
    const userList = await userData.getAllUsers()
    return NextResponse.json({ userList }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }
}

//user creation
export async function POST(req) {
  let reqBody = null
  try {
    reqBody = await req.json()
    if (!reqBody || Object.keys(reqBody).length == 0) {
      return NextResponse.json(
        { error: "There are no fields in the request body" },
        { status: 400 }
      )
    }
    //validate password
    const auth = getAuth(firebaseApp)
    try {
      const status = await validatePassword(auth, reqBody.password)
      let errors = []
      if (!status.isValid) {
        if (!status.containsLowercaseLetter)
          errors.push('Password requires at least one lowercase letter')
        if (!status.containsUppercaseLetter)
          errors.push('Password requires at least one uppercase character')
        if (!status.containsNonAlphanumericCharacter)
          errors.push('Password requires at least one special character')
        if (!status.containsNumericCharacter)
          errors.push('Password requires at least one number')
        if (!status.meetsMinPasswordLength)
          errors.push('Password needs to contain at least 8 characters')
      }
      if (errors.length > 0)
        throw errors
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 400 })
    }
    //validate all the user fields
    let newReqBody = {}
    try {
      newReqBody = validation.validateUserFields(reqBody)
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 400 })
    }

    //create the user in firebase auth
    let firebaseAuthId = ''
    try {
      const createFirebaseUser = await createUserWithEmailAndPassword(auth, newReqBody.email, reqBody.password)
      firebaseAuthId = createFirebaseUser.user.uid
    } catch (e) {
      let error = ''
      if (e.code === 'auth/email-already-in-use')
        error = 'This email already has an account!'
      else if (e.code === 'auth/invalid-email')
        error = 'Invalid email'
      else if (e.code === 'auth/weak-password')
        error = 'Password is too weak'
      return NextResponse.json({ error: error }, { status: 400 })
    }

    //create the user in firestore collection
    try {
      const newUser = await userData.createUser(newReqBody, firebaseAuthId)
      return NextResponse.json(newUser, { status: 200 })
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 500 })
    }
  } catch (e) {
    return NextResponse.json(
      { error: "There is no request body" },
      { status: 400 }
    )
  }
}