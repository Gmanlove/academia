"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
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
} from "recharts"
import { TrendingUp, TrendingDown, Minus, Users, BookOpen, Award, AlertTriangle, Download } from "lucide-react"

// Mock data for analytics
const mockClassData = [
  { id: 1, name: "Mathematics 101", students: 28, avgScore: 85.2, trend: "improving" },
  { id: 2, name: "Physics Advanced", students: 22, avgScore: 78.9, trend: "declining" },
  { id: 3, name: "Chemistry Basic", students: 31, avgScore: 82.1, trend: "stable" },
  { id: 4, name: "Biology Lab", students: 25, avgScore: 88.7, trend: "improving" },
]

const mockPerformanceData = [
  { month: "Jan", math: 82, physics: 75, chemistry: 79, biology: 85 },
  { month: "Feb", math: 84, physics: 77, chemistry: 81, biology: 87 },
  { month: "Mar", math: 86, physics: 79, chemistry: 83, biology: 89 },
  { month: "Apr", math: 85, physics: 78, chemistry: 82, biology: 88 },
  { month: "May", math: 87, physics: 80, chemistry: 84, biology: 90 },
]

const mockStudentDistribution = [
  { name: "Excellent (90-100)", value: 15, color: "#22c55e" },
  { name: "Good (80-89)", value: 35, color: "#3b82f6" },
  { name: "Average (70-79)", value: 30, color: "#f59e0b" },
  { name: "Below Average (<70)", value: 20, color: "#ef4444" },
]

const mockSubjectComparison = [
  { subject: "Mathematics", classAvg: 85.2, schoolAvg: 82.1, nationalAvg: 78.5 },
  { subject: "Physics", classAvg: 78.9, schoolAvg: 80.3, nationalAvg: 76.8 },
  { subject: "Chemistry", classAvg: 82.1, schoolAvg: 81.7, nationalAvg: 79.2 },
  { subject: "Biology", classAvg: 88.7, schoolAvg: 85.4, nationalAvg: 81.9 },
]

const mockAssignmentData = [
  { name: "Quiz 1", submitted: 28, total: 30, avgScore: 87 },
  { name: "Midterm", submitted: 29, total: 30, avgScore: 82 },
  { name: "Project A", submitted: 25, total: 30, avgScore: 91 },
  { name: "Quiz 2", submitted: 27, total: 30, avgScore: 85 },
]

export default function TeacherAnalytics() {
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedTerm, setSelectedTerm] = useState("current")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600 bg-green-50"
      case "declining":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your teaching performance and student progress
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {mockClassData.map((cls) => (
                <SelectItem key={cls.id} value={cls.id.toString()}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedTerm} onValueChange={setSelectedTerm}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Term</SelectItem>
              <SelectItem value="previous">Previous Term</SelectItem>
              <SelectItem value="year">Full Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">106</div>
            <p className="text-xs text-muted-foreground">+12% from last term</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83.7%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last term</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">2 advanced, 2 basic</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk Students</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Class Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Class Performance Overview</CardTitle>
                <CardDescription>Current performance metrics for all your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClassData.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{cls.name}</h4>
                          <Badge variant="outline" className={getTrendColor(cls.trend)}>
                            {getTrendIcon(cls.trend)}
                            <span className="ml-1 capitalize">{cls.trend}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {cls.students} students • Avg: {cls.avgScore}%
                        </p>
                      </div>
                      <div className="text-right">
                        <Progress value={cls.avgScore} className="w-20 mb-1" />
                        <span className="text-xs text-muted-foreground">{cls.avgScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Student Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Student Performance Distribution</CardTitle>
                <CardDescription>Distribution of students across performance levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockStudentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockStudentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Subject Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance Comparison</CardTitle>
              <CardDescription>Compare your class performance with school and national averages</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockSubjectComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="classAvg" fill="#3b82f6" name="Class Average" />
                  <Bar dataKey="schoolAvg" fill="#10b981" name="School Average" />
                  <Bar dataKey="nationalAvg" fill="#f59e0b" name="National Average" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Monthly performance trends across all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="math" stroke="#3b82f6" name="Mathematics" />
                  <Line type="monotone" dataKey="physics" stroke="#ef4444" name="Physics" />
                  <Line type="monotone" dataKey="chemistry" stroke="#10b981" name="Chemistry" />
                  <Line type="monotone" dataKey="biology" stroke="#f59e0b" name="Biology" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Analytics</CardTitle>
              <CardDescription>Detailed insights into individual student performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Student Analytics</h3>
                <p className="text-muted-foreground">Detailed student performance analytics will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Analytics</CardTitle>
              <CardDescription>Track assignment submission rates and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAssignmentData.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{assignment.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {assignment.submitted}/{assignment.total} submitted • Avg: {assignment.avgScore}%
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium mb-1">
                        {Math.round((assignment.submitted / assignment.total) * 100)}% submitted
                      </div>
                      <Progress value={(assignment.submitted / assignment.total) * 100} className="w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
