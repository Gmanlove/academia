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
    const results = {
      connection: 'testing...',
      tables: {},
      users: {
        count: 0,
        list: []
      },
      errors: []
    }

    // Test 1: Basic connection
    try {
      const { data, error } = await supabaseAdmin
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')

      if (error) {
        results.connection = 'failed'
        results.errors.push(`Connection error: ${error.message}`)
      } else {
        results.connection = 'connected'
        
        // Check for required tables
        const tableNames = data.map(t => t.table_name)
        results.tables = {
          schools: tableNames.includes('schools'),
          user_profiles: tableNames.includes('user_profiles'),
          students: tableNames.includes('students'),
          teachers: tableNames.includes('teachers'),
          notifications: tableNames.includes('notifications'),
          all_tables: tableNames
        }
      }
    } catch (error) {
      results.connection = 'failed'
      results.errors.push(`Connection exception: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Test 2: Check auth users
    try {
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
      
      if (authError) {
        results.errors.push(`Auth error: ${authError.message}`)
      } else {
        results.users.count = authUsers.users.length
        results.users.list = authUsers.users.map(u => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          confirmed_at: u.email_confirmed_at
        }))
      }
    } catch (error) {
      results.errors.push(`Auth exception: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    return NextResponse.json(results)

  } catch (error) {
    return NextResponse.json({
      connection: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
