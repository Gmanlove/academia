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

export async function GET() {
  try {
    // Test 1: Basic connection
    const { data: healthCheck, error: healthError } = await supabaseAdmin
      .from('schools')
      .select('count')
      .limit(1)

    // Test 2: Auth service
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    // Test 3: Database tables
    const { data: tables, error: tableError } = await supabaseAdmin
      .rpc('check_table_exists', { table_name: 'user_profiles' })
      .select()

    return NextResponse.json({
      status: 'success',
      connection: {
        database: healthError ? 'failed' : 'connected',
        auth: authError ? 'failed' : 'connected',
        error: healthError || authError || tableError
      },
      userCount: authUsers?.users?.length || 0,
      users: authUsers?.users?.map(u => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        confirmed_at: u.email_confirmed_at
      })) || []
    })

  } catch (error) {
    console.error('Supabase status check error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
