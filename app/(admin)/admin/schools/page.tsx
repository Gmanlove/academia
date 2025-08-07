"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { School } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SchoolsPage() {
  const [brand, setBrand] = useState<string>("all")
  const [statusOnlyActive, setStatusOnlyActive] = useState<boolean | "all">("all")
  const [q, setQ] = useState("")
  const { data, mutate } = useSWR<School[]>(`/api/schools?q=${encodeURIComponent(q)}&brand=${brand}&active=${statusOnlyActive}`, fetcher)

  const filtered = useMemo(() => data ?? [], [data])

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/schools`, {
      method: "PATCH",
      body: JSON.stringify({ id, active }),
    })
    mutate()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Schools</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="col-span-2">
            <Label htmlFor="q">Search</Label>
            <Input id="q" placeholder="Search by name..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div>
            <Label>Brand</Label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Acme">Acme</SelectItem>
                <SelectItem value="Contoso">Contoso</SelectItem>
                <SelectItem value="Globex">Globex</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <div className="space-y-1">
              <Label>Only Active</Label>
              <div className="flex items-center gap-2">
                <Switch checked={statusOnlyActive === true} onCheckedChange={(v) => setStatusOnlyActive(v ? true : "all")} />
                <span className="text-sm text-muted-foreground">{statusOnlyActive === true ? "Active" : "All"}</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => { setQ(""); setBrand("all"); setStatusOnlyActive("all") }}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((s) => (
          <Card key={s.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{s.name}</span>
                <Badge variant={s.active ? "default" : "secondary"}>{s.active ? "Active" : "Inactive"}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-sm text-muted-foreground">Brand: {s.brand}</div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-2xl font-semibold">{s.stats.students}</div>
                  <div className="text-xs">Students</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">{s.stats.teachers}</div>
                  <div className="text-xs">Teachers</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold">{s.stats.classes}</div>
                  <div className="text-xs">Classes</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={!!s.active} onCheckedChange={(v) => toggleActive(s.id, v)} />
                  <span className="text-sm">Toggle Active</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/admin/schools/${s.id}`}>View</a>
                  </Button>
                  <Button variant="secondary" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
