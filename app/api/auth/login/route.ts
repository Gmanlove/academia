import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers, updateUser } from '@/lib/data-store'

interface LoginRequest {
  username: string
  password: string
  role: string
  schoolId?: string
  rememberMe: boolean
}

interface User {
  id: string
  username: string
  role: string
  schoolId: string
  name: string
  email: string
  permissions: string[]
  lastLogin?: string
  emailVerified?: boolean
  status?: string
}

// Demo users database - These are pre-verified demo accounts
const demoUsers: Record<string, User> = {
  'admin': {
    id: 'ADM-001',
    username: 'admin',
    role: 'admin',
    schoolId: 'SYS-001',
    name: 'System Administrator',
    email: 'admin@academia.edu',
    permissions: ['read', 'write', 'delete', 'manage_users', 'manage_schools', 'view_analytics'],
    lastLogin: '2025-08-09T10:30:00Z',
    emailVerified: true,
    status: 'active'
  },
  'teacher': {
    id: 'TCH-001',
    username: 'teacher',
    role: 'teacher',
    schoolId: 'SCH-001',
    name: 'John Teacher',
    email: 'teacher@academia.edu',
    permissions: ['read', 'write', 'manage_scores', 'view_students', 'send_notifications'],
    lastLogin: '2025-08-09T09:15:00Z',
    emailVerified: true,
    status: 'active'
  },
  'student': {
    id: 'STU-001',
    username: 'student',
    role: 'student',
    schoolId: 'SCH-001',
    name: 'Jane Student',
    email: 'student@academia.edu',
    permissions: ['read', 'view_results', 'download_transcripts'],
    lastLogin: '2025-08-09T08:45:00Z',
    emailVerified: true,
    status: 'active'
  }
}

// Import registered users from register route (in production, this would be a shared database)

// Demo passwords (in production, these would be hashed)
const demoPasswords: Record<string, string> = {
  'admin': 'admin123',
  'teacher': 'teach123',
  'student': 'stud123'
}

function generateToken(): string {
  return 'AUTH_' + Math.random().toString(36).substr(2, 9).toUpperCase()
}

function generateSessionId(): string {
  return 'SES_' + Math.random().toString(36).substr(2, 12).toUpperCase()
}

function getRolePermissions(role: string): string[] {
  switch (role) {
    case 'admin':
      return ['read', 'write', 'delete', 'manage_users', 'manage_schools', 'view_analytics']
    case 'teacher':
      return ['read', 'write', 'manage_scores', 'view_students', 'send_notifications']
    case 'student':
      return ['read', 'view_results', 'download_transcripts']
    default:
      return ['read']
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { username, password, role, schoolId, rememberMe } = body

    // Validate required fields
    if (!username || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let user: User | undefined

    // First check demo users (these are pre-verified)
    if (demoUsers[username] && demoPasswords[username] === password) {
      user = demoUsers[username]
    } else {
      // Check registered users
      const allUsers = getAllUsers()
      const registeredUser = allUsers.find(
        u => (u.username === username || u.email === username) && 
             u.password === `hashed_${password}` // In production, compare hashed passwords
      )

      if (registeredUser) {
        user = {
          id: registeredUser.id,
          username: registeredUser.username,
          role: registeredUser.role,
          schoolId: registeredUser.schoolId,
          name: `${registeredUser.firstName} ${registeredUser.lastName}`,
          email: registeredUser.email,
          permissions: getRolePermissions(registeredUser.role),
          lastLogin: registeredUser.lastLoginAt || undefined,
          emailVerified: registeredUser.emailVerified,
          status: registeredUser.status
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if email is verified (skip for demo users)
    if (!demoUsers[username] && !user.emailVerified) {
      return NextResponse.json(
        { 
          error: 'Email not verified', 
          requiresVerification: true,
          email: user.email 
        },
        { status: 403 }
      )
    }

    // Check if account is active
    if (user.status && user.status !== 'active') {
      return NextResponse.json(
        { 
          error: 'Account is not active. Please contact support.',
          status: user.status 
        },
        { status: 403 }
      )
    }

    // Check role match
    if (user.role !== role) {
      return NextResponse.json(
        { error: 'Role mismatch' },
        { status: 401 }
      )
    }

    // Check school ID for non-admin users
    if (role !== 'admin' && schoolId && user.schoolId !== schoolId) {
      return NextResponse.json(
        { error: 'Invalid school ID' },
        { status: 401 }
      )
    }

    // Update last login for registered users
    if (!demoUsers[username] && user) {
      updateUser(user.id, {
        lastLoginAt: new Date().toISOString()
      })
    }

    // Generate session data
    const token = generateToken()
    const sessionId = generateSessionId()
    const expiresAt = Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)

    // Update last login
    user.lastLogin = new Date().toISOString()

    // Create response
    const authData = {
      user: {
        ...user,
        lastLogin: user.lastLogin
      },
      token,
      sessionId,
      expiresAt,
      loginTime: new Date().toISOString()
    }

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: authData
    })

    // Set HTTP-only cookies for security
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60
    })

    response.cookies.set('session-id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
