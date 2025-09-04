import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle both email and username fields (frontend sends username)
    const email = body.email || body.username
    const { password, role } = body

    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return NextResponse.json({ 
        error: 'Invalid email or password' 
      }, { status: 401 })
    }

    if (!data.user) {
      return NextResponse.json({ 
        error: 'Authentication failed' 
      }, { status: 401 })
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ 
        error: 'User profile not found' 
      }, { status: 404 })
    }

    // Check if user is verified
    if (!userProfile.email_verified) {
      return NextResponse.json({ 
        error: 'Please verify your email before logging in',
        requiresVerification: true,
        email: data.user.email
      }, { status: 403 })
    }

    // Check if user status is active
    if (userProfile.status !== 'active') {
      return NextResponse.json({ 
        error: 'Account is inactive. Please contact administration.' 
      }, { status: 403 })
    }

    // Verify role matches if provided
    if (role && userProfile.role !== role) {
      return NextResponse.json({ 
        error: `This account is not registered as a ${role}` 
      }, { status: 403 })
    }

    // Update last login
    await supabase
      .from('user_profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id)

    return NextResponse.json({ 
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: userProfile.role,
        name: userProfile.name,
        school_id: userProfile.school_id
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
