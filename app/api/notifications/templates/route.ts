import { NextResponse } from "next/server"
import { db } from "@/lib/mock-db"
import { NotificationTemplate } from "@/lib/types"

// GET /api/notifications/templates - List notification templates
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const schoolId = searchParams.get('schoolId')

  const templates = db.listNotificationTemplates({
    category: category || undefined,
    schoolId: schoolId || undefined
  })

  return NextResponse.json({
    templates,
    total: templates.length
  })
}

// POST /api/notifications/templates - Create new template
export async function POST(request: Request) {
  try {
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

    const template: Omit<NotificationTemplate, "id" | "createdAt"> = {
      name: body.name,
      category: body.category || "Administrative",
      subject: body.subject,
      message: body.message,
      variables: Array.from(variables),
      schoolId: body.schoolId,
      isSystem: body.isSystem || false,
      createdBy: body.createdBy || "admin",
      usageStats: {
        timesUsed: 0,
        avgOpenRate: 0,
        avgClickRate: 0
      }
    }

    const created = db.addNotificationTemplate(template)
    return NextResponse.json(created)
  } catch (error) {
    console.error("Error creating template:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

// PATCH /api/notifications/templates - Bulk template operations
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { action, templateIds, data } = body

    switch (action) {
      case 'bulk_delete':
        templateIds.forEach((id: string) => db.deleteNotificationTemplate(id))
        return NextResponse.json({ success: true, deleted: templateIds.length })
      
      case 'bulk_category_update':
        templateIds.forEach((id: string) => {
          db.updateNotificationTemplate(id, { category: data.category })
        })
        return NextResponse.json({ success: true, updated: templateIds.length })
      
      default:
        return new NextResponse("Invalid action", { status: 400 })
    }
  } catch (error) {
    console.error("Error in bulk template operation:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
