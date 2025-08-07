"use client"

import { useState } from "react"
import useSWR from "swr"
import { db } from "@/lib/mock-db"
import type { NotificationItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Page() {
  const { data, mutate } = useSWR<NotificationItem[]>("/api/notifications", fetcher)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState<"School" | "Class" | "Custom">("School")
  const [delivery, setDelivery] = useState<"Email" | "SMS" | "App">("Email")

  async function create() {
    await fetch("/api/notifications", {
      method: "POST",
      body: JSON.stringify({ title, message, audience, delivery }),
    })
    setTitle("")
    setMessage("")
    mutate()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Bulk Notification</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="col-span-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Audience</Label>
            <Select value={audience} onValueChange={(v: any) => setAudience(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="School">School</SelectItem>
                <SelectItem value="Class">Class</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Delivery</Label>
            <Select value={delivery} onValueChange={(v: any) => setDelivery(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="App">App</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-4">
            <Label>Message</Label>
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." />
          </div>
          <div className="md:col-span-4">
            <Button onClick={create} disabled={!title || !message}>Schedule</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(data ?? db.listNotifications()).map((n) => (
            <div key={n.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="font-medium">{n.title}</div>
                <div className="text-xs text-muted-foreground">{n.audience} • {n.delivery} • {new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-xs text-muted-foreground">{n.status}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
