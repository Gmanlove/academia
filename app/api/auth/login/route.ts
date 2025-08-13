import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Login request body:', body)
    
    // Handle both email and username fields (frontend sends username)
    const email = body.email || body.username
    const { password } = body

    if (!email || !password) {
      console.log('Missing email or password:', { email: !!email, password: !!password })
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 })
    }

    const supabase = await createClient()

    console.log('Attempting login for:', email)

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Supabase login error:', error)
      return NextResponse.json({ 
        error: error.message 
      }, { status: 401 })
    }

    if (!data.user) {
      console.log('No user returned from Supabase')
      return NextResponse.json({ 
        error: 'Login failed' 
      }, { status: 401 })
    }

    console.log('Login successful for user:', data.user.id)

    // Check if user is verified
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('email_verified, status, role')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ 
        error: 'Failed to fetch user profile' 
      }, { status: 500 })
    }

    console.log('User profile:', userProfile)

    if (!userProfile?.email_verified || userProfile?.status !== 'active') {
      console.log('User not verified or not active:', userProfile)
      return NextResponse.json({ 
        error: 'Please verify your email before logging in',
        needsVerification: true
      }, { status: 403 })
    }

    // Update last login
    await supabase
      .from('user_profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id)

    // Determine redirect based on role
    let redirectPath = '/admin/dashboard' // default
    if (userProfile?.role) {
      switch (userProfile.role) {
        case 'admin':
          redirectPath = '/admin/dashboard'
          break
        case 'teacher':
          redirectPath = '/teacher/dashboard'
          break
        case 'student':
          redirectPath = '/student/dashboard'
          break
        default:
          redirectPath = '/admin/dashboard'
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: userProfile?.role
      },
      redirectPath
    })

  } catch (error) {
    console.error('Login endpoint error:', error)
    return NextResponse.json({ 
      error: 'Internal server error during login',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
