import { NextResponse, NextRequest } from "next/server"
import { createClient } from '../../../../../supabase/server'
import usersUtil from '../../../../utils/users'
import validation from '../../../../utils/validation'
import { create } from "domain"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    validation.checkId(params.id)
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }

  try {
    const user = await usersUtil.getUserById(params.id)
    return NextResponse.json(user, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {

  let reqBody = await request.json()
  if (!reqBody || Object.keys(reqBody).length == 0) {
    return NextResponse.json(
      { error: 'There are no fields in the request body' },
      { status: 400 }
    )
  }
  try {
    await validation.checkUserSignedIn()
    params.id = validation.checkId(params.id)
    reqBody.first_name = validation.checkString(reqBody.first_name, 'First name')
    reqBody.last_name = validation.checkString(reqBody.last_name, 'Last name')
    reqBody.instagram = validation.checkString(reqBody.instagram, 'Instagram')
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }

  try {
    const user = await usersUtil.updateUserNoEmail(params.id, reqBody.first_name, reqBody.last_name, reqBody.instagram)
    return NextResponse.json(user, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 })
  }
}

