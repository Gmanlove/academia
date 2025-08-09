import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const body = await req.json()
    const rows = (body?.rows ?? []) as any[]
    
    if (!Array.isArray(rows)) {
      return new NextResponse("Invalid rows", { status: 400 })
    }

    // Get default school and class if needed
    const { data: schools } = await supabase
      .from('schools')
      .select('id')
      .eq('active', true)
      .limit(1)

    const { data: classes } = await supabase
      .from('classes')
      .select('id')
      .limit(1)

    if (!schools || schools.length === 0) {
      return new NextResponse("No active schools found", { status: 400 })
    }

    if (!classes || classes.length === 0) {
      return new NextResponse("No classes found", { status: 400 })
    }

    const defaultSchoolId = schools[0].id
    const defaultClassId = classes[0].id

    const prepared = rows
      .filter((r) => r.studentId && r.name)
      .map((r) => ({
        student_id: r.studentId,
        name: r.name,
        email: r.email,
        school_id: r.schoolId || defaultSchoolId,
        class_id: r.classId || defaultClassId,
        parent_name: r.parentName,
        parent_email: r.parentEmail,
        parent_phone: r.parentPhone,
        performance_level: r.performance?.level || 'Average',
        current_gpa: r.performance?.gpa || 3.0,
        active: true
      }))

    const { data, error } = await supabase
      .from('students')
      .insert(prepared)
      .select()

    if (error) {
      console.error('Database error:', error)
      return new NextResponse("Failed to import students", { status: 500 })
    }

    return NextResponse.json({ count: data?.length || 0 })
  } catch (error) {
    console.error('Server error:', error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
