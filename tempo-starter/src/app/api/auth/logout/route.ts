import { createClient } from "../../../../../supabase/server";
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return NextResponse.json({ message: 'User logged out' }, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { error: e },
      { status: 400 }
    )
  }
}