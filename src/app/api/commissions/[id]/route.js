import { commissionData } from "@/data/index";
import { NextResponse } from "next/server";
import validation from "@/data/validation";

export async function GET(req, { params }) {
  try {
    params.id = validation.checkId(params.id)
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }

  try {
    const commission = await commissionData.getCommissionById(params.id)
    return NextResponse.json(commission, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 })
  }
}