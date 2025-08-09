"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ClassRadarChart } from "@/components/charts/class-radar"
import { StudentTrendChart } from "@/components/charts/student-trend"
import { 
  BookOpen,
  Award,
  TrendingUp,
  Calendar,
  Bell,
  FileText,
  Target,
  BarChart3,
  Clock,
  User,
  GraduationCap,
  Download,
  MessageCircle,
  Star,
  Trophy,
  Medal,
  Users,
  CheckCircle,
  AlertCircle,
  ChevronRight
} from "lucide-react"
import { db } from "@/lib/mock-db"
import { Student, ResultEntry, Subject } from "@/lib/types"

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<Student | null>(null)
  const [recentResults, setRecentResults] = useState<any[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [upcomingAssessments, setUpcomingAssessments] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [trendData, setTrendData] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      const students = db.listStudents()
      const studentData = students[0]
      const subjectsData = db.listSubjects() || []
      const results = generateRecentResults()
      const assessments = generateUpcomingAssessments()
      const notifs = generateNotifications()
      const performance = generatePerformanceData(subjectsData)
      const trends = generateTrendData()
      const studentAchievements = generateAchievements()
      
      setStudent(studentData)
      setSubjects(subjectsData)
      setRecentResults(results)
      setUpcomingAssessments(assessments)
      setNotifications(notifs)
      setPerformanceData(performance)
      setTrendData(trends)
      setAchievements(studentAchievements)
      setLoading(false)
    }, 500)
  }, [])

  const generateRecentResults = () => {
    return [
      {
        subject: "Mathematics",
        ca: 18,
        exam: 72,
        total: 90,
        grade: "A",
        position: 3,
        term: "Term 2"
      },
      {
        subject: "English Language",
        ca: 16,
        exam: 68,
        total: 84,
        grade: "A",
        position: 5,
        term: "Term 2"
      },
      {
        subject: "Physics",
        ca: 15,
        exam: 70,
        total: 85,
        grade: "A",
        position: 2,
        term: "Term 2"
      }
    ]
  }

  const generateUpcomingAssessments = () => {
    return [
      {
        subject: "Chemistry",
        type: "CA Test",
        date: "2024-08-15",
        time: "10:00 AM"
      },
      {
        subject: "Biology",
        type: "Assignment",
        date: "2024-08-18",
        time: "Due by 5:00 PM"
      }
    ]
  }

  const generateNotifications = () => {
    return [
      {
        title: "Term 2 Results Available",
        message: "Your Term 2 results have been published",
        date: "2024-08-08",
        type: "result"
      },
      {
        title: "Parent-Teacher Meeting",
        message: "Scheduled for Friday, August 16th",
        date: "2024-08-07",
        type: "meeting"
      },
      {
        title: "Chemistry Test Reminder",
        message: "CA Test tomorrow at 10:00 AM",
        date: "2024-08-07",
        type: "assessment"
      }
    ]
  }

  const generatePerformanceData = (subjects: Subject[]) => {
    return {
      labels: subjects.slice(0, 6).map(s => s.name),
      datasets: [
        {
          label: "Your Performance",
          data: [85, 78, 92, 88, 76, 82],
          borderColor: "hsl(var(--primary))",
          backgroundColor: "hsl(var(--primary) / 0.1)",
        },
        {
          label: "Class Average",
          data: [80, 75, 85, 82, 73, 79],
          borderColor: "hsl(var(--muted-foreground))",
          backgroundColor: "hsl(var(--muted-foreground) / 0.1)",
        }
      ]
    }
  }

  const generateTrendData = () => {
    return [
      { month: "Jan", gpa: 3.2, attendance: 95 },
      { month: "Feb", gpa: 3.4, attendance: 92 },
      { month: "Mar", gpa: 3.6, attendance: 96 },
      { month: "Apr", gpa: 3.5, attendance: 94 },
      { month: "May", gpa: 3.7, attendance: 97 },
      { month: "Jun", gpa: 3.8, attendance: 95 }
    ]
  }

  const generateAchievements = () => {
    return [
      {
        id: "1",
        title: "Academic Excellence",
        description: "Achieved GPA above 3.5 for 3 consecutive terms",
        icon: "trophy",
        color: "gold",
        date: "2024-06-15",
        category: "Academic"
      },
      {
        id: "2",
        title: "Perfect Attendance",
        description: "100% attendance for the month",
        icon: "medal",
        color: "silver",
        date: "2024-05-30",
        category: "Behavior"
      },
      {
        id: "3",
        title: "Top Performer",
        description: "Ranked #1 in Mathematics class",
        icon: "star",
        color: "bronze",
        date: "2024-05-15",
        category: "Academic"
      },
      {
        id: "4",
        title: "Class Representative",
        description: "Elected as class representative",
        icon: "users",
        color: "blue",
        date: "2024-04-20",
        category: "Leadership"
      }
    ]
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No student data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentGPA = student.currentGPA || 0
  const attendancePercentage = student.attendance?.percentage || 0
  const unreadNotifications = notifications.filter(n => n.type !== "read").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {student.name}
          </h1>
          <p className="text-muted-foreground">
            Track your academic progress and stay updated with your performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Reports
          </Button>
        </div>
      </div>

      {/* Academic Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{currentGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              <span className="text-green-600">+0.2 from last term</span>
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Results</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {recentResults.length > 0 ? recentResults[0].total + '%' : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {recentResults.length > 0 ? recentResults[0].subject : 'No recent results'}
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-10 -mt-10"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Assessments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{upcomingAssessments.length}</div>
            <p className="text-xs text-muted-foreground">
              Next: {upcomingAssessments.length > 0 ? upcomingAssessments[0].subject : 'None scheduled'}
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full -mr-10 -mt-10"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unreadNotifications}</div>
            <p className="text-xs text-muted-foreground">
              {unreadNotifications > 0 ? 'New messages' : 'All caught up!'}
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full -mr-10 -mt-10"></div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Performance Visualization */}
        <div className="md:col-span-2 space-y-6">
          {/* Subject Performance Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Subject-wise Performance
              </CardTitle>
              <CardDescription>Your performance vs class average</CardDescription>
            </CardHeader>
            <CardContent>
              {performanceData && <ClassRadarChart data={performanceData} />}
            </CardContent>
          </Card>

          {/* Grade Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Grade Trends Over Time
              </CardTitle>
              <CardDescription>Track your academic progress throughout the year</CardDescription>
            </CardHeader>
            <CardContent>
              <StudentTrendChart data={trendData} />
            </CardContent>
          </Card>

          {/* Achievement Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievement Badges
              </CardTitle>
              <CardDescription>Your milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      {achievement.icon === 'trophy' && <Trophy className="h-6 w-6 text-white" />}
                      {achievement.icon === 'medal' && <Medal className="h-6 w-6 text-white" />}
                      {achievement.icon === 'star' && <Star className="h-6 w-6 text-white" />}
                      {achievement.icon === 'users' && <Users className="h-6 w-6 text-white" />}
                    </div>
                    <h4 className="font-semibold text-sm">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {achievement.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Access
              </CardTitle>
              <CardDescription>Common actions and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <div className="flex items-center cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  Check Latest Results
                  <ChevronRight className="ml-auto h-4 w-4" />
                </div>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <div className="flex items-center cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  View Notifications
                  <Badge variant="secondary" className="ml-auto">
                    {unreadNotifications}
                  </Badge>
                </div>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <div className="flex items-center cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  Download Reports
                  <ChevronRight className="ml-auto h-4 w-4" />
                </div>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <div className="flex items-center cursor-pointer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Teacher
                  <ChevronRight className="ml-auto h-4 w-4" />
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Mathematics result published</p>
                    <p className="text-xs text-muted-foreground">Grade: A (95%) - 2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Assignment submitted</p>
                    <p className="text-xs text-muted-foreground">English Literature - 1 day ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Upcoming test reminder</p>
                    <p className="text-xs text-muted-foreground">Chemistry - in 3 days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Performance</span>
                  <span className="text-sm font-bold">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Attendance Rate</span>
                  <span className="text-sm font-bold">{attendancePercentage.toFixed(1)}%</span>
                </div>
                <Progress value={attendancePercentage} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Assignment Completion</span>
                  <span className="text-sm font-bold">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Class Position</span>
                  <Badge variant="default">3rd of 30</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
