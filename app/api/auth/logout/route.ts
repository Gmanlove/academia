import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
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
    // 1. Invalidate the token in your database
    // 2. Add token to blacklist
    // 3. Log the logout event
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    })

    // Clear authentication cookies
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0) // Expire immediately
    })

    response.cookies.set('session-id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0) // Expire immediately
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
