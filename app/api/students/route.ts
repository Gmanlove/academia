import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    
    const q = searchParams.get("q") ?? undefined
    const perf = searchParams.get("perf") ?? undefined

    let query = supabase
      .from('students')
      .select(`
        *,
        schools:school_id(name),
        classes:class_id(name)
      `)

    if (perf && perf !== "all") {
      query = query.eq('performance_level', perf)
    }
    
    if (q) {
      query = query.or(`name.ilike.%${q}%,student_id.ilike.%${q}%,parent_email.ilike.%${q}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return new NextResponse("Database error", { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Server error:', error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const body = await req.json()
    
    if (!body.studentId || !body.name) {
      return new NextResponse("studentId and name required", { status: 400 })
    }

    // Get default school and class if not provided
    let schoolId = body.schoolId
    let classId = body.classId

    if (!schoolId) {
      const { data: schools } = await supabase
        .from('schools')
        .select('id')
        .eq('active', true)
        .limit(1)
      
      if (schools && schools.length > 0) {
        schoolId = schools[0].id
      } else {
        return new NextResponse("No active schools found", { status: 400 })
      }
    }

    if (!classId) {
      const { data: classes } = await supabase
        .from('classes')
        .select('id')
        .eq('school_id', schoolId)
        .limit(1)
      
      if (classes && classes.length > 0) {
        classId = classes[0].id
      } else {
        return new NextResponse("No classes found for school", { status: 400 })
      }
    }

    const { data, error } = await supabase
      .from('students')
      .insert([{
        student_id: body.studentId,
        name: body.name,
        email: body.email,
        school_id: schoolId,
        class_id: classId,
        parent_name: body.parentName,
        parent_email: body.parentEmail,
        parent_phone: body.parentPhone,
        performance_level: body.performance?.level || 'Average',
        current_gpa: body.performance?.gpa || 3.0,
        active: true
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new NextResponse("Failed to create student", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Server error:', error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
