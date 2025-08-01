import { NextResponse, NextRequest } from 'next/server';
import validation from '../../../utils/validation'
import imageUtil from '../../../utils/images'

export async function POST(
  request: NextRequest
) {
  try {
    try {
      await validation.checkAdminUser()
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      return NextResponse.json({ error: errorMessage }, { status: 403 })
    }

    let formData = await request.formData()
    const file = formData.get('image') as File
    if (!file) {
      return NextResponse.json({ error: 'No image was uploaded' }, { status: 400 })
    }
    validation.checkImageType(file)

    const id = formData.get('id') as string | null

    try {
      const publicImageUrl = await imageUtil.createImage(file, id)
      return NextResponse.json(publicImageUrl, { status: 200 })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}