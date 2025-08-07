"use client"

import Papa from "papaparse"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Student } from "@/lib/types"

type Row = Partial<Omit<Student, "id">>

export default function ImportStudentsPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [importing, setImporting] = useState(false)

  function handleFile(file: File) {
    setErrors([])
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const data = (res.data as any[]).map((r) => ({
          studentId: r.studentId || r["Student ID"],
          name: r.name || r["Name"],
          schoolId: r.schoolId || "",
          classId: r.classId || "",
          parentEmail: r.parentEmail || r["Parent Email"],
          parentPhone: r.parentPhone || r["Parent Phone"],
          performance: {
            gpa: parseFloat(r.gpa ?? "3.0"),
            level: (r.level as any) ?? "Average",
          },
        }))
        setRows(data)
      },
      error: (e) => setErrors([e.message]),
    })
  }

  async function submitImport() {
    setImporting(true)
    const valid = rows.filter((r) => r.studentId && r.name)
    const res = await fetch("/api/students/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: valid }),
    })
    if (!res.ok) {
      const t = await res.text()
      setErrors([t || "Failed to import"])
    } else {
      setRows([])
      alert("Import completed")
    }
    setImporting(false)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Student Import</CardTitle>
          <CardDescription>Upload a CSV file. Columns: studentId, name, schoolId, classId, parentEmail, parentPhone, gpa, level</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            <Label>Upload CSV</Label>
            <Input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />
          </div>
          {errors.length > 0 && (
            <div className="text-red-600 text-sm">
              {errors.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </div>
          )}
          {rows.length > 0 && (
            <div className="rounded-md border">
              <div className="flex items-center justify-between p-3">
                <div className="text-sm">
                  Preview: {rows.length} rows. Only rows with studentId and name are imported.
                </div>
                <Button onClick={submitImport} disabled={importing}>
                  {importing ? "Importing..." : "Start Import"}
                </Button>
              </div>
              <div className="max-h-80 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Student ID</th>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Parent Email</th>
                      <th className="p-2 text-left">GPA</th>
                      <th className="p-2 text-left">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 50).map((r, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="p-2">{r.studentId}</td>
                        <td className="p-2">{r.name}</td>
                        <td className="p-2">{r.parentEmail}</td>
                        <td className="p-2">{r.performance?.gpa}</td>
                        <td className="p-2">{r.performance?.level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
