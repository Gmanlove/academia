import { NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const notification = db.getNotification(params.id)
  
  if (!notification) {
    return new NextResponse("Notification not found", { status: 404 })
  }

  return NextResponse.json(notification)
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updated = db.updateNotification(params.id, body)
    
    if (!updated) {
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
  const deleted = db.deleteNotification(params.id)
  
  if (!deleted) {
    return new NextResponse("Notification not found", { status: 404 })
  }

  return NextResponse.json({ success: true })
}
