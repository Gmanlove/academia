import { NextRequest, NextResponse } from 'next/server'
import { 
  findUserByToken, 
  findUserByEmail, 
  updateUser, 
  getAllUsers 
} from '@/lib/data-store'
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find user with the verification token
    const user = findUserByToken(token)

    if (!user || user.status !== 'pending_verification') {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Update user verification status
    const updated = updateUser(user.id, {
      emailVerified: true,
      status: 'active',
      verifiedAt: new Date().toISOString(),
      verificationToken: null
    })

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to verify email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      user: {
        id: user.id,
        email: user.email,
        status: 'active'
      }
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = findUserByEmail(email)

    if (!user || user.status !== 'pending_verification') {
      return NextResponse.json(
        { error: 'User not found or already verified' },
        { status: 400 }
      )
    }

    // Generate new verification token
    const newToken = `verify_${Math.random().toString(36).substr(2, 32)}`
    
    const updated = updateUser(user.id, {
      verificationToken: newToken
    })

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to generate new token' },
        { status: 500 }
      )
    }

    // Simulate resending email (in production, send actual email)
    console.log(`[DEMO] Verification email resent to ${email}`)
    console.log(`[DEMO] New verification link: /auth/verify-email?token=${newToken}`)

    return NextResponse.json({
      success: true,
      message: 'Verification email resent successfully!'
    })

  } catch (error) {
    console.error('Resend verification error:', error)
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
