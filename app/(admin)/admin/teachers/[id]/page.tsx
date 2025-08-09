"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
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
import { Progress } from "@/components/ui/progress"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { db } from "@/lib/mock-db"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  BookOpen,
  Users,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  Award,
  MessageSquare,
  Edit,
  Download,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle,
  Eye,
  MoreHorizontal,
  MapPin,
  Building2,
  School
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"

interface Props {
  params: {
    id: string
  }
}

export default function TeacherProfilePage({ params }: Props) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchClasses, setSearchClasses] = useState("")
  const [searchStudents, setSearchStudents] = useState("")

  const teachers = db.listTeachers()
  const teacher = teachers.find(t => t.id === params.id)
  const schools = db.listSchools()
  const classes = db.listClasses({})
  const students = db.listStudents({})

  if (!teacher) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Teacher not found</h3>
          <p className="text-muted-foreground mb-4">
            The requested teacher profile could not be found.
          </p>
          <Button asChild>
            <Link href="/admin/teachers">Back to Teachers</Link>
          </Button>
        </div>
      </div>
    )
  }

  const school = schools.find(s => s.id === teacher.schoolId)
  const teacherClasses = classes.filter(cls => cls.teacherId === teacher.id)
  const teacherStudents = students.filter(student => 
    teacherClasses.some(cls => cls.id === student.classId)
  )

  // Mock performance data
  const performanceData = [
    { month: "Jan", classAverage: 72, feedback: 4.2, timeliness: 85 },
    { month: "Feb", classAverage: 74, feedback: 4.3, timeliness: 90 },
    { month: "Mar", classAverage: 71, feedback: 4.1, timeliness: 88 },
    { month: "Apr", classAverage: 76, feedback: 4.4, timeliness: 92 },
    { month: "May", classAverage: 78, feedback: 4.5, timeliness: 95 },
    { month: "Jun", classAverage: 75, feedback: 4.3, timeliness: 90 },
  ]

  const subjectPerformance = teacher.subjects.map(subject => ({
    subject,
    average: 60 + Math.random() * 30,
    feedback: 3 + Math.random() * 2,
    fullMark: 100,
  }))

  const communicationData = [
    { category: "Email Response", value: 90 },
    { category: "Parent Meetings", value: 85 },
    { category: "Result Updates", value: 95 },
    { category: "Notice Delivery", value: 88 },
    { category: "Student Feedback", value: 92 },
  ]

  // Filter classes and students based on search
  const filteredClasses = teacherClasses.filter(cls =>
    cls.name.toLowerCase().includes(searchClasses.toLowerCase())
  )

  const filteredStudents = teacherStudents.filter(student =>
    student.name.toLowerCase().includes(searchStudents.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/admin/teachers" className="hover:text-foreground">Teachers</Link>
            <span>/</span>
            <span>{teacher.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{teacher.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={teacher.active ? "default" : "secondary"}>
              {teacher.active ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline">{teacher.experience || 0} years experience</Badge>
            <Badge variant="outline">{teacher.subjects.length} subjects</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Profile
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Professional Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {teacher.photoUrl ? (
                    <Image
                      src={teacher.photoUrl}
                      alt={teacher.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-semibold">
                      {teacher.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{teacher.name}</h3>
                  <p className="text-muted-foreground">Teacher ID: {teacher.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{teacher.email}</div>
                </div>
              </div>
              
              {teacher.phoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="font-medium">{teacher.phoneNumber}</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">School</div>
                  <div className="font-medium">{school?.name || "Not Assigned"}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Date Joined</div>
                  <div className="font-medium">
                    {teacher.dateJoined ? new Date(teacher.dateJoined).toLocaleDateString() : "Not available"}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Experience</div>
                  <div className="font-medium">{teacher.experience || 0} years</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Subjects</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {teacher.subjects.map(subject => (
                      <Badge key={subject} variant="outline">{subject}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {teacher.qualifications && (
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Qualifications</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {teacher.qualifications.map(qual => (
                        <Badge key={qual} variant="outline">{qual}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Assigned</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              Active assignments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all classes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacher.performance.classAverage}%</div>
            <p className="text-xs text-muted-foreground">
              Class average score
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Feedback</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacher.performance.studentFeedback}/5</div>
            <p className="text-xs text-muted-foreground">
              Average rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">Classes & Students</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Class performance and feedback over time</CardDescription>
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
                      dataKey="classAverage" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Class Average"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="feedback" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      name="Feedback Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Communication Activity</CardTitle>
                <CardDescription>Communication performance across channels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={communicationData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 bg-green-100 rounded-full p-2" />
                  <div className="flex-1">
                    <div className="font-medium">Results submitted on time</div>
                    <div className="text-sm text-muted-foreground">
                      Mathematics results for JSS 2A submitted
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">2 days ago</div>
                </div>
                
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <Star className="h-8 w-8 text-yellow-600 bg-yellow-100 rounded-full p-2" />
                  <div className="flex-1">
                    <div className="font-medium">High student feedback</div>
                    <div className="text-sm text-muted-foreground">
                      Received 4.8/5 rating from JSS 1B students
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">1 week ago</div>
                </div>
                
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <MessageSquare className="h-8 w-8 text-blue-600 bg-blue-100 rounded-full p-2" />
                  <div className="flex-1">
                    <div className="font-medium">Parent communication</div>
                    <div className="text-sm text-muted-foreground">
                      Conducted 5 parent meetings this week
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">3 days ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Classes ({teacherClasses.length})</CardTitle>
                <CardDescription>Classes currently taught by this teacher</CardDescription>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search classes..."
                    value={searchClasses}
                    onChange={(e) => setSearchClasses(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredClasses.map((classRoom) => (
                    <div key={classRoom.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{classRoom.name}</h4>
                          <p className="text-sm text-muted-foreground">{classRoom.level}</p>
                        </div>
                        <Badge variant="outline">{classRoom.studentCount} students</Badge>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/classes/${classRoom.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredClasses.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No classes found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Students ({teacherStudents.length})</CardTitle>
                <CardDescription>All students across teacher's classes</CardDescription>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search students..."
                    value={searchStudents}
                    onChange={(e) => setSearchStudents(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {filteredStudents.slice(0, 10).map((student) => (
                    <div key={student.id} className="flex items-center gap-3 p-2 border rounded">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{student.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {teacherClasses.find(c => c.id === student.classId)?.name}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {student.performanceLevel}
                      </Badge>
                    </div>
                  ))}
                  {filteredStudents.length > 10 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" size="sm">
                        View All ({filteredStudents.length})
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Performance across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="average" fill="#8884d8" name="Class Average" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Result Submission Timeliness</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Student Engagement</span>
                    <span>88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Parent Communication</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Professional Development</span>
                    <span>76%</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Report</CardTitle>
              <CardDescription>Comprehensive performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{teacher.performance.classAverage}%</div>
                  <div className="text-sm text-muted-foreground">Class Average</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">+2.3% from last term</span>
                  </div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{teacher.performance.studentFeedback}/5</div>
                  <div className="text-sm text-muted-foreground">Student Feedback</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-muted-foreground">Excellent rating</span>
                  </div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">94%</div>
                  <div className="text-sm text-muted-foreground">Attendance Rate</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">Above average</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Schedule</CardTitle>
              <CardDescription>Weekly class schedule and workload distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-2 text-sm font-medium">
                  <div>Time</div>
                  <div>Monday</div>
                  <div>Tuesday</div>
                  <div>Wednesday</div>
                  <div>Thursday</div>
                  <div>Friday</div>
                </div>
                
                {['8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '1:00-2:00', '2:00-3:00'].map(time => (
                  <div key={time} className="grid grid-cols-6 gap-2 text-sm">
                    <div className="font-medium">{time}</div>
                    {Array.from({ length: 5 }, (_, dayIndex) => {
                      const hasClass = Math.random() > 0.4
                      const classData = hasClass ? teacherClasses[Math.floor(Math.random() * teacherClasses.length)] : null
                      
                      return (
                        <div key={dayIndex} className="min-h-[40px]">
                          {classData && (
                            <div className="p-2 bg-blue-100 rounded text-xs">
                              <div className="font-medium">{classData.name}</div>
                              <div className="text-muted-foreground">
                                {teacher.subjects[Math.floor(Math.random() * teacher.subjects.length)]}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Workload Distribution</CardTitle>
                <CardDescription>Hours per subject per week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teacher.subjects.map(subject => {
                    const hours = Math.floor(Math.random() * 8) + 2
                    const percentage = (hours / 20) * 100
                    
                    return (
                      <div key={subject}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{subject}</span>
                          <span>{hours} hours/week</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Schedule Conflicts</CardTitle>
                <CardDescription>Potential scheduling issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">No conflicts detected</div>
                      <div className="text-xs text-muted-foreground">
                        Schedule is optimally arranged
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    All classes are properly scheduled with adequate breaks
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
