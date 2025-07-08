import { createClient } from "../../../../../supabase/server";
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) throw `User is not logged in`
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