import firebaseApp from '@/firebase/firebase'
import { getAuth, createUserWithEmailAndPassword, validatePassword } from 'firebase/auth'
import { userData } from '@/data/index'
import { NextResponse } from "next/server"
import validation from "@/data/validation"

export async function GET(req, { params }) {
  try {
    params.id = validation.checkId(params.id)
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }
  try {
    const user = await userData.getUserById(params.id)
    return NextResponse.json(user, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 })
  }
}