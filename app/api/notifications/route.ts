import { NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function GET() {
  return NextResponse.json(db.listNotifications())
}

export async function POST(req: Request) {
  const body = await req.json()
  if (!body.title || !body.message) return new NextResponse("title and message required", { status: 400 })
  const created = db.addNotification({
    title: body.title,
    message: body.message,
    audience: body.audience ?? "School",
    delivery: body.delivery ?? "Email",
  })
  return NextResponse.json(created)
}
