import { NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function POST(req: Request) {
  const body = await req.json()
  const rows = (body?.rows ?? []) as any[]
  if (!Array.isArray(rows)) return new NextResponse("Invalid rows", { status: 400 })
  const prepared = rows
    .filter((r) => r.studentId && r.name)
    .map((r) => ({
      studentId: r.studentId,
      name: r.name,
      schoolId: r.schoolId || db.listSchools()[0].id,
      classId: r.classId || db.listClasses()[0].id,
      parentEmail: r.parentEmail,
      parentPhone: r.parentPhone,
      parentName: r.parentName,
      performance: r.performance || { gpa: 3.0, level: "Average" },
      lastLogin: undefined,
    }))
  const created = db.bulkImportStudents(prepared as any)
  return NextResponse.json({ count: created.length })
}
