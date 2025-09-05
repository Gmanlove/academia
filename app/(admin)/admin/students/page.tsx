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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold">Students</h1>
          <p className="text-sm text-muted-foreground">Manage student records and enrollment</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:gap-2">
          <Button variant="outline" onClick={quickAdd} size="sm" className="text-xs sm:text-sm">
            Quick Add
          </Button>
          <Button asChild size="sm" className="text-xs sm:text-sm">
            <Link href="/admin/students/import">Import Students</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:gap-4">
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
          <SelectTrigger className="w-full sm:w-48">
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
          <CardTitle className="text-base sm:text-lg">Student List ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-sm text-muted-foreground">No students found</p>
              <Button onClick={quickAdd} className="mt-4" size="sm">
                Add First Student
              </Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {students.map((student: any) => (
                <div
                  key={student.id}
                  className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 border rounded-lg p-3 sm:p-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm sm:text-base truncate">{student.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      ID: {student.student_id} • {student.performance_level} • GPA: {student.current_gpa}
                    </div>
                    {student.parent_email && (
                      <div className="text-xs sm:text-sm text-muted-foreground truncate">
                        Parent: {student.parent_email}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 sm:flex-shrink-0">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs">
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs">
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
