"use client"

import { useState, useMemo } from "react"
import { db } from "@/lib/mock-db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts"
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Eye,
  RefreshCw
} from "lucide-react"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export default function Page() {
  const [selectedTerm, setSelectedTerm] = useState("Term 1")
  const [selectedSession, setSelectedSession] = useState("2024/2025")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const results = db.listResults()
  const students = db.listStudents()
  const teachers = db.listTeachers()
  const subjects = db.listSubjects()
  const classes = db.listClasses()

  // Filter results based on selections
  const filteredResults = useMemo(() => {
    return results.filter(result => {
      const termMatch = selectedTerm === "all" || result.term === selectedTerm
      const sessionMatch = selectedSession === "all" || result.session === selectedSession
      const subjectMatch = selectedSubject === "all" || result.subjectId === selectedSubject
      
      if (searchQuery) {
        const student = students.find(s => s.id === result.studentId)
        const subject = subjects.find(s => s.id === result.subjectId)
        const searchLower = searchQuery.toLowerCase()
        const studentMatch = student?.name.toLowerCase().includes(searchLower) || 
                           student?.studentId.toLowerCase().includes(searchLower)
        const subjectMatch = subject?.name.toLowerCase().includes(searchLower)
        return termMatch && sessionMatch && subjectMatch && (studentMatch || subjectMatch)
      }
      
      return termMatch && sessionMatch && subjectMatch
    })
  }, [results, selectedTerm, selectedSession, selectedSubject, searchQuery, students, subjects])

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo(() => {
    if (filteredResults.length === 0) {
      return {
        totalResults: 0,
        averageScore: 0,
        passRate: 0,
        gradeDistribution: [],
        subjectPerformance: [],
        trendData: [],
        pendingSubmissions: 0,
        completionRate: 0
      }
    }

    const totalResults = filteredResults.length
    const averageScore = filteredResults.reduce((sum, r) => sum + r.total, 0) / totalResults
    const passCount = filteredResults.filter(r => r.total >= 50).length
    const passRate = (passCount / totalResults) * 100

    // Grade distribution
    const gradeRanges = [
      { name: 'A (80-100)', min: 80, max: 100, color: '#22c55e' },
      { name: 'B (70-79)', min: 70, max: 79, color: '#3b82f6' },
      { name: 'C (60-69)', min: 60, max: 69, color: '#f59e0b' },
      { name: 'D (50-59)', min: 50, max: 59, color: '#f97316' },
      { name: 'F (0-49)', min: 0, max: 49, color: '#ef4444' }
    ]

    const gradeDistribution = gradeRanges.map(grade => ({
      ...grade,
      count: filteredResults.filter(r => r.total >= grade.min && r.total <= grade.max).length,
      percentage: (filteredResults.filter(r => r.total >= grade.min && r.total <= grade.max).length / totalResults) * 100
    }))

    // Subject performance
    const subjectPerformance = subjects.map(subject => {
      const subjectResults = filteredResults.filter(r => r.subjectId === subject.id)
      const avgScore = subjectResults.length > 0 
        ? subjectResults.reduce((sum, r) => sum + r.total, 0) / subjectResults.length 
        : 0
      const passRate = subjectResults.length > 0
        ? (subjectResults.filter(r => r.total >= 50).length / subjectResults.length) * 100
        : 0
      
      return {
        name: subject.name,
        code: subject.code,
        avgScore: Math.round(avgScore),
        passRate: Math.round(passRate),
        totalStudents: subjectResults.length
      }
    }).filter(s => s.totalStudents > 0)

    // Mock trend data (would be calculated from historical data)
    const trendData = [
      { period: 'Term 1', avgScore: 72, passRate: 78 },
      { period: 'Term 2', avgScore: 75, passRate: 82 },
      { period: 'Term 3', avgScore: Math.round(averageScore), passRate: Math.round(passRate) }
    ]

    // Calculate pending submissions
    const totalExpectedResults = students.length * subjects.length
    const completionRate = (totalResults / totalExpectedResults) * 100
    const pendingSubmissions = totalExpectedResults - totalResults

    return {
      totalResults,
      averageScore: Math.round(averageScore),
      passRate: Math.round(passRate),
      gradeDistribution,
      subjectPerformance,
      trendData,
      pendingSubmissions,
      completionRate: Math.round(completionRate)
    }
  }, [filteredResults, students, subjects])

  // Get teacher submission status
  const getTeacherSubmissionStatus = () => {
    return teachers.map(teacher => {
      const teacherSubjects = subjects.filter(s => s.teacherIds.includes(teacher.id))
      const teacherClasses = classes.filter(c => c.teacherId === teacher.id)
      
      const expectedSubmissions = teacherSubjects.length * teacherClasses.reduce((sum, c) => sum + c.studentCount, 0)
      const actualSubmissions = results.filter(r => {
        const subject = subjects.find(s => s.id === r.subjectId)
        const studentClass = classes.find(c => c.id === r.classId)
        return subject && teacherSubjects.includes(subject) && studentClass && teacherClasses.includes(studentClass)
      }).length
      
      const submissionRate = expectedSubmissions > 0 ? (actualSubmissions / expectedSubmissions) * 100 : 0
      const status = submissionRate >= 90 ? "Complete" : submissionRate >= 70 ? "Partial" : "Pending"
      
      return {
        id: teacher.id,
        name: teacher.name,
        expectedSubmissions,
        actualSubmissions,
        submissionRate: Math.round(submissionRate),
        status,
        lastSubmission: teacher.lastLogin || "Never"
      }
    })
  }

  const teacherStatus = getTeacherSubmissionStatus()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Results Overview</h1>
          <p className="text-muted-foreground">Comprehensive performance dashboard and result monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terms</SelectItem>
                <SelectItem value="Term 1">Term 1</SelectItem>
                <SelectItem value="Term 2">Term 2</SelectItem>
                <SelectItem value="Term 3">Term 3</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                <SelectItem value="2024/2025">2024/2025</SelectItem>
                <SelectItem value="2023/2024">2023/2024</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              placeholder="Search students or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Performance Dashboard</TabsTrigger>
          <TabsTrigger value="submissions">Result Entry Monitoring</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="details">Detailed Results</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Total Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardMetrics.totalResults.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardMetrics.completionRate}% completion rate
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Average Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardMetrics.averageScore}%</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">+3% from last term</span>
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
                <div className="text-2xl font-bold">{dashboardMetrics.passRate}%</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">+5% from last term</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Pending Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardMetrics.pendingSubmissions}</div>
                <p className="text-xs text-muted-foreground">
                  Require immediate attention
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
                      data={dashboardMetrics.gradeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {dashboardMetrics.gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} students (${props.payload.percentage.toFixed(1)}%)`,
                        props.payload.name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-4">
                  {dashboardMetrics.gradeDistribution.map((grade, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: grade.color }}
                      />
                      <span>{grade.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subject Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Subject Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardMetrics.subjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="code" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value}%`,
                        name === 'avgScore' ? 'Average Score' : 'Pass Rate'
                      ]}
                    />
                    <Bar dataKey="avgScore" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="passRate" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Subject Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left">Subject</th>
                      <th className="p-3 text-left">Students</th>
                      <th className="p-3 text-left">Avg Score</th>
                      <th className="p-3 text-left">Pass Rate</th>
                      <th className="p-3 text-left">Performance</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardMetrics.subjectPerformance.map((subject) => (
                      <tr key={subject.code} className="border-b last:border-0">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{subject.name}</div>
                            <div className="text-xs text-muted-foreground">{subject.code}</div>
                          </div>
                        </td>
                        <td className="p-3">{subject.totalStudents}</td>
                        <td className="p-3">{subject.avgScore}%</td>
                        <td className="p-3">{subject.passRate}%</td>
                        <td className="p-3">
                          <Progress value={subject.avgScore} className="h-2 w-20" />
                        </td>
                        <td className="p-3">
                          <Badge variant={
                            subject.avgScore >= 75 ? "default" : 
                            subject.avgScore >= 60 ? "secondary" : "destructive"
                          }>
                            {subject.avgScore >= 75 ? "Excellent" : 
                             subject.avgScore >= 60 ? "Good" : "Needs Attention"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Submission Status</CardTitle>
              <p className="text-sm text-muted-foreground">Monitor result entry progress and pending submissions</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left">Teacher</th>
                      <th className="p-3 text-left">Expected</th>
                      <th className="p-3 text-left">Submitted</th>
                      <th className="p-3 text-left">Completion Rate</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Last Submission</th>
                      <th className="p-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherStatus.map((teacher) => (
                      <tr key={teacher.id} className="border-b last:border-0">
                        <td className="p-3 font-medium">{teacher.name}</td>
                        <td className="p-3">{teacher.expectedSubmissions}</td>
                        <td className="p-3">{teacher.actualSubmissions}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Progress value={teacher.submissionRate} className="h-2 w-20" />
                            <span>{teacher.submissionRate}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant={
                            teacher.status === "Complete" ? "default" :
                            teacher.status === "Partial" ? "secondary" : "destructive"
                          }>
                            {teacher.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-xs">{teacher.lastSubmission}</td>
                        <td className="p-3">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={dashboardMetrics.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="avgScore" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="passRate" stackId="2" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Results ({filteredResults.length} records)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-2 text-left">Student ID</th>
                      <th className="p-2 text-left">Student Name</th>
                      <th className="p-2 text-left">Class</th>
                      <th className="p-2 text-left">Subject</th>
                      <th className="p-2 text-left">CA</th>
                      <th className="p-2 text-left">Exam</th>
                      <th className="p-2 text-left">Total</th>
                      <th className="p-2 text-left">Grade</th>
                      <th className="p-2 text-left">Term</th>
                      <th className="p-2 text-left">Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.slice(0, 100).map((result) => {
                      const student = students.find(s => s.id === result.studentId)
                      const subject = subjects.find(s => s.id === result.subjectId)
                      const classItem = classes.find(c => c.id === result.classId)
                      
                      const getGrade = (score: number) => {
                        if (score >= 80) return 'A'
                        if (score >= 70) return 'B'
                        if (score >= 60) return 'C'
                        if (score >= 50) return 'D'
                        return 'F'
                      }
                      
                      return (
                        <tr key={result.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="p-2">{student?.studentId}</td>
                          <td className="p-2">{student?.name}</td>
                          <td className="p-2">{classItem?.name}</td>
                          <td className="p-2">{subject?.name}</td>
                          <td className="p-2">{result.ca}</td>
                          <td className="p-2">{result.exam}</td>
                          <td className="p-2 font-medium">{result.total}</td>
                          <td className="p-2">
                            <Badge variant={result.total >= 50 ? "default" : "destructive"}>
                              {getGrade(result.total)}
                            </Badge>
                          </td>
                          <td className="p-2">{result.term}</td>
                          <td className="p-2">{result.session}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {filteredResults.length > 100 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Showing first 100 of {filteredResults.length} results. Use filters to narrow down the view.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
