import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get recent users from auth.users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    // Get recent user profiles
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      authUsers: authUsers?.users?.slice(0, 5).map(u => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        email_confirmed_at: u.email_confirmed_at
      })) || [],
      profiles: profiles || [],
      errors: {
        authError: authError?.message,
        profileError: profileError?.message
      }
    })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch user data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
