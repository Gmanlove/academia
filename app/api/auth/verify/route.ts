import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, userId } = body

    // Handle profile update for verified user
    if (userId) {
      console.log("Updating profile for verified user:", userId)

      // Check if we have the required environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !serviceRoleKey) {
        console.error("Missing Supabase environment variables")
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
      }

      // Admin client for updating user profiles
      const supabaseAdmin = createAdminClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      // Update user profile to mark as verified using admin client
      const { error: updateError } = await supabaseAdmin
        .from("user_profiles")
        .update({
          email_verified: true,
          status: "active",
          last_login: new Date().toISOString(),
        })
        .eq("id", userId)

      if (updateError) {
        console.error("Profile update error:", updateError)
        return NextResponse.json({ error: "Failed to update user profile" }, { status: 400 })
      }

      console.log("✅ User profile updated to verified")
      return NextResponse.json({
        success: true,
        message: "User profile updated successfully",
      })
    }

    // Handle email resend
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Resend confirmation email
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    })

    if (error) {
      console.error("Resend verification error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: "Verification email sent successfully!",
    })
  } catch (error) {
    console.error("Verify endpoint error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify the email with the token
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "signup",
    })

    if (error) {
      console.error("Email verification error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now log in.",
      user: data.user,
    })
  } catch (error) {
    console.error("GET verify endpoint error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
