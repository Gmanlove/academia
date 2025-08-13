import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

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

    // Test 1: Try to send a test email using resend method
    const { error: emailError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
    })

    // Test 2: Check email settings
    const emailConfig = {
      smtp_configured: !!process.env.SMTP_HOST || 'Using Supabase default SMTP',
      site_url: process.env.NEXT_PUBLIC_SITE_URL,
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
    }

    return NextResponse.json({
      email_test: emailError ? { 
        status: 'failed', 
        error: emailError.message 
      } : { 
        status: 'success', 
        message: 'Email service is working' 
      },
      email_config: emailConfig,
      recommendation: emailError ? 
        'Check your Supabase email settings in Dashboard → Authentication → Settings' :
        'Email configuration appears to be working'
    })

  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown email test error'
    }, { status: 500 })
  }
}
