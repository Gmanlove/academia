import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    
    const schoolId = searchParams.get('schoolId')
    const status = searchParams.get('status')
    const delivery = searchParams.get('delivery')
    const audience = searchParams.get('audience')

    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })

    if (schoolId) query = query.eq('school_id', schoolId)
    if (status && status !== 'all') query = query.eq('status', status)
    if (delivery && delivery !== 'all') query = query.eq('delivery', delivery)
    if (audience && audience !== 'all') query = query.eq('audience', audience)

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
    
    if (!body.title || !body.message || !body.audience || !body.delivery) {
      return new NextResponse("title, message, audience, and delivery are required", { status: 400 })
    }

    // Get default school if not provided
    let schoolId = body.schoolId
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

    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        title: body.title,
        message: body.message,
        school_id: schoolId,
        audience: body.audience,
        delivery: body.delivery,
        status: body.status || 'Scheduled',
        scheduled_for: body.scheduledFor ? new Date(body.scheduledFor).toISOString() : null
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new NextResponse("Failed to create notification", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Server error:', error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
