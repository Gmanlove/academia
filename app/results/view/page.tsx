"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Star,
  Download,
  Printer,
  Share2,
  Shield,
  Eye,
  LogOut,
  Timer,
  FileText,
  AlertTriangle,
  Info,
  Lock,
  Send,
  BarChart3,
  Target,
  BookOpen,
  Users,
} from "lucide-react"

interface StudentResult {
  id: string
  subjectId: string
  subjectName: string
  ca: number
  exam: number
  total: number
  grade: string
  teacherRemark: string
  position: number
  classAverage: number
}

interface StudentInfo {
  id: string
  name: string
  studentId: string
  className: string
  classLevel: string
  photoUrl?: string
  dateOfBirth: string
  parentName: string
  parentEmail: string
  enrollmentDate: string
  overallAverage: number
  gpa: number
  totalStudents: number
  classPosition: number
  term: string
  academicYear: string
  nextTerm: string
}

function ResultViewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const printRef = useRef<HTMLDivElement>(null)

  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
  const [results, setResults] = useState<StudentResult[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionTimeLeft, setSessionTimeLeft] = useState(15 * 60) // 15 minutes
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)
  const [shareEmail, setShareEmail] = useState("")
  const [shareMessage, setShareMessage] = useState("")
  const [accessAttempts, setAccessAttempts] = useState(1)
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  useEffect(() => {
    const studentId = searchParams.get("studentId")
    if (!studentId) {
      router.push("/results")
      return
    }

    // Simulate authentication check
    const authCheck = localStorage.getItem("result-auth-time")
    const currentTime = Date.now()

    if (!authCheck || currentTime - Number.parseInt(authCheck) > 15 * 60 * 1000) {
      setIsAuthenticated(false)
      router.push("/results")
      return
    }

    // Load student data
    setTimeout(() => {
      const mockStudentInfo: StudentInfo = {
        id: "1",
        name: "John Doe",
        studentId: studentId,
        className: "JSS 2A",
        classLevel: "JSS 2",
        photoUrl: "/placeholder-user.jpg",
        dateOfBirth: "2008-05-15",
        parentName: "Mr. & Mrs. Doe",
        parentEmail: "parent@example.com",
        enrollmentDate: "2023-09-01",
        overallAverage: 78.5,
        gpa: 3.2,
        totalStudents: 45,
        classPosition: 12,
        term: "Second Term",
        academicYear: "2024/2025",
        nextTerm: "September 15, 2025",
      }

      const mockResults: StudentResult[] = [
        {
          id: "1",
          subjectId: "math",
          subjectName: "Mathematics",
          ca: 25,
          exam: 58,
          total: 83,
          grade: "A",
          teacherRemark: "Excellent performance! Keep up the great work.",
          position: 3,
          classAverage: 72,
        },
        {
          id: "2",
          subjectId: "eng",
          subjectName: "English Language",
          ca: 22,
          exam: 52,
          total: 74,
          grade: "B",
          teacherRemark: "Good work! Continue to strive for excellence.",
          position: 8,
          classAverage: 68,
        },
        {
          id: "3",
          subjectId: "sci",
          subjectName: "Basic Science",
          ca: 20,
          exam: 55,
          total: 75,
          grade: "B",
          teacherRemark: "Good understanding of concepts.",
          position: 7,
          classAverage: 70,
        },
      ]

      setStudentInfo(mockStudentInfo)
      setResults(mockResults)
      setLoading(false)

      // Store access attempt
      const attempts = Number.parseInt(localStorage.getItem("result-access-attempts") || "0") + 1
      localStorage.setItem("result-access-attempts", attempts.toString())
      setAccessAttempts(attempts)
    }, 1000)
  }, [searchParams, router])

  // Session timeout countdown
  useEffect(() => {
    if (!isAuthenticated) return

    const timer = setInterval(() => {
      setSessionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSessionExpired()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isAuthenticated])

  const getGrade = (score: number): string => {
    if (score >= 90) return "A+"
    if (score >= 80) return "A"
    if (score >= 70) return "B"
    if (score >= 60) return "C"
    if (score >= 50) return "D"
    return "F"
  }

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case "A+":
      case "A":
        return "text-green-600 bg-green-100"
      case "B":
        return "text-blue-600 bg-blue-100"
      case "C":
        return "text-yellow-600 bg-yellow-100"
      case "D":
        return "text-orange-600 bg-orange-100"
      default:
        return "text-red-600 bg-red-100"
    }
  }

  const calculateGPA = (results: StudentResult[]): number => {
    const gradePoints: { [key: string]: number } = {
      "A+": 4.0,
      A: 4.0,
      B: 3.0,
      C: 2.0,
      D: 1.0,
      F: 0.0,
    }
    const totalPoints = results.reduce((sum, r) => sum + (gradePoints[r.grade] || 0), 0)
    return totalPoints / results.length
  }

  const generateTeacherRemark = (score: number): string => {
    if (score >= 80) return "Excellent performance! Keep up the great work."
    if (score >= 70) return "Good work! Continue to strive for excellence."
    if (score >= 60) return "Satisfactory performance. Room for improvement."
    if (score >= 50) return "Fair performance. More effort needed."
    return "Poor performance. Requires immediate attention and support."
  }

  const handleSessionExpired = () => {
    localStorage.removeItem("result-auth-time")
    localStorage.removeItem("result-access-attempts")
    router.push("/results")
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    setDownloadDialogOpen(false)
    // Simulate PDF generation
    const link = document.createElement("a")
    link.href = "#"
    link.download = `${studentInfo?.studentId}_results_${studentInfo?.term}.pdf`
    link.click()
  }

  const handleShare = () => {
    if (!shareEmail) return

    // Simulate email sharing
    console.log("Sharing results to:", shareEmail, "Message:", shareMessage)
    setShareDialogOpen(false)
    setShareEmail("")
    setShareMessage("")
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getPerformanceIcon = (total: number) => {
    if (total >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (total >= 60) return <Star className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading your results...</p>
          <p className="text-sm text-gray-500">Please wait while we fetch your academic information</p>
        </div>
      </div>
    )
  }

  if (!studentInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Student Not Found</h2>
            <p className="text-gray-600 mb-4">The requested student information could not be located.</p>
            <Button onClick={() => router.push("/results")}>
              <LogOut className="mr-2 h-4 w-4" />
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 print:bg-white">
      {/* Security Bar - Hidden on print */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Secure Session</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-600">
                Session expires in: <span className="font-mono font-medium">{formatTime(sessionTimeLeft)}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Access #{accessAttempts} | View Only</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Download Results</DialogTitle>
                  <DialogDescription>Generate a watermarked PDF copy of the academic results</DialogDescription>
                </DialogHeader>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    The downloaded PDF will include security watermarks and access logs for authenticity verification.
                  </AlertDescription>
                </Alert>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDownloadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate PDF
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Results</DialogTitle>
                  <DialogDescription>Send a secure link to view these results (Limited sharing)</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shareEmail">Recipient Email</Label>
                    <Input
                      id="shareEmail"
                      type="email"
                      placeholder="Enter email address"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shareMessage">Message (Optional)</Label>
                    <Textarea
                      id="shareMessage"
                      placeholder="Add a personal message..."
                      value={shareMessage}
                      onChange={(e) => setShareMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      Shared links expire in 24 hours and are limited to 3 views for security.
                    </AlertDescription>
                  </Alert>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleShare} disabled={!shareEmail}>
                    <Send className="mr-2 h-4 w-4" />
                    Share Results
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={() => router.push("/results")}>
              <LogOut className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4 print:py-4 print:px-2" ref={printRef}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Watermark for print/PDF */}
          <div className="hidden print:block absolute inset-0 pointer-events-none opacity-5 z-0">
            <div className="flex items-center justify-center h-full text-6xl font-bold text-gray-400 transform rotate-45">
              OFFICIAL COPY
            </div>
          </div>

          {/* Header */}
          <div className="print:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 Academic Results</h1>
            <p className="text-lg text-gray-600">
              {studentInfo.term} - {studentInfo.academicYear}
            </p>
          </div>

          {/* Student Information Header */}
          <Card className="shadow-lg print:shadow-none">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white print:bg-gray-100 print:text-black">
              <CardTitle className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-4 border-white print:border-gray-300">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="text-xl bg-white text-blue-600">
                      {studentInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{studentInfo.name}</h2>
                    <p className="text-blue-100 print:text-gray-600">
                      {studentInfo.studentId} • {studentInfo.className}
                    </p>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Class Level</div>
                  <div className="font-semibold">{studentInfo.classLevel}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Class Position</div>
                  <div className="font-semibold text-blue-600">
                    {studentInfo.classPosition} / {studentInfo.totalStudents}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Overall Average</div>
                  <div className="font-semibold text-green-600">{studentInfo.overallAverage}%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">GPA</div>
                  <div className="font-semibold">{studentInfo.gpa} / 4.0</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Term</div>
                  <div className="font-semibold">{studentInfo.term}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Next Term</div>
                  <div className="font-semibold text-orange-600">{studentInfo.nextTerm}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <div className="grid gap-6 md:grid-cols-4 print:grid-cols-4 print:gap-2">
            <Card className="print:border print:border-gray-300">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {results.filter((r) => r.grade.includes("A")).length}
                </div>
                <div className="text-sm text-gray-600">A Grades</div>
              </CardContent>
            </Card>
            <Card className="print:border print:border-gray-300">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{results.filter((r) => r.total >= 70).length}</div>
                <div className="text-sm text-gray-600">Above 70%</div>
              </CardContent>
            </Card>
            <Card className="print:border print:border-gray-300">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round((results.filter((r) => r.total >= 60).length / results.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Pass Rate</div>
              </CardContent>
            </Card>
            <Card className="print:border print:border-gray-300">
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{results.length}</div>
                <div className="text-sm text-gray-600">Subjects</div>
              </CardContent>
            </Card>
          </div>

          {/* Subject-wise Score Table */}
          <Card className="shadow-lg print:shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Subject-wise Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="print:border-b-2 print:border-gray-400">
                    <TableHead className="font-semibold print:text-black">Subject</TableHead>
                    <TableHead className="font-semibold print:text-black">CA (30)</TableHead>
                    <TableHead className="font-semibold print:text-black">Exam (70)</TableHead>
                    <TableHead className="font-semibold print:text-black">Total (100)</TableHead>
                    <TableHead className="font-semibold print:text-black">Grade</TableHead>
                    <TableHead className="font-semibold print:text-black">Position</TableHead>
                    <TableHead className="font-semibold print:text-black print:hidden">Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id} className="print:border-b print:border-gray-300">
                      <TableCell className="font-medium print:text-black">{result.subjectName}</TableCell>
                      <TableCell className="print:text-black">{result.ca}</TableCell>
                      <TableCell className="print:text-black">{result.exam}</TableCell>
                      <TableCell className="font-semibold print:text-black">{result.total}</TableCell>
                      <TableCell>
                        <Badge className={`${getGradeColor(result.grade)} print:bg-gray-200 print:text-black`}>
                          {result.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="print:text-black">{result.position}</TableCell>
                      <TableCell className="print:hidden">
                        <div className="flex items-center gap-2">
                          {getPerformanceIcon(result.total)}
                          <span className="text-sm text-gray-600">
                            {result.total >= result.classAverage ? "Above Average" : "Below Average"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Teacher Remarks Compilation */}
          <Card className="shadow-lg print:shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Teacher Remarks & Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="p-4 border rounded-lg print:border-gray-300">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{result.subjectName}</h4>
                      <Badge variant="outline" className="print:border-gray-400 print:text-black">
                        {result.total}% ({result.grade})
                      </Badge>
                    </div>
                    <p className="text-gray-700 text-sm italic print:text-black">"{result.teacherRemark}"</p>
                  </div>
                ))}

                {/* Overall Class Teacher Remark */}
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 print:bg-gray-100 print:border-gray-400">
                  <h4 className="font-semibold text-blue-900 print:text-black mb-2">Class Teacher's Overall Comment</h4>
                  <p className="text-blue-800 print:text-black">
                    {studentInfo.overallAverage >= 80
                      ? `${studentInfo.name} has shown exceptional performance this term with an outstanding average of ${studentInfo.overallAverage}%. Continue the excellent work and maintain this high standard.`
                      : studentInfo.overallAverage >= 70
                        ? `${studentInfo.name} has demonstrated good academic progress with an average of ${studentInfo.overallAverage}%. With more focus and effort, even better results can be achieved.`
                        : studentInfo.overallAverage >= 60
                          ? `${studentInfo.name} has achieved a fair performance with ${studentInfo.overallAverage}% average. There is significant room for improvement. Please focus on weak areas and seek additional support where needed.`
                          : `${studentInfo.name}'s performance requires immediate attention with an average of ${studentInfo.overallAverage}%. Parent-teacher consultation is recommended to develop an improvement plan.`}
                  </p>
                  <div className="mt-3 pt-3 border-t border-blue-200 print:border-gray-400">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-700 print:text-black">Next Term Resumes: {studentInfo.nextTerm}</span>
                      <span className="text-blue-700 print:text-black">Academic Year: {studentInfo.academicYear}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer with Security Information */}
          <div className="text-center space-y-2 print:mt-8 print:border-t print:pt-4 print:border-gray-400">
            <div className="text-sm text-gray-600 print:text-black">
              Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </div>
            <div className="text-xs text-gray-500 print:text-gray-700">
              Document ID: {studentInfo.studentId}-{Date.now()} | Access Level: Student/Parent View | Session: #
              {accessAttempts}
            </div>
            <div className="text-xs text-gray-500 print:text-gray-700">
              This document is authenticated and watermarked for security. Any unauthorized reproduction is prohibited.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResultViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Loading your results...</p>
            <p className="text-sm text-gray-500">Please wait while we fetch your academic information</p>
          </div>
        </div>
      }
    >
      <ResultViewContent />
    </Suspense>
  )
}
