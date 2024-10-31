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

// nixon fill these out, if need help on put vs patch google or reference advanced-api-blog-nextjs/src/app/api/posts/[id]/route.js
export async function PUT(req, { params }) {

}

export async function PATCH(req, { params }) {

}

export async function DELETE(req, { params }) {

}