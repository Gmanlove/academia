import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: notification, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error || !notification) {
      return new NextResponse("Notification not found", { status: 404 })
    }

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Database error:', error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { data: updated, error } = await supabase
      .from('notifications')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()
    
    if (error || !updated) {
      return new NextResponse("Notification not found", { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating notification:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      return new NextResponse("Error deleting notification", { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
