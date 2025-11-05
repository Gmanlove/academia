import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: Start a new exam attempt
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { exam_id } = body

    if (!exam_id) {
      return NextResponse.json({ error: 'exam_id is required' }, { status: 400 })
    }

    // Get exam details
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .select('*, exam_questions(*, question:questions(*))')
      .eq('id', exam_id)
      .single()

    if (examError) throw examError
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }

    // Check if exam is available
    if (exam.status !== 'published') {
      return NextResponse.json({ error: 'Exam is not available' }, { status: 403 })
    }

    const now = new Date()
    if (exam.start_time && new Date(exam.start_time) > now) {
      return NextResponse.json({ error: 'Exam has not started yet' }, { status: 403 })
    }
    if (exam.end_time && new Date(exam.end_time) < now) {
      return NextResponse.json({ error: 'Exam has ended' }, { status: 403 })
    }

    // Check previous attempts
    const { data: attempts, error: attemptsError } = await supabase
      .from('exam_attempts')
      .select('attempt_number')
      .eq('exam_id', exam_id)
      .eq('student_id', user.id)
      .order('attempt_number', { ascending: false })

    if (attemptsError) throw attemptsError

    const attemptNumber = (attempts && attempts.length > 0) ? attempts[0].attempt_number + 1 : 1

    if (exam.max_attempts && attemptNumber > exam.max_attempts) {
      return NextResponse.json({ error: 'Maximum attempts reached' }, { status: 403 })
    }

    // Create new attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('exam_attempts')
      .insert({
        exam_id,
        student_id: user.id,
        attempt_number: attemptNumber,
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (attemptError) throw attemptError

    // Shuffle questions if needed
    let questions = exam.exam_questions
    if (exam.shuffle_questions) {
      questions = [...questions].sort(() => Math.random() - 0.5)
    }

    // Shuffle options if needed
    if (exam.shuffle_options) {
      questions = questions.map((q: any) => {
        if (q.question.options) {
          return {
            ...q,
            question: {
              ...q.question,
              options: [...q.question.options].sort(() => Math.random() - 0.5)
            }
          }
        }
        return q
      })
    }

    // Return attempt with questions (without correct answers)
    const sanitizedQuestions = questions.map((q: any) => ({
      id: q.id,
      question_order: q.question_order,
      points: q.points,
      question: {
        id: q.question.id,
        question_text: q.question.question_text,
        question_type: q.question.question_type,
        options: q.question.options?.map((opt: any, idx: number) => ({
          text: opt.text,
          index: idx
        })),
        points: q.question.points
      }
    }))

    return NextResponse.json({
      success: true,
      data: {
        attempt,
        exam: {
          id: exam.id,
          title: exam.title,
          description: exam.description,
          duration_minutes: exam.duration_minutes,
          total_points: exam.total_points
        },
        questions: sanitizedQuestions
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error starting exam attempt:', error)
    return NextResponse.json(
      { error: 'Failed to start exam attempt' },
      { status: 500 }
    )
  }
}

// GET: Get active exam attempt
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const attemptId = searchParams.get('attempt_id')

    if (!attemptId) {
      return NextResponse.json({ error: 'attempt_id is required' }, { status: 400 })
    }

    // Get attempt with answers
    const { data: attempt, error } = await supabase
      .from('exam_attempts')
      .select(`
        *,
        exam:exams(*),
        answers:exam_answers(*)
      `)
      .eq('id', attemptId)
      .eq('student_id', user.id)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data: attempt })
  } catch (error) {
    console.error('Error fetching exam attempt:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exam attempt' },
      { status: 500 }
    )
  }
}
