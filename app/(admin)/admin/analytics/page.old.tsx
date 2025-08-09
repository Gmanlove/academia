"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  Calendar as CalendarIcon,
  Filter,
  Eye,
  School,
  Users,
  GraduationCap,
  BookOpen,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Activity,
  Clock,
  DollarSign
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
  ComposedChart,
  Scatter,
  ScatterChart
} from "recharts"
import { db } from "@/lib/mock-db"
import { StudentTrendChart } from "@/components/charts/student-trend"
import { SubjectDistributionChart } from "@/components/charts/subject-distribution"
import { ClassRadarChart } from "@/components/charts/class-radar"
import { Analytics, AdminDashboardStats } from "@/lib/types"

export default function AnalyticsPage() {
  const [selectedSchool, setSelectedSchool] = useState<string>("all")
  const [selectedTerm, setSelectedTerm] = useState<string>("current")
  const [selectedSession, setSelectedSession] = useState<string>("2024/2025")
  const [dateRange, setDateRange] = useState<any>()
  const [reportType, setReportType] = useState<string>("overview")
  const [loading, setLoading] = useState(true)
  
  const [dashboardData, setDashboardData] = useState<AdminDashboardStats | null>(null)
  const [analyticsData, setAnalyticsData] = useState<Analytics | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setDashboardData(db.getAdminDashboard())
      setAnalyticsData(generateAnalyticsData())
      setLoading(false)
    }, 500)
  }, [selectedSchool, selectedTerm, selectedSession])

  // Generate comprehensive analytics data
  const generateAnalyticsData = (): Analytics => {
    return {
      schoolPerformance: {
        averageGPA: 3.2,
        passRate: 87.5,
        topSubjects: [
          { subjectName: "Mathematics", average: 85.2 },
          { subjectName: "English", average: 82.1 },
          { subjectName: "Physics", average: 78.9 },
          { subjectName: "Chemistry", average: 76.4 },
          { subjectName: "Biology", average: 75.8 }
        ],
        bottomSubjects: [
          { subjectName: "Further Math", average: 65.2 },
          { subjectName: "Economics", average: 67.8 },
          { subjectName: "Geography", average: 69.1 }
        ],
        trendData: [
          { month: "Jan", performance: 74.2 },
          { month: "Feb", performance: 75.8 },
          { month: "Mar", performance: 77.1 },
          { month: "Apr", performance: 76.9 },
          { month: "May", performance: 78.3 },
          { month: "Jun", performance: 79.1 }
        ]
      },
      classComparison: [
        { classId: "1", className: "JSS 1A", average: 82.5, studentCount: 35, passRate: 91.4 },
        { classId: "2", className: "JSS 1B", average: 78.2, studentCount: 33, passRate: 87.9 },
        { classId: "3", className: "JSS 2A", average: 84.1, studentCount: 36, passRate: 94.4 },
        { classId: "4", className: "JSS 2B", average: 76.8, studentCount: 32, passRate: 84.4 },
        { classId: "5", className: "JSS 3A", average: 85.9, studentCount: 34, passRate: 97.1 },
        { classId: "6", className: "SS 1A", average: 79.3, studentCount: 30, passRate: 86.7 }
      ],
      subjectAnalysis: [
        {
          subjectId: "math",
          subjectName: "Mathematics",
          difficulty: "Medium",
          averageCA: 23.4,
          averageExam: 58.7,
          passRate: 89.2,
          teacherEffectiveness: 85.5
        },
        {
          subjectId: "eng",
          subjectName: "English Language",
          difficulty: "Easy",
          averageCA: 25.8,
          averageExam: 61.3,
          passRate: 93.1,
          teacherEffectiveness: 88.2
        },
        {
          subjectId: "phy",
          subjectName: "Physics",
          difficulty: "Hard",
          averageCA: 21.2,
          averageExam: 54.8,
          passRate: 76.4,
          teacherEffectiveness: 79.8
        }
      ],
      studentInsights: {
        topPerformers: [
          { studentId: "1", name: "Alice Johnson", gpa: 3.9 },
          { studentId: "2", name: "Bob Smith", gpa: 3.8 },
          { studentId: "3", name: "Carol Williams", gpa: 3.7 },
          { studentId: "4", name: "David Brown", gpa: 3.6 },
          { studentId: "5", name: "Eva Davis", gpa: 3.5 }
        ],
        strugglingStudents: [
          { studentId: "6", name: "Frank Miller", gpa: 1.8, issues: ["Mathematics", "Physics"] },
          { studentId: "7", name: "Grace Wilson", gpa: 2.1, issues: ["Chemistry", "Further Math"] },
          { studentId: "8", name: "Henry Moore", gpa: 2.0, issues: ["Physics", "Mathematics"] }
        ],
        improvementCandidates: [
          { studentId: "9", name: "Ivy Taylor", potential: 85 },
          { studentId: "10", name: "Jack Anderson", potential: 82 },
          { studentId: "11", name: "Kelly Thomas", potential: 78 }
        ]
      }
    }
  }

  const schools = db.listSchools()
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!dashboardData || !analyticsData) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive performance analytics and custom report generation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
          <CardDescription>Configure your analytics view and report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label>School</Label>
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schools</SelectItem>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Term</Label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Term</SelectItem>
                  <SelectItem value="term1">Term 1</SelectItem>
                  <SelectItem value="term2">Term 2</SelectItem>
                  <SelectItem value="term3">Term 3</SelectItem>
                  <SelectItem value="all">All Terms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Session</Label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                  <SelectItem value="2023/2024">2023/2024</SelectItem>
                  <SelectItem value="2022/2023">2022/2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="trends">Trends</SelectItem>
                  <SelectItem value="comparison">Comparison</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Custom Range
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange}
                    onSelect={setDateRange}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.schoolPerformance.averageGPA}/4.0</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.5% from last term
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.schoolPerformance.passRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +1.8% improvement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Subject</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.schoolPerformance.topSubjects[0].average}%</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.schoolPerformance.topSubjects[0].subjectName}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students at Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.studentInsights.strugglingStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              Need intervention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="insights">Student Insights</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Subject Performance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.schoolPerformance.topSubjects.concat(analyticsData.schoolPerformance.bottomSubjects)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subjectName" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="average" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Class Performance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.classComparison}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="average"
                      label={({ className, average }) => `${className}: ${average}%`}
                    >
                      {analyticsData.classComparison.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Subject Analysis Deep Dive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Avg CA</TableHead>
                    <TableHead>Avg Exam</TableHead>
                    <TableHead>Pass Rate</TableHead>
                    <TableHead>Teacher Effectiveness</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.subjectAnalysis.map((subject) => (
                    <TableRow key={subject.subjectId}>
                      <TableCell className="font-medium">{subject.subjectName}</TableCell>
                      <TableCell>
                        <Badge variant={
                          subject.difficulty === "Easy" ? "default" :
                          subject.difficulty === "Medium" ? "secondary" :
                          "destructive"
                        }>
                          {subject.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>{subject.averageCA}/30</TableCell>
                      <TableCell>{subject.averageExam}/70</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">{subject.passRate}%</div>
                          <div className={`h-2 w-16 rounded-full ${
                            subject.passRate >= 80 ? 'bg-green-500' :
                            subject.passRate >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} style={{ width: `${subject.passRate}%` }} />
                        </div>
                      </TableCell>
                      <TableCell>{subject.teacherEffectiveness}%</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5" />
                  Performance Trends Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.schoolPerformance.trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[70, 85]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="performance" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Growth Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <StudentTrendChart data={dashboardData.charts.studentTrend} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Submission & Activity Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={dashboardData.charts.monthlySubmissions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="submissions" fill="#8884d8" name="Total Submissions" />
                  <Line type="monotone" dataKey="onTime" stroke="#82ca9d" name="On Time" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Class Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.classComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="className" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#8884d8" name="Average Score" />
                  <Bar dataKey="passRate" fill="#82ca9d" name="Pass Rate" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Multi-Subject Class Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ClassRadarChart data={dashboardData.charts.classComparison} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Class Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Average</TableHead>
                      <TableHead>Pass Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.classComparison.map((cls) => (
                      <TableRow key={cls.classId}>
                        <TableCell className="font-medium">{cls.className}</TableCell>
                        <TableCell>{cls.studentCount}</TableCell>
                        <TableCell>{cls.average}%</TableCell>
                        <TableCell>
                          <Badge variant={cls.passRate >= 90 ? "default" : cls.passRate >= 75 ? "secondary" : "destructive"}>
                            {cls.passRate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>School Comparison</CardTitle>
                <CardDescription>Performance across all schools in network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schools.slice(0, 5).map((school, index) => (
                    <div key={school.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{school.name}</p>
                          <p className="text-sm text-muted-foreground">{school.stats.students} students</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{school.stats.averagePerformance}%</p>
                        <p className="text-xs text-muted-foreground">Average</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Performing Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.studentInsights.topPerformers.map((student, index) => (
                    <div key={student.studentId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">Student ID: {student.studentId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{student.gpa}</p>
                        <p className="text-xs text-muted-foreground">GPA</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Students Needing Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.studentInsights.strugglingStudents.map((student) => (
                    <div key={student.studentId} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">GPA: {student.gpa}</p>
                        </div>
                        <Badge variant="destructive">At Risk</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Problem Areas:</p>
                        <div className="flex gap-1">
                          {student.issues.map((issue) => (
                            <Badge key={issue} variant="outline" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Improvement Candidates
              </CardTitle>
              <CardDescription>Students with high potential for improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {analyticsData.studentInsights.improvementCandidates.map((student) => (
                  <Card key={student.studentId}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="font-medium">{student.name}</p>
                        <div className="mt-2">
                          <div className="text-2xl font-bold text-blue-600">{student.potential}%</div>
                          <p className="text-xs text-muted-foreground">Improvement Potential</p>
                        </div>
                        <Button size="sm" className="mt-3" variant="outline">
                          View Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Custom Report Builder
              </CardTitle>
              <CardDescription>
                Create custom reports with drag-and-drop functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student Report</SelectItem>
                      <SelectItem value="class">Class Report</SelectItem>
                      <SelectItem value="subject">Subject Report</SelectItem>
                      <SelectItem value="school">School Report</SelectItem>
                      <SelectItem value="teacher">Teacher Report</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Delivery</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Delivery method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="download">Download</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="schedule">Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Drag & Drop Report Builder</h3>
                <p className="text-muted-foreground mb-4">
                  Drag components here to build your custom report
                </p>
                <Button variant="outline">
                  Start Building
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <School className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-medium">School Summary</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">Student List</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm font-medium">Performance Chart</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm font-medium">Subject Analysis</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button variant="outline">
                  Save Template
                </Button>
                <Button variant="outline">
                  Schedule Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
