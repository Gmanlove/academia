import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { email, action } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    switch (action) {
      case 'unlock':
        // Reset failed attempts and unlock account
        const { error: unlockError } = await adminClient
          .from('user_profiles')
          .update({ 
            status: 'active',
            // Reset any lock-related fields if they exist
            failed_attempts: 0,
            locked_until: null,
            updated_at: new Date().toISOString()
          })
          .eq('email', email);

        if (unlockError) {
          console.error('Unlock error:', unlockError);
          return NextResponse.json({ error: unlockError.message }, { status: 500 });
        }

        return NextResponse.json({ 
          success: true,
          message: 'Account unlocked successfully'
        });

      case 'reset_password':
        // Send password reset email
        const { error: resetError } = await adminClient.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
        });

        if (resetError) {
          console.error('Password reset error:', resetError);
          return NextResponse.json({ error: resetError.message }, { status: 500 });
        }

        return NextResponse.json({ 
          success: true,
          message: 'Password reset email sent'
        });

      case 'check_status':
        // Check user status
        const { data: user, error: checkError } = await adminClient
          .from('user_profiles')
          .select('email, status, email_verified, last_login, created_at, updated_at')
          .eq('email', email)
          .single();

        if (checkError) {
          console.error('Check status error:', checkError);
          return NextResponse.json({ error: checkError.message }, { status: 500 });
        }

        return NextResponse.json({ 
          success: true,
          user
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Account management error:', error);
    return NextResponse.json({ 
      error: 'Failed to manage account',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
