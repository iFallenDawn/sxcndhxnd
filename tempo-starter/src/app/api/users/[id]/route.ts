import { NextResponse, NextRequest } from "next/server"
import usersUtil from '../../../../utils/users'
import validation from '../../../../utils/validation'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    params.id = validation.checkId(params.id)
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }

  try {
    const user = await usersUtil.getUserById(params.id)
    return NextResponse.json(user, { status: 200 })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 404 })
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
    await validation.checkIsUserSignedIn()
    params.id = validation.checkId(params.id)
    if (reqBody.first_name) {
      reqBody.first_name = validation.checkString(reqBody.first_name, 'First name')
    }

    if (reqBody.last_name) {
      reqBody.last_name = validation.checkString(reqBody.last_name, 'Last name')
    }

    if (reqBody.instagram) {
      reqBody.instagram = validation.checkString(reqBody.instagram, 'Instagram')
    }

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }

  try {
    const user = await usersUtil.updateUserNoEmail(
      params.id,
      reqBody.first_name,
      reqBody.last_name,
      reqBody.instagram
    )
    return NextResponse.json(user, { status: 200 })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}

// note, NEED TO BE ADMIN FOR THIS ROUTE TO WORK PROPERLY, otherwise it wont delete from auth
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      params.id = validation.checkId(params.id)
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    try {
      await usersUtil.getUserById(params.id)
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      return NextResponse.json({ error: errorMessage }, { status: 404 })
    }

    try {
      const deletedUser = await usersUtil.deleteUser(params.id)
      return NextResponse.json(deletedUser, { status: 200 })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 404 })
  }
}

