import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { email, password, userData } = await req.json()

    if (!email || !password || !userData) {
      return new NextResponse("Email, password, and user data required", { status: 400 })
    }

    // Sign up the user (no email verification required)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // No redirect needed
        data: {
          name: userData.name,
          role: userData.role
        }
      }
    })

    if (error) {
      console.error('Sign up error:', error)
      return new NextResponse(error.message, { status: 400 })
    }

    if (!data.user) {
      return new NextResponse("User creation failed", { status: 500 })
    }

    // Create user profile (immediately active and verified)
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: data.user.id,
        email: data.user.email!,
        role: userData.role,
        school_id: userData.schoolId,
        name: userData.name,
        permissions: userData.permissions || [],
        email_verified: true, // Immediately verified
        status: 'active' // Immediately active
      }])

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return new NextResponse("Failed to create user profile", { status: 500 })
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
      message: "Registration successful! You can now log in."
    })
  } catch (error) {
    console.error('Registration error:', error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
