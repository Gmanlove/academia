"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  Eye,
  Edit,
  MoreHorizontal,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  UserCheck,
  GraduationCap,
  BarChart3,
  Star,
  Search,
  Filter,
  Download,
  Send,
  FileText,
  Target,
  Zap,
  Heart,
  MapPin
} from "lucide-react"
import { Teacher, ClassRoom, Student, Subject, ResultEntry } from "@/lib/types"

interface ClassPerformanceData {
  classId: string
  className: string
  totalStudents: number
  averageScore: number
  passRate: number
  subjects: {
    id: string
    name: string
    average: number
    lastActivity: string
  }[]
  topPerformers: Student[]
  needsAttention: Student[]
  lastActivity: string
  attendance: {
    present: number
    absent: number
    rate: number
  }
}

interface StudentDetailData extends Student {
  averageScore: number
  grade: string
  attendance: number
  parentContact: {
    name: string
    email: string
    phone: string
    relationship: string
  }
  communicationHistory: {
    id: string
    type: "email" | "sms" | "call" | "meeting"
    subject: string
    date: string
    status: "sent" | "delivered" | "read" | "replied"
  }[]
  subjectPerformance: {
    subjectId: string
    subjectName: string
    ca: number
    exam: number
    total: number
    grade: string
    trend: "up" | "down" | "stable"
  }[]
}

export default function ClassesManagementPage() {
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [classes, setClasses] = useState<ClassRoom[]>([])
  const [classPerformance, setClassPerformance] = useState<Record<string, ClassPerformanceData>>({})
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedStudent, setSelectedStudent] = useState<StudentDetailData | null>(null)
  const [studentDialogOpen, setStudentDialogOpen] = useState(false)
  const [communicationDialogOpen, setCommunicationDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "excellent" | "good" | "needs_attention">("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    // TODO: Replace with real API calls to fetch teacher data and classes
    setTimeout(() => {
      // For now, set empty data until real APIs are implemented
      setTeacher(null)
      setMyClasses([])
      setPerformanceData({})
      setAllStudents([])
      setAllSubjects([])
      setLoading(false)
    }, 1000)
  }, [])

  const generateStudentDetailData = (student: Student): StudentDetailData => {
    // TODO: Replace with real API calls
    const subjects = [] // Empty until real API is implemented
    
    return {
      ...student,
      averageScore: Math.floor(Math.random() * 30) + 60,
      grade: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
      attendance: Math.floor(Math.random() * 20) + 80, // 80-100%
      parentContact: {
        name: `${student.firstName} Parent`,
        email: `parent.${student.firstName.toLowerCase()}@email.com`,
        phone: `+234-${Math.floor(Math.random() * 900000000) + 100000000}`,
        relationship: ["Father", "Mother", "Guardian"][Math.floor(Math.random() * 3)]
      },
      communicationHistory: [
        {
          id: "1",
          type: "email",
          subject: "Progress Update",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: "read"
        },
        {
          id: "2", 
          type: "sms",
          subject: "Assignment Reminder",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: "delivered"
        },
        {
          id: "3",
          type: "call",
          subject: "Parent-Teacher Meeting",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "sent"
        }
      ],
      subjectPerformance: subjects.map(subject => ({
        subjectId: subject.id,
        subjectName: subject.name,
        ca: Math.floor(Math.random() * 25) + 5, // 5-30
        exam: Math.floor(Math.random() * 50) + 20, // 20-70
        total: Math.floor(Math.random() * 40) + 50, // 50-90
        grade: ["A", "B", "C", "D", "F"][Math.floor(Math.random() * 5)],
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable"
      }))
    }
  }

  const handleStudentClick = (student: Student) => {
    const studentDetail = generateStudentDetailData(student)
    setSelectedStudent(studentDetail)
    setStudentDialogOpen(true)
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 70) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
    return <Badge className="bg-red-100 text-red-800">Needs Attention</Badge>
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const getCommStatusIcon = (status: string) => {
    switch (status) {
      case "read":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "delivered":
        return <Mail className="h-4 w-4 text-blue-600" />
      case "sent":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "replied":
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

  const selectedClassData = selectedClass ? classPerformance[selectedClass] : null
  const selectedClassStudents = selectedClass ? 
    allStudents.filter(s => s.classId === selectedClass) : []

  const filteredStudents = selectedClassStudents.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false
    
    if (filterStatus === "all") return true
    
    // Mock performance filtering
    const avgScore = Math.floor(Math.random() * 40) + 50
    if (filterStatus === "excellent" && avgScore >= 80) return true
    if (filterStatus === "good" && avgScore >= 70 && avgScore < 80) return true
    if (filterStatus === "needs_attention" && avgScore < 60) return true
    
    return false
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your classes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            👥 My Classes Management
          </h1>
          <p className="text-muted-foreground">
            Manage your classes, track student performance, and communicate with parents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm">
            <Send className="mr-2 h-4 w-4" />
            Send Update
          </Button>
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map(classRoom => {
          const performance = classPerformance[classRoom.id]
          if (!performance) return null

          return (
            <Card 
              key={classRoom.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedClass === classRoom.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedClass(classRoom.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    {classRoom.name}
                  </CardTitle>
                  {getPerformanceBadge(performance.averageScore)}
                </div>
                <CardDescription>
                  Level {classRoom.level} • {performance.totalStudents} Students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{performance.averageScore}</div>
                    <div className="text-xs text-muted-foreground">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{performance.passRate}%</div>
                    <div className="text-xs text-muted-foreground">Pass Rate</div>
                  </div>
                </div>

                {/* Subjects */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Subject Assignments</h4>
                  <div className="space-y-2">
                    {performance.subjects.slice(0, 3).map(subject => (
                      <div key={subject.id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{subject.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{subject.average}</span>
                          <div className="w-12 h-1 bg-gray-200 rounded-full">
                            <div 
                              className="h-1 bg-primary rounded-full"
                              style={{ width: `${subject.average}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {performance.subjects.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{performance.subjects.length - 3} more subjects
                      </div>
                    )}
                  </div>
                </div>

                {/* Attendance */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Attendance Rate</span>
                    <span className="font-medium">{performance.attendance.rate.toFixed(1)}%</span>
                  </div>
                  <Progress value={performance.attendance.rate} className="h-2" />
                </div>

                {/* Last Activity */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Last activity {formatTimeAgo(performance.lastActivity)}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Class View */}
      {selectedClass && selectedClassData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {selectedClassData.className} - Detailed View
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Class Report
                </Button>
                <Button variant="outline" size="sm">
                  <Send className="mr-2 h-4 w-4" />
                  Message Parents
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="students">Student Roster</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="communication">Communication</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Performance Summary */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Performance Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Class Average</span>
                        <span className="font-bold">{selectedClassData.averageScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pass Rate</span>
                        <span className="font-bold text-green-600">{selectedClassData.passRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Attendance</span>
                        <span className="font-bold">{selectedClassData.attendance.rate.toFixed(1)}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Performers */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Top Performers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedClassData.topPerformers.map(student => (
                        <div key={student.id} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback className="text-xs">
                              {student.firstName[0]}{student.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{student.firstName} {student.lastName}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Needs Attention */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        Needs Attention
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedClassData.needsAttention.map(student => (
                        <div key={student.id} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback className="text-xs">
                              {student.firstName[0]}{student.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{student.firstName} {student.lastName}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Subject Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Subject Performance Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {selectedClassData.subjects.map(subject => (
                        <div key={subject.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{subject.name}</h4>
                            <Badge variant="outline">{subject.average}</Badge>
                          </div>
                          <Progress value={subject.average} className="h-2 mb-2" />
                          <p className="text-xs text-muted-foreground">
                            Last activity: {formatTimeAgo(subject.lastActivity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Students Tab */}
              <TabsContent value="students" className="space-y-4">
                {/* Student Filters */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter: {filterStatus === "all" ? "All" : filterStatus}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                        All Students
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("excellent")}>
                        Excellent (80+)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("good")}>
                        Good (70-79)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("needs_attention")}>
                        Needs Attention (&lt;60)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Student List */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredStudents.map(student => {
                    const avgScore = Math.floor(Math.random() * 40) + 50 // Mock score
                    return (
                      <Card 
                        key={student.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleStudentClick(student)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar>
                              <AvatarImage src="/placeholder-user.jpg" />
                              <AvatarFallback>
                                {student.firstName[0]}{student.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold">{student.firstName} {student.lastName}</h4>
                              <p className="text-sm text-muted-foreground">{student.studentId}</p>
                            </div>
                            {getPerformanceBadge(avgScore)}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Average Score</span>
                              <span className="font-medium">{avgScore}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Attendance</span>
                              <span className="font-medium">{Math.floor(Math.random() * 20) + 80}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Class Performance Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedClassData.subjects.map(subject => (
                          <div key={subject.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{subject.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{subject.average}</span>
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Grade Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {["A", "B", "C", "D", "F"].map(grade => {
                          const count = Math.floor(Math.random() * 10) + 1
                          const percentage = (count / selectedClassData.totalStudents) * 100
                          return (
                            <div key={grade} className="flex items-center gap-2">
                              <div className="w-8 text-center font-bold">{grade}</div>
                              <div className="flex-1">
                                <Progress value={percentage} className="h-2" />
                              </div>
                              <div className="w-12 text-right text-sm">{count}</div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Communication Tab */}
              <TabsContent value="communication" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Communications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { type: "email", subject: "Weekly Progress Report", date: "2h ago", status: "sent" },
                          { type: "sms", subject: "Assignment Reminder", date: "1d ago", status: "delivered" },
                          { type: "meeting", subject: "Parent-Teacher Conference", date: "3d ago", status: "completed" }
                        ].map((comm, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 border rounded">
                            {getCommStatusIcon(comm.status)}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{comm.subject}</p>
                              <p className="text-xs text-muted-foreground">{comm.date}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">{comm.type}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button className="w-full justify-start" variant="outline">
                          <Mail className="mr-2 h-4 w-4" />
                          Send Progress Report
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Broadcast Message
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Meeting
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Phone className="mr-2 h-4 w-4" />
                          Contact Parent
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Student Detail Dialog */}
      <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>
                  {selectedStudent?.firstName[0]}{selectedStudent?.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div>{selectedStudent?.firstName} {selectedStudent?.lastName}</div>
                <div className="text-sm text-muted-foreground">{selectedStudent?.studentId}</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Overview */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedStudent.averageScore}</div>
                      <div className="text-sm text-muted-foreground">Average Score</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedStudent.attendance}%</div>
                      <div className="text-sm text-muted-foreground">Attendance</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Badge className="text-lg px-3 py-1">{selectedStudent.grade}</Badge>
                      <div className="text-sm text-muted-foreground mt-1">Current Grade</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="performance" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="contact">Parent Contact</TabsTrigger>
                  <TabsTrigger value="communication">Communication</TabsTrigger>
                </TabsList>

                {/* Performance Tab */}
                <TabsContent value="performance">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Subject Performance</h4>
                    <div className="space-y-3">
                      {selectedStudent.subjectPerformance.map(subject => (
                        <div key={subject.subjectId} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium">{subject.subjectName}</h5>
                              {getTrendIcon(subject.trend)}
                            </div>
                            <Badge variant={subject.grade === "F" ? "destructive" : "default"}>
                              {subject.grade}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">CA: </span>
                              <span className="font-medium">{subject.ca}/30</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Exam: </span>
                              <span className="font-medium">{subject.exam}/70</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Total: </span>
                              <span className="font-medium">{subject.total}/100</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Parent Contact Tab */}
                <TabsContent value="contact">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Parent/Guardian Information</h4>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <UserCheck className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{selectedStudent.parentContact.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedStudent.parentContact.relationship}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{selectedStudent.parentContact.email}</p>
                            <p className="text-sm text-muted-foreground">Email Address</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{selectedStudent.parentContact.phone}</p>
                            <p className="text-sm text-muted-foreground">Phone Number</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Phone className="mr-2 h-4 w-4" />
                        Call Parent
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send SMS
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Communication History Tab */}
                <TabsContent value="communication">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Communication History</h4>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Communication
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {selectedStudent.communicationHistory.map(comm => (
                        <div key={comm.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getCommStatusIcon(comm.status)}
                              <span className="font-medium">{comm.subject}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {comm.type}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{formatTimeAgo(comm.date)}</span>
                            <span className="capitalize">{comm.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
