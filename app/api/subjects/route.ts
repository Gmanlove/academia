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

    // Get the student's class and school info
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('class_id, school_id')
      .eq('id', userData.student_id)
      .single()

    if (studentError || !studentData) {
      return NextResponse.json({ error: 'Student details not found' }, { status: 404 })
    }

    // Get subjects for the student's class
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select(`
        id,
        code,
        name,
        school_id,
        is_core,
        credit_hours,
        description,
        passing_grade
      `)
      .eq('school_id', studentData.school_id)
      .contains('class_ids', [studentData.class_id])

    if (subjectsError) {
      console.error('Error fetching subjects:', subjectsError)
      return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 })
    }

    // Transform data to match the expected type
    const transformedSubjects = subjects?.map(subject => ({
      id: subject.id,
      code: subject.code,
      name: subject.name,
      schoolId: subject.school_id,
      teacherIds: [], // Would need a separate query to get teachers
      classIds: [studentData.class_id],
      isCore: subject.is_core,
      creditHours: subject.credit_hours,
      description: subject.description,
      passingGrade: subject.passing_grade
    })) || []

    return NextResponse.json({ data: transformedSubjects })
  } catch (error) {
    console.error('Error in subjects API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
