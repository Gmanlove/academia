import { NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") ?? undefined
  const perf = searchParams.get("perf") ?? undefined
  const data = db.listStudents({
    q,
    performanceLevel: perf && perf !== "all" ? (perf as any) : undefined,
  })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  if (!body.studentId || !body.name) return new NextResponse("studentId and name required", { status: 400 })
  const created = db.addStudent({
    studentId: body.studentId,
    name: body.name,
    schoolId: body.schoolId || db.listSchools()[0].id,
    classId: body.classId || db.listClasses()[0].id,
    parentEmail: body.parentEmail,
    parentPhone: body.parentPhone,
    parentName: body.parentName,
    performance: body.performance || { gpa: 3.0, level: "Average" },
    lastLogin: undefined,
  })
  return NextResponse.json(created)
}
