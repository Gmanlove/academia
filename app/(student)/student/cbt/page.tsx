"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, FileText, Clock } from "lucide-react"

export default function StudentCBTPage() {
  const router = useRouter()
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/cbt/exams')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch exams')
      }

      setExams(data.exams || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const startExam = (examId: string) => {
    router.push(`/student/cbt/exam/${examId}`)
  }

  const getStatusColor = (exam: any) => {
    const now = new Date()
    const start = exam.start_time ? new Date(exam.start_time) : null
    const end = exam.end_time ? new Date(exam.end_time) : null

    if (start && now < start) return "secondary"
    if (end && now > end) return "destructive"
    return "default"
  }

  const getStatusText = (exam: any) => {
    const now = new Date()
    const start = exam.start_time ? new Date(exam.start_time) : null
    const end = exam.end_time ? new Date(exam.end_time) : null

    if (start && now < start) return "Upcoming"
    if (end && now > end) return "Ended"
    return "Available"
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading exams...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Available Exams</h1>
        <p className="text-muted-foreground">
          View and take exams assigned to your class
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {exams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Exams Available</h3>
            <p className="text-muted-foreground text-center max-w-md">
              There are no published exams available for your class at the moment.
              Check back later or contact your teacher.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{exam.title}</CardTitle>
                  <Badge variant={getStatusColor(exam) as any}>
                    {getStatusText(exam)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {exam.description || "No description provided"}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{exam.subject?.name || "Unknown Subject"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{exam.duration_minutes} minutes</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{exam.question_count || 0} questions</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={() => startExam(exam.id)}
                    className="w-full"
                    disabled={getStatusText(exam) !== "Available"}
                  >
                    {getStatusText(exam) === "Available" ? "Start Exam" : getStatusText(exam)}
                  </Button>
                </div>

                {exam.max_attempts > 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Maximum {exam.max_attempts} attempt(s) allowed
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
