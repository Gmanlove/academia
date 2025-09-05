import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string): boolean => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)
}

export async function POST(request: NextRequest) {
  try {
    // Check environment variables at runtime
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables")
      return NextResponse.json(
        {
          error: "Server configuration error. Please contact support.",
        },
        { status: 500 },
      )
    }

    // Create admin client only when needed
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const body = await request.json()

    console.log("Registration request received:", body)

    // Handle the legacy format from your frontend
    let email, password, userData

    if (body.type === "individual" || body.type === "school") {
      // Legacy format support - extract from nested data object
      const data = body.data || body
      email = data.email
      password = data.password
      userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName || ""} ${data.lastName || ""}`.trim() || data.name,
        role: data.role || (body.type === "school" ? "admin" : "student"),
        schoolId: data.schoolId,
        schoolName: data.schoolName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
      }
    } else {
      // New format
      email = body.email
      password = body.password
      userData = body.userData || {}
    }

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        {
          error: "Invalid email format",
        },
        { status: 400 },
      )
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters with uppercase, lowercase, and number",
        },
        { status: 400 },
      )
    }

    // Check if user already exists using Supabase query
    const { data: existingUser } = await supabaseAdmin.from("user_profiles").select("email").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User with this email already exists",
        },
        { status: 409 },
      )
    }

    // Register user with Supabase Auth (skip email verification)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email verification
      user_metadata: {
        name: userData.name || email.split("@")[0],
        role: userData.role || "student",
      },
    })

    if (authError) {
      console.error("Auth registration error:", authError)
      return NextResponse.json(
        {
          error: authError.message,
        },
        { status: 400 },
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        {
          error: "Failed to create user account",
        },
        { status: 500 },
      )
    }

    console.log("✅ User created successfully:", authData.user.id)

    // Get default school for fallback
    const { data: defaultSchool } = await supabaseAdmin.from("schools").select("id").limit(1).single()

    // Create user profile with correct column names
    const { error: profileError } = await supabaseAdmin.from("user_profiles").insert({
      id: authData.user.id,
      email: authData.user.email!,
      role: userData.role || "student",
      school_id: userData.schoolId || defaultSchool?.id,
      name: userData.name || email.split("@")[0], // Use 'name' not 'full_name'
      permissions: [],
      email_verified: true, // Auto-verify email
      status: "active", // Set as active immediately
    })

    if (profileError) {
      console.error("Profile creation error:", profileError)
      return NextResponse.json(
        {
          error: "User created but profile setup failed. Please contact support.",
          userId: authData.user.id,
          details: profileError,
        },
        { status: 500 },
      )
    }

    console.log("✅ User profile created successfully")

    return NextResponse.json({
      success: true,
      message: "Registration successful! You can now sign in to your account.",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        needsVerification: false, // No verification needed
        canSignIn: true, // Ready to sign in
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        error: "Internal server error during registration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
