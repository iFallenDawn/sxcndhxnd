import { commissionData } from "@/data/index";
import { NextResponse } from "next/server";
import validation from "@/data/validation";

// have to decide if we want to protect this route later on
export async function GET(req) {
  try {
    const commissionList = await commissionData.getAllCommissions()
    return NextResponse.json({ commissionList }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

// commission creation, still need to check if there's an authorized user, attach the userId to that commission
export async function POST(req) {
  let reqBody = null;
  try {
    reqBody = await req.json();
    if (!reqBody || Object.keys(reqBody).length === 0) {
      return NextResponse.json(
        { error: "There are no fields in the request body" },
        { status: 400 }
      );
    }
    // check all the variables
    try {
      reqBody.firstName = validation.checkString(reqBody.firstName, "First Name");
      reqBody.lastName = validation.checkString(reqBody.lastName, "Last Name");
      reqBody.email = validation.checkString(reqBody.email, "Email");
      reqBody.commissionType = validation.checkString(reqBody.commissionType, "Commission Type");
      reqBody.pieceVision = validation.checkString(reqBody.pieceVision, "Piece Vision");
      reqBody.symmetryType = validation.checkString(reqBody.symmetryType, "Symmetry Type");
      reqBody.baseMaterial = validation.checkString(reqBody.baseMaterial, "Base Material");
      reqBody.colors = validation.checkString(reqBody.colors, "Colors");
      reqBody.fabrics = validation.checkString(reqBody.fabrics, "Fabrics");
      reqBody.shapePatterns = validation.checkString(reqBody.shapePatterns, "Shape Patterns");
      reqBody.distress = validation.checkString(reqBody.distress, "Distress");
      reqBody.retailor = validation.checkString(reqBody.retailor, "Retailor");
      reqBody.pockets = validation.checkString(reqBody.pockets, "Pockets");
      reqBody.weeklyChecks = validation.checkString(reqBody.weeklyChecks, "Weekly Checks");
      reqBody.extra = validation.checkString(reqBody.extra, "Extra");
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 400 });
    }

    try {
      const newCommission = await commissionData.addCommission(
        reqBody.firstName,
        reqBody.lastName,
        reqBody.email,
        reqBody.commissionType,
        reqBody.pieceVision,
        reqBody.symmetryType,
        reqBody.baseMaterial,
        reqBody.colors,
        reqBody.fabrics,
        reqBody.shapePatterns,
        reqBody.distress,
        reqBody.retailor,
        reqBody.pockets,
        reqBody.weeklyChecks,
        reqBody.extra
      );
      return NextResponse.json(newCommission, { status: 200 });
    } catch (e) {
      console.log(e);
      return NextResponse.json({ error: e }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json(
      { error: "There is no request body" },
      { status: 400 }
    );
  }
}

