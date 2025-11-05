import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: Fetch exams (teachers see their own, students see published exams for their class)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role (default to teacher/admin if no profile)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    let query = supabase
      .from('exams')
      .select(`
        *,
        subject:subjects(id, name),
        teacher:teachers(id, first_name, last_name),
        class:classes(id, name),
        question_bank:question_banks(id, title),
        exam_questions(count)
      `)

    // Default to teacher behavior if no profile (development mode)
    if (!profile || profile.role === 'teacher' || profile.role === 'admin') {
      query = query.eq('teacher_id', user.id)
    } else if (profile.role === 'student') {
      // Students only see published exams for their class
      const { data: student } = await supabase
        .from('students')
        .select('class_id')
        .eq('id', user.id)
        .single()

      if (student?.class_id) {
        query = query
          .eq('class_id', student.class_id)
          .eq('status', 'published')
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching exams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    )
  }
}

// POST: Create a new exam (teachers only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      subject_id,
      class_id,
      school_id,
      question_bank_id,
      duration_minutes,
      passing_score,
      start_time,
      end_time,
      shuffle_questions,
      shuffle_options,
      show_results_immediately,
      allow_review,
      max_attempts,
      selected_questions // Array of question IDs
    } = body

    if (!title || !subject_id || !class_id || !duration_minutes) {
      return NextResponse.json(
        { error: 'Title, subject, class, and duration are required' },
        { status: 400 }
      )
    }

    // Calculate total points
    const totalPoints = selected_questions?.reduce((sum: number, q: any) => sum + (q.points || 1), 0) || 0

    // Create exam
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .insert({
        title,
        description,
        subject_id,
        teacher_id: user.id,
        class_id,
        school_id,
        question_bank_id,
        duration_minutes,
        total_points: totalPoints,
        passing_score: passing_score || 50,
        start_time,
        end_time,
        shuffle_questions: shuffle_questions || false,
        shuffle_options: shuffle_options || false,
        show_results_immediately: show_results_immediately || false,
        allow_review: allow_review !== false,
        max_attempts: max_attempts || 1,
        status: 'draft'
      })
      .select()
      .single()

    if (examError) throw examError

    // Add selected questions to exam
    if (selected_questions && selected_questions.length > 0) {
      const examQuestions = selected_questions.map((q: any, index: number) => ({
        exam_id: exam.id,
        question_id: q.id,
        question_order: index + 1,
        points: q.points || 1
      }))

      const { error: questionsError } = await supabase
        .from('exam_questions')
        .insert(examQuestions)

      if (questionsError) throw questionsError
    }

    return NextResponse.json({ success: true, data: exam }, { status: 201 })
  } catch (error) {
    console.error('Error creating exam:', error)
    return NextResponse.json(
      { error: 'Failed to create exam' },
      { status: 500 }
    )
  }
}

// PUT: Update exam
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Exam ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('exams')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('teacher_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating exam:', error)
    return NextResponse.json(
      { error: 'Failed to update exam' },
      { status: 500 }
    )
  }
}
