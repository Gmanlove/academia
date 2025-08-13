import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Test basic connection with admin client
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

    // Test 1: Basic health check
    const { data: healthData, error: healthError } = await supabaseAdmin
      .from('schools')
      .select('count')
      .limit(1)

    // Test 2: Auth service check
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    const connected = !healthError && !authError
    const details = {
      database: healthError ? { error: healthError.message } : { status: 'connected' },
      auth: authError ? { error: authError.message } : { 
        status: 'connected', 
        userCount: authData?.users?.length || 0 
      }
    }

    return NextResponse.json({
      connected,
      details,
      message: connected ? 'Supabase connection successful' : 'Connection issues detected'
    })

  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown connection error'
    }, { status: 500 })
  }
}
