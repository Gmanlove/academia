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
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Calendar,
  Star,
  Award,
  BookOpen,
  Mail,
  Share,
  Eye,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from "lucide-react"
import { Student, ResultEntry, Subject } from "@/lib/types"

export default function StudentResultsPage() {
  const [student, setStudent] = useState<Student | null>(null)
  const [results, setResults] = useState<ResultEntry[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [filteredResults, setFilteredResults] = useState<ResultEntry[]>([])
  const [selectedTerm, setSelectedTerm] = useState<string>("all")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [trendData, setTrendData] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareEmail, setShareEmail] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError("")
      
      try {
        // Fetch student profile, subjects, and results in parallel
        const [studentResponse, subjectsResponse, resultsResponse] = await Promise.all([
          fetch('/api/student/profile'),
          fetch('/api/subjects'),
          fetch('/api/results')
        ])

        if (!studentResponse.ok || !subjectsResponse.ok || !resultsResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const [studentResult, subjectsResult, resultsResult] = await Promise.all([
          studentResponse.json(),
          subjectsResponse.json(),
          resultsResponse.json()
        ])

        const studentData = studentResult.data
        const subjectsData = subjectsResult.data || []
        const resultsData = resultsResult.data || []

        // Generate performance analytics
        const performance = generatePerformanceData(subjectsData, resultsData)
        const trends = generateTrendData(resultsData)
        const studentGoals = generateGoals(subjectsData)

        setStudent(studentData)
        setSubjects(subjectsData)
        setResults(resultsData)
        setFilteredResults(resultsData)
        setPerformanceData(performance)
        setTrendData(trends)
        setGoals(studentGoals)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load student data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Filter results based on selected criteria
    let filtered = results

    if (selectedTerm !== "all") {
      filtered = filtered.filter(r => r.term === selectedTerm)
    }

    if (selectedSubject !== "all") {
      const subject = subjects.find(s => s.name === selectedSubject)
      if (subject) {
        filtered = filtered.filter(r => r.subjectId === subject.id)
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(r => {
        const subject = subjects.find(s => s.id === r.subjectId)
        return subject?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               r.teacherRemark?.toLowerCase().includes(searchQuery.toLowerCase())
      })
    }

    setFilteredResults(filtered)
  }, [selectedTerm, selectedSubject, searchQuery, results, subjects])

  const generatePerformanceData = (subjects: Subject[], results: ResultEntry[]) => {
    const subjectPerformance = subjects.slice(0, 6).map(subject => {
      const subjectResults = results.filter(r => r.subjectId === subject.id)
      const average = subjectResults.length > 0 
        ? subjectResults.reduce((sum, r) => sum + r.total, 0) / subjectResults.length 
        : 0
      return {
        subject: subject.name,
        yourScore: Math.round(average),
        classAverage: Math.round(average * 0.85) // Simulated class average
      }
    })

    return {
      labels: subjectPerformance.map(p => p.subject),
      datasets: [
        {
          label: "Your Performance",
          data: subjectPerformance.map(p => p.yourScore),
          borderColor: "hsl(var(--primary))",
          backgroundColor: "hsl(var(--primary) / 0.1)",
        },
        {
          label: "Class Average",
          data: subjectPerformance.map(p => p.classAverage),
          borderColor: "hsl(var(--muted-foreground))",
          backgroundColor: "hsl(var(--muted-foreground) / 0.1)",
        }
      ]
    }
  }

  const generateTrendData = (results: ResultEntry[]) => {
    const sortedResults = results.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
    const recentResults = sortedResults.slice(-6)
    
    return recentResults.map((result, index) => ({
      period: `Test ${index + 1}`,
      score: result.total,
      ca: result.ca,
      exam: result.exam,
      date: new Date(result.submittedAt).toLocaleDateString()
    }))
  }

  const generateGoals = (subjects: Subject[]) => {
    return subjects.slice(0, 4).map(subject => ({
      id: subject.id,
      subject: subject.name,
      targetGrade: "A",
      currentGrade: "B+",
      targetScore: 90,
      currentScore: 85,
      progress: 85,
      deadline: "End of Term",
      status: "On Track"
    }))
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-green-600 bg-green-50"
      case "B": return "text-blue-600 bg-blue-50"
      case "C": return "text-yellow-600 bg-yellow-50"
      case "D": return "text-orange-600 bg-orange-50"
      case "F": return "text-red-600 bg-red-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const calculatePerformanceIndicator = (currentScore: number, previousScore: number) => {
    if (currentScore > previousScore) {
      return { type: "improvement", icon: TrendingUp, color: "text-green-600" }
    } else if (currentScore < previousScore) {
      return { type: "decline", icon: TrendingDown, color: "text-red-600" }
    }
    return { type: "stable", icon: Target, color: "text-gray-600" }
  }

  const handleDownloadResult = (resultId: string, type: "slip" | "transcript" | "report") => {
    // Simulate download
    console.log(`Downloading ${type} for result ${resultId}`)
    // In a real app, this would trigger a download API call
  }

  const handleShareResults = () => {
    if (shareEmail) {
      console.log(`Sharing results to ${shareEmail}`)
      setShareDialogOpen(false)
      setShareEmail("")
      // In a real app, this would call an email API
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your results...</p>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">📋 My Results</h1>
          <p className="text-muted-foreground">
            Track your academic performance and download reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Share className="mr-2 h-4 w-4" />
                Share Results
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Results via Email</DialogTitle>
                <DialogDescription>
                  Enter the email address to share your academic results
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="parent@example.com"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleShareResults}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button size="sm" onClick={() => handleDownloadResult("all", "transcript")}>
            <Download className="mr-2 h-4 w-4" />
            Download Transcript
          </Button>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.total, 0) / results.length) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              <span className="text-green-600">+3% from last term</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Subject</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Mathematics</div>
            <p className="text-xs text-muted-foreground">95% average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Results</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{results.length}</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Ranking</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">3rd</div>
            <p className="text-xs text-muted-foreground">Out of 30 students</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Results Timeline</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="goals">Goal Tracking</TabsTrigger>
          <TabsTrigger value="downloads">Download Center</TabsTrigger>
        </TabsList>

        {/* Results Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label htmlFor="term-filter">Term</Label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Terms</SelectItem>
                      <SelectItem value="Term 1">Term 1</SelectItem>
                      <SelectItem value="Term 2">Term 2</SelectItem>
                      <SelectItem value="Term 3">Term 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject-filter">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.name}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search subjects or remarks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedTerm("all")
                      setSelectedSubject("all")
                      setSearchQuery("")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Chronological Results ({filteredResults.length})
              </CardTitle>
              <CardDescription>
                Your academic performance across all subjects and terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>CA Score</TableHead>
                      <TableHead>Exam Score</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Teacher Remark</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result) => {
                      const subject = subjects.find(s => s.id === result.subjectId)
                      return (
                        <TableRow key={result.id}>
                          <TableCell>
                            {new Date(result.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              {subject?.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{result.ca}/20</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{result.exam}/80</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-bold">{result.total}%</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getGradeColor(result.grade || "")}>
                              {result.grade}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {result.position || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>{result.term}</TableCell>
                          <TableCell className="max-w-xs">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span className="text-sm text-muted-foreground truncate">
                                {result.teacherRemark || "No remarks"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadResult(result.id, "slip")}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Subject Comparison
                </CardTitle>
                <CardDescription>Your performance vs class average</CardDescription>
              </CardHeader>
              <CardContent>
                {performanceData && <ClassRadarChart data={performanceData} />}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Trends
                </CardTitle>
                <CardDescription>Track your progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentTrendChart data={trendData} />
              </CardContent>
            </Card>
          </div>

          {/* Performance Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Improvement/Decline Indicators
              </CardTitle>
              <CardDescription>Subject-wise performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {subjects.slice(0, 6).map((subject) => {
                  const subjectResults = results.filter(r => r.subjectId === subject.id)
                  const recentScores = subjectResults.slice(-2)
                  const currentScore = recentScores[1]?.total || 0
                  const previousScore = recentScores[0]?.total || 0
                  const indicator = calculatePerformanceIndicator(currentScore, previousScore)
                  const IconComponent = indicator.icon

                  return (
                    <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${indicator.color.includes('green') ? 'bg-green-100' : indicator.color.includes('red') ? 'bg-red-100' : 'bg-gray-100'}`}>
                          <IconComponent className={`h-4 w-4 ${indicator.color}`} />
                        </div>
                        <div>
                          <div className="font-medium">{subject.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Current: {currentScore}% | Previous: {previousScore}%
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        indicator.type === "improvement" ? "default" :
                        indicator.type === "decline" ? "destructive" : "secondary"
                      }>
                        {indicator.type === "improvement" ? "Improving" :
                         indicator.type === "decline" ? "Declining" : "Stable"}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Performance Predictions
              </CardTitle>
              <CardDescription>Projected grades based on current trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjects.slice(0, 4).map((subject) => {
                  const subjectResults = results.filter(r => r.subjectId === subject.id)
                  const average = subjectResults.length > 0 
                    ? subjectResults.reduce((sum, r) => sum + r.total, 0) / subjectResults.length 
                    : 0
                  const predictedGrade = average >= 90 ? "A" : average >= 80 ? "B" : average >= 70 ? "C" : "D"
                  const confidence = Math.min(95, Math.max(60, average + 10))

                  return (
                    <div key={subject.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={getGradeColor(predictedGrade)}>
                            Predicted: {predictedGrade}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {confidence}% confidence
                          </span>
                        </div>
                      </div>
                      <Progress value={confidence} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goal Tracking Tab */}
        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Academic Goals
              </CardTitle>
              <CardDescription>Track your progress towards academic targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {goals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{goal.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          Target: {goal.targetGrade} ({goal.targetScore}%) | Current: {goal.currentGrade} ({goal.currentScore}%)
                        </p>
                      </div>
                      <Badge variant={
                        goal.status === "On Track" ? "default" :
                        goal.status === "At Risk" ? "destructive" : "secondary"
                      }>
                        {goal.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Deadline: {goal.deadline}
                      </span>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Download Center Tab */}
        <TabsContent value="downloads" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Individual Result Slips
                </CardTitle>
                <CardDescription>Download specific test results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredResults.slice(0, 5).map((result) => {
                  const subject = subjects.find(s => s.id === result.subjectId)
                  return (
                    <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{subject?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {result.term} - {result.total}%
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadResult(result.id, "slip")}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  )
                })}
                {filteredResults.length > 5 && (
                  <div className="text-center">
                    <Button variant="outline" size="sm">
                      View All Results ({filteredResults.length - 5} more)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Comprehensive Transcripts
                </CardTitle>
                <CardDescription>Complete academic records</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadResult("all", "transcript")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Complete Transcript
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadResult("term1", "transcript")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Term 1 Transcript
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadResult("term2", "transcript")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Term 2 Transcript
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadResult("term3", "transcript")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Term 3 Transcript
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Progress Reports
                </CardTitle>
                <CardDescription>Detailed performance analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadResult("all", "report")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Performance Summary
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadResult("analytics", "report")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Analytics Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadResult("goals", "report")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Goal Progress Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadResult("prediction", "report")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Prediction Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Download Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Bulk Download Options
              </CardTitle>
              <CardDescription>Download multiple documents at once</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold">By Subject</h4>
                  {subjects.slice(0, 4).map((subject) => (
                    <Button 
                      key={subject.id}
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleDownloadResult(subject.id, "slip")}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      All {subject.name} Results
                    </Button>
                  ))}
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">By Term</h4>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadResult("term1", "slip")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    All Term 1 Results
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadResult("term2", "slip")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    All Term 2 Results
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadResult("term3", "slip")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    All Term 3 Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
