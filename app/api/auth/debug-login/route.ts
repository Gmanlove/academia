import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('Debug login attempt for:', email)

    const supabase = await createClient()

    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    console.log('Auth result:', { 
      user: data.user?.id, 
      error: error?.message 
    })

    if (error) {
      return NextResponse.json({ 
        error: error.message,
        details: error
      }, { status: 400 })
    }

    // Check if user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single()

    console.log('Profile result:', { 
      profile: profile?.email, 
      error: profileError?.message 
    })

    return NextResponse.json({ 
      success: true,
      user: data.user,
      profile: profile
    })

  } catch (error) {
    console.error('Debug login error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
