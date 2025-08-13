import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password required' 
      }, { status: 400 })
    }

    console.log(`🔍 Testing registration for: ${email}`)

    // Attempt to create user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false // We'll handle confirmation manually for testing
    })

    if (error) {
      console.error('Registration error:', error)
      
      // Check if it's a rate limit error
      if (error.message.includes('rate limit')) {
        return NextResponse.json({
          error: 'Rate limit exceeded. Please wait a few minutes and try again.',
          code: 'rate_limit',
          details: error
        }, { status: 429 })
      }

      return NextResponse.json({
        error: error.message,
        code: error.status,
        details: error
      }, { status: 400 })
    }

    console.log('✅ User created successfully:', data.user?.id)

    // Try to create user profile
    let profileCreated = false
    let profileError = null

    try {
      const { error: insertError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          role: 'student',
          name: email.split('@')[0]
        })

      if (insertError) {
        console.error('Profile creation error:', insertError)
        profileError = insertError.message
      } else {
        profileCreated = true
        console.log('✅ User profile created')
      }
    } catch (profileErr) {
      console.error('Profile creation exception:', profileErr)
      profileError = profileErr instanceof Error ? profileErr.message : 'Unknown profile error'
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at
      },
      profile: {
        created: profileCreated,
        error: profileError
      },
      message: 'User created successfully. Check your Supabase dashboard → Authentication → Users'
    })

  } catch (error) {
    console.error('Registration test error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
