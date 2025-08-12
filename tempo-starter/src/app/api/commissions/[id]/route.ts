import { NextResponse, NextRequest } from "next/server";
import commissionsUtil from '../../../../utils/commissions'
import validation from '../../../../utils/validation'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await validation.checkAdminUser()
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 403 })
  }

  try {
    params.id = validation.checkId(params.id)
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }

  try {
    const product = await commissionsUtil.getCommissionById(params.id)
    return NextResponse.json(product, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await validation.checkAdminUser()
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 403 })
  }

  let reqBody = await request.json()
  if (!reqBody || Object.keys(reqBody).length == 0) {
    return NextResponse.json(
      { error: 'There are no fields in the request body' },
      { status: 400 }
    )
  }

  // all fields are optional to be updated, will default to old values if not provided
  try {
    params.id = validation.checkId(params.id)
    if (reqBody.user_id) {
      reqBody.user_id = validation.checkId(reqBody.user_id)
    }

    if (reqBody.product_id) {
      reqBody.product_id = validation.checkId(reqBody.product_id)
    }

    if (reqBody.first_name) {
      reqBody.first_name = validation.checkString(reqBody.first_name, 'First name')
    }

    if (reqBody.last_name) {
      reqBody.last_name = validation.checkString(reqBody.last_name, 'Last name')
    }

    if (reqBody.email) {
      reqBody.email = validation.checkEmail(reqBody.email)
    }

    if (reqBody.commission_type) {
      reqBody.commission_type = validation.checkCommissionType(reqBody.commission_type)
    }

    if (reqBody.piece_vision) {
      reqBody.piece_vision = validation.checkPieceVision(reqBody.piece_vision)
    }

    if (reqBody.base_material) {
      reqBody.base_material = validation.checkBoolean(reqBody.base_material)
    }

    if (reqBody.creative_control) {
      reqBody.creative_control = validation.checkBoolean(reqBody.creative_control)
    }

    if (reqBody.colors) {
      reqBody.colors = validation.checkString(reqBody.colors, 'Colors')
    }

    if (reqBody.fabrics) {
      reqBody.fabrics = validation.checkString(reqBody.fabrics, 'Fabrics')
    }

    if (reqBody.shape_patterns) {
      reqBody.shape_patterns = validation.checkString(reqBody.shape_patterns, 'Shape patterns')
    }

    if (reqBody.distress) {
      reqBody.distress = validation.checkBoolean(reqBody.distress)
    }

    if (reqBody.retailor) {
      reqBody.retailor = validation.checkBoolean(reqBody.retailor)
    }

  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }

  try {
    const updatedCommission = await commissionsUtil.updateCommission(
      params.id,
      reqBody.user_id,
      reqBody.product_id,
      reqBody.first_name,
      reqBody.last_name,
      reqBody.email,
      reqBody.commission_type,
      reqBody.piece_vision,
      reqBody.base_material,
      reqBody.creative_control,
      reqBody.colors,
      reqBody.fabrics,
      reqBody.shape_patterns,
      reqBody.distress,
      reqBody.retailor
    )
    return NextResponse.json(updatedCommission, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await validation.checkAdminUser()
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 403 })
  }

  try {
    params.id = validation.checkId(params.id)
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }

  try {
    const deletedCommission = await commissionsUtil.deleteCommission(params.id)
    return NextResponse.json(deletedCommission, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 })
  }
}