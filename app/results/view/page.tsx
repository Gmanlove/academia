"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Trophy,
  Calendar,
  Clock,
  User,
  BookOpen,
  Target,
  Download,
  Share2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react"
import { createClient } from '@/lib/supabase/client'

interface ResultSection {
  name: string
  totalMarks: number
  obtainedMarks: number
  percentage: number
}

interface StudentResult {
  id: string
  studentName: string
  studentId: string
  examTitle: string
  subject: string
  examDate: string
  duration: string
  totalMarks: number
  obtainedMarks: number
  percentage: number
  grade: string
  position: number
  totalStudents: number
  status: string
  sections: ResultSection[]
  teacher: string
  remarks: string
  publishedAt: string
}

function ResultsViewContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [result, setResult] = useState<StudentResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accessAttempts, setAccessAttempts] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const loadResult = async () => {
      try {
        const resultId = searchParams.get('id')
        const token = searchParams.get('token')
        
        if (!resultId) {
          setError('No result ID provided')
          setLoading(false)
          return
        }

        const supabase = createClient()
        
        // First, try to get the result data
        const { data: resultData, error: resultError } = await supabase
          .from('results')
          .select(`
            *,
            students(first_name, last_name, student_id),
            subjects(name),
            teachers(first_name, last_name)
          `)
          .eq('id', resultId)
          .single()

        if (resultError || !resultData) {
          setError('Result not found')
          setLoading(false)
          return
        }

        // Check if token is required and valid
        if (resultData.access_token && resultData.access_token !== token) {
          setError('Invalid access token')
          setAccessAttempts(prev => prev + 1)
          setLoading(false)
          return
        }

        // Get total students in the same class for position calculation
        const { count: totalStudents } = await supabase
          .from('results')
          .select('*', { count: 'exact', head: true })
          .eq('class_id', resultData.class_id)
          .eq('subject_id', resultData.subject_id)
          .eq('term', resultData.term)
          .eq('session', resultData.session)

        // Format the result data
        const formattedResult: StudentResult = {
          id: resultData.id,
          studentName: `${resultData.students.first_name} ${resultData.students.last_name}`,
          studentId: resultData.students.student_id,
          examTitle: `${resultData.subjects.name} - ${resultData.term} ${resultData.session}`,
          subject: resultData.subjects.name,
          examDate: resultData.exam_date || resultData.created_at,
          duration: '2 hours', // This could be stored in the database
          totalMarks: 100, // Assuming CA + Exam = 100
          obtainedMarks: resultData.total,
          percentage: resultData.total,
          grade: resultData.grade,
          position: resultData.position || 0,
          totalStudents: totalStudents || 0,
          status: 'published',
          sections: [
            {
              name: 'Continuous Assessment',
              totalMarks: 40,
              obtainedMarks: resultData.ca || 0,
              percentage: ((resultData.ca || 0) / 40) * 100,
            },
            {
              name: 'Examination',
              totalMarks: 60,
              obtainedMarks: resultData.exam || 0,
              percentage: ((resultData.exam || 0) / 60) * 100,
            }
          ],
          teacher: `${resultData.teachers.first_name} ${resultData.teachers.last_name}`,
          remarks: resultData.teacher_remark || 'No remarks provided',
          publishedAt: resultData.created_at,
        }

        setResult(formattedResult)
        setIsAuthenticated(true)
      } catch (err) {
        console.error('Error loading result:', err)
        setError('Failed to load result')
      } finally {
        setLoading(false)
      }
    }

    loadResult()
  }, [searchParams])
  const [showDetails, setShowDetails] = useState(true)

  const resultId = searchParams.get("id")
  const accessCode = searchParams.get("code")

  useEffect(() => {
    // Simulate authentication and data loading
    const timer = setTimeout(() => {
      if (!resultId) {
        setError("Result ID is required")
        setLoading(false)
        return
      }

      // Simulate access attempt tracking
      const attempts = Number.parseInt(localStorage.getItem("result-access-attempts") || "0") + 1
      localStorage.setItem("result-access-attempts", attempts.toString())
      setAccessAttempts(attempts)

      // Simulate authentication check
      if (accessCode === "valid-code" || attempts <= 3) {
        setIsAuthenticated(true)
        setLoading(false)
      } else {
        setError("Invalid access code or too many attempts")
        setLoading(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [resultId, accessCode])

  // Session timeout countdown
  useEffect(() => {
    if (isAuthenticated) {
      const timeout = setTimeout(() => {
        setError("Session expired. Please refresh to view results again.")
        setIsAuthenticated(false)
      }, 300000) // 5 minutes

      return () => clearTimeout(timeout)
    }
  }, [isAuthenticated])

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-800"
      case "B":
        return "bg-blue-100 text-blue-800"
      case "C":
        return "bg-yellow-100 text-yellow-800"
      case "D":
        return "bg-orange-100 text-orange-800"
      case "F":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPerformanceIcon = (percentage: number) => {
    if (percentage >= 90) return <Trophy className="h-4 w-4 text-yellow-500" />
    if (percentage >= 80) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (percentage >= 70) return <Target className="h-4 w-4 text-blue-500" />
    if (percentage >= 60) return <AlertCircle className="h-4 w-4 text-orange-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const handleDownload = () => {
    if (!result) return
    // Simulate PDF download
    const element = document.createElement("a")
    element.href = "#"
    element.download = `result-${result.id}.pdf`
    element.click()
  }

  const handleShare = () => {
    if (!result) return
    if (navigator.share) {
      navigator.share({
        title: `${result.studentName} - ${result.examTitle}`,
        text: `Result: ${result.percentage}% (${result.grade})`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Button onClick={() => router.push("/results")} variant="outline">
              Back to Results
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Alert>
            <Eye className="h-4 w-4" />
            <AlertDescription>Please provide a valid access code to view this result.</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No result data available</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Examination Result</h1>
          <p className="text-muted-foreground">Official result for {result.examTitle}</p>
        </div>

        {/* Result Status */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {getPerformanceIcon(result.percentage)}
              <CardTitle className="text-2xl">{result.studentName}</CardTitle>
            </div>
            <CardDescription>Student ID: {result.studentId}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold">
                  {result.obtainedMarks}/{result.totalMarks}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Percentage</p>
                <p className="text-2xl font-bold">{result.percentage}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Grade</p>
                <Badge className={`text-lg px-3 py-1 ${getGradeColor(result.grade)}`}>{result.grade}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="text-2xl font-bold">
                  {result.position}/{result.totalStudents}
                </p>
              </div>
            </div>

            <Progress value={result.percentage} className="w-full h-3" />
          </CardContent>
        </Card>

        {/* Exam Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Examination Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Date: {new Date(result.examDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Duration: {result.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Teacher: {result.teacher}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Subject: {result.subject}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section-wise Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Section-wise Performance</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showDetails ? "Hide" : "Show"} Details
              </Button>
            </div>
          </CardHeader>
          {showDetails && (
            <CardContent>
              <div className="space-y-4">
                {result.sections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{section.name}</h4>
                      <div className="flex items-center gap-2">
                        {getPerformanceIcon(section.percentage)}
                        <span className="text-sm font-medium">
                          {section.obtainedMarks}/{section.totalMarks} ({section.percentage}%)
                        </span>
                      </div>
                    </div>
                    <Progress value={section.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Teacher's Remarks */}
        {result.remarks && (
          <Card>
            <CardHeader>
              <CardTitle>Teacher's Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{result.remarks}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={handleShare} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            Share Result
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Result published on {new Date(result.publishedAt).toLocaleString()}</p>
          <p>This is an official document. Any tampering is strictly prohibited.</p>
        </div>
      </div>
    </div>
  )
}

export default function ResultsViewPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
            </div>
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <ResultsViewContent />
    </Suspense>
  )
}
