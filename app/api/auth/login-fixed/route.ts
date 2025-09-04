import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body: LoginRequest = await request.json()
    const { email, password, rememberMe } = body

    console.log('Login attempt for:', email)

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 })
    }

    // Attempt to sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Login error:', authError)
      // Return specific error messages
      if (authError.message.includes('Invalid login credentials')) {
        return NextResponse.json({ 
          error: 'Invalid email or password' 
        }, { status: 401 })
      }
      return NextResponse.json({ 
        error: authError.message 
      }, { status: 401 })
    }

    if (!authData.user) {
      return NextResponse.json({ 
        error: 'Login failed - no user data' 
      }, { status: 401 })
    }

    // Get user profile
    const userId = authData.user.id;
    if (!userId) {
      return NextResponse.json({ 
        error: 'Login failed - user ID missing' 
      }, { status: 401 })
    }
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !userProfile) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ 
        error: 'User profile not found. Please contact support.' 
      }, { status: 404 })
    }

    // Update last login
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId)

    if (updateError) {
      console.error('Last login update error:', updateError)
      // Don't fail the login for this
    }

    // Return successful login
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        schoolId: userProfile.school_id,
        permissions: userProfile.permissions || [],
        lastLogin: new Date().toISOString(),
        emailVerified: userProfile.email_verified,
        status: userProfile.status
      },
      session: {
        accessToken: authData.session?.access_token,
        refreshToken: authData.session?.refresh_token,
        expiresAt: authData.session?.expires_at
      }
    })

  } catch (error) {
    console.error('Login endpoint error:', error)
    return NextResponse.json({ 
      error: 'Internal server error during login' 
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
