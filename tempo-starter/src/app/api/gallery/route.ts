import { NextResponse, NextRequest } from 'next/server'
import galleryUtil from '../../../utils/gallery'
import validation from '../../../utils/validation'

// Get all gallery items
export async function GET() {
  try {
    const items = await galleryUtil.getAllGalleryItems()
    return NextResponse.json(items, { status: 200 })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 404 })
  }
}

// Create a gallery item
export async function POST(request: NextRequest) {
  try {
    await validation.checkAdminUser()
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 403 })
  }

  try {
    const reqBody = await request.json()
    
    if (!reqBody || Object.keys(reqBody).length === 0) {
      throw new Error('There are no fields in the request body')
    }

    // Validate required fields
    const title = validation.checkString(reqBody.title, 'Title')
    const description = validation.checkString(reqBody.description, 'Description')
    const category = validation.checkString(reqBody.category, 'Category')
    const price = reqBody.price?.toString() || ''
    const status = validation.checkStatus(reqBody.status)
    const image_urls = validation.checkArrayOfStrings(reqBody.image_urls, 'Image URLs')
    
    // Optional fields
    const size = reqBody.size ? validation.checkString(reqBody.size, 'Size') : null
    const original_brand = reqBody.original_brand ? validation.checkString(reqBody.original_brand, 'Original Brand') : null

    const newItem = await galleryUtil.createGalleryItem(
      title,
      description,
      category,
      price,
      size,
      status as 'available' | 'sold' | 'reserved',
      original_brand,
      image_urls
    )

    return NextResponse.json(newItem, { status: 200 })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}