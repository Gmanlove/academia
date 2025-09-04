import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, classId, requestType } = body

    if (!studentId || !classId) {
      return NextResponse.json(
        { error: 'Student ID and Class ID are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify student exists
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id, name, email')
      .eq('student_id', studentId)
      .eq('class_id', classId)
      .single()

    if (studentError || !student) {
      return NextResponse.json(
        { error: 'Student not found with the provided ID and class' },
        { status: 404 }
      )
    }

    // Create token request record
    const { data: tokenRequest, error: requestError } = await supabase
      .from('result_token_requests')
      .insert([
        {
          student_id: student.id,
          student_number: studentId,
          class_id: classId,
          request_type: requestType || 'access_token',
          status: 'pending',
          requested_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours
        }
      ])
      .select()
      .single()

    if (requestError) {
      console.error('Error creating token request:', requestError)
      return NextResponse.json(
        { error: 'Failed to submit token request' },
        { status: 500 }
      )
    }

    // TODO: Send email notification to admin/school
    // For now, we'll just log the request
    console.log(`Token request submitted for student ${studentId}:`, tokenRequest)

    return NextResponse.json({
      success: true,
      message: 'Token request submitted successfully',
      requestId: tokenRequest.id,
      estimatedDelivery: '24-48 hours'
    })

  } catch (error) {
    console.error('Token request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get recent token requests for this student
    const { data: requests, error } = await supabase
      .from('result_token_requests')
      .select('*')
      .eq('student_number', studentId)
      .order('requested_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Error fetching token requests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch token requests' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      requests: requests || [],
      canRequest: true // TODO: Add logic to limit request frequency
    })

  } catch (error) {
    console.error('Error in token request GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
