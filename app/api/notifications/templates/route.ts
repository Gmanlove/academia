import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/notifications/templates - List notification templates
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const schoolId = searchParams.get('schoolId')

    let query = supabase
      .from('notification_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (schoolId) query = query.eq('school_id', schoolId)

    const { data: templates, error } = await query

    if (error) {
      console.error('Database error:', error)
      return new NextResponse("Database error", { status: 500 })
    }

    return NextResponse.json({
      templates: templates || [],
      total: templates?.length || 0
    })
  } catch (error) {
    console.error('Server error:', error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

// POST /api/notifications/templates - Create new template
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    // Validation
    if (!body.name || !body.subject || !body.message) {
      return new NextResponse("name, subject, and message are required", { status: 400 })
    }

    // Extract variables from template content
    const variableRegex = /\{\{(\w+)\}\}/g
    const variables = new Set<string>()
    let match

    // Extract from subject
    while ((match = variableRegex.exec(body.subject)) !== null) {
      variables.add(match[1])
    }

    // Reset regex lastIndex and extract from message
    variableRegex.lastIndex = 0
    while ((match = variableRegex.exec(body.message)) !== null) {
      variables.add(match[1])
    }

    const template = {
      name: body.name,
      category: body.category || "Administrative",
      subject: body.subject,
      message: body.message,
      variables: Array.from(variables),
      school_id: body.schoolId,
      is_system: body.isSystem || false,
      created_by: body.createdBy || "admin",
      usage_stats: {
        times_used: 0,
        avg_open_rate: 0,
        avg_click_rate: 0
      }
    }

    const { data: created, error } = await supabase
      .from('notification_templates')
      .insert(template)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new NextResponse("Database error", { status: 500 })
    }

    return NextResponse.json(created)
  } catch (error) {
    console.error("Error creating template:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

// PATCH /api/notifications/templates - Bulk template operations
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { action, templateIds, data } = body

    switch (action) {
      case 'bulk_delete':
        const { error: deleteError } = await supabase
          .from('notification_templates')
          .delete()
          .in('id', templateIds)
        
        if (deleteError) {
          return new NextResponse("Delete failed", { status: 500 })
        }
        return NextResponse.json({ success: true, deleted: templateIds.length })
      
      case 'bulk_category_update':
        const { error: updateError } = await supabase
          .from('notification_templates')
          .update({ category: data.category })
          .in('id', templateIds)

        if (updateError) {
          return new NextResponse("Update failed", { status: 500 })
        }
        return NextResponse.json({ success: true, updated: templateIds.length })
      
      default:
        return new NextResponse("Invalid action", { status: 400 })
    }
  } catch (error) {
    console.error("Error in bulk template operation:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
