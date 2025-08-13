import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const requiredEnvVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
    }

    const issues: string[] = []
    
    // Check if all required env vars are present
    Object.entries(requiredEnvVars).forEach(([key, value]) => {
      if (!value) {
        issues.push(`Missing: ${key}`)
      } else if (key.includes('KEY') && value.length < 50) {
        issues.push(`Invalid ${key}: appears to be too short`)
      } else if (key.includes('URL') && !value.startsWith('http')) {
        issues.push(`Invalid ${key}: should be a URL`)
      }
    })

    const valid = issues.length === 0

    return NextResponse.json({
      valid,
      issues,
      envVars: {
        NEXT_PUBLIC_SUPABASE_URL: requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL || 'MISSING',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***REDACTED***' : 'MISSING',
        SUPABASE_SERVICE_ROLE_KEY: requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY ? '***REDACTED***' : 'MISSING',
        NEXT_PUBLIC_SITE_URL: requiredEnvVars.NEXT_PUBLIC_SITE_URL || 'MISSING'
      }
    })

  } catch (error) {
    return NextResponse.json({
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
