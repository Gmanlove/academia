import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const body = await req.json()
    const { studentId, token } = body || {}
    
    if (!studentId || !token) {
      return new NextResponse("Student ID and token required", { status: 400 })
    }

    // Find existing token record
    const { data: existingToken, error: findError } = await supabase
      .from('result_tokens')
      .select('*')
      .eq('student_id', studentId)
      .single()

    if (findError && findError.code !== 'PGRST116') {
      console.error('Database error:', findError)
      return new NextResponse("Database error", { status: 500 })
    }

    let tokenRecord = existingToken

    // Create token if doesn't exist
    if (!tokenRecord) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

      const { data: newToken, error: createError } = await supabase
        .from('result_tokens')
        .insert([{
          student_id: studentId,
          attempts: 0,
          expires_at: expiresAt.toISOString()
        }])
        .select()
        .single()

      if (createError) {
        console.error('Database error:', createError)
        return new NextResponse("Failed to create token", { status: 500 })
      }

      tokenRecord = newToken
    }

    // Check if token is expired
    const expires = new Date(tokenRecord.expires_at).getTime()
    if (Date.now() > expires) {
      return new NextResponse("Token expired", { status: 403 })
    }

    // Increment attempts
    const { data: updatedToken, error: updateError } = await supabase
      .from('result_tokens')
      .update({ attempts: tokenRecord.attempts + 1 })
      .eq('id', tokenRecord.id)
      .select()
      .single()

    if (updateError) {
      console.error('Database error:', updateError)
      return new NextResponse("Failed to update token", { status: 500 })
    }

    // Check attempt limit
    if (updatedToken.attempts > 5) {
      return new NextResponse("Trial limit reached", { status: 429 })
    }

    // Validate token (for demo, we accept "DEMO")
    if (token !== "DEMO") {
      return new NextResponse("Invalid token", { status: 401 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Server error:', error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
