"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ClassRadarChart } from "@/components/charts/class-radar"
import { StudentTrendChart } from "@/components/charts/student-trend"
import { 
  History,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  BarChart3,
  Calendar,
  Star,
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trophy,
  Medal,
  Brain,
  Lightbulb,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"
import { db } from "@/lib/mock-db"
import { Student, ResultEntry, Subject } from "@/lib/types"

interface AcademicRecord {
  year: string
  term: string
  results: ResultEntry[]
  gpa: number
  position: number
  totalStudents: number
  achievements: Achievement[]
}

interface Achievement {
  id: string
  title: string
  description: string
  type: "academic" | "behavior" | "sports" | "leadership"
  date: string
  icon: string
  color: string
}

interface SubjectProgression {
  subjectId: string
  subjectName: string
  timeline: {
    year: string
    term: string
    score: number
    grade: string
    position: number
  }[]
  trend: "improving" | "declining" | "stable"
  currentLevel: "excellent" | "good" | "average" | "needs_improvement"
  recommendations: string[]
}

interface PerformancePattern {
  pattern: string
  description: string
  subjects: string[]
  confidence: number
  recommendation: string
}

interface Goal {
  id: string
  title: string
  description: string
  targetScore: number
  currentScore: number
  deadline: string
  status: "on_track" | "at_risk" | "completed" | "overdue"
  milestones: {
    title: string
    completed: boolean
    date: string
  }[]
}

export default function StudentAcademicHistoryPage() {
  const [student, setStudent] = useState<Student | null>(null)
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectProgressions, setSubjectProgressions] = useState<SubjectProgression[]>([])
  const [performancePatterns, setPerformancePatterns] = useState<PerformancePattern[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [goalDialogOpen, setGoalDialogOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetScore: 90,
    deadline: ""
  })

  useEffect(() => {
    // Simulate API calls to fetch comprehensive academic data
    setTimeout(() => {
      const students = db.listStudents()
      const studentData = students[0]
      const subjectsData = db.listSubjects() || []
      const allResults = db.listResults({ studentId: studentData.id }) || []
      
      const records = generateAcademicRecords(allResults, subjectsData)
      const progressions = generateSubjectProgressions(allResults, subjectsData)
      const patterns = generatePerformancePatterns(allResults, subjectsData)
      const studentGoals = generateGoals()

      setStudent(studentData)
      setSubjects(subjectsData)
      setAcademicRecords(records)
      setSubjectProgressions(progressions)
      setPerformancePatterns(patterns)
      setGoals(studentGoals)
      setLoading(false)
    }, 1500)
  }, [])

  const generateAcademicRecords = (results: ResultEntry[], subjects: Subject[]): AcademicRecord[] => {
    // Group results by year and term
    const groupedResults = results.reduce((acc, result) => {
      const key = `${result.session}-${result.term}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(result)
      return acc
    }, {} as Record<string, ResultEntry[]>)

    return Object.entries(groupedResults).map(([key, termResults], index) => {
      const [year, term] = key.split('-')
      const gpa = termResults.reduce((sum, r) => sum + r.total, 0) / termResults.length
      
      return {
        year,
        term,
        results: termResults,
        gpa: Math.round(gpa * 100) / 100,
        position: Math.floor(Math.random() * 5) + 1, // Mock position
        totalStudents: 30,
        achievements: generateAchievementsForTerm(year, term, gpa)
      }
    }).sort((a, b) => b.year.localeCompare(a.year))
  }

  const generateAchievementsForTerm = (year: string, term: string, gpa: number): Achievement[] => {
    const achievements: Achievement[] = []
    
    if (gpa >= 85) {
      achievements.push({
        id: `academic-${year}-${term}`,
        title: "Academic Excellence",
        description: `Achieved excellent performance in ${term}`,
        type: "academic",
        date: `${year}-${term === "Term 1" ? "04" : term === "Term 2" ? "08" : "12"}-15`,
        icon: "trophy",
        color: "gold"
      })
    }
    
    if (Math.random() > 0.7) {
      achievements.push({
        id: `behavior-${year}-${term}`,
        title: "Outstanding Behavior",
        description: "Demonstrated exemplary conduct",
        type: "behavior",
        date: `${year}-${term === "Term 1" ? "04" : term === "Term 2" ? "08" : "12"}-20`,
        icon: "star",
        color: "blue"
      })
    }

    return achievements
  }

  const generateSubjectProgressions = (results: ResultEntry[], subjects: Subject[]): SubjectProgression[] => {
    return subjects.map(subject => {
      const subjectResults = results.filter(r => r.subjectId === subject.id)
        .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())

      const timeline = subjectResults.map(result => ({
        year: result.session,
        term: result.term,
        score: result.total,
        grade: result.grade || "N/A",
        position: result.position || 0
      }))

      // Calculate trend
      const recentScores = timeline.slice(-3).map(t => t.score)
      let trend: "improving" | "declining" | "stable" = "stable"
      
      if (recentScores.length >= 2) {
        const firstScore = recentScores[0]
        const lastScore = recentScores[recentScores.length - 1]
        if (lastScore > firstScore + 5) trend = "improving"
        else if (lastScore < firstScore - 5) trend = "declining"
      }

      // Determine current level
      const avgScore = timeline.length > 0 
        ? timeline.reduce((sum, t) => sum + t.score, 0) / timeline.length 
        : 0
      
      let currentLevel: "excellent" | "good" | "average" | "needs_improvement"
      if (avgScore >= 90) currentLevel = "excellent"
      else if (avgScore >= 80) currentLevel = "good"
      else if (avgScore >= 70) currentLevel = "average"
      else currentLevel = "needs_improvement"

      // Generate recommendations
      const recommendations = generateRecommendations(subject.name, trend, currentLevel, avgScore)

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        timeline,
        trend,
        currentLevel,
        recommendations
      }
    })
  }

  const generateRecommendations = (
    subjectName: string, 
    trend: string, 
    level: string, 
    score: number
  ): string[] => {
    const recommendations: string[] = []

    if (level === "needs_improvement") {
      recommendations.push(`Focus on fundamental concepts in ${subjectName}`)
      recommendations.push("Seek additional help from teachers or tutors")
      recommendations.push("Practice regularly with past questions")
    } else if (level === "average") {
      recommendations.push(`Work on advanced topics in ${subjectName}`)
      recommendations.push("Join study groups for peer learning")
    } else if (level === "good") {
      recommendations.push(`Maintain consistency in ${subjectName}`)
      recommendations.push("Explore challenging problems to reach excellence")
    } else {
      recommendations.push(`Continue excellent work in ${subjectName}`)
      recommendations.push("Consider mentoring other students")
    }

    if (trend === "declining") {
      recommendations.push("Address recent performance decline immediately")
      recommendations.push("Review recent topics that may need reinforcement")
    } else if (trend === "improving") {
      recommendations.push("Keep up the excellent improvement trend")
    }

    return recommendations
  }

  const generatePerformancePatterns = (results: ResultEntry[], subjects: Subject[]): PerformancePattern[] => {
    const patterns: PerformancePattern[] = []

    // Analyze consistency pattern
    const consistentSubjects = subjects.filter(subject => {
      const subjectResults = results.filter(r => r.subjectId === subject.id)
      const scores = subjectResults.map(r => r.total)
      const variance = scores.length > 1 ? 
        scores.reduce((sum, score) => sum + Math.pow(score - scores.reduce((a, b) => a + b, 0) / scores.length, 2), 0) / scores.length 
        : 0
      return variance < 25 // Low variance indicates consistency
    })

    if (consistentSubjects.length > 0) {
      patterns.push({
        pattern: "Consistent Performance",
        description: "You maintain stable performance across multiple terms",
        subjects: consistentSubjects.map(s => s.name),
        confidence: 85,
        recommendation: "Your consistency is excellent. Focus on gradual improvement in weaker areas."
      })
    }

    // Analyze strong performance pattern
    const strongSubjects = subjects.filter(subject => {
      const subjectResults = results.filter(r => r.subjectId === subject.id)
      const avgScore = subjectResults.reduce((sum, r) => sum + r.total, 0) / subjectResults.length
      return avgScore >= 85
    })

    if (strongSubjects.length > 0) {
      patterns.push({
        pattern: "Subject Strengths",
        description: "You excel in analytical and problem-solving subjects",
        subjects: strongSubjects.map(s => s.name),
        confidence: 92,
        recommendation: "Leverage your analytical strengths to improve in other subjects."
      })
    }

    // Analyze improvement pattern
    const improvingSubjects = subjects.filter(subject => {
      const subjectResults = results.filter(r => r.subjectId === subject.id)
        .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
      
      if (subjectResults.length < 3) return false
      
      const recent = subjectResults.slice(-2)
      const earlier = subjectResults.slice(-4, -2)
      
      const recentAvg = recent.reduce((sum, r) => sum + r.total, 0) / recent.length
      const earlierAvg = earlier.reduce((sum, r) => sum + r.total, 0) / earlier.length
      
      return recentAvg > earlierAvg + 5
    })

    if (improvingSubjects.length > 0) {
      patterns.push({
        pattern: "Improvement Trend",
        description: "You show consistent improvement in several subjects",
        subjects: improvingSubjects.map(s => s.name),
        confidence: 78,
        recommendation: "Continue your current study methods as they're showing positive results."
      })
    }

    return patterns
  }

  const generateGoals = (): Goal[] => {
    return [
      {
        id: "1",
        title: "Achieve 90% in Mathematics",
        description: "Improve mathematics performance to achieve excellence grade",
        targetScore: 90,
        currentScore: 85,
        deadline: "2025-12-15",
        status: "on_track",
        milestones: [
          { title: "Complete algebra review", completed: true, date: "2025-08-01" },
          { title: "Score 85%+ in practice tests", completed: true, date: "2025-08-15" },
          { title: "Master calculus basics", completed: false, date: "2025-09-01" },
          { title: "Achieve target in final exam", completed: false, date: "2025-12-15" }
        ]
      },
      {
        id: "2",
        title: "Improve English Literature Grade",
        description: "Move from B+ to A grade in English Literature",
        targetScore: 88,
        currentScore: 82,
        deadline: "2025-11-30",
        status: "at_risk",
        milestones: [
          { title: "Read assigned novels", completed: true, date: "2025-07-15" },
          { title: "Improve essay writing skills", completed: false, date: "2025-09-01" },
          { title: "Complete poetry analysis", completed: false, date: "2025-10-15" },
          { title: "Score A in final assessment", completed: false, date: "2025-11-30" }
        ]
      }
    ]
  }

  const handleCreateGoal = () => {
    if (newGoal.title && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        targetScore: newGoal.targetScore,
        currentScore: 0,
        deadline: newGoal.deadline,
        status: "on_track",
        milestones: []
      }
      
      setGoals(prev => [...prev, goal])
      setNewGoal({ title: "", description: "", targetScore: 90, deadline: "" })
      setGoalDialogOpen(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return <TrendingUp className="h-4 w-4 text-green-600" />
      case "declining": return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
      case "average":
        return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
      case "needs_improvement":
        return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on_track": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "at_risk": return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "completed": return <Trophy className="h-4 w-4 text-blue-600" />
      case "overdue": return <Clock className="h-4 w-4 text-red-600" />
      default: return <Target className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your academic history...</p>
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

  const allTimeGPA = academicRecords.length > 0 
    ? academicRecords.reduce((sum, record) => sum + record.gpa, 0) / academicRecords.length 
    : 0

  const totalAchievements = academicRecords.reduce((sum, record) => sum + record.achievements.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">📈 Academic History</h1>
          <p className="text-muted-foreground">
            Comprehensive view of your academic journey and progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export History
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All-Time GPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{allTimeGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across {academicRecords.length} terms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalAchievements}</div>
            <p className="text-xs text-muted-foreground">
              Academic & behavioral awards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects Studied</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Different subject areas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Years of Study</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Set(academicRecords.map(r => r.year)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Academic years completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="records">Academic Records</TabsTrigger>
          <TabsTrigger value="progression">Subject Progression</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Insights</TabsTrigger>
          <TabsTrigger value="goals">Goals & Planning</TabsTrigger>
        </TabsList>

        {/* Academic Records Tab */}
        <TabsContent value="records" className="space-y-4">
          {/* Year-over-Year Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Year-over-Year Performance
              </CardTitle>
              <CardDescription>Compare your academic performance across different years</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from(new Set(academicRecords.map(r => r.year))).map(year => {
                  const yearRecords = academicRecords.filter(r => r.year === year)
                  const yearGPA = yearRecords.reduce((sum, r) => sum + r.gpa, 0) / yearRecords.length
                  
                  return (
                    <div key={year} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">{year} Academic Year</h4>
                        <Badge variant="outline">GPA: {yearGPA.toFixed(2)}</Badge>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-3">
                        {yearRecords.map(record => (
                          <div key={`${record.year}-${record.term}`} className="border rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{record.term}</span>
                              <span className="text-sm text-muted-foreground">
                                Position: {record.position}/{record.totalStudents}
                              </span>
                            </div>
                            <div className="text-xl font-bold mb-2">{record.gpa.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">
                              {record.results.length} subjects
                            </div>
                            {record.achievements.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {record.achievements.map(achievement => (
                                  <Badge key={achievement.id} variant="secondary" className="text-xs">
                                    {achievement.title}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Achievement Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Achievement Timeline
              </CardTitle>
              <CardDescription>Your academic and behavioral achievements over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {academicRecords.flatMap(record => 
                  record.achievements.map(achievement => ({
                    ...achievement,
                    year: record.year,
                    term: record.term
                  }))
                ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.color === 'gold' ? 'bg-yellow-100' :
                      achievement.color === 'silver' ? 'bg-gray-100' :
                      'bg-blue-100'
                    }`}>
                      {achievement.icon === 'trophy' && <Trophy className="h-5 w-5 text-yellow-600" />}
                      {achievement.icon === 'medal' && <Medal className="h-5 w-5 text-gray-600" />}
                      {achievement.icon === 'star' && <Star className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {achievement.year} {achievement.term} • {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant={
                      achievement.type === 'academic' ? 'default' :
                      achievement.type === 'behavior' ? 'secondary' :
                      'outline'
                    }>
                      {achievement.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subject Progression Tab */}
        <TabsContent value="progression" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select subject" />
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
          </div>

          <div className="grid gap-4">
            {subjectProgressions
              .filter(progression => selectedSubject === "all" || progression.subjectId === selectedSubject)
              .map(progression => (
                <Card key={progression.subjectId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {progression.subjectName}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(progression.trend)}
                        {getLevelBadge(progression.currentLevel)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Progress Timeline */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Progress Timeline</h4>
                      <div className="space-y-2">
                        {progression.timeline.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <span className="font-medium">{entry.year} {entry.term}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                Position: {entry.position}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">{entry.score}%</span>
                              <Badge variant="outline">{entry.grade}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Performance Chart */}
                    {progression.timeline.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3">Performance Trend</h4>
                        <div className="h-64 w-full">
                          <div className="text-sm text-muted-foreground mb-2">
                            Performance trend over time for {progression.subjectName}
                          </div>
                          {/* Simple trend visualization */}
                          <div className="space-y-2">
                            {progression.timeline.map((entry, index) => (
                              <div key={index} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                                <span className="text-sm w-24">{entry.year} {entry.term}</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${entry.score}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium w-12">{entry.score}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {progression.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Analytics & Insights Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {/* Strength and Weakness Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Strength & Weakness Analysis
              </CardTitle>
              <CardDescription>AI-powered analysis of your academic performance patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Strengths */}
                <div>
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Academic Strengths
                  </h4>
                  <div className="space-y-3">
                    {subjectProgressions
                      .filter(p => p.currentLevel === "excellent" || p.currentLevel === "good")
                      .slice(0, 3)
                      .map(progression => (
                        <div key={progression.subjectId} className="p-3 bg-green-50 rounded-lg">
                          <div className="font-medium">{progression.subjectName}</div>
                          <div className="text-sm text-muted-foreground">
                            Consistent {progression.currentLevel} performance
                          </div>
                          <Progress 
                            value={progression.timeline.length > 0 
                              ? progression.timeline[progression.timeline.length - 1].score 
                              : 0} 
                            className="mt-2 h-2"
                          />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    Areas for Improvement
                  </h4>
                  <div className="space-y-3">
                    {subjectProgressions
                      .filter(p => p.currentLevel === "needs_improvement" || p.currentLevel === "average")
                      .slice(0, 3)
                      .map(progression => (
                        <div key={progression.subjectId} className="p-3 bg-orange-50 rounded-lg">
                          <div className="font-medium">{progression.subjectName}</div>
                          <div className="text-sm text-muted-foreground">
                            Needs focused attention
                          </div>
                          <Progress 
                            value={progression.timeline.length > 0 
                              ? progression.timeline[progression.timeline.length - 1].score 
                              : 0} 
                            className="mt-2 h-2"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Patterns
              </CardTitle>
              <CardDescription>Identified patterns in your academic performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performancePatterns.map((pattern, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{pattern.pattern}</h4>
                      <Badge variant="outline">{pattern.confidence}% confidence</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{pattern.description}</p>
                    
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1">Affected Subjects:</div>
                      <div className="flex flex-wrap gap-1">
                        {pattern.subjects.map(subject => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 mb-1">💡 Recommendation:</div>
                      <div className="text-sm text-blue-800">{pattern.recommendation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Performance Radar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Overall Performance Overview
              </CardTitle>
              <CardDescription>Comprehensive view of your performance across all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {subjectProgressions.map(progression => {
                  const latestScore = progression.timeline.length > 0 
                    ? progression.timeline[progression.timeline.length - 1].score 
                    : 0
                  
                  return (
                    <div key={progression.subjectId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{progression.subjectName}</span>
                        <span className="text-lg font-bold">{latestScore}%</span>
                      </div>
                      <Progress value={latestScore} className="h-2 mb-2" />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{progression.currentLevel}</span>
                        {getTrendIcon(progression.trend)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals & Planning Tab */}
        <TabsContent value="goals" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Academic Goals</h3>
              <p className="text-muted-foreground">Track your progress towards academic targets</p>
            </div>
            <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Academic Goal</DialogTitle>
                  <DialogDescription>
                    Set a specific target to track your academic progress
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goal-title">Goal Title</Label>
                    <Input
                      id="goal-title"
                      placeholder="e.g., Achieve 90% in Mathematics"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-description">Description</Label>
                    <Textarea
                      id="goal-description"
                      placeholder="Describe your goal and how you plan to achieve it"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-target">Target Score (%)</Label>
                    <Input
                      id="goal-target"
                      type="number"
                      min="0"
                      max="100"
                      value={newGoal.targetScore}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetScore: parseInt(e.target.value) || 90 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-deadline">Deadline</Label>
                    <Input
                      id="goal-deadline"
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setGoalDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGoal}>Create Goal</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {goals.map(goal => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(goal.status)}
                      {goal.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        goal.status === "completed" ? "default" :
                        goal.status === "on_track" ? "secondary" :
                        goal.status === "at_risk" ? "destructive" :
                        "outline"
                      }>
                        {goal.status.replace('_', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {goal.currentScore}% / {goal.targetScore}%
                        </span>
                      </div>
                      <Progress value={(goal.currentScore / goal.targetScore) * 100} className="h-2" />
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span className={new Date(goal.deadline) < new Date() ? "text-red-600" : ""}>
                        {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Milestones */}
                    {goal.milestones.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Milestones</h4>
                        <div className="space-y-2">
                          {goal.milestones.map((milestone, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className={`h-4 w-4 ${
                                milestone.completed ? "text-green-600" : "text-gray-300"
                              }`} />
                              <span className={milestone.completed ? "line-through text-muted-foreground" : ""}>
                                {milestone.title}
                              </span>
                              <span className="text-xs text-muted-foreground ml-auto">
                                {new Date(milestone.date).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Improvement Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Improvement Recommendations
              </CardTitle>
              <CardDescription>Personalized suggestions based on your academic history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-semibold text-blue-900">Study Strategy</h4>
                  <p className="text-blue-800 text-sm mt-1">
                    Based on your performance patterns, consider implementing spaced repetition 
                    for subjects where you show declining trends.
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-semibold text-green-900">Strength Leveraging</h4>
                  <p className="text-green-800 text-sm mt-1">
                    Your analytical skills in Mathematics and Science can be applied to improve 
                    performance in Language Arts through structured essay planning.
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                  <h4 className="font-semibold text-orange-900">Time Management</h4>
                  <p className="text-orange-800 text-sm mt-1">
                    Consider allocating more study time to subjects showing inconsistent performance 
                    patterns to achieve better stability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
