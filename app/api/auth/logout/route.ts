import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('🔓 API Logout: Starting AGGRESSIVE logout...')
    
    // Create Supabase client
    const supabase = await createClient()
    
    // Sign out from Supabase (scope: global to clear all sessions)
    const { error } = await supabase.auth.signOut({ scope: 'global' })
    
    if (error) {
      console.error('❌ API Logout: Supabase signOut error:', error)
      // Continue anyway to clear cookies
    } else {
      console.log('✅ API Logout: Supabase signOut successful')
    }
    
    // Get cookie store to manually clear all cookies
    const cookieStore = await cookies()
    
    // Get all cookies
    const allCookies = cookieStore.getAll()
    console.log('🍪 Found cookies:', allCookies.map(c => c.name))
    
    // Create response with aggressive headers
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    }, {
      status: 200,
      headers: {
        // Clear all site data
        'Clear-Site-Data': '"cache", "cookies", "storage", "executionContexts"',
        // Prevent caching
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

    // Clear ALL Supabase and auth-related cookies
    const cookiePatterns = [
      'sb-',           // All Supabase cookies
      'auth-',         // Auth cookies
      'session-',      // Session cookies
      'supabase-'      // Alternative Supabase pattern
    ]
    
    // Clear cookies that match patterns
    allCookies.forEach(cookie => {
      const shouldClear = cookiePatterns.some(pattern => 
        cookie.name.startsWith(pattern)
      )
      
      if (shouldClear) {
        console.log(`🧹 Clearing cookie: ${cookie.name}`)
        response.cookies.set(cookie.name, '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 0,
          expires: new Date(0)
        })
      }
    })
    
    // Also explicitly clear common cookie names
    const explicitCookies = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-auth-token',
      'auth-token',
      'session-id'
    ]
    
    explicitCookies.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
        expires: new Date(0)
      })
    })
    
    console.log('✅ API Logout: All cookies cleared')

    return response

  } catch (error: any) {
    console.error('❌ API Logout error:', error)
    
    // Even on error, return success and clear cookies
    const response = NextResponse.json(
      { success: true, message: 'Logout completed' },
      { status: 200 }
    )
    
    // Force clear cookies
    const clearCookies = ['sb-access-token', 'sb-refresh-token', 'auth-token']
    clearCookies.forEach(name => {
      response.cookies.delete(name)
    })
    
    return response
  }
}

// Also support GET method for direct browser logout
export async function GET(request: NextRequest) {
  return POST(request)
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
