import { NextRequest, NextResponse } from 'next/server'
import { 
  addUser, 
  addSchool, 
  findUserByEmail, 
  findUserByUsername,
  findUserByToken,
  updateUser,
  type User,
  type School 
} from '@/lib/data-store'

// Validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

const validatePassword = (password: string): boolean => {
  // Check for minimum requirements: 8+ chars, uppercase, lowercase, number
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    console.log('Registration request received:', { type, data })

    // Individual user registration
    if (type === 'individual') {
      const {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        username,
        password,
        confirmPassword,
        role,
        schoolId,
        schoolName,
        schoolAddress,
        schoolType,
        studentId,
        employeeId,
        department,
        acceptTerms,
        acceptPrivacy
      } = data

      // Validation
      if (!firstName || !lastName || !email || !phone || !username || !password || !role) {
        console.log('Missing required fields:', { firstName: !!firstName, lastName: !!lastName, email: !!email, phone: !!phone, username: !!username, password: !!password, role: !!role })
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }

      if (!validateEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }

      if (!validatePhone(phone)) {
        return NextResponse.json(
          { error: 'Invalid phone number format' },
          { status: 400 }
        )
      }

      if (username.length < 3) {
        return NextResponse.json(
          { error: 'Username must be at least 3 characters long' },
          { status: 400 }
        )
      }

      if (!validatePassword(password)) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters with uppercase, lowercase, and number' },
          { status: 400 }
        )
      }

      if (password !== confirmPassword) {
        return NextResponse.json(
          { error: 'Passwords do not match' },
          { status: 400 }
        )
      }

      if (!acceptTerms || !acceptPrivacy) {
        return NextResponse.json(
          { error: 'You must accept the Terms of Service and Privacy Policy' },
          { status: 400 }
        )
      }

      // Role-specific validation
      if (role !== 'admin' && !schoolId) {
        return NextResponse.json(
          { error: 'School ID is required for non-admin users' },
          { status: 400 }
        )
      }

      if (role === 'student' && !studentId) {
        return NextResponse.json(
          { error: 'Student ID is required for student registration' },
          { status: 400 }
        )
      }

      if (role === 'teacher' && !department) {
        return NextResponse.json(
          { error: 'Department is required for teacher registration' },
          { status: 400 }
        )
      }

      // Check for existing users
      const existingUserByEmail = findUserByEmail(email)
      const existingUserByUsername = findUserByUsername(username)

      if (existingUserByEmail || existingUserByUsername) {
        return NextResponse.json(
          { error: 'User with this email or username already exists' },
          { status: 409 }
        )
      }

      // Create user record
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        username,
        password: `hashed_${password}`, // In production, hash the password
        role,
        schoolId: role === 'admin' ? `school_${Date.now()}` : schoolId,
        schoolName: role === 'admin' ? schoolName : undefined,
        schoolAddress: role === 'admin' ? schoolAddress : undefined,
        schoolType: role === 'admin' ? schoolType : undefined,
        studentId: role === 'student' ? studentId : undefined,
        employeeId: role === 'teacher' ? employeeId : undefined,
        department: role === 'teacher' ? department : undefined,
        status: 'pending_verification',
        emailVerified: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: null,
        verificationToken: `verify_${Math.random().toString(36).substr(2, 32)}`,
        acceptedTermsAt: new Date().toISOString(),
        acceptedPrivacyAt: new Date().toISOString(),
        subscribeNewsletter: data.subscribeNewsletter || false
      }

      addUser(newUser)

      // If admin creating a new school, add school record
      if (role === 'admin' && schoolName) {
        const newSchool: School = {
          id: newUser.schoolId!,
          name: schoolName,
          type: schoolType!,
          address: schoolAddress!,
          adminId: newUser.id,
          status: 'active',
          createdAt: new Date().toISOString(),
          settings: {
            allowSelfRegistration: false,
            requireEmailVerification: true,
            maxStudents: 1000
          }
        }
        addSchool(newSchool)
      }

      // Simulate email verification (in production, send actual email)
      console.log(`[DEMO] Verification email sent to ${email}`)
      console.log(`[DEMO] Verification link: /auth/verify-email?token=${newUser.verificationToken}`)

      return NextResponse.json({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status
        },
        verificationRequired: true
      })
    }

    // School registration
    if (type === 'school') {
      const {
        schoolName,
        schoolType,
        address,
        city,
        state,
        phone,
        email,
        website,
        principalName,
        principalEmail,
        studentCount,
        planType
      } = data

      // Validation
      if (!schoolName || !schoolType || !address || !city || !state || !phone || !email || !principalName || !principalEmail) {
        return NextResponse.json(
          { error: 'Missing required fields for school registration' },
          { status: 400 }
        )
      }

      if (!validateEmail(email) || !validateEmail(principalEmail)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }

      if (!validatePhone(phone)) {
        return NextResponse.json(
          { error: 'Invalid phone number format' },
          { status: 400 }
        )
      }

      // Check for existing school - simplified for demo
      // In production, you'd have proper school lookup functions

      // Create school record
      const newSchool: School = {
        id: `school_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: schoolName,
        type: schoolType,
        address: `${address}, ${city}, ${state}`,
        adminId: '', // Would be set when admin account is created
        status: 'pending_approval',
        createdAt: new Date().toISOString(),
        settings: {
          allowSelfRegistration: false,
          requireEmailVerification: true,
          maxStudents: getMaxStudentsForPlan(planType)
        }
      }

      addSchool(newSchool)

      // Simulate notification to admin team
      console.log(`[DEMO] School registration notification sent to admin team`)
      console.log(`[DEMO] School: ${schoolName} - Principal: ${principalName}`)

      return NextResponse.json({
        success: true,
        message: 'School registration submitted successfully! Our team will contact you within 24 hours.',
        school: {
          id: newSchool.id,
          name: newSchool.name,
          type: newSchool.type,
          status: newSchool.status
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid registration type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error during registration' },
      { status: 500 }
    )
  }
}

// Helper functions
function getMaxStudentsForPlan(planType: string): number {
  switch (planType) {
    case 'free':
      return 20
    case 'basic':
      return 500
    case 'pro':
      return 2000
    case 'enterprise':
      return 10000
    default:
      return 100
  }
}

function getPlanFeatures(planType: string): string[] {
  const baseFeatures = ['student_management', 'basic_reporting']
  
  switch (planType) {
    case 'free':
      return [...baseFeatures]
    case 'basic':
      return [...baseFeatures, 'parent_portal', 'sms_notifications']
    case 'pro':
      return [...baseFeatures, 'parent_portal', 'sms_notifications', 'advanced_analytics', 'custom_reports']
    case 'enterprise':
      return [...baseFeatures, 'parent_portal', 'sms_notifications', 'advanced_analytics', 'custom_reports', 'api_access', 'white_label']
    default:
      return baseFeatures
  }
}

// GET endpoint to check registration status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const username = searchParams.get('username')
  const token = searchParams.get('token')

  try {
    // Check email/username availability
    if (email || username) {
      const existingUserByEmail = email ? findUserByEmail(email) : null
      const existingUserByUsername = username ? findUserByUsername(username) : null
      const existingUser = existingUserByEmail || existingUserByUsername

      return NextResponse.json({
        available: !existingUser,
        message: existingUser ? 'Email or username already taken' : 'Available'
      })
    }

    // Verify email token
    if (token) {
      const user = findUserByToken(token)
      
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid verification token' },
          { status: 400 }
        )
      }

      if (user.emailVerified) {
        return NextResponse.json(
          { error: 'Email already verified' },
          { status: 400 }
        )
      }

      // Mark email as verified
      const updated = updateUser(user.id, {
        emailVerified: true,
        status: 'active',
        verifiedAt: new Date().toISOString(),
        verificationToken: null
      })

      if (!updated) {
        return NextResponse.json(
          { error: 'Failed to update user' },
          { status: 500 }
        )
      }
      user.emailVerified = true
      user.status = 'active'
      user.verifiedAt = new Date().toISOString()

      return NextResponse.json({
        success: true,
        message: 'Email verified successfully! You can now log in.',
        user: {
          id: user.id,
          email: user.email,
          status: user.status
        }
      })
    }

    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Registration check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
