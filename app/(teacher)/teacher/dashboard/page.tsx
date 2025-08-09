"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  BarChart3,
  MessageSquare,
  Edit,
  Eye,
  Plus,
  Bell,
  UserCheck,
  FileText,
  Award,
  Target,
  Send,
  Download,
  GraduationCap,
  ChevronRight,
  Star,
  AlertCircle,
  Zap
} from "lucide-react"
import { db } from "@/lib/mock-db"
import { Teacher, ClassRoom, Student, ResultEntry, Subject } from "@/lib/types"

interface TeachingStats {
  totalClasses: number
  totalStudents: number
  pendingEntries: number
  recentSubmissions: number
}

interface ClassPerformance {
  classId: string
  className: string
  subjectId: string
  subjectName: string
  average: number
  submitted: number
  total: number
  trend: "up" | "down" | "stable"
}

interface StudentPerformance {
  studentId: string
  studentName: string
  classId: string
  className: string
  average: number
  status: "excellent" | "good" | "average" | "needs_attention"
  lastSubmission: string
}

interface SubmissionDeadline {
  id: string
  title: string
  subject: string
  class: string
  dueDate: string
  status: "upcoming" | "due_today" | "overdue"
  priority: "high" | "medium" | "low"
}

interface RecentActivity {
  id: string
  type: "score_entry" | "notification" | "report" | "communication"
  title: string
  description: string
  timestamp: string
  status: "completed" | "pending" | "failed"
  classId?: string
  studentId?: string
}

export default function TeacherDashboardPage() {
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [teachingStats, setTeachingStats] = useState<TeachingStats>({
    totalClasses: 0,
    totalStudents: 0,
    pendingEntries: 0,
    recentSubmissions: 0
  })
  const [myClasses, setMyClasses] = useState<ClassRoom[]>([])
  const [classPerformances, setClassPerformances] = useState<ClassPerformance[]>([])
  const [topStudents, setTopStudents] = useState<StudentPerformance[]>([])
  const [studentsNeedingAttention, setStudentsNeedingAttention] = useState<StudentPerformance[]>([])
  const [submissionDeadlines, setSubmissionDeadlines] = useState<SubmissionDeadline[]>([])
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  // Quick Actions Dialog States
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false)
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [studentProfileDialogOpen, setStudentProfileDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentPerformance | null>(null)

  // Quick Actions Form States
  const [scoreForm, setScoreForm] = useState({
    classId: "",
    subjectId: "",
    studentId: "",
    ca: "",
    exam: ""
  })
  const [notificationForm, setNotificationForm] = useState({
    classId: "",
    title: "",
    message: "",
    priority: "medium"
  })
  const [reportForm, setReportForm] = useState({
    classId: "",
    subjectId: "",
    type: "performance",
    period: "current_term"
  })

  useEffect(() => {
    // Simulate API calls to fetch comprehensive teacher data
    setTimeout(() => {
      const teachersData = db.listTeachers()
      const teacherData = teachersData.data[0] // Get first teacher for demo

      const classesData = db.listClasses()
      const myClassesData = classesData.data.filter(c => c.teacherId === teacherData.id)
      
      const studentsData = db.listStudents()
      const myStudentsData = studentsData.data.filter(s => 
        myClassesData.some(c => c.id === s.classId)
      )

      const subjectsData = db.listSubjects() || []
      
      const stats = generateTeachingStats(myClassesData, myStudentsData)
      const performances = generateClassPerformances(myClassesData, subjectsData)
      const topPerformers = generateTopStudents(myStudentsData, myClassesData)
      const needsAttention = generateStudentsNeedingAttention(myStudentsData, myClassesData)
      const deadlines = generateSubmissionDeadlines(myClassesData, subjectsData)
      const activities = generateRecentActivities(myClassesData, subjectsData)

      setTeacher(teacherData)
      setMyClasses(myClassesData)
      setSubjects(subjectsData)
      setTeachingStats(stats)
      setClassPerformances(performances)
      setTopStudents(topPerformers)
      setStudentsNeedingAttention(needsAttention)
      setSubmissionDeadlines(deadlines)
      setRecentActivities(activities)
      setLoading(false)
    }, 1200)
  }, [])

  const generateTeachingStats = (classes: ClassRoom[], students: Student[]): TeachingStats => {
    return {
      totalClasses: classes.length,
      totalStudents: students.length,
      pendingEntries: Math.floor(Math.random() * 15) + 5, // 5-20 pending entries
      recentSubmissions: Math.floor(Math.random() * 10) + 3 // 3-13 recent submissions
    }
  }

  const generateClassPerformances = (classes: ClassRoom[], subjects: Subject[]): ClassPerformance[] => {
    return classes.flatMap(classRoom => 
      subjects.slice(0, 3).map(subject => ({
        classId: classRoom.id,
        className: classRoom.name,
        subjectId: subject.id,
        subjectName: subject.name,
        average: Math.floor(Math.random() * 30) + 65, // 65-95 average
        submitted: Math.floor(Math.random() * 25) + 20, // 20-45 submitted
        total: Math.floor(Math.random() * 10) + 45, // 45-55 total
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable"
      }))
    )
  }

  const generateTopStudents = (students: Student[], classes: ClassRoom[]): StudentPerformance[] => {
    return students.slice(0, 5).map(student => {
      const studentClass = classes.find(c => c.id === student.classId)
      return {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        classId: student.classId,
        className: studentClass?.name || "Unknown Class",
        average: Math.floor(Math.random() * 15) + 85, // 85-100 for top students
        status: "excellent" as const,
        lastSubmission: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    })
  }

  const generateStudentsNeedingAttention = (students: Student[], classes: ClassRoom[]): StudentPerformance[] => {
    return students.slice(5, 10).map(student => {
      const studentClass = classes.find(c => c.id === student.classId)
      const average = Math.floor(Math.random() * 20) + 45 // 45-65 for students needing attention
      let status: "excellent" | "good" | "average" | "needs_attention"
      
      if (average >= 80) status = "excellent"
      else if (average >= 70) status = "good"
      else if (average >= 60) status = "average"
      else status = "needs_attention"

      return {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        classId: student.classId,
        className: studentClass?.name || "Unknown Class",
        average,
        status,
        lastSubmission: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    })
  }

  const generateSubmissionDeadlines = (classes: ClassRoom[], subjects: Subject[]): SubmissionDeadline[] => {
    const deadlines: SubmissionDeadline[] = []
    
    classes.forEach(classRoom => {
      subjects.slice(0, 2).forEach((subject, index) => {
        const daysFromNow = Math.floor(Math.random() * 14) - 3 // -3 to +11 days
        const dueDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
        
        let status: "upcoming" | "due_today" | "overdue"
        let priority: "high" | "medium" | "low"
        
        if (daysFromNow < 0) {
          status = "overdue"
          priority = "high"
        } else if (daysFromNow === 0) {
          status = "due_today"
          priority = "high"
        } else if (daysFromNow <= 2) {
          status = "upcoming"
          priority = "medium"
        } else {
          status = "upcoming"
          priority = "low"
        }

        deadlines.push({
          id: `deadline-${classRoom.id}-${subject.id}`,
          title: `${subject.name} Assessment`,
          subject: subject.name,
          class: classRoom.name,
          dueDate: dueDate.toISOString(),
          status,
          priority
        })
      })
    })

    return deadlines.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }

  const generateRecentActivities = (classes: ClassRoom[], subjects: Subject[]): RecentActivity[] => {
    const activities: RecentActivity[] = []
    const activityTypes = ["score_entry", "notification", "report", "communication"] as const
    
    for (let i = 0; i < 8; i++) {
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
      const classRoom = classes[Math.floor(Math.random() * classes.length)]
      const subject = subjects[Math.floor(Math.random() * subjects.length)]
      const hoursAgo = Math.floor(Math.random() * 72) + 1 // 1-72 hours ago

      let title, description
      switch (type) {
        case "score_entry":
          title = "Scores Submitted"
          description = `${subject.name} results for ${classRoom.name}`
          break
        case "notification":
          title = "Class Notification Sent"
          description = `Assignment reminder to ${classRoom.name}`
          break
        case "report":
          title = "Report Generated"
          description = `Performance report for ${classRoom.name}`
          break
        case "communication":
          title = "Parent Communication"
          description = `Progress update sent to parents`
          break
      }

      activities.push({
        id: `activity-${i}`,
        type,
        title,
        description,
        timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.1 ? "completed" : "pending",
        classId: classRoom.id
      })
    }

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const handleScoreSubmission = () => {
    // Simulate score submission
    const newActivity: RecentActivity = {
      id: `activity-${Date.now()}`,
      type: "score_entry",
      title: "Scores Submitted",
      description: `New scores entered for selected class`,
      timestamp: new Date().toISOString(),
      status: "completed",
      classId: scoreForm.classId
    }
    
    setRecentActivities(prev => [newActivity, ...prev.slice(0, 7)])
    setScoreDialogOpen(false)
    setScoreForm({ classId: "", subjectId: "", studentId: "", ca: "", exam: "" })
  }

  const handleNotificationSend = () => {
    // Simulate notification sending
    const newActivity: RecentActivity = {
      id: `activity-${Date.now()}`,
      type: "notification",
      title: "Class Notification Sent",
      description: notificationForm.title,
      timestamp: new Date().toISOString(),
      status: "completed",
      classId: notificationForm.classId
    }
    
    setRecentActivities(prev => [newActivity, ...prev.slice(0, 7)])
    setNotificationDialogOpen(false)
    setNotificationForm({ classId: "", title: "", message: "", priority: "medium" })
  }

  const handleReportGeneration = () => {
    // Simulate report generation
    const newActivity: RecentActivity = {
      id: `activity-${Date.now()}`,
      type: "report",
      title: "Report Generated",
      description: `${reportForm.type} report for selected class`,
      timestamp: new Date().toISOString(),
      status: "completed",
      classId: reportForm.classId
    }
    
    setRecentActivities(prev => [newActivity, ...prev.slice(0, 7)])
    setReportDialogOpen(false)
    setReportForm({ classId: "", subjectId: "", type: "performance", period: "current_term" })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
      case "average":
        return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
      case "needs_attention":
        return <Badge className="bg-red-100 text-red-800">Needs Attention</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "score_entry":
        return <Edit className="h-4 w-4 text-blue-600" />
      case "notification":
        return <Bell className="h-4 w-4 text-yellow-600" />
      case "report":
        return <FileText className="h-4 w-4 text-green-600" />
      case "communication":
        return <MessageSquare className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your teaching dashboard...</p>
        </div>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No teacher data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">👨‍🏫 Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {teacher.firstName} {teacher.lastName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Today's Schedule
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Quick Action
          </Button>
        </div>
      </div>

      {/* Teaching Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{teachingStats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              Active classes this term
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{teachingStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all your classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Entries</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{teachingStats.pendingEntries}</div>
            <p className="text-xs text-muted-foreground">
              Results awaiting entry
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Submissions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{teachingStats.recentSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              Submitted this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Class Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        {/* Class Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* My Classes Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  My Classes Summary
                </CardTitle>
                <CardDescription>Overview of all your assigned classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myClasses.map(classRoom => (
                    <div key={classRoom.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{classRoom.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {classRoom.capacity} students • Level {classRoom.level}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
                <CardDescription>Your latest teaching activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.slice(0, 5).map(activity => (
                    <div key={activity.id} className="flex items-center gap-3 p-2 border rounded-lg">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm">{activity.title}</h5>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Metrics Tab */}
        <TabsContent value="performance" className="space-y-4">
          {/* Class Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Class Performance Metrics
              </CardTitle>
              <CardDescription>Academic performance across your classes and subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold">Class Averages per Subject</h4>
                <div className="grid gap-3">
                  {classPerformances.map((performance, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(performance.trend)}
                          <div>
                            <span className="font-medium">{performance.subjectName}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({performance.className})
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-lg">{performance.average}%</div>
                          <div className="text-xs text-muted-foreground">
                            {performance.submitted}/{performance.total} submitted
                          </div>
                        </div>
                        <Progress value={performance.average} className="w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Performing Students */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Performing Students
                </CardTitle>
                <CardDescription>Students showing excellent academic performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topStudents.map(student => (
                    <div key={student.studentId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Award className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h5 className="font-medium">{student.studentName}</h5>
                          <p className="text-sm text-muted-foreground">{student.className}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{student.average}%</div>
                        {getStatusBadge(student.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Students Needing Attention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Students Needing Attention
                </CardTitle>
                <CardDescription>Students who may need additional support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentsNeedingAttention.map(student => (
                    <div key={student.studentId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <h5 className="font-medium">{student.studentName}</h5>
                          <p className="text-sm text-muted-foreground">{student.className}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-600">{student.average}%</div>
                        {getStatusBadge(student.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Submission Deadlines Tab */}
        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Submission Deadlines
              </CardTitle>
              <CardDescription>Upcoming deadlines and pending submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submissionDeadlines.map(deadline => {
                  const dueDate = new Date(deadline.dueDate)
                  const isOverdue = dueDate < new Date()
                  const isDueToday = dueDate.toDateString() === new Date().toDateString()
                  
                  return (
                    <div key={deadline.id} className={`flex items-center justify-between p-4 border rounded-lg ${
                      isOverdue ? 'border-red-200 bg-red-50' :
                      isDueToday ? 'border-yellow-200 bg-yellow-50' :
                      'border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isOverdue ? 'bg-red-100' :
                          isDueToday ? 'bg-yellow-100' :
                          'bg-blue-100'
                        }`}>
                          <ClipboardList className={`h-5 w-5 ${
                            isOverdue ? 'text-red-600' :
                            isDueToday ? 'text-yellow-600' :
                            'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{deadline.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {deadline.subject} • {deadline.class}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getPriorityBadge(deadline.priority)}
                          <Badge variant={
                            isOverdue ? "destructive" :
                            isDueToday ? "default" :
                            "outline"
                          }>
                            {deadline.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {dueDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Enter/Update Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Score Management
                </CardTitle>
                <CardDescription>Enter or update student scores</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={scoreDialogOpen} onOpenChange={setScoreDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Enter/Update Scores
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Enter Student Scores</DialogTitle>
                      <DialogDescription>
                        Select class and subject to enter or update scores
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="score-class">Class</Label>
                        <Select value={scoreForm.classId} onValueChange={(value) => 
                          setScoreForm(prev => ({ ...prev, classId: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {myClasses.map(classRoom => (
                              <SelectItem key={classRoom.id} value={classRoom.id}>
                                {classRoom.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="score-subject">Subject</Label>
                        <Select value={scoreForm.subjectId} onValueChange={(value) => 
                          setScoreForm(prev => ({ ...prev, subjectId: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map(subject => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ca-score">CA Score</Label>
                          <Input
                            id="ca-score"
                            type="number"
                            placeholder="0-40"
                            value={scoreForm.ca}
                            onChange={(e) => setScoreForm(prev => ({ ...prev, ca: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="exam-score">Exam Score</Label>
                          <Input
                            id="exam-score"
                            type="number"
                            placeholder="0-60"
                            value={scoreForm.exam}
                            onChange={(e) => setScoreForm(prev => ({ ...prev, exam: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setScoreDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleScoreSubmission}>Submit Scores</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Send Class Notification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Class Communication
                </CardTitle>
                <CardDescription>Send notifications to your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <Bell className="mr-2 h-4 w-4" />
                      Send Class Notification
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Class Notification</DialogTitle>
                      <DialogDescription>
                        Send a message to students and parents
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="notification-class">Class</Label>
                        <Select value={notificationForm.classId} onValueChange={(value) => 
                          setNotificationForm(prev => ({ ...prev, classId: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {myClasses.map(classRoom => (
                              <SelectItem key={classRoom.id} value={classRoom.id}>
                                {classRoom.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="notification-title">Title</Label>
                        <Input
                          id="notification-title"
                          placeholder="Notification title"
                          value={notificationForm.title}
                          onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="notification-message">Message</Label>
                        <Textarea
                          id="notification-message"
                          placeholder="Enter your message here..."
                          value={notificationForm.message}
                          onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="notification-priority">Priority</Label>
                        <Select value={notificationForm.priority} onValueChange={(value) => 
                          setNotificationForm(prev => ({ ...prev, priority: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNotificationDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleNotificationSend}>
                        <Send className="mr-2 h-4 w-4" />
                        Send Notification
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Generate Class Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Report Generation
                </CardTitle>
                <CardDescription>Generate comprehensive class reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Class Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate Class Report</DialogTitle>
                      <DialogDescription>
                        Create detailed performance and attendance reports
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="report-class">Class</Label>
                        <Select value={reportForm.classId} onValueChange={(value) => 
                          setReportForm(prev => ({ ...prev, classId: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {myClasses.map(classRoom => (
                              <SelectItem key={classRoom.id} value={classRoom.id}>
                                {classRoom.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="report-subject">Subject (Optional)</Label>
                        <Select value={reportForm.subjectId} onValueChange={(value) => 
                          setReportForm(prev => ({ ...prev, subjectId: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="All subjects" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Subjects</SelectItem>
                            {subjects.map(subject => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="report-type">Report Type</Label>
                        <Select value={reportForm.type} onValueChange={(value) => 
                          setReportForm(prev => ({ ...prev, type: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="performance">Performance Report</SelectItem>
                            <SelectItem value="attendance">Attendance Report</SelectItem>
                            <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="report-period">Period</Label>
                        <Select value={reportForm.period} onValueChange={(value) => 
                          setReportForm(prev => ({ ...prev, period: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="current_term">Current Term</SelectItem>
                            <SelectItem value="last_term">Last Term</SelectItem>
                            <SelectItem value="academic_year">Academic Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleReportGeneration}>
                        <Download className="mr-2 h-4 w-4" />
                        Generate Report
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* View Student Profiles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Management
                </CardTitle>
                <CardDescription>View and manage student profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View Student Profiles
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
