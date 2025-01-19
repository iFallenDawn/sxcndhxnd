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

export async function PUT(req, { params }) {
  try {
    let reqBody = await req.json();

    if (!reqBody || Object.keys(reqBody).length === 0) {
      return NextResponse.json(
        { error: 'There are no fields in the request body' },
        { status: 400 }
      );
    }
    let updatedReqBody = null
    try {
      params.id = validation.checkId(params.id)
      updatedReqBody = validation.validateUserFields(reqBody)
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 400 })
    }
    try {
      const updatedUser = await userData.updateUserPut(params.id, updatedReqBody)
      return NextResponse.json(updatedUser, { status: 200 })
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 404 });
    }
  } catch (e) {
    return NextResponse.json(
      { error: 'There is no request body' },
      { status: 400 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    let reqBody = await req.json()

    if (!reqBody || Object.keys(reqBody).length === 0) {
      return NextResponse.json(
        { error: 'There are no fields in the request body' },
        { status: 400 }
      )
    }
    const updatedReqBody = {}
    try {
      params.id = validation.checkId(params.id)
      for (const [key, value] of Object.entries(reqBody)) {
        if (validation.validateUserKey(key)) {
          const userArrayData = ['commissionIds', 'productIds']
          if (userArrayData.includes(key)) {
            updatedReqBody[key] = validation.checkStringArray(value, key)
          }
          else {
            updatedReqBody[key] = validation.checkString(value, key)
          }
        }
      }
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 400 })
    }
    try {
      const updatedUser = await userData.updateUserPatch(params.id, updatedReqBody)
      return NextResponse.json(updatedUser, { status: 200 })
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 404 })
    }
  } catch (e) {
    return NextResponse.json(
      { error: 'There is no request body' },
      { status: 400 }
    )
  }
}

export async function DELETE(req, { params }) {
  //check the id
  try {
    params.id = validation.checkId(params.id)
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }
  //try to delete post
  try {
    let deletedUser = await userData.deleteUser(params.id)
    return NextResponse.json(deletedUser, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 })
  }
}