import { NextResponse, NextRequest } from 'next/server'
import validation from '../../../../utils/validation'
import productsUtil from '../../../../utils/products'

export async function GET(
  { params }: { params: { id: string } }
) {
  try {
    params.id = validation.checkId(params.id)
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }

  try {
    const product = await productsUtil.getProductById(params.id)
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
    return NextResponse.json(
      { error: e },
      { status: 403 }
    )
  }

  let reqBody = await request.json()
  if (!reqBody || Object.keys(reqBody).length == 0) {
    return NextResponse.json(
      { error: 'There are no fields in the request body' },
      { status: 400 }
    )
  }

  //all fields are optional to be updated, will default to old values if not provided
  try {
    params.id = validation.checkId(params.id)
    if (reqBody.user_id) {
      reqBody.user_id = validation.checkId(reqBody.user_id)
    }

    if (reqBody.commission_id) {
      reqBody.commission_id = validation.checkId(reqBody.commission_id)
    }

    if (reqBody.title) {
      reqBody.title = validation.checkString(reqBody.title, 'Title')
    }

    if (reqBody.description) {
      reqBody.description = validation.checkString(reqBody.description, 'Description')
    }
    if (reqBody.image_url) {
      reqBody.image_url = validation.checkString(reqBody.image_url, 'Image url')
    }

    if (reqBody.price) {
      reqBody.price = validation.checkPrice(reqBody.price)
    }

    if (reqBody.status) {
      reqBody.status = validation.checkStatus(reqBody.status)
    }

    if (reqBody.paid) {
      reqBody.paid = validation.checkBoolean(reqBody.paid)
    }

    if (reqBody.drop_item) {
      reqBody.drop_item = validation.checkBoolean(reqBody.drop_item)
    }

    if (reqBody.drop_title) {
      reqBody.drop_title = validation.checkString(reqBody.drop_title, 'Drop Title')
    }
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }

  try {
    const updatedProduct = await productsUtil.updateProduct(
      params.id,
      reqBody.user_id,
      reqBody.commission_id,
      reqBody.title,
      reqBody.description,
      reqBody.image_url,
      reqBody.price,
      reqBody.status,
      reqBody.paid,
      reqBody.drop_item,
      reqBody.drop_title
    )
    return NextResponse.json(updatedProduct, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    params.id = validation.checkId(params.id)
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 })
  }
  try {
    const deletedProduct = await productsUtil.deleteProduct(params.id)
    return NextResponse.json(deletedProduct, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 })
  }
}