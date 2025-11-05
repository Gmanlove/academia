import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({
        status: 'error',
        message: 'Email and password are required'
      }, { status: 400 })
    }

    // Use service role key to bypass RLS
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

    console.log('🔐 Authenticating user...')

    // First authenticate to get user ID
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json({
        status: 'auth_error',
        message: authError?.message || 'Authentication failed'
      }, { status: 401 })
    }

    console.log('✅ User authenticated:', authData.user.id)

    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (existingProfile) {
      console.log('✅ Profile already exists')
      return NextResponse.json({
        status: 'exists',
        profile: existingProfile,
        message: 'Profile already exists. You can login now!'
      })
    }

    console.log('⚠️ No profile found, creating...')

    // Create the profile using service role (bypasses RLS)
    const newProfile = {
      id: authData.user.id,
      email: authData.user.email!,
      role: 'admin',
      name: authData.user.email?.split('@')[0] || 'User',
      permissions: [],
      email_verified: !!authData.user.email_confirmed_at,
      status: 'active',
      school_id: null,
      teacher_id: null,
      student_id: null
    }

    const { data: createdProfile, error: createError } = await supabaseAdmin
      .from('user_profiles')
      .insert([newProfile])
      .select()
      .single()

    if (createError) {
      console.error('❌ Create error:', createError)
      return NextResponse.json({
        status: 'create_error',
        error: createError.message,
        code: createError.code,
        details: createError.details,
        hint: createError.hint
      }, { status: 500 })
    }

    console.log('✅ Profile created successfully!')

    return NextResponse.json({
      status: 'created',
      profile: createdProfile,
      message: 'Profile created successfully! You can now login.'
    })

  } catch (error: any) {
    console.error('❌ Exception:', error)
    return NextResponse.json({
      status: 'exception',
      message: error.message
    }, { status: 500 })
  }
}
