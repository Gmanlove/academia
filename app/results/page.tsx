"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Page() {
  const [studentId, setStudentId] = useState("")
  const [token, setToken] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit() {
    setError(null)
    const res = await fetch("/api/token", {
      method: "POST",
      body: JSON.stringify({ studentId, token }),
    })
    if (res.ok) {
      router.push(`/results/view?studentId=${encodeURIComponent(studentId)}`)
    } else {
      const t = await res.text()
      setError(t || "Verification failed")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader><CardTitle>Result Checker</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label>Student ID</Label>
            <Input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g., STU-1001" />
          </div>
          <div className="space-y-1">
            <Label>Token</Label>
            <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Enter access token" />
          </div>
          <Button onClick={onSubmit} disabled={!studentId || !token}>View Result</Button>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="text-xs text-muted-foreground">Need help? See <a className="underline" href="/results/help">Help & Support</a></div>
        </CardContent>
      </Card>
    </div>
  )
}
