import { NextResponse, NextRequest } from 'next/server'
import galleryUtil from '../../../../utils/gallery'
import validation from '../../../../utils/validation'

// Get a single gallery item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = validation.checkId(params.id)
    const item = await galleryUtil.getGalleryItemById(id)
    return NextResponse.json(item, { status: 200 })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 404 })
  }
}

// Update a gallery item
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

  try {
    const id = validation.checkId(params.id)
    const reqBody = await request.json()
    
    if (!reqBody || Object.keys(reqBody).length === 0) {
      throw new Error('There are no fields in the request body')
    }

    // Prepare update object with validated fields
    const updates: any = {}
    
    if (reqBody.title !== undefined) {
      updates.title = validation.checkString(reqBody.title, 'Title')
    }
    if (reqBody.description !== undefined) {
      updates.description = validation.checkString(reqBody.description, 'Description')
    }
    if (reqBody.category !== undefined) {
      updates.category = validation.checkString(reqBody.category, 'Category')
    }
    if (reqBody.price !== undefined) {
      updates.price = reqBody.price.toString()
    }
    if (reqBody.status !== undefined) {
      updates.status = validation.checkStatus(reqBody.status)
    }
    if (reqBody.size !== undefined) {
      updates.size = reqBody.size ? validation.checkString(reqBody.size, 'Size') : null
    }
    if (reqBody.original_brand !== undefined) {
      updates.original_brand = reqBody.original_brand ? validation.checkString(reqBody.original_brand, 'Original Brand') : null
    }
    if (reqBody.image_urls !== undefined) {
      updates.image_urls = validation.checkArrayOfStrings(reqBody.image_urls, 'Image URLs')
    }

    const updatedItem = await galleryUtil.updateGalleryItem(id, updates)
    return NextResponse.json(updatedItem, { status: 200 })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}

// Delete a gallery item
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
    const id = validation.checkId(params.id)
    const result = await galleryUtil.deleteGalleryItem(id)
    return NextResponse.json(result, { status: 200 })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 404 })
  }
}