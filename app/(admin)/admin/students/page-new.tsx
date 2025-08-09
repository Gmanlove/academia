"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [performanceFilter, setPerformanceFilter] = useState("all")

  const { data: students = [], mutate } = useSWR(
    `/api/students?q=${searchTerm}&perf=${performanceFilter}`,
    fetcher
  )

  async function quickAdd() {
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
          name: "New Student",
          email: "newstudent@example.com",
          parentEmail: "parent@example.com",
          performance: { gpa: 3.0, level: "Average" },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add student")
      }

      mutate()
    } catch (error) {
      console.error("Error adding student:", error)
      alert("Failed to add student")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage student records and enrollment</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={quickAdd}>
            Quick Add
          </Button>
          <Button asChild>
            <Link href="/admin/students/import">Import Students</Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Performance</SelectItem>
            <SelectItem value="Excellent">Excellent</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Average">Average</SelectItem>
            <SelectItem value="Poor">Poor</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students found</p>
              <Button onClick={quickAdd} className="mt-4">
                Add First Student
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((student: any) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {student.student_id} • {student.performance_level} • GPA: {student.current_gpa}
                    </div>
                    {student.parent_email && (
                      <div className="text-sm text-muted-foreground">
                        Parent: {student.parent_email}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
