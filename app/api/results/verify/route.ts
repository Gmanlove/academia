import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, token } = body

    if (!studentId || !token) {
      return NextResponse.json({ 
        error: 'Student ID and token are required' 
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if token exists and is valid
    const { data: tokenData, error: tokenError } = await supabase
      .from('result_tokens')
      .select('*')
      .eq('student_id', studentId)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ 
        error: 'Invalid or expired token' 
      }, { status: 401 })
    }

    // Check if too many attempts
    if (tokenData.attempts >= 3) {
      return NextResponse.json({ 
        error: 'Too many attempts. Please request a new token.' 
      }, { status: 429 })
    }

    // Verify token matches (in real implementation, you'd hash the token)
    if (token !== tokenData.id) {
      // Increment attempts
      await supabase
        .from('result_tokens')
        .update({ attempts: tokenData.attempts + 1 })
        .eq('id', tokenData.id)

      return NextResponse.json({ 
        error: 'Invalid token',
        attemptsRemaining: 3 - (tokenData.attempts + 1)
      }, { status: 401 })
    }

    // Get student results
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select(`
        *,
        class:classes(name, level),
        school:schools(name),
        results:results(
          *,
          subject:subjects(name, code),
          class:classes(name, level)
        )
      `)
      .eq('student_id', studentId)
      .single()

    if (studentError || !student) {
      return NextResponse.json({ 
        error: 'Student not found' 
      }, { status: 404 })
    }

    // Calculate overall statistics
    const results = student.results || []
    const totalScore = results.reduce((sum: number, result: any) => sum + result.total_score, 0)
    const averageScore = results.length > 0 ? totalScore / results.length : 0

    // Group results by term/session
    const resultsByTerm = results.reduce((acc: any, result: any) => {
      const key = `${result.session}-${result.term}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(result)
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        studentId: student.student_id,
        name: student.name,
        class: student.class?.name,
        level: student.class?.level,
        school: student.school?.name,
        overallAverage: Math.round(averageScore * 100) / 100,
        totalSubjects: results.length
      },
      results: resultsByTerm,
      token: {
        attemptsRemaining: 3 - tokenData.attempts,
        expiresAt: tokenData.expires_at
      }
    })

  } catch (error) {
    console.error('Results verification error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    
    if (!studentId) {
      return NextResponse.json({ 
        error: 'Student ID is required' 
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Generate a new token for the student
    const { data: student } = await supabase
      .from('students')
      .select('student_id, name, class:classes(name)')
      .eq('student_id', studentId)
      .single()

    if (!student) {
      return NextResponse.json({ 
        error: 'Student not found' 
      }, { status: 404 })
    }

    // Create a new token (expires in 7 days)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const { data: tokenData, error: tokenError } = await supabase
      .from('result_tokens')
      .insert([{
        student_id: studentId,
        expires_at: expiresAt.toISOString(),
        attempts: 0
      }])
      .select()
      .single()

    if (tokenError) {
      return NextResponse.json({ 
        error: 'Failed to generate token' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      token: {
        id: tokenData.id,
        studentId: student.student_id,
        studentName: student.name,
        className: student.class?.name || 'Unknown',
        expiresAt: tokenData.expires_at,
        maxTrials: 3
      }
    })

  } catch (error) {
    console.error('Token generation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
