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

    // Get detailed student information
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select(`
        *,
        schools:school_id(name),
        classes:class_id(name, level)
      `)
      .eq('id', userData.student_id)
      .single()

    if (studentError || !student) {
      console.error('Error fetching student details:', studentError)
      return NextResponse.json({ error: 'Student details not found' }, { status: 404 })
    }

    // Transform data to match the expected Student type
    const transformedStudent = {
      id: student.id,
      studentId: student.student_id,
      name: student.name,
      email: student.email,
      photoUrl: student.photo_url,
      dateOfBirth: student.date_of_birth,
      gender: student.gender as "Male" | "Female" | undefined,
      schoolId: student.school_id,
      classId: student.class_id,
      parentName: student.parent_name,
      parentEmail: student.parent_email,
      parentPhone: student.parent_phone,
      secondaryParentName: student.secondary_parent_name,
      secondaryParentEmail: student.secondary_parent_email,
      secondaryParentPhone: student.secondary_parent_phone,
      address: student.address,
      enrollmentDate: student.enrollment_date,
      active: student.active,
      lastLogin: student.last_login,
      performanceLevel: student.performance_level as "Excellent" | "Good" | "Average" | "Poor" | "Critical",
      currentGPA: student.current_gpa,
      school: student.schools,
      class: student.classes
    }

    return NextResponse.json({ data: transformedStudent })
  } catch (error) {
    console.error('Error in student profile API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
