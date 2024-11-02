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
  let reqBody = null;
  // check if there is no request body, or if request body empty
  try {
    reqBody = await req.json();

    if (!reqBody || Object.keys(reqBody).length === 0) {
      return NextResponse.json(
        {error: 'There are no fields in the request body'},
        {status: 400}
      );
    }
    let updatedReqBody = null
    // check all inputs that will return 400 if they fail, 
    try {
      params.id = validation.checkId(params.id);
      updatedReqBody = validation.validateCommissionFields(reqBody)
    } catch (e) {
      return NextResponse.json({error:e}, {status:400});
    }
    try {
      const updatedCommission = await commissionData.updateCommissionPut(params.id, updatedReqBody);
      return NextResponse.json(updatedCommission, {status:200});
    } catch (e) {
      return NextResponse.json({error: e}, {status: 400});
    }

  }
  catch (e) {
    return NextResponse.json(
      {error: 'There is no request body'},
      {status: 400}
    );
  }
}

export async function PATCH(req, { params }) {

}

export async function DELETE(req, { params }) {

}