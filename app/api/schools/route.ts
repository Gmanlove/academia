import { NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") ?? undefined
  const brand = searchParams.get("brand") ?? undefined
  const activeParam = searchParams.get("active")
  const active = activeParam === "true" ? true : activeParam === "false" ? false : undefined
  const data = db.listSchools({
    q,
    brand: brand && brand !== "all" ? (brand as any) : undefined,
    active,
  })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const body = await req.json()
  if (!body.id || typeof body.active !== "boolean") return new NextResponse("Invalid payload", { status: 400 })
  const s = db.toggleSchoolActive(body.id, body.active)
  if (!s) return new NextResponse("Not found", { status: 404 })
  return NextResponse.json(s)
}
