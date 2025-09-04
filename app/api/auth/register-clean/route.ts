import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role, school_id } = body

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json({ 
        error: 'Email, password, name, and role are required' 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters long' 
      }, { status: 400 })
    }

    // Validate role
    const validRoles = ['admin', 'teacher', 'student', 'parent']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role specified' 
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', email)
      .single()

    if (existingProfile) {
      return NextResponse.json({ 
        error: 'User with this email already exists' 
      }, { status: 409 })
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      }
    })

    if (authError) {
      console.error('Auth signup error:', authError)
      return NextResponse.json({ 
        error: authError.message 
      }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ 
        error: 'Failed to create user' 
      }, { status: 500 })
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        email: authData.user.email!,
        role: role as 'admin' | 'teacher' | 'student' | 'parent',
        school_id: school_id || null,
        name,
        permissions: getDefaultPermissions(role),
        email_verified: false,
        status: 'active'
      }])

    if (profileError) {
      console.error('Profile creation error:', profileError)
      
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      
      return NextResponse.json({ 
        error: 'Failed to create user profile' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role,
        name
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

function getDefaultPermissions(role: string): string[] {
  switch (role) {
    case 'admin':
      return ['read', 'write', 'delete', 'manage_users', 'manage_schools', 'view_analytics']
    case 'teacher':
      return ['read', 'write', 'manage_scores', 'view_students', 'send_notifications']
    case 'student':
      return ['read', 'view_results', 'download_transcripts']
    case 'parent':
      return ['read', 'view_child_results']
    default:
      return ['read']
  }
}
