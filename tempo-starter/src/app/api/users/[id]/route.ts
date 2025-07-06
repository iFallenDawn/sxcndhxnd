import { NextResponse } from "next/server"
import { Database } from '../../../../types/supabase'
import usersUtil from '../../../../utils/users'
import validation from '../../../../utils/validation'

type User = Database['public']['Tables']['users']['Row'];

export async function GET(request: Request, context: { params: User }) {
  try {
    validation.checkId(context.params.id)
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }

  try {
    const user = await usersUtil.getUserById(context.params.id)
    return NextResponse.json(user, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 })
  }
}

export async function PUT(request: Request, context: { params: User }) {
  try {
    validation.checkPublicUser(context.params)
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }

  try {
    const user = await usersUtil.updateUser(context.params)
    return NextResponse.json(user, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 })
  }
}

export async function DELETE(request: Request, context: { params: User }) {
  try {

  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 })
  }
}

