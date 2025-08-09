"use client"

import { useState, useEffect, useMemo } from "react"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
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
  DollarSign,
  Settings,
  Plus,
  Search
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
  AreaChart,
  Area,
  ComposedChart,
  Scatter,
  ScatterChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export default function AnalyticsPage() {
  const [selectedSchool, setSelectedSchool] = useState("all")
  const [selectedTerm, setSelectedTerm] = useState("current")
  const [selectedSession, setSelectedSession] = useState("2024/2025")
  const [reportType, setReportType] = useState("overview")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [showReportBuilder, setShowReportBuilder] = useState(false)

  // Mock data - in real app, this would come from API
  const analyticsData = useMemo(() => ({
    overview: {
      totalStudents: 1247,
      totalTeachers: 45,
      totalSubjects: 12,
      averagePerformance: 78.5,
      performanceTrend: 5.2,
      passRate: 85.7,
      passRateTrend: 3.1,
      attendanceRate: 92.3,
      submissionRate: 89.4
    },
    performanceTrends: [
      { month: 'Jan', performance: 72.5, passRate: 78.2, attendance: 89.1 },
      { month: 'Feb', performance: 74.1, passRate: 80.5, attendance: 90.3 },
      { month: 'Mar', performance: 75.8, passRate: 82.1, attendance: 91.7 },
      { month: 'Apr', performance: 77.2, passRate: 83.8, attendance: 92.1 },
      { month: 'May', performance: 78.5, passRate: 85.7, attendance: 92.3 },
      { month: 'Jun', performance: 79.1, passRate: 86.2, attendance: 93.1 }
    ],
    classComparison: [
      { className: 'JSS 1A', students: 35, avgScore: 82.5, passRate: 91.4, trend: 5.2 },
      { className: 'JSS 1B', students: 33, avgScore: 78.2, passRate: 87.9, trend: 2.1 },
      { className: 'JSS 2A', students: 36, avgScore: 84.1, passRate: 94.4, trend: 6.8 },
      { className: 'JSS 2B', students: 32, avgScore: 76.8, passRate: 84.4, trend: -1.2 },
      { className: 'JSS 3A', students: 34, avgScore: 85.9, passRate: 97.1, trend: 4.5 },
      { className: 'SSS 1A', students: 30, avgScore: 79.3, passRate: 86.7, trend: 3.2 }
    ],
    subjectAnalysis: [
      { subject: 'Mathematics', avgScore: 82.1, passRate: 89.2, difficulty: 'Medium', teachers: 3, trend: 4.5 },
      { subject: 'English', avgScore: 85.3, passRate: 93.1, difficulty: 'Easy', teachers: 2, trend: 2.8 },
      { subject: 'Physics', avgScore: 75.8, passRate: 78.5, difficulty: 'Hard', teachers: 2, trend: -1.5 },
      { subject: 'Chemistry', avgScore: 77.2, passRate: 82.1, difficulty: 'Medium', teachers: 2, trend: 3.2 },
      { subject: 'Biology', avgScore: 79.5, passRate: 85.7, difficulty: 'Medium', teachers: 2, trend: 1.8 },
      { subject: 'Geography', avgScore: 80.1, passRate: 87.3, difficulty: 'Easy', teachers: 1, trend: 2.1 }
    ],
    teacherEffectiveness: [
      { name: 'Dr. Smith', subjects: ['Mathematics', 'Physics'], avgScore: 84.2, studentFeedback: 4.8, submissionRate: 98.5 },
      { name: 'Mrs. Johnson', subjects: ['English'], avgScore: 87.1, studentFeedback: 4.9, submissionRate: 100.0 },
      { name: 'Mr. Brown', subjects: ['Chemistry', 'Biology'], avgScore: 78.5, studentFeedback: 4.5, submissionRate: 95.2 },
      { name: 'Ms. Davis', subjects: ['Geography'], avgScore: 82.3, studentFeedback: 4.7, submissionRate: 97.8 }
    ],
    gradeDistribution: [
      { grade: 'A (80-100)', count: 285, percentage: 35.2, color: '#22c55e' },
      { grade: 'B (70-79)', count: 198, percentage: 24.5, color: '#3b82f6' },
      { grade: 'C (60-69)', count: 156, percentage: 19.3, color: '#f59e0b' },
      { grade: 'D (50-59)', count: 102, percentage: 12.6, color: '#f97316' },
      { grade: 'F (0-49)', count: 68, percentage: 8.4, color: '#ef4444' }
    ],
    studentPerformanceDistribution: [
      { range: '90-100', count: 45, label: 'Excellent' },
      { range: '80-89', count: 128, label: 'Very Good' },
      { range: '70-79', count: 198, label: 'Good' },
      { range: '60-69', count: 156, label: 'Average' },
      { range: '50-59', count: 102, label: 'Below Average' },
      { range: '0-49', count: 68, label: 'Poor' }
    ]
  }), [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Interactive charts, performance analytics, and custom report generation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Dialog open={showReportBuilder} onOpenChange={setShowReportBuilder}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Report Builder
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Custom Report Builder</DialogTitle>
                <DialogDescription>Create custom reports with drag-and-drop interface</DialogDescription>
              </DialogHeader>
              <ReportBuilder onClose={() => setShowReportBuilder(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Analytics Filters
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
                  <SelectItem value="acme">Acme High School</SelectItem>
                  <SelectItem value="contoso">Contoso Junior School</SelectItem>
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
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Select Range
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="effectiveness">Teacher Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.totalStudents.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">+12% from last term</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Avg Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.averagePerformance}%</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">+{analyticsData.overview.performanceTrend}% improvement</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Pass Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.passRate}%</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">+{analyticsData.overview.passRateTrend}% increase</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Attendance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.attendanceRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Submission: {analyticsData.overview.submissionRate}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Grade Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.gradeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {analyticsData.gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [
                      `${value} students (${props.payload.percentage}%)`,
                      props.payload.grade
                    ]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-4">
                  {analyticsData.gradeDistribution.map((grade, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: grade.color }} />
                      <span>{grade.grade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Performance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.studentPerformanceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* Subject Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance Analysis</CardTitle>
              <CardDescription>Detailed breakdown of subject-wise performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={analyticsData.subjectAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="passRate" stroke="#22c55e" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subject Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Pass Rate</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Teachers</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.subjectAnalysis.map((subject) => (
                    <TableRow key={subject.subject}>
                      <TableCell className="font-medium">{subject.subject}</TableCell>
                      <TableCell>{subject.avgScore}%</TableCell>
                      <TableCell>{subject.passRate}%</TableCell>
                      <TableCell>
                        <Badge variant={
                          subject.difficulty === 'Easy' ? 'default' :
                          subject.difficulty === 'Hard' ? 'destructive' : 'secondary'
                        }>
                          {subject.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>{subject.teachers}</TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${subject.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {subject.trend >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {Math.abs(subject.trend)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subject.avgScore >= 75 ? 'default' : subject.avgScore >= 60 ? 'secondary' : 'destructive'}>
                          {subject.avgScore >= 75 ? 'Excellent' : subject.avgScore >= 60 ? 'Good' : 'Needs Attention'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4" />
                Performance Trends Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analyticsData.performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="performance" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="passRate" stackId="2" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="attendance" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Comparison Analysis</CardTitle>
              <CardDescription>Compare performance across different classes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.classComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="className" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="passRate" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Class Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Class Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Pass Rate</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.classComparison.map((classData) => (
                    <TableRow key={classData.className}>
                      <TableCell className="font-medium">{classData.className}</TableCell>
                      <TableCell>{classData.students}</TableCell>
                      <TableCell>{classData.avgScore}%</TableCell>
                      <TableCell>{classData.passRate}%</TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${classData.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {classData.trend >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {Math.abs(classData.trend)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Progress value={classData.avgScore} className="w-16 h-2" />
                      </TableCell>
                      <TableCell>
                        <Badge variant={classData.avgScore >= 80 ? 'default' : classData.avgScore >= 70 ? 'secondary' : 'destructive'}>
                          {classData.avgScore >= 80 ? 'Excellent' : classData.avgScore >= 70 ? 'Good' : 'Needs Attention'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teacher Effectiveness Tab */}
        <TabsContent value="effectiveness" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Effectiveness Metrics</CardTitle>
              <CardDescription>Analyze teacher performance and student outcomes</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Avg Student Score</TableHead>
                    <TableHead>Student Feedback</TableHead>
                    <TableHead>Submission Rate</TableHead>
                    <TableHead>Effectiveness Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.teacherEffectiveness.map((teacher) => (
                    <TableRow key={teacher.name}>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.map((subject) => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{teacher.avgScore}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{teacher.studentFeedback}/5.0</span>
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < Math.floor(teacher.studentFeedback) ? 'bg-yellow-400' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{teacher.submissionRate}%</TableCell>
                      <TableCell>
                        <Badge variant={
                          teacher.avgScore >= 85 ? 'default' :
                          teacher.avgScore >= 75 ? 'secondary' : 'destructive'
                        }>
                          {teacher.avgScore >= 85 ? 'Excellent' :
                           teacher.avgScore >= 75 ? 'Good' : 'Needs Improvement'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReportBuilder({ onClose }: { onClose: () => void }) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [reportName, setReportName] = useState("")
  const [reportFormat, setReportFormat] = useState("pdf")
  const [scheduleFrequency, setScheduleFrequency] = useState("none")

  const availableMetrics = [
    { id: 'performance', label: 'Performance Metrics', description: 'Average scores, pass rates, grade distribution' },
    { id: 'attendance', label: 'Attendance Data', description: 'Student attendance rates and patterns' },
    { id: 'subjects', label: 'Subject Analysis', description: 'Subject-wise performance breakdown' },
    { id: 'classes', label: 'Class Comparison', description: 'Inter-class performance comparison' },
    { id: 'teachers', label: 'Teacher Effectiveness', description: 'Teacher performance metrics' },
    { id: 'trends', label: 'Trend Analysis', description: 'Performance trends over time' },
    { id: 'demographics', label: 'Student Demographics', description: 'Student population analysis' },
    { id: 'financials', label: 'Financial Metrics', description: 'Revenue, billing, and payment data' }
  ]

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="reportName">Report Name</Label>
            <Input 
              id="reportName"
              placeholder="e.g., Monthly Performance Report"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>
          <div>
            <Label>Export Format</Label>
            <Select value={reportFormat} onValueChange={setReportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                <SelectItem value="csv">CSV File</SelectItem>
                <SelectItem value="pptx">PowerPoint Presentation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Schedule Delivery</Label>
            <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">One-time Report</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Data Sources</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {availableMetrics.map((metric) => (
              <div key={metric.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={metric.id}
                  checked={selectedMetrics.includes(metric.id)}
                  onCheckedChange={() => handleMetricToggle(metric.id)}
                />
                <div className="space-y-1">
                  <label htmlFor={metric.id} className="text-sm font-medium cursor-pointer">
                    {metric.label}
                  </label>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      {selectedMetrics.length > 0 && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <h4 className="font-medium mb-2">Report Preview</h4>
          <div className="text-sm space-y-1">
            <p><strong>Report:</strong> {reportName || "Untitled Report"}</p>
            <p><strong>Format:</strong> {reportFormat.toUpperCase()}</p>
            <p><strong>Metrics:</strong> {selectedMetrics.length} selected</p>
            <p><strong>Schedule:</strong> {scheduleFrequency === 'none' ? 'One-time' : scheduleFrequency}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" disabled={selectedMetrics.length === 0}>
            <Eye className="h-4 w-4 mr-2" />
            Preview Report
          </Button>
          <Button disabled={selectedMetrics.length === 0 || !reportName}>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  )
}
