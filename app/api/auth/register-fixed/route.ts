import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string): boolean => {
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { email, password, userData } = body

    console.log('Registration request received:', { email, userData })

    // Validate input
    if (!email || !password || !userData) {
      return NextResponse.json({ 
        error: 'Email, password, and user data are required' 
      }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 })
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters with uppercase, lowercase, and number' 
      }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ 
        error: 'User with this email already exists' 
      }, { status: 409 })
    }

    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
          name: userData.name || userData.fullName,
          role: userData.role || 'student'
        }
      }
    })

    if (authError) {
      console.error('Auth registration error:', authError)
      return NextResponse.json({ 
        error: authError.message 
      }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ 
        error: 'Failed to create user account' 
      }, { status: 500 })
    }

    // Get default school
    const { data: defaultSchool } = await supabase
      .from('schools')
      .select('id')
      .limit(1)
      .single()

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email!,
        role: userData.role || 'student',
        school_id: userData.schoolId || defaultSchool?.id,
        name: userData.name || userData.fullName || email.split('@')[0],
        permissions: [],
        email_verified: false,
        status: 'pending'
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Note: User is created in auth but profile failed
      return NextResponse.json({ 
        error: 'User created but profile setup failed. Please contact support.',
        userId: authData.user.id
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        needsVerification: !authData.user.email_confirmed_at
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ 
      error: 'Internal server error during registration' 
    }, { status: 500 })
  }
}
