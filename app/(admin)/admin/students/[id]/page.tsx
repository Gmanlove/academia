"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  TableRow 
} from "@/components/ui/table"
import { db } from "@/lib/mock-db"
import { Student, School, ClassRoom, Subject, ResultEntry } from "@/lib/types"
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown,
  Download,
  MessageSquare,
  Bell,
  Clock,
  Building2,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  BarChart3,
  FileText,
  Camera,
  Settings,
} from "lucide-react"
import { StudentTrendChart } from "@/components/charts/student-trend"

export default function StudentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string

  const [student, setStudent] = useState<Student | null>(null)
  const [school, setSchool] = useState<School | null>(null)
  const [studentClass, setStudentClass] = useState<ClassRoom | null>(null)
  const [results, setResults] = useState<ResultEntry[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])

  useEffect(() => {
    // Load student data
    const studentData = db.getStudent(studentId)
    if (studentData) {
      setStudent(studentData)
      
      // Load related data
      const schoolData = db.getSchool(studentData.schoolId)
      setSchool(schoolData)
      
      const classData = db.getClass(studentData.classId)
      setStudentClass(classData)
      
      // Load student results
      const studentResults = db.getStudentResults(studentId)
      setResults(studentResults || [])
      
      // Load subjects
      if (classData) {
        const classSubjects = classData.subjectIds.map(id => db.getSubject(id)).filter(Boolean)
        setSubjects(classSubjects)
      }
    }
  }, [studentId])

  if (!student) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="text-center py-12">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Student not found</h3>
          <p className="text-muted-foreground">
            The student you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  const calculateGPA = () => {
    if (results.length === 0) return 0
    const total = results.reduce((sum, result) => sum + result.total, 0)
    return total / results.length
  }

  const getPerformanceTrend = () => {
    // Calculate trend based on recent results
    if (results.length < 2) return "stable"
    const recent = results.slice(-3).map(r => r.total)
    const trend = recent[recent.length - 1] - recent[0]
    return trend > 5 ? "improving" : trend < -5 ? "declining" : "stable"
  }

  const getGradeColor = (grade: string) => {
    switch (grade?.toUpperCase()) {
      case 'A': return 'text-green-600'
      case 'B': return 'text-blue-600'
      case 'C': return 'text-yellow-600'
      case 'D': return 'text-orange-600'
      case 'F': return 'text-red-600'
      default: return 'text-muted-foreground'
    }
  }

  const performanceTrend = getPerformanceTrend()
  const currentGPA = calculateGPA()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back to Students
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
            <p className="text-muted-foreground">
              Student Profile • ID: {student.studentId}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Transcript
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Student Info Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                {student.photoUrl ? (
                  <img 
                    src={student.photoUrl} 
                    alt={student.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-blue-600">
                    {student.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <div className="font-semibold">{student.name}</div>
                <div className="text-sm text-muted-foreground">
                  ID: {student.studentId}
                </div>
                <Badge variant={student.active ? "default" : "secondary"}>
                  {student.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              {student.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
              )}
              
              {student.dateOfBirth && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(student.dateOfBirth).toLocaleDateString()}</span>
                </div>
              )}
              
              {student.gender && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{student.gender}</span>
                </div>
              )}
              
              {student.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{student.address}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Academic Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">{currentGPA.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Current GPA</div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Badge 
                    variant={
                      student.performanceLevel === "Excellent" ? "default" :
                      student.performanceLevel === "Good" ? "secondary" :
                      student.performanceLevel === "Average" ? "outline" :
                      "destructive"
                    }
                  >
                    {student.performanceLevel}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">Performance</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{school?.name || "N/A"}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{studentClass?.name || "N/A"}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{subjects.length} subjects enrolled</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                {performanceTrend === "improving" ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : performanceTrend === "declining" ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={
                  performanceTrend === "improving" ? "text-green-600" :
                  performanceTrend === "declining" ? "text-red-600" :
                  "text-muted-foreground"
                }>
                  Performance {performanceTrend}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parent/Guardian Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Parent/Guardian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {student.parentName && (
              <div>
                <div className="font-semibold">{student.parentName}</div>
                <div className="text-sm text-muted-foreground">Primary Guardian</div>
              </div>
            )}
            
            <Separator />
            
            <div className="space-y-3">
              {student.parentEmail && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{student.parentEmail}</span>
                </div>
              )}
              
              {student.parentPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{student.parentPhone}</span>
                </div>
              )}
            </div>
            
            {student.secondaryParentName && (
              <>
                <Separator />
                <div>
                  <div className="font-semibold">{student.secondaryParentName}</div>
                  <div className="text-sm text-muted-foreground">Secondary Guardian</div>
                </div>
                
                <div className="space-y-3">
                  {student.secondaryParentEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{student.secondaryParentEmail}</span>
                    </div>
                  )}
                  
                  {student.secondaryParentPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{student.secondaryParentPhone}</span>
                    </div>
                  )}
                </div>
              </>
            )}
            
            <div className="pt-4">
              <Button size="sm" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Parent
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="results" className="space-y-4">
        <TabsList>
          <TabsTrigger value="results">Results History</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="communication">Communication Log</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Results History */}
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Results</CardTitle>
              <CardDescription>
                Complete history of test scores, exams, and assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="space-y-4">
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Term</TableHead>
                          <TableHead>Session</TableHead>
                          <TableHead>CA Score</TableHead>
                          <TableHead>Exam Score</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((result) => {
                          const subject = subjects.find(s => s.id === result.subjectId)
                          return (
                            <TableRow key={result.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{subject?.name || "N/A"}</div>
                                  <div className="text-sm text-muted-foreground">{subject?.code}</div>
                                </div>
                              </TableCell>
                              <TableCell>{result.term}</TableCell>
                              <TableCell>{result.session}</TableCell>
                              <TableCell>{result.ca}/40</TableCell>
                              <TableCell>{result.exam}/60</TableCell>
                              <TableCell>
                                <div className="font-semibold">{result.total}/100</div>
                              </TableCell>
                              <TableCell>
                                <span className={`font-semibold ${getGradeColor(result.grade || '')}`}>
                                  {result.grade || "N/A"}
                                </span>
                              </TableCell>
                              <TableCell>
                                {result.position ? (
                                  <Badge variant="outline">
                                    #{result.position}
                                  </Badge>
                                ) : "N/A"}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                                  {result.teacherRemark || "No remarks"}
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Transcript
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results available</h3>
                  <p className="text-muted-foreground">
                    Results will appear here once they are submitted by teachers.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Analysis */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                  Academic performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StudentTrendChart studentId={studentId} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subject Analysis</CardTitle>
                <CardDescription>
                  Performance breakdown by subject
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.map(subject => {
                    const subjectResults = results.filter(r => r.subjectId === subject.id)
                    const average = subjectResults.length > 0 
                      ? subjectResults.reduce((sum, r) => sum + r.total, 0) / subjectResults.length
                      : 0
                    
                    return (
                      <div key={subject.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{subject.name}</span>
                          <span>{average.toFixed(1)}%</span>
                        </div>
                        <Progress value={average} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Attendance */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Record</CardTitle>
              <CardDescription>
                Track student attendance and punctuality
              </CardDescription>
            </CardHeader>
            <CardContent>
              {student.attendance ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {student.attendance.presentDays}
                      </div>
                      <div className="text-sm text-muted-foreground">Present Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {student.attendance.absentDays}
                      </div>
                      <div className="text-sm text-muted-foreground">Absent Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {student.attendance.totalDays}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {student.attendance.percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Attendance Rate</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Attendance Rate</span>
                      <span>{student.attendance.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={student.attendance.percentage} className="h-3" />
                  </div>
                  
                  {student.attendance.percentage < 75 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Attendance below recommended minimum (75%). Consider reaching out to parent/guardian.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No attendance data</h3>
                  <p className="text-muted-foreground">
                    Attendance tracking is not yet set up for this student.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Log */}
        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
              <CardDescription>
                Messages, notifications, and parent communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No communication history</h3>
                <p className="text-muted-foreground mb-4">
                  Communication logs will appear here as messages are sent.
                </p>
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Achievements & Awards</CardTitle>
              <CardDescription>
                Recognition for academic and extracurricular excellence
              </CardDescription>
            </CardHeader>
            <CardContent>
              {student.achievements && student.achievements.length > 0 ? (
                <div className="space-y-4">
                  {student.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <Award className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                          <Badge variant="outline">{achievement.category}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No achievements yet</h3>
                  <p className="text-muted-foreground">
                    Achievements and awards will be displayed here as they are earned.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
