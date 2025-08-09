import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { email, password } = await req.json()

    if (!email || !password) {
      return new NextResponse("Email and password required", { status: 400 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return new NextResponse(error.message, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      return new NextResponse("User profile not found", { status: 404 })
    }

    return NextResponse.json({
      user: data.user,
      profile,
      session: data.session
    })
  } catch (error) {
    console.error('Login error:', error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
