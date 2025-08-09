import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    
    const brand = searchParams.get('brand')
    const active = searchParams.get('active')
    const q = searchParams.get('q')

    let query = supabase
      .from('schools')
      .select('*')

    if (brand) query = query.eq('brand', brand)
    if (active !== null) query = query.eq('active', active === 'true')
    if (q) query = query.ilike('name', `%${q}%`)

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
    
    if (!body.name || !body.brand || !body.contactEmail) {
      return new NextResponse("name, brand, and contactEmail are required", { status: 400 })
    }

    const { data, error } = await supabase
      .from('schools')
      .insert([{
        name: body.name,
        brand: body.brand,
        contact_email: body.contactEmail,
        contact_phone: body.contactPhone,
        address: body.address,
        website: body.website,
        active: body.active ?? true,
        plan: body.plan || 'Free',
        max_students: body.maxStudents || 100,
        admin_assigned: body.adminAssigned
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new NextResponse("Failed to create school", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Server error:', error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient()
    const body = await req.json()
    
    if (!body.id || typeof body.active !== "boolean") {
      return new NextResponse("Invalid payload", { status: 400 })
    }

    const { data, error } = await supabase
      .from('schools')
      .update({ active: body.active })
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new NextResponse("Failed to update school", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Server error:', error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
