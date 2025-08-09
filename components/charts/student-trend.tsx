"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { db } from "@/lib/mock-db"
import { ResultEntry } from "@/lib/types"
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react"

interface StudentTrendChartProps {
  studentId?: string
  data?: Array<{
    month: string
    gpa: number
    attendance: number
  }>
}

export function StudentTrendChart({ studentId, data }: StudentTrendChartProps) {
  const [results, setResults] = useState<ResultEntry[]>([])
  const [chartType, setChartType] = useState<"trend" | "subjects" | "performance">("trend")

  useEffect(() => {
    if (studentId) {
      const studentResults = db.getStudentResults(studentId)
      setResults(studentResults || [])
    }
  }, [studentId])

  // If simple data is provided, render simple trend chart
  if (data) {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="month" 
            className="fill-muted-foreground text-xs"
          />
          <YAxis 
            className="fill-muted-foreground text-xs"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
            }}
          />
          <Line 
            type="monotone" 
            dataKey="gpa" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            name="GPA"
            dot={{ fill: 'hsl(var(--primary))' }}
          />
          <Line 
            type="monotone" 
            dataKey="attendance" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth={2}
            name="Attendance %"
            dot={{ fill: 'hsl(var(--chart-2))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No performance data available
          </div>
        </CardContent>
      </Card>
    )
  }

  // Prepare data for trend chart
  const trendData = results
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
    .map((result, index) => ({
      index: index + 1,
      date: new Date(result.submittedAt).toLocaleDateString(),
      total: result.total,
      ca: result.ca,
      exam: result.exam,
      grade: result.grade,
    }))

  // Prepare data for subjects chart
  const subjectData = results.reduce((acc, result) => {
    const subject = db.getSubject(result.subjectId)
    const subjectName = subject?.name || "Unknown"
    
    if (!acc[subjectName]) {
      acc[subjectName] = []
    }
    acc[subjectName].push(result.total)
    return acc
  }, {} as Record<string, number[]>)

  const subjectAverages = Object.entries(subjectData).map(([subject, scores]) => ({
    subject,
    average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    count: scores.length,
  }))

  // Prepare data for performance distribution
  const performanceData = [
    { name: "Excellent (80-100)", value: results.filter(r => r.total >= 80).length, color: "#10b981" },
    { name: "Good (70-79)", value: results.filter(r => r.total >= 70 && r.total < 80).length, color: "#3b82f6" },
    { name: "Average (60-69)", value: results.filter(r => r.total >= 60 && r.total < 70).length, color: "#f59e0b" },
    { name: "Below Average (50-59)", value: results.filter(r => r.total >= 50 && r.total < 60).length, color: "#ef4444" },
    { name: "Poor (<50)", value: results.filter(r => r.total < 50).length, color: "#dc2626" },
  ].filter(item => item.value > 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Performance Analysis</CardTitle>
          <div className="flex gap-1">
            <Button
              variant={chartType === "trend" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("trend")}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Trend
            </Button>
            <Button
              variant={chartType === "subjects" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("subjects")}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Subjects
            </Button>
            <Button
              variant={chartType === "performance" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("performance")}
            >
              <PieChartIcon className="h-4 w-4 mr-1" />
              Distribution
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4">
          {chartType === "trend" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="index" 
                  label={{ value: 'Assessment', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value}%`, 
                    name === "total" ? "Total Score" : name === "ca" ? "CA Score" : "Exam Score"
                  ]}
                  labelFormatter={(label) => `Assessment ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {chartType === "subjects" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAverages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, "Average Score"]}
                />
                <Bar 
                  dataKey="average" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}

          {chartType === "performance" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value, percent }) => 
                    `${value} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-lg">
              {results.length > 0 ? (results.reduce((sum, r) => sum + r.total, 0) / results.length).toFixed(1) : 0}%
            </div>
            <div className="text-muted-foreground">Average Score</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-lg text-green-600">
              {Math.max(...results.map(r => r.total), 0)}%
            </div>
            <div className="text-muted-foreground">Highest Score</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-lg text-red-600">
              {Math.min(...results.map(r => r.total), 100)}%
            </div>
            <div className="text-muted-foreground">Lowest Score</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-lg">
              {results.length}
            </div>
            <div className="text-muted-foreground">Assessments</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
