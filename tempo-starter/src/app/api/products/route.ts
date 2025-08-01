import { NextResponse, NextRequest } from 'next/server'
import productUtil from '../../../utils/products'
import validation from '../../../utils/validation'

// returns all products
export async function GET() {
  try {
    const allProducts = await productUtil.getAllProducts()
    return NextResponse.json(allProducts, { status: 200 })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 404 })
  }
}

//create a product
export async function POST(
  request: NextRequest
) {
  try {
    await validation.checkAdminUser()
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 403 })
  }
  let reqBody = null
  try {
    reqBody = await request.json()
    if (!reqBody || Object.keys(reqBody).length == 0)
      throw new Error(`There are no fields in the request body`)
    try {
      if (reqBody.user_id) {
        reqBody.user_id = validation.checkId(reqBody.user_id)
      }

      if (reqBody.commission_id) {
        reqBody.commission_id = validation.checkId(reqBody.commission_id)
      }

      reqBody.title = validation.checkString(reqBody.title, 'Title')
      reqBody.description = validation.checkString(reqBody.description, 'Description')
      reqBody.image_urls = validation.checkArrayOfStrings(reqBody.image_urls, 'Image urls')
      reqBody.price = validation.checkPrice(reqBody.price)
      reqBody.status = validation.checkStatus(reqBody.status)

      if (reqBody.paid) {
        reqBody.paid = validation.checkBoolean(reqBody.paid)
      }

      if (reqBody.drop_item) {
        reqBody.drop_item = validation.checkBoolean(reqBody.drop_item)
      }

      if (reqBody.drop_title) {
        reqBody.drop_title = validation.checkString(reqBody.drop_title, 'Drop Title')
      }

      reqBody.category = validation.checkString(reqBody.category, 'Category')

      if (reqBody.size) {
        reqBody.size = validation.checkString(reqBody.size, 'Size')
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    let newProduct = await productUtil.createProduct(
      reqBody.user_id,
      reqBody.commission_id,
      reqBody.title,
      reqBody.description,
      reqBody.image_urls,
      reqBody.price,
      reqBody.status,
      reqBody.paid,
      reqBody.drop_item,
      reqBody.drop_title,
      reqBody.category,
      reqBody.size
    )
    return NextResponse.json(newProduct, { status: 200 })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}