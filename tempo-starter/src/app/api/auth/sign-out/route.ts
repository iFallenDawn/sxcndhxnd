import { createClient } from "../../../../../supabase/server";
import validation from '../../../../utils/validation'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await validation.checkIsUserSignedIn()
    const supabase = await createClient()
    await supabase.auth.signOut();
    return NextResponse.json({ message: 'User logged out' }, { status: 200 })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}