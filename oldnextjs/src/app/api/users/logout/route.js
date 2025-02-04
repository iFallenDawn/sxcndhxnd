import firebaseApp from '@/firebase/firebase'
import { getAuth, signOut } from 'firebase/auth'
import { NextResponse } from 'next/server'

//logging user out
export async function GET(req) {
  try {
    const auth = getAuth(firebaseApp)
    if (!auth.currentUser) throw 'User is not logged in'
    await signOut(auth)
    return NextResponse.json({ message: 'User logged out' }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { error: e },
      { status: 400 }
    )
  }
}