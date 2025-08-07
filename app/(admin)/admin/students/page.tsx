"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Student } from "@/lib/types"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function StudentsPage() {
  const [q, setQ] = useState("")
  const [perf, setPerf] = useState<"all" | "Low" | "Average" | "High">("all")
  const { data, mutate } = useSWR<Student[]>(`/api/students?q=${encodeURIComponent(q)}&perf=${perf}`, fetcher)

  const students = useMemo(() => data ?? [], [data])

  async function quickAdd() {
    await fetch("/api/students", {
      method: "POST",
      body: JSON.stringify({
        studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        name: "New Student",
        schoolId: "", // assigned later (mock)
        classId: "",
        parentEmail: "parent@mail.com",
        performance: { gpa: 3.0, level: "Average" },
      }),
    })
    mutate()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="col-span-2">
            <Label>Search</Label>
            <Input placeholder="Search by name, ID, or parent info" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div>
            <Label>Performance</Label>
            <Select value={perf} onValueChange={(v: any) => setPerf(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Average">Average</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={() => quickAdd()}>Quick Add</Button>
            <Button asChild variant="outline">
              <Link href="/admin/students/import">Bulk Import</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3">Student ID</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Parent</th>
                <th className="text-left p-3">Contact</th>
                <th className="text-left p-3">GPA</th>
                <th className="text-left p-3">Level</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="p-3">{s.studentId}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.parentName ?? "—"}</td>
                  <td className="p-3">{s.parentEmail ?? s.parentPhone ?? "—"}</td>
                  <td className="p-3">{s.performance.gpa.toFixed(2)}</td>
                  <td className="p-3">{s.performance.level}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/students/${s.id}`}>View</Link>
                      </Button>
                      <Button variant="secondary" size="sm">Message</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-muted-foreground" colSpan={7}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
