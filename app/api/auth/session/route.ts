import { NextRequest, NextResponse } from 'next/server'

interface SessionData {
  user: {
    id: string
    username: string
    role: string
    schoolId: string
    name: string
    email: string
    permissions: string[]
    lastLogin?: string
  }
  token: string
  sessionId: string
  expiresAt: number
  loginTime: string
}

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies or headers
    const authToken = request.cookies.get('auth-token')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '')

    if (!authToken) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      )
    }

    // In a real app, you would:
    // 1. Verify token in database
    // 2. Check if token is blacklisted
    // 3. Validate session expiry
    // 4. Update last activity time

    // For demo purposes, check localStorage data format
    // In production, validate against secure server-side session store
    
    // Simulate session validation
    if (!authToken.startsWith('AUTH_')) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 401 }
      )
    }

    // Mock session data (in production, fetch from database)
    const mockSession: SessionData = {
      user: {
        id: 'USER-001',
        username: 'demo_user',
        role: 'student', // This would be fetched from the token/database
        schoolId: 'SCH-001',
        name: 'Demo User',
        email: 'demo@academia.edu',
        permissions: ['read', 'view_results'],
        lastLogin: new Date().toISOString()
      },
      token: authToken,
      sessionId: 'SES_DEMO123',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      loginTime: new Date().toISOString()
    }

    // Check if session is expired
    if (Date.now() > mockSession.expiresAt) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        user: mockSession.user,
        sessionInfo: {
          expiresAt: mockSession.expiresAt,
          loginTime: mockSession.loginTime,
          remainingTime: mockSession.expiresAt - Date.now()
        }
      }
    })

  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Refresh session endpoint
export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      )
    }

    // In production, you would:
    // 1. Verify current session
    // 2. Extend expiry time
    // 3. Update last activity

    const newExpiryTime = Date.now() + 24 * 60 * 60 * 1000 // Extend by 24 hours

    const response = NextResponse.json({
      success: true,
      message: 'Session refreshed',
      data: {
        expiresAt: newExpiryTime
      }
    })

    // Update cookie expiry
    response.cookies.set('auth-token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response

  } catch (error) {
    console.error('Session refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
