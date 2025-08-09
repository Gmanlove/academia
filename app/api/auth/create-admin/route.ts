import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    // Use service role for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, password, userData } = await req.json()

    if (!email || !password || !userData) {
      return new NextResponse("Email, password, and user data required", { status: 400 })
    }

    // Create user with admin privileges (bypassing email confirmation)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // This bypasses email confirmation
    })

    if (authError) {
      console.error('Auth error:', authError)
      return new NextResponse(authError.message, { status: 400 })
    }

    if (!authData.user) {
      return new NextResponse("User creation failed", { status: 500 })
    }

    // Create user profile
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        email: authData.user.email!,
        role: userData.role,
        school_id: userData.schoolId,
        name: userData.name,
        permissions: userData.permissions || [],
        email_verified: true, // Set as verified
        status: 'active'
      }])

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return new NextResponse("Failed to create user profile", { status: 500 })
    }

    return NextResponse.json({
      user: authData.user,
      message: "User created successfully and verified"
    })
  } catch (error) {
    console.error('Registration error:', error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
