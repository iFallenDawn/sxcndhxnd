import usersUtil from '../../../../utils/users'
import { NextResponse } from "next/server"
import { Database } from '../../../../types/supabase'

type User = Database['public']['Tables']['users']['Row'];

export async function GET(request: Request, context: { params: User }) {
  try {
    const user = await usersUtil.getUserById(context.params.id)
    return NextResponse.json(user, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 })
  }
}

export async function PATCH(request: Request, context: { params: User }) {
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

