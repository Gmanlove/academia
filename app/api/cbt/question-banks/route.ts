import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: Fetch question banks for logged-in teacher
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get teacher profile (or allow if profile doesn't exist - development mode)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Allow access if no profile exists (development/default admin) OR if role is teacher/admin
    if (profile && profile.role !== 'teacher' && profile.role !== 'admin') {
      return NextResponse.json({ error: 'Only teachers can access question banks' }, { status: 403 })
    }

    // Get teacher's question banks
    const { data, error } = await supabase
      .from('question_banks')
      .select(`
        *,
        subject:subjects(id, name),
        teacher:teachers(id, first_name, last_name),
        questions:questions(count)
      `)
      .eq('teacher_id', user.id)
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching question banks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question banks' },
      { status: 500 }
    )
  }
}

// POST: Create a new question bank
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check role (allow if no profile or if teacher/admin)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile && profile.role !== 'teacher' && profile.role !== 'admin') {
      return NextResponse.json({ error: 'Only teachers can create question banks' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, subject_id, school_id } = body

    if (!title || !subject_id) {
      return NextResponse.json(
        { error: 'Title and subject are required' },
        { status: 400 }
      )
    }

    // Create question bank
    const { data, error } = await supabase
      .from('question_banks')
      .insert({
        title,
        description,
        subject_id,
        teacher_id: user.id,
        school_id,
        active: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Error creating question bank:', error)
    return NextResponse.json(
      { error: 'Failed to create question bank' },
      { status: 500 }
    )
  }
}
