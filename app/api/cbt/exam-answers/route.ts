import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: Submit an answer or update existing answer
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      exam_attempt_id,
      exam_question_id,
      answer_text,
      selected_option,
      time_spent_seconds
    } = body

    if (!exam_attempt_id || !exam_question_id) {
      return NextResponse.json(
        { error: 'exam_attempt_id and exam_question_id are required' },
        { status: 400 }
      )
    }

    // Check if answer already exists
    const { data: existingAnswer } = await supabase
      .from('exam_answers')
      .select('id')
      .eq('exam_attempt_id', exam_attempt_id)
      .eq('exam_question_id', exam_question_id)
      .single()

    let data, error

    if (existingAnswer) {
      // Update existing answer
      const result = await supabase
        .from('exam_answers')
        .update({
          answer_text,
          selected_option,
          time_spent_seconds,
          answered_at: new Date().toISOString()
        })
        .eq('id', existingAnswer.id)
        .select()
        .single()
      
      data = result.data
      error = result.error
    } else {
      // Create new answer
      const result = await supabase
        .from('exam_answers')
        .insert({
          exam_attempt_id,
          exam_question_id,
          answer_text,
          selected_option,
          time_spent_seconds
        })
        .select()
        .single()
      
      data = result.data
      error = result.error
    }

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error submitting answer:', error)
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    )
  }
}

// PUT: Submit entire exam
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { exam_attempt_id, time_spent_seconds } = body

    if (!exam_attempt_id) {
      return NextResponse.json({ error: 'exam_attempt_id is required' }, { status: 400 })
    }

    // Update exam attempt status
    const { data, error } = await supabase
      .from('exam_attempts')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        time_spent_seconds
      })
      .eq('id', exam_attempt_id)
      .eq('student_id', user.id)
      .select(`
        *,
        exam:exams(*),
        answers:exam_answers(
          *,
          exam_question:exam_questions(
            *,
            question:questions(*)
          )
        )
      `)
      .single()

    if (error) throw error

    // Auto-grade if show_results_immediately is true
    if (data.exam.show_results_immediately) {
      // Results are already calculated by the trigger
      return NextResponse.json({
        success: true,
        data: {
          ...data,
          show_results: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        show_results: false,
        message: 'Exam submitted successfully. Results will be available soon.'
      }
    })
  } catch (error) {
    console.error('Error submitting exam:', error)
    return NextResponse.json(
      { error: 'Failed to submit exam' },
      { status: 500 }
    )
  }
}
