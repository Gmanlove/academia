"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { db } from "@/lib/mock-db"
import {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Activity,
  TrendingUp,
  Edit,
  MessageSquare,
  Download,
  Eye,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import Link from "next/link"

interface Props {
  params: {
    id: string
  }
}

export default function SchoolDetailPage({ params }: Props) {
  const [activeTab, setActiveTab] = useState("overview")
  
  const schools = db.listSchools()
  const school = schools.find(s => s.id === params.id)
  const students = db.listStudents({ schoolId: params.id })
  const teachers = db.listTeachers().filter(t => t.schoolId === params.id)
  const classes = db.listClasses({ schoolId: params.id })
  const subjects = db.listSubjects({ schoolId: params.id })

  if (!school) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">School not found</h3>
          <p className="text-muted-foreground mb-4">
            The requested school could not be found.
          </p>
          <Button asChild>
            <Link href="/admin/schools">Back to Schools</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Mock performance data
  const performanceData = [
    { month: "Jan", average: 72 },
    { month: "Feb", average: 74 },
    { month: "Mar", average: 71 },
    { month: "Apr", average: 76 },
    { month: "May", average: 78 },
    { month: "Jun", average: 75 },
  ]

  const subjectPerformance = subjects.map(subject => ({
    subject: subject.name,
    average: 60 + Math.random() * 30,
    students: Math.floor(Math.random() * 50) + 20,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/admin/schools" className="hover:text-foreground">Schools</Link>
            <span>/</span>
            <span>{school.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{school.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{school.brand}</Badge>
            <Badge variant={school.active ? "default" : "secondary"}>
              {school.active ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline">{school.plan} Plan</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit School
          </Button>
        </div>
      </div>

      {/* School Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            School Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{school.contactEmail}</div>
                </div>
              </div>
              
              {school.contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="font-medium">{school.contactPhone}</div>
                  </div>
                </div>
              )}
              
              {school.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Website</div>
                    <a href={school.website} className="font-medium text-blue-600 hover:underline">
                      {school.website}
                    </a>
                  </div>
                </div>
              )}
              
              {school.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div className="font-medium">{school.address}</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Created</div>
                  <div className="font-medium">
                    {new Date(school.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Capacity</div>
                  <div className="font-medium">
                    {school.currentStudentCount} / {school.maxStudents} students
                  </div>
                </div>
              </div>
              
              {school.adminAssigned && (
                <div className="flex items-center gap-3">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Admin</div>
                    <div className="font-medium">{school.adminAssigned}</div>
                  </div>
                </div>
              )}
              
              {school.currentBilling && (
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Billing Status</div>
                    <div className="flex items-center gap-2">
                      {school.currentBilling.paymentStatus === "Active" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className="font-medium">
                        ₦{school.currentBilling.amount.toLocaleString()} / {school.currentBilling.billingCycle}
                      </span>
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
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{school.stats.students}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +5% from last term
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{school.stats.teachers}</div>
            <p className="text-xs text-muted-foreground">
              {teachers.filter(t => t.active).length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{school.stats.classes}</div>
            <p className="text-xs text-muted-foreground">
              Active sessions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{school.stats.averagePerformance?.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              School-wide average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
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
            
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Average scores by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="average" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 bg-blue-100 rounded-full p-2" />
                  <div className="flex-1">
                    <div className="font-medium">New student enrollments</div>
                    <div className="text-sm text-muted-foreground">5 new students enrolled this week</div>
                  </div>
                  <div className="text-sm text-muted-foreground">2 days ago</div>
                </div>
                
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <BookOpen className="h-8 w-8 text-green-600 bg-green-100 rounded-full p-2" />
                  <div className="flex-1">
                    <div className="font-medium">Results submitted</div>
                    <div className="text-sm text-muted-foreground">Mathematics results for JSS 2</div>
                  </div>
                  <div className="text-sm text-muted-foreground">3 days ago</div>
                </div>
                
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <GraduationCap className="h-8 w-8 text-purple-600 bg-purple-100 rounded-full p-2" />
                  <div className="flex-1">
                    <div className="font-medium">Teacher assignment</div>
                    <div className="text-sm text-muted-foreground">New English teacher assigned to JSS 1</div>
                  </div>
                  <div className="text-sm text-muted-foreground">1 week ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Students ({students.length})</CardTitle>
              <CardDescription>All students enrolled in this school</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.slice(0, 10).map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>
                        {classes.find(c => c.id === student.classId)?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.performanceLevel}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={student.active ? "default" : "secondary"}>
                          {student.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {students.length > 10 && (
                <div className="mt-4 text-center">
                  <Button variant="outline">
                    View All Students ({students.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teachers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teachers ({teachers.length})</CardTitle>
              <CardDescription>Teaching staff assigned to this school</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {teacher.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{teacher.name}</div>
                            <div className="text-sm text-muted-foreground">{teacher.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.map(subject => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{teacher.experience} years</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Avg: {teacher.performance.classAverage}%</div>
                          <div className="text-muted-foreground">
                            Feedback: {teacher.performance.studentFeedback}/5
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={teacher.active ? "default" : "secondary"}>
                          {teacher.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Classes ({classes.length})</CardTitle>
              <CardDescription>Active classes in this school</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((classRoom) => (
                  <Card key={classRoom.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{classRoom.name}</CardTitle>
                      <CardDescription>{classRoom.level}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Students:</span>
                          <span className="font-medium">{classRoom.studentCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Subjects:</span>
                          <span className="font-medium">{classRoom.subjectIds.length}</span>
                        </div>
                        {classRoom.teacherId && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Teacher:</span>
                            <span className="font-medium">
                              {teachers.find(t => t.id === classRoom.teacherId)?.name || "N/A"}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>School Settings</CardTitle>
              <CardDescription>Configure school-specific settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-3">Academic Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Academic Year</label>
                      <div className="font-medium">{school.settings.academicYear}</div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Terms</label>
                      <div className="flex gap-1 mt-1">
                        {school.settings.terms.map(term => (
                          <Badge key={term} variant="outline">{term}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Grading Scale</label>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {school.settings.gradingScale.map(grade => (
                          <Badge key={grade} variant="outline">{grade}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Assessment Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Max CA Score</label>
                      <div className="font-medium">{school.settings.maxCA}</div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Max Exam Score</label>
                      <div className="font-medium">{school.settings.maxExam}</div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Passing Grade</label>
                      <div className="font-medium">{school.settings.passingGrade}%</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Communication Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">SMS Credits</label>
                      <div className="font-medium">{school.settings.smsCredits}</div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Notification Channels</label>
                      <div className="flex gap-1 mt-1">
                        {school.settings.notificationChannels.map(channel => (
                          <Badge key={channel} variant="outline">{channel}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Parent Access</label>
                      <div className="font-medium">
                        {school.settings.allowParentAccess ? "Enabled" : "Disabled"}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Result Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Result Visibility</label>
                      <div className="font-medium">{school.settings.resultVisibility}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
