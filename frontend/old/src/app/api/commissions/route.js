import { commissionData } from "@/data/index"
import { NextResponse } from "next/server"
import validation from "@/data/validation"

// have to decide if we want to protect this route later on
export async function GET(req) {
  try {
    const commissionList = await commissionData.getAllCommissions()
    return NextResponse.json({ commissionList }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }
}

// commission creation, still need to check if there's an authorized user, attach the userId to that commission
export async function POST(req) {
  let reqBody = null
  try {
    reqBody = await req.json()
    if (!reqBody || Object.keys(reqBody).length === 0) {
      return NextResponse.json(
        { error: "There are no fields in the request body" },
        { status: 400 }
      )
    }
    // validate all the variables
    try {
      reqBody = validation.validateCommissionFields(reqBody)
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 400 })
    }

    try {
      const newCommission = await commissionData.createCommission(reqBody)
      return NextResponse.json(newCommission, { status: 200 })
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

