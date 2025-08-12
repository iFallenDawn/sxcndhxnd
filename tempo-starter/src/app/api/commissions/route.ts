import { NextResponse, NextRequest } from 'next/server'
import commissionsUtil from '../../../utils/commissions'
import validation from '../../../utils/validation'

export async function GET() {
  try {
    await validation.checkAdminUser()
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 403 })
  }

  try {
    const allCommissions = await commissionsUtil.getAllCommissions()
    return NextResponse.json(allCommissions, { status: 200 })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 404 })
  }
}

export async function POST(
  request: NextRequest
) {
  let reqBody = null
  try {
    reqBody = await request.json()
    if (!reqBody || Object.keys(reqBody).length == 0)
      throw new Error('There are no fields in the request body')
    try {
      if (reqBody.user_id) {
        reqBody.user_id = validation.checkId(reqBody.user_id)
      }

      if (reqBody.product_id) {
        reqBody.product_id = validation.checkId(reqBody.product_id)
      }

      reqBody.first_name = validation.checkString(reqBody.first_name, 'First name')
      reqBody.last_name = validation.checkString(reqBody.last_name, 'Last name')
      reqBody.email = validation.checkEmail(reqBody.email)
      reqBody.commission_type = validation.checkCommissionType(reqBody.commission_type)
      reqBody.piece_vision = validation.checkString(reqBody.piece_vision, 'Piece vision')
      reqBody.base_material = validation.checkBoolean(reqBody.base_material)
      reqBody.creative_control = validation.checkBoolean(reqBody.creative_control)
      reqBody.colors = validation.checkString(reqBody.colors, 'Colors')
      reqBody.fabrics = validation.checkString(reqBody.fabrics, 'Fabrics')
      reqBody.shape_patterns = validation.checkString(reqBody.shape_patterns, 'Shape patterns')
      reqBody.distress = validation.checkBoolean(reqBody.distress)
      reqBody.retailor = validation.checkBoolean(reqBody.retailor)
      reqBody.pockets = validation.checkBoolean(reqBody.pockets)
      reqBody.weekly_checkins = validation.checkBoolean(reqBody.weekly_checkins)

      if (reqBody.extra) {
        reqBody.extra = validation.checkString(reqBody.extra, 'Extra')
      }

      reqBody.symmetry_type = validation.checkSymmetryType(reqBody.symmetry_type)
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    let newCommission = await commissionsUtil.createCommission(
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
      reqBody.retailor,
      reqBody.pockets,
      reqBody.weekly_checkins,
      reqBody.extra,
      reqBody.symmetry_type
    )
    return NextResponse.json(newCommission, { status: 200 })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}