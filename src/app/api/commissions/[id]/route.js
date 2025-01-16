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

//if need help on put vs patch google or reference advanced-api-blog-nextjs/src/app/api/posts/[id]/route.js
// PUT - update a resource, REPLACE the entire resource with new data.
// PATCH - update a resource, update some fields in the resource IN PLACE.

export async function PUT(req, { params }) {
  // check if there is no request body, or if request body empty
  try {
    let reqBody = await req.json();

    if (!reqBody || Object.keys(reqBody).length === 0) {
      return NextResponse.json(
        { error: 'There are no fields in the request body' },
        { status: 400 }
      );
    }
    let updatedReqBody = null
    // check all inputs that will return 400 if they fail, 
    try {
      params.id = validation.checkId(params.id);
      updatedReqBody = validation.validateCommissionFields(reqBody)
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 400 });
    }
    try {
      const updatedCommission = await commissionData.updateCommissionPut(params.id, updatedReqBody);
      return NextResponse.json(updatedCommission, { status: 200 });
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 404 });
    }

  }
  catch (e) {
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
      // this only checks for the variables that exist in reqBody
      for (const [key, value] of Object.entries(reqBody)) {
        // only allow valid commission keys in updated request
        if (validation.validateCommissionKey(key)) {
          updatedReqBody[key] = validation.checkString(value, key)
        }
      }
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 400 })
    }
    try {
      const updatedCommission = await commissionData.updateCommissionPatch(params.id, updatedReqBody)
      return NextResponse.json(updatedCommission, { status: 200 })
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
    params.id = validation.checkId(params.id, 'id URL Param')
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }
  //try to delete post
  try {
    let deletedCommission = await commissionData.deleteCommission(params.id)
    return NextResponse.json(deletedCommission, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 })
  }

}