"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  Edit,
  Settings,
  Shield,
  Bell,
  CreditCard,
  FileText,
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  MessageSquare,
  Trash2,
  Download,
  UserPlus,
  UserMinus,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Award,
  BarChart3,
  PieChart,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface Props {
  params: {
    id: string
  }
}

export default function SchoolProfilePage({ params }: Props) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchStudents, setSearchStudents] = useState("")
  const [searchTeachers, setSearchTeachers] = useState("")
  const [searchClasses, setSearchClasses] = useState("")

  // Get school data
  const school = db.getSchool(params.id)
  const students = db.listStudents().filter(s => s.schoolId === params.id)
  const teachers = db.listTeachers().filter(t => t.schoolId === params.id)
  const classes = db.listClasses().filter(c => c.schoolId === params.id)
  const subjects = db.listSubjects().filter(s => s.schoolId === params.id)

  if (!school) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">School not found</h3>
          <p className="text-muted-foreground mb-4">
            The school you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/admin/schools">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schools
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Filter data based on search
    const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchStudents.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchStudents.toLowerCase()) ||
    (student.email && student.email.toLowerCase().includes(searchStudents.toLowerCase()))
  )

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTeachers.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTeachers.toLowerCase())
  )

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchClasses.toLowerCase()) ||
    cls.level.toLowerCase().includes(searchClasses.toLowerCase())
  )  // Mock performance data
  const performanceData = [
    { month: "Jan", average: 72 },
    { month: "Feb", average: 74 },
    { month: "Mar", average: 71 },
    { month: "Apr", average: 76 },
    { month: "May", average: 78 },
    { month: "Jun", average: 75 },
  ]

  // Recent activities for this school
  const recentActivities = [
    {
      id: "1",
      type: "student_enrolled",
      message: "New student John Doe enrolled",
      timestamp: "2 hours ago",
      severity: "info" as const,
      icon: UserPlus,
    },
    {
      id: "2", 
      type: "payment_received",
      message: "Monthly payment received - ₦45,000",
      timestamp: "1 day ago",
      severity: "success" as const,
      icon: CreditCard,
    },
    {
      id: "3",
      type: "teacher_added",
      message: "New teacher Sarah Johnson added",
      timestamp: "3 days ago", 
      severity: "info" as const,
      icon: UserPlus,
    },
    {
      id: "4",
      type: "class_completed",
      message: "Mathematics class completed - 25 students",
      timestamp: "1 week ago",
      severity: "success" as const,
      icon: BookOpen,
    },
  ]

  const performanceMetrics = [
    { label: "Student Satisfaction", value: 92, trend: "up", change: "+5%" },
    { label: "Teacher Retention", value: 88, trend: "up", change: "+2%" },
    { label: "Class Completion Rate", value: 95, trend: "up", change: "+3%" },
    { label: "Payment Timeliness", value: 76, trend: "down", change: "-8%" },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success": return "text-green-600"
      case "warning": return "text-yellow-600"
      case "error": return "text-red-600"
      default: return "text-blue-600"
    }
  }

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge variant="default" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Inactive
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/schools">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schools
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{school.name}</h1>
            <p className="text-muted-foreground">
              School Profile & Management
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit School
          </Button>
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                School Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Deactivate School
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* School Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              School Information
            </span>
            {getStatusBadge(school.active)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Brand</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{school.brand}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Plan</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{school.plan}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(school.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Contact Email</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${school.contactEmail}`} className="hover:underline">
                    {school.contactEmail}
                  </a>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${school.contactPhone}`} className="hover:underline">
                    {school.contactPhone}
                  </a>
                </div>
              </div>
              {school.website && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Website</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="h-4 w-4" />
                    <a href={school.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Visit Website
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Admin Assignments</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="h-4 w-4" />
                  <span>3 Admins Assigned</span>
                </div>
              </div>
              {school.address && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {school.address}
                  </div>
                </div>
              )}
              {school.currentBilling && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Billing Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {school.currentBilling.paymentStatus === "Active" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>₦{school.currentBilling.amount.toLocaleString()} / month</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-2xl font-bold">{school.currentStudentCount}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Teachers</p>
                <p className="text-2xl font-bold">{school.stats?.teachers || 0}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Classes</p>
                <p className="text-2xl font-bold">{school.stats?.classes || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">₦{(school.currentBilling?.amount || 0).toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{metric.value}%</span>
                        <div className={`flex items-center gap-1 ${
                          metric.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          {metric.trend === "up" ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span className="text-xs">{metric.change}</span>
                        </div>
                      </div>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`p-1 rounded-full ${getSeverityColor(activity.severity)}`}>
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>Average school performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Students ({filteredStudents.length})
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative w-64">
                    <Input
                      placeholder="Search students..."
                      value={searchStudents}
                      onChange={(e) => setSearchStudents(e.target.value)}
                    />
                  </div>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-muted-foreground">{student.email || "No email"}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{student.performanceLevel}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.active ? "default" : "secondary"}>
                            {student.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(student.enrollmentDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={85} className="w-16 h-2" />
                            <span className="text-sm">85%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Student
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <UserMinus className="h-4 w-4 mr-2" />
                                Remove Student
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Teachers ({filteredTeachers.length})
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative w-64">
                    <Input
                      placeholder="Search teachers..."
                      value={searchTeachers}
                      onChange={(e) => setSearchTeachers(e.target.value)}
                    />
                  </div>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Teacher
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              {teacher.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium">{teacher.name}</div>
                              <div className="text-sm text-muted-foreground">{teacher.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {teacher.subjects.map((subject, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{teacher.workload?.totalClasses || 0}</TableCell>
                        <TableCell>{teacher.workload?.totalStudents || 0}</TableCell>
                        <TableCell>
                          <Badge variant={teacher.active ? "default" : "secondary"}>
                            {teacher.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Teacher
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Award className="h-4 w-4 mr-2" />
                                View Performance
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <UserMinus className="h-4 w-4 mr-2" />
                                Remove Teacher
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Classes ({filteredClasses.length})
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative w-64">
                    <Input
                      placeholder="Search classes..."
                      value={searchClasses}
                      onChange={(e) => setSearchClasses(e.target.value)}
                    />
                  </div>
                  <Button>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Add Class
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{cls.name}</div>
                            <div className="text-sm text-muted-foreground">{cls.level}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {cls.subjectIds.length > 0 ? (
                              subjects.filter(s => cls.subjectIds.includes(s.id)).map(subject => (
                                <Badge key={subject.id} variant="outline" className="text-xs">
                                  {subject.name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">No subjects</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {cls.teacherId ? 
                            teachers.find(t => t.id === cls.teacherId)?.name || "N/A" : 
                            "No teacher assigned"
                          }
                        </TableCell>
                        <TableCell>{cls.studentCount}/{cls.capacity || 30}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {cls.schedule ? (
                              <div>
                                <div>{cls.schedule.periods} periods</div>
                                <div className="text-muted-foreground">
                                  {cls.schedule.startTime} - {cls.schedule.endTime}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No schedule</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Class
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className="h-4 w-4 mr-2" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Class
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="school-name">School Name</Label>
                  <Input id="school-name" defaultValue={school.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" type="email" defaultValue={school.contactEmail} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input id="contact-phone" defaultValue={school.contactPhone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue={school.website || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue={school.address || ""} />
                </div>
              </CardContent>
            </Card>

            {/* Plan & Billing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Plan & Billing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plan">Current Plan</Label>
                  <Select defaultValue={school.plan}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Pro">Pro</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Billing Information</Label>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Monthly Fee:</span>
                      <span className="font-medium">₦{school.currentBilling?.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Payment:</span>
                      <span>Dec 1, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <Badge variant={school.currentBilling?.paymentStatus === "Active" ? "default" : "destructive"}>
                        {school.currentBilling?.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="payment-reminders">Payment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get notified about upcoming payments</p>
                  </div>
                  <Switch id="payment-reminders" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="performance-reports">Performance Reports</Label>
                    <p className="text-sm text-muted-foreground">Weekly performance summaries</p>
                  </div>
                  <Switch id="performance-reports" />
                </div>
              </CardContent>
            </Card>

            {/* Access Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>School Status</Label>
                    <p className="text-sm text-muted-foreground">Enable or disable school access</p>
                  </div>
                  <Switch defaultChecked={school.active} />
                </div>
                <div className="space-y-2">
                  <Label>Admin Permissions</Label>
                  <div className="text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Student Management</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Teacher Management</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Financial Reports</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
