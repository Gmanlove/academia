"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/mock-db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SubjectDistributionChart } from "@/components/charts/subject-distribution"
import { StudentTrendChart } from "@/components/charts/student-trend"
import { ClassRadarChart } from "@/components/charts/class-radar"
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  AlertTriangle,
  BookOpen,
  Target,
  Eye,
  Download,
  Filter,
  Calendar,
  FileText,
  Mail,
  Share2,
  Printer,
  Plus,
  Star,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  ArrowRight,
  PieChart,
  LineChart,
  MoreHorizontal,
  Search,
  Lightbulb,
  RefreshCw,
  Zap,
  GraduationCap,
  UserCheck,
  Brain,
  Gauge
} from "lucide-react"
import { Teacher, Student, ClassRoom, Subject, ResultEntry } from "@/lib/types"

interface ReportData {
  id: string
  type: "class" | "student" | "parent-meeting" | "recommendation"
  title: string
  description: string
  generated: string
  status: "draft" | "completed" | "sent"
  recipient?: string
  data: any
}

interface StudentProgressData {
  studentId: string
  studentName: string
  currentGrade: string
  averageScore: number
  trend: "improving" | "declining" | "stable"
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  parentMeetingNotes: string
  nextSteps: string[]
}

export default function TeacherAnalyticsPage() {
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedTerm, setSelectedTerm] = useState<string>("Term 2")
  const [myClasses, setMyClasses] = useState<ClassRoom[]>([])
  const [classPerformance, setClassPerformance] = useState<any[]>([])
  const [studentInsights, setStudentInsights] = useState<any[]>([])
  const [subjectAnalytics, setSubjectAnalytics] = useState<any[]>([])
  const [reports, setReports] = useState<ReportData[]>([])
  const [studentProgress, setStudentProgress] = useState<StudentProgressData[]>([])
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [reportType, setReportType] = useState<string>("class")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      const teacherData = db.listTeachers()[0]
      const classes = db.listClasses().filter((c: ClassRoom) => c.teacherId === teacherData.id)
      const performance = generateClassPerformance(classes)
      const insights = generateStudentInsights()
      const subjects = generateSubjectAnalytics()
      const reportsData = generateReports()
      const progressData = generateStudentProgress()
      
      setTeacher(teacherData)
      setMyClasses(classes)
      setClassPerformance(performance)
      setStudentInsights(insights)
      setSubjectAnalytics(subjects)
      setReports(reportsData)
      setStudentProgress(progressData)
      setLoading(false)
    }, 500)
  }, [selectedClass, selectedSubject, selectedTerm])

  const generateClassPerformance = (classes: ClassRoom[]) => {
    return classes.map(c => ({
      classId: c.id,
      className: c.name,
      averageScore: 75 + Math.random() * 20,
      passRate: 80 + Math.random() * 15,
      topPerformers: Math.floor(Math.random() * 8) + 2,
      needsAttention: Math.floor(Math.random() * 5) + 1,
      improvement: Math.random() > 0.5 ? "positive" : "negative",
      improvementValue: Math.random() * 10
    }))
  }

  const generateStudentInsights = () => {
    return [
      {
        category: "Top Performers",
        count: 15,
        students: ["Alice Johnson", "Michael Chen", "Sarah Williams"],
        trend: "up",
        percentage: 12
      },
      {
        category: "Needs Attention",
        count: 8,
        students: ["David Brown", "Emma Davis", "James Wilson"],
        trend: "down",
        percentage: 6
      },
      {
        category: "Most Improved",
        count: 12,
        students: ["Lisa Garcia", "Robert Taylor", "Nina Patel"],
        trend: "up",
        percentage: 9
      }
    ]
  }

  const generateSubjectAnalytics = () => {
    return [
      {
        subject: "Mathematics",
        classAverage: 78.5,
        passRate: 85,
        difficulty: "Medium",
        commonErrors: ["Algebra", "Geometry", "Word Problems"],
        topicPerformance: [
          { topic: "Algebra", score: 82 },
          { topic: "Geometry", score: 75 },
          { topic: "Statistics", score: 80 }
        ]
      },
      {
        subject: "English",
        classAverage: 82.3,
        passRate: 91,
        difficulty: "Easy",
        commonErrors: ["Grammar", "Essay Writing", "Comprehension"],
        topicPerformance: [
          { topic: "Grammar", score: 85 },
          { topic: "Literature", score: 79 },
          { topic: "Writing", score: 83 }
        ]
      }
    ]
  }

  const generateStudentProgress = (): StudentProgressData[] => {
    const students = db.listStudents().slice(0, 10)
    return students.map((student: Student) => ({
      studentId: student.id,
      studentName: student.name,
      currentGrade: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
      averageScore: Math.floor(Math.random() * 40) + 50,
      trend: ["improving", "declining", "stable"][Math.floor(Math.random() * 3)] as "improving" | "declining" | "stable",
      strengths: ["Problem Solving", "Critical Thinking", "Communication", "Teamwork"].slice(0, 2),
      weaknesses: ["Time Management", "Attention to Detail", "Study Habits"].slice(0, 2),
      recommendations: [
        "Increase practice in weak areas",
        "Provide additional support materials",
        "Schedule regular check-ins"
      ].slice(0, 2),
      parentMeetingNotes: "Discuss study habits and homework completion strategies",
      nextSteps: ["Weekly progress reviews", "Parent communication", "Peer tutoring"]
    }))
  }

  const handleGenerateReport = (type: string, studentId?: string) => {
    const newReport: ReportData = {
      id: Date.now().toString(),
      type: type as "class" | "student" | "parent-meeting" | "recommendation",
      title: `${type === "class" ? "Class Performance" : 
               type === "student" ? "Student Progress" :
               type === "parent-meeting" ? "Parent Meeting Prep" : 
               "Performance Recommendations"} Report`,
      description: `Generated on ${new Date().toLocaleDateString()}`,
      generated: new Date().toISOString(),
      status: "draft",
      data: { type, studentId, generatedAt: new Date().toISOString() }
    }
    
    setReports([newReport, ...reports])
    setReportDialogOpen(false)
  }

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "stable":
        return <div className="h-4 w-4 rounded-full bg-gray-300" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      const teacherData = db.listTeachers()[0]
      const classes = db.listClasses().filter((c: ClassRoom) => c.teacherId === teacherData.id)
      const performance = generateClassPerformance(classes)
      const insights = generateStudentInsights()
      const subjects = generateSubjectAnalytics()
      const reportsData = generateReports()
      const progressData = generateStudentProgress()
      
      setTeacher(teacherData)
      setMyClasses(classes)
      setClassPerformance(performance)
      setStudentInsights(insights)
      setSubjectAnalytics(subjects)
      setReports(reportsData)
      setStudentProgress(progressData)
      setLoading(false)
    }, 500)
  }, [selectedClass, selectedSubject, selectedTerm])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "stable":
        return <div className="h-4 w-4 rounded-full bg-gray-300" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const generateReports = (): ReportData[] => {
    return [
      {
        id: "1",
        type: "class",
        title: "Term 2 Class Performance Report",
        description: "Comprehensive analysis of class performance including trends and recommendations",
        generated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        data: { classId: "class1", term: "Term 2" }
      },
      {
        id: "2", 
        type: "student",
        title: "Individual Progress Report - Sarah Johnson",
        description: "Detailed student performance analysis with parent meeting preparation",
        generated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "sent",
        recipient: "parent.sarah@email.com",
        data: { studentId: "student1" }
      },
      {
        id: "3",
        type: "parent-meeting",
        title: "Parent-Teacher Meeting Prep - Grade 10A",
        description: "Meeting preparation materials for upcoming parent conferences",
        generated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: "draft",
        data: { classId: "class1", meetingDate: "2025-08-15" }
      },
      {
        id: "4",
        type: "recommendation",
        title: "Performance Improvement Recommendations",
        description: "Strategic recommendations for struggling students and class improvements",
        generated: new Date().toISOString(),
        status: "draft",
        data: { scope: "class", priority: "high" }
      }
    ]
  }

  const generateStudentProgress = (): StudentProgressData[] => {
    const students = db.listStudents().data.slice(0, 10)
    return students.map(student => ({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      currentGrade: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
      averageScore: Math.floor(Math.random() * 40) + 50,
      trend: ["improving", "declining", "stable"][Math.floor(Math.random() * 3)] as "improving" | "declining" | "stable",
      strengths: ["Problem Solving", "Critical Thinking", "Communication", "Teamwork"].slice(0, 2),
      weaknesses: ["Time Management", "Attention to Detail", "Study Habits"].slice(0, 2),
      recommendations: [
        "Increase practice in weak areas",
        "Provide additional support materials",
        "Schedule regular check-ins"
      ].slice(0, 2),
      parentMeetingNotes: "Discuss study habits and homework completion strategies",
      nextSteps: ["Weekly progress reviews", "Parent communication", "Peer tutoring"]
    }))
  }
    setTimeout(() => {
      const teacherData = db.listTeachers().data[0]
      const classes = db.listClasses().data.filter((c) => c.teacherId === teacherData.id)
      const performance = generateClassPerformance(classes)
      const insights = generateStudentInsights()
      const subjects = generateSubjectAnalytics()
      
      setTeacher(teacherData)
      setMyClasses(classes)
      setClassPerformance(performance)
      setStudentInsights(insights)
      setSubjectAnalytics(subjects)
      setLoading(false)
    }, 500)
  }, [selectedClass, selectedSubject, selectedTerm])

  const generateClassPerformance = (classes: ClassRoom[]) => {
    return classes.map(c => ({
      classId: c.id,
      className: c.name,
      averageScore: 75 + Math.random() * 20,
      passRate: 80 + Math.random() * 15,
      topPerformers: Math.floor(Math.random() * 8) + 2,
      needsAttention: Math.floor(Math.random() * 5) + 1,
      improvement: Math.random() > 0.5 ? "positive" : "negative",
      improvementValue: Math.random() * 10
    }))
  }

  const generateStudentInsights = () => {
    return [
      {
        category: "Top Performers",
        count: 15,
        students: ["Alice Johnson", "Michael Chen", "Sarah Williams"],
        trend: "up",
        percentage: 12
      },
      {
        category: "Needs Attention",
        count: 8,
        students: ["David Brown", "Emma Davis", "James Wilson"],
        trend: "down",
        percentage: 6
      },
      {
        category: "Most Improved",
        count: 12,
        students: ["Lisa Garcia", "Robert Taylor", "Nina Patel"],
        trend: "up",
        percentage: 9
      }
    ]
  }

  const generateSubjectAnalytics = () => {
    return [
      {
        subject: "Mathematics",
        classAverage: 78.5,
        passRate: 85,
        difficulty: "Medium",
        commonErrors: ["Algebra", "Geometry", "Word Problems"],
        topicPerformance: [
          { topic: "Algebra", score: 82 },
          { topic: "Geometry", score: 75 },
          { topic: "Statistics", score: 80 }
        ]
      },
      {
        subject: "English",
        classAverage: 82.3,
        passRate: 91,
        difficulty: "Easy",
        commonErrors: ["Grammar", "Essay Writing", "Comprehension"],
        topicPerformance: [
          { topic: "Grammar", score: 85 },
          { topic: "Literature", score: 79 },
          { topic: "Writing", score: 83 }
        ]
      }
    ]
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const filteredClasses = selectedClass === "all" ? myClasses : 
    myClasses.filter(c => c.id === selectedClass)
  
  const filteredSubjects = selectedSubject === "all" ? subjectAnalytics :
    subjectAnalytics.filter(s => s.subject === selectedSubject)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            📊 Class Analytics
          </h1>
          <p className="text-muted-foreground">
            Performance analytics, progress tracking, and comprehensive reporting tools
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>
                  Choose the type of report you want to generate
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class Performance Report</SelectItem>
                      <SelectItem value="student">Individual Student Report</SelectItem>
                      <SelectItem value="parent-meeting">Parent Meeting Preparation</SelectItem>
                      <SelectItem value="recommendation">Performance Recommendations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {reportType === "student" && (
                  <div>
                    <Label htmlFor="student">Select Student</Label>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {studentProgress.map((student) => (
                          <SelectItem key={student.studentId} value={student.studentId}>
                            {student.studentName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleGenerateReport(reportType, selectedStudent)}>
                  Generate Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {myClasses.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {teacher?.subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Term 1">Term 1</SelectItem>
            <SelectItem value="Term 2">Term 2</SelectItem>
            <SelectItem value="Term 3">Term 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +2.3% from last term
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +5.1% improvement
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              12% of total students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              6% require support
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="performance">Class Performance</TabsTrigger>
          <TabsTrigger value="students">Student Insights</TabsTrigger>
          <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
          <TabsTrigger value="trends">Progress Trends</TabsTrigger>
          <TabsTrigger value="reports">Reporting Tools</TabsTrigger>
          <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Class Performance Overview</CardTitle>
                <CardDescription>Performance metrics across your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Average</TableHead>
                      <TableHead>Pass Rate</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classPerformance.map((performance) => (
                      <TableRow key={performance.classId}>
                        <TableCell className="font-medium">
                          {performance.className}
                        </TableCell>
                        <TableCell>{performance.averageScore.toFixed(1)}%</TableCell>
                        <TableCell>{performance.passRate.toFixed(1)}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {performance.improvement === "positive" ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className={
                              performance.improvement === "positive" ? 
                              "text-green-600" : "text-red-600"
                            }>
                              {performance.improvementValue.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Grade distribution across classes</CardDescription>
              </CardHeader>
              <CardContent>
                <SubjectDistributionChart data={db.getAdminDashboard().charts.subjectDistribution} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Class Metrics</CardTitle>
              <CardDescription>Comprehensive performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {classPerformance.map((performance) => (
                  <div key={performance.classId} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{performance.className}</h4>
                      <Badge variant="outline">
                        {performance.averageScore.toFixed(1)}% avg
                      </Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Top Performers</span>
                          <span className="font-medium">{performance.topPerformers}</span>
                        </div>
                        <Progress value={(performance.topPerformers / 30) * 100} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Needs Attention</span>
                          <span className="font-medium">{performance.needsAttention}</span>
                        </div>
                        <Progress value={(performance.needsAttention / 30) * 100} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {studentInsights.map((insight) => (
              <Card key={insight.category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {insight.category === "Top Performers" && <Award className="h-5 w-5 text-yellow-600" />}
                    {insight.category === "Needs Attention" && <AlertTriangle className="h-5 w-5 text-red-600" />}
                    {insight.category === "Most Improved" && <TrendingUp className="h-5 w-5 text-green-600" />}
                    {insight.category}
                  </CardTitle>
                  <CardDescription>
                    {insight.count} students ({insight.percentage}% of class)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {insight.students.map((student: string) => (
                      <div key={student} className="flex items-center justify-between">
                        <span className="text-sm">{student}</span>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="space-y-4">
            {filteredSubjects.map((subject) => (
              <Card key={subject.subject}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{subject.subject} Analysis</span>
                    <Badge variant={
                      subject.difficulty === "Easy" ? "secondary" :
                      subject.difficulty === "Medium" ? "default" :
                      "destructive"
                    }>
                      {subject.difficulty}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Class Average: {subject.classAverage}% | Pass Rate: {subject.passRate}%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h5 className="font-medium mb-2">Topic Performance</h5>
                      <div className="space-y-2">
                        {subject.topicPerformance.map((topic: any) => (
                          <div key={topic.topic} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{topic.topic}</span>
                              <span>{topic.score}%</span>
                            </div>
                            <Progress value={topic.score} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Common Challenges</h5>
                      <div className="space-y-1">
                        {subject.commonErrors.map((error: string) => (
                          <Badge key={error} variant="outline" className="mr-1 mb-1">
                            {error}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Student progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentTrendChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Class Comparison</CardTitle>
                <CardDescription>Multi-dimensional class analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ClassRadarChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reporting Tools Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Generated Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generated Reports
                </CardTitle>
                <CardDescription>Access and manage your generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{report.title}</h4>
                        <p className="text-xs text-muted-foreground">{report.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getReportStatusBadge(report.status)}
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(report.generated)}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Report
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Report
                          </DropdownMenuItem>
                          {report.status === "draft" && (
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send to Parents
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Report Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Reports
                </CardTitle>
                <CardDescription>Generate commonly used reports instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Weekly Class Summary
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Student Progress Cards
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Parent Communication Log
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Target className="mr-2 h-4 w-4" />
                  Performance Improvement Plan
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Term Assessment Summary
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Student Progress Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Student Progress Reports</CardTitle>
              <CardDescription>Detailed progress analysis for parent-teacher meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input placeholder="Search students..." />
                  </div>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
                
                <div className="grid gap-3">
                  {studentProgress.slice(0, 5).map((student) => (
                    <div key={student.studentId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>
                            {student.studentName.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-sm">{student.studentName}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{student.currentGrade}</Badge>
                            {getTrendIcon(student.trend)}
                            <span className="text-xs text-muted-foreground">
                              {student.averageScore}% average
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          View Report
                        </Button>
                        <Button size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights & Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* AI-Powered Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>Smart analysis of your class performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Performance Pattern Detected</h4>
                      <p className="text-sm text-blue-800">
                        Students show 15% better performance in morning classes compared to afternoon sessions.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900">Teaching Effectiveness</h4>
                      <p className="text-sm text-green-800">
                        Your interactive teaching methods show 23% higher engagement rates.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-900">Attention Required</h4>
                      <p className="text-sm text-orange-800">
                        3 students show declining performance in Mathematics. Consider additional support.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Recommended Actions
                </CardTitle>
                <CardDescription>Actionable steps to improve class performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Immediate Actions</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Checkbox id="action1" />
                      <label htmlFor="action1">Schedule one-on-one sessions with struggling students</label>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Checkbox id="action2" />
                      <label htmlFor="action2">Implement peer tutoring for Mathematics</label>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Checkbox id="action3" />
                      <label htmlFor="action3">Send progress updates to parents</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Long-term Strategies</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Checkbox id="strategy1" />
                      <label htmlFor="strategy1">Increase hands-on learning activities</label>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Checkbox id="strategy2" />
                      <label htmlFor="strategy2">Develop subject-specific study guides</label>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Checkbox id="strategy3" />
                      <label htmlFor="strategy3">Regular assessment feedback sessions</label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparative Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Comparative Performance Analysis</CardTitle>
              <CardDescription>How your classes compare with school and national averages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold">Your Classes</h4>
                  <div className="text-2xl font-bold text-blue-600">78.5%</div>
                  <p className="text-sm text-muted-foreground">Average Performance</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold">School Average</h4>
                  <div className="text-2xl font-bold text-gray-600">74.2%</div>
                  <p className="text-sm text-green-600">+4.3% above average</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold">National Average</h4>
                  <div className="text-2xl font-bold text-gray-600">71.8%</div>
                  <p className="text-sm text-green-600">+6.7% above average</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Subject-wise Comparison</h4>
                <div className="space-y-3">
                  {[
                    { subject: "Mathematics", yours: 78, school: 75, national: 72 },
                    { subject: "English", yours: 82, school: 77, national: 74 },
                    { subject: "Science", yours: 76, school: 73, national: 70 }
                  ].map((subject) => (
                    <div key={subject.subject} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{subject.subject}</span>
                        <span>Your: {subject.yours}% | School: {subject.school}% | National: {subject.national}%</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="flex-1 h-2 bg-blue-200 rounded">
                          <div 
                            className="h-2 bg-blue-600 rounded"
                            style={{ width: `${subject.yours}%` }}
                          />
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 rounded">
                          <div 
                            className="h-2 bg-gray-500 rounded"
                            style={{ width: `${subject.school}%` }}
                          />
                        </div>
                        <div className="flex-1 h-2 bg-gray-100 rounded">
                          <div 
                            className="h-2 bg-gray-400 rounded"
                            style={{ width: `${subject.national}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
  )
}
