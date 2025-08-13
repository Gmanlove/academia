import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user's student data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('student_id')
      .eq('id', user.id)
      .single()

    if (userError || !userData?.student_id) {
      return NextResponse.json({ error: 'Student data not found' }, { status: 404 })
    }

    // Get results for the student
    const { data: results, error: resultsError } = await supabase
      .from('results')
      .select(`
        id,
        student_id,
        school_id,
        class_id,
        subject_id,
        ca,
        exam,
        total,
        grade,
        position,
        term,
        session,
        submitted_at,
        submitted_by,
        teacher_remark
      `)
      .eq('student_id', userData.student_id)
      .order('submitted_at', { ascending: false })

    if (resultsError) {
      console.error('Error fetching results:', resultsError)
      return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
    }

    // Transform data to match the expected type
    const transformedResults = results?.map(result => ({
      id: result.id,
      studentId: result.student_id,
      schoolId: result.school_id,
      classId: result.class_id,
      subjectId: result.subject_id,
      ca: result.ca,
      exam: result.exam,
      total: result.total,
      grade: result.grade,
      position: result.position,
      term: result.term as "Term 1" | "Term 2" | "Term 3",
      session: result.session,
      submittedAt: result.submitted_at,
      submittedBy: result.submitted_by,
      teacherRemark: result.teacher_remark
    })) || []

    return NextResponse.json({ data: transformedResults })
  } catch (error) {
    console.error('Error in results API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
