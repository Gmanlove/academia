import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current session and user from Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'No valid session found' },
        { status: 401 }
      )
    }

    const user = session.user

    // Get user profile data
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, school_id, full_name')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'Error fetching user profile' },
        { status: 500 }
      )
    }

    // Default profile if none exists
    const profile = userProfile || {
      role: 'student',
      school_id: null,
      full_name: user.user_metadata?.full_name || user.email
    }

    // Define permissions based on role
    const getPermissions = (role: string) => {
      switch (role) {
        case 'admin':
          return ['read', 'write', 'delete', 'manage_users', 'view_analytics']
        case 'teacher':
          return ['read', 'write', 'view_classes', 'manage_results']
        case 'student':
          return ['read', 'view_results']
        default:
          return ['read']
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.email,
          role: profile.role,
          schoolId: profile.school_id,
          name: profile.full_name,
          email: user.email,
          permissions: getPermissions(profile.role),
          lastLogin: user.last_sign_in_at
        },
        sessionInfo: {
          expiresAt: session.expires_at ? new Date(session.expires_at * 1000).getTime() : null,
          loginTime: user.last_sign_in_at,
          remainingTime: session.expires_at 
            ? (session.expires_at * 1000) - Date.now()
            : null
        }
      }
    })

  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Refresh session endpoint
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Refresh the session
    const { data, error } = await supabase.auth.refreshSession()

    if (error || !data.session) {
      return NextResponse.json(
        { error: 'Failed to refresh session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Session refreshed successfully',
      data: {
        expiresAt: data.session.expires_at ? new Date(data.session.expires_at * 1000).getTime() : null,
        user: {
          id: data.user?.id,
          email: data.user?.email
        }
      }
    })

  } catch (error) {
    console.error('Session refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
