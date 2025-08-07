import { NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function POST(req: Request) {
  const body = await req.json()
  const { studentId, token } = body || {}
  if (!studentId || !token) return new NextResponse("Student ID and token required", { status: 400 })

  // Mock token verification:
  // - If token equals "DEMO", accept if token record exists and not expired. Otherwise create one and accept.
  // - Increment attempts and allow up to 5.
  const record = db.findTokenByStudentPublicId(studentId) ?? db.createToken(studentId)
  const expires = new Date(record.expiresAt).getTime()
  if (Date.now() > expires) return new NextResponse("Token expired", { status: 403 })
  db.incrementTokenAttempt(record.id)
  if (record.attempts > 5) return new NextResponse("Trial limit reached", { status: 429 })
  if (token !== "DEMO") return new NextResponse("Invalid token", { status: 401 })

  return NextResponse.json({ ok: true })
}
