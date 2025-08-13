import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Admin client for updating user profiles
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/admin'
  
  // Also check for direct token-based verification (URL fragment handling)
  const accessToken = requestUrl.searchParams.get('access_token')
  const refreshToken = requestUrl.searchParams.get('refresh_token')
  const tokenType = requestUrl.searchParams.get('token_type')
  const type = requestUrl.searchParams.get('type')

  console.log('Auth callback received:', { 
    code: !!code, 
    accessToken: !!accessToken, 
    type,
    next 
  })

  const supabase = await createClient()

  // Handle token-based verification (when tokens are in URL)
  if (accessToken && refreshToken && type === 'signup') {
    try {
      // Set the session using the tokens
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })
      
      if (error) {
        console.error('Token session error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
      }

      if (data.user) {
        console.log('✅ User session created via tokens:', data.user.id)
        
        // Update user profile to mark as verified using admin client
        const { error: updateError } = await supabaseAdmin
          .from('user_profiles')
          .update({ 
            email_verified: true,
            status: 'active',
            last_login: new Date().toISOString()
          })
          .eq('id', data.user.id)

        if (updateError) {
          console.error('Profile update error:', updateError)
          // Don't fail the verification for this
        } else {
          console.log('✅ User profile updated to verified')
        }

        // Determine where to redirect based on user role using admin client
        const { data: userProfile } = await supabaseAdmin
          .from('user_profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        let redirectPath = '/admin' // default
        if (userProfile?.role) {
          switch (userProfile.role) {
            case 'admin':
              redirectPath = '/admin/dashboard'
              break
            case 'teacher':
              redirectPath = '/teacher/dashboard'
              break
            case 'student':
              redirectPath = '/student/dashboard'
              break
            default:
              redirectPath = '/admin/dashboard'
          }
        }

        // Handle redirect properly
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'
        
        if (isLocalEnv) {
          return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`)
        } else {
          return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
        }
      }
    } catch (err) {
      console.error('Token callback processing error:', err)
      return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error?error=token_processing_error`)
    }
  }

  // Handle code-based verification (traditional flow)
  if (code) {
    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Code exchange error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
      }

      if (data.user) {
        console.log('✅ User session created:', data.user.id)
        
        // Update user profile to mark as verified using admin client
        const { error: updateError } = await supabaseAdmin
          .from('user_profiles')
          .update({ 
            email_verified: true,
            status: 'active',
            last_login: new Date().toISOString()
          })
          .eq('id', data.user.id)

        if (updateError) {
          console.error('Profile update error:', updateError)
          // Don't fail the verification for this
        } else {
          console.log('✅ User profile updated to verified')
        }

        // Determine where to redirect based on user role using admin client
        const { data: userProfile } = await supabaseAdmin
          .from('user_profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        let redirectPath = '/admin' // default
        if (userProfile?.role) {
          switch (userProfile.role) {
            case 'admin':
              redirectPath = '/admin/dashboard'
              break
            case 'teacher':
              redirectPath = '/teacher/dashboard'
              break
            case 'student':
              redirectPath = '/student/dashboard'
              break
            default:
              redirectPath = '/admin/dashboard'
          }
        }

        // Handle redirect properly
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'
        
        if (isLocalEnv) {
          return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`)
        } else {
          return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
        }
      }
    } catch (err) {
      console.error('Callback processing error:', err)
      return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error?error=processing_error`)
    }
  }

  // No code provided or other error
  console.error('No verification code provided')
  return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error?error=no_code`)
}
