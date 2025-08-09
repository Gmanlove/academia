"use client"

import { useState } from "react"
import { db } from "@/lib/mock-db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Settings,
  BarChart3,
  Target,
  Clock,
  Award,
  AlertTriangle
} from "lucide-react"

export default function Page() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedView, setSelectedView] = useState<'grid' | 'matrix'>('grid')
  
  const subjects = db.listSubjects()
  const teachers = db.listTeachers()
  const classes = db.listClasses()
  const students = db.listStudents()
  const results = db.listResults()

  // Calculate subject analytics
  const getSubjectAnalytics = (subjectId: string) => {
    const subjectResults = results.filter(r => r.subjectId === subjectId)
    if (subjectResults.length === 0) return { avgScore: 0, passRate: 0, difficulty: "Medium", trend: 0 }
    
    const avgScore = subjectResults.reduce((sum, r) => sum + r.total, 0) / subjectResults.length
    const passCount = subjectResults.filter(r => r.total >= 50).length
    const passRate = (passCount / subjectResults.length) * 100
    
    let difficulty: "Easy" | "Medium" | "Hard" = "Medium"
    if (avgScore >= 75) difficulty = "Easy"
    else if (avgScore < 60) difficulty = "Hard"
    
    return { 
      avgScore: Math.round(avgScore), 
      passRate: Math.round(passRate), 
      difficulty,
      trend: Math.random() > 0.5 ? Math.round(Math.random() * 10) : -Math.round(Math.random() * 5)
    }
  }

  const getSubjectTeachers = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId)
    if (!subject) return []
    return teachers.filter(t => subject.teacherIds.includes(t.id))
  }

  const getSubjectClasses = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId)
    if (!subject) return []
    return classes.filter(c => subject.classIds.includes(c.id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subjects Management</h1>
          <p className="text-muted-foreground">Manage subject catalog, assignments, and performance analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedView} onValueChange={(value: 'grid' | 'matrix') => setSelectedView(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid View</SelectItem>
              <SelectItem value="matrix">Matrix View</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>Create a new subject for your academic program</DialogDescription>
              </DialogHeader>
              <SubjectForm onClose={() => setShowCreateDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="catalog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="catalog">Subject Catalog</TabsTrigger>
          <TabsTrigger value="assignments">Assignment Matrix</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          {selectedView === 'grid' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => {
                const analytics = getSubjectAnalytics(subject.id)
                const subjectTeachers = getSubjectTeachers(subject.id)
                const subjectClasses = getSubjectClasses(subject.id)
                
                return (
                  <Card key={subject.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <Badge variant="outline">{subject.code}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={subject.isCore ? "default" : "secondary"}>
                          {subject.isCore ? "Core" : "Elective"}
                        </Badge>
                        <Badge variant={analytics.difficulty === "Easy" ? "default" : analytics.difficulty === "Hard" ? "destructive" : "secondary"}>
                          {analytics.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Teaching Staff */}
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {subjectTeachers.length} teacher{subjectTeachers.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Assigned Classes */}
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {subjectClasses.length} class{subjectClasses.length !== 1 ? 'es' : ''}
                        </span>
                      </div>

                      {/* Performance Metrics */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Average Score</span>
                          <span className="font-medium">{analytics.avgScore}%</span>
                        </div>
                        <Progress value={analytics.avgScore} className="h-2" />
                        
                        <div className="flex items-center justify-between text-sm">
                          <span>Pass Rate</span>
                          <div className="flex items-center gap-1">
                            {analytics.trend >= 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                            <span className="font-medium">{analytics.passRate}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Teachers List */}
                      <div>
                        <div className="text-sm font-medium mb-1">Teaching Staff</div>
                        <div className="space-y-1">
                          {subjectTeachers.slice(0, 2).map((teacher) => (
                            <div key={teacher.id} className="text-xs text-muted-foreground">
                              {teacher.name}
                            </div>
                          ))}
                          {subjectTeachers.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{subjectTeachers.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <SubjectMatrix subjects={subjects} classes={classes} teachers={teachers} />
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Assignment Matrix</CardTitle>
              <p className="text-sm text-muted-foreground">Visual overview of class-subject and teacher-subject assignments</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Class-Subject Matrix */}
                <div>
                  <h4 className="font-medium mb-3">Class-Subject Assignments</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-2 bg-muted/50 text-left font-medium">Class</th>
                          {subjects.map((subject) => (
                            <th key={subject.id} className="border p-2 bg-muted/50 text-center font-medium min-w-16">
                              {subject.code}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {classes.map((classItem) => (
                          <tr key={classItem.id}>
                            <td className="border p-2 font-medium">{classItem.name}</td>
                            {subjects.map((subject) => {
                              const isAssigned = classItem.subjectIds.includes(subject.id)
                              return (
                                <td key={subject.id} className="border p-2 text-center">
                                  {isAssigned ? (
                                    <div className="w-4 h-4 bg-green-500 rounded-full mx-auto" />
                                  ) : (
                                    <div className="w-4 h-4 bg-gray-200 rounded-full mx-auto" />
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Teacher Workload Distribution */}
                <div>
                  <h4 className="font-medium mb-3">Teacher Workload Distribution</h4>
                  <div className="space-y-3">
                    {teachers.map((teacher) => {
                      const teacherSubjects = subjects.filter(s => s.teacherIds.includes(teacher.id))
                      const workloadPercentage = (teacherSubjects.length / subjects.length) * 100
                      
                      return (
                        <div key={teacher.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h5 className="font-medium">{teacher.name}</h5>
                              <p className="text-sm text-muted-foreground">{teacher.email}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{teacherSubjects.length} subjects</div>
                              <div className="text-sm text-muted-foreground">{Math.round(workloadPercentage)}% workload</div>
                            </div>
                          </div>
                          <Progress value={workloadPercentage} className="h-2 mb-2" />
                          <div className="flex flex-wrap gap-1">
                            {teacherSubjects.map((subject) => (
                              <Badge key={subject.id} variant="outline" className="text-xs">
                                {subject.code}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Summary Cards */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Best Performing Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Mathematics</div>
                <p className="text-xs text-muted-foreground">82% average score</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Most Challenging</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Physics</div>
                <p className="text-xs text-muted-foreground">65% average score</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overall Pass Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76%</div>
                <p className="text-xs text-muted-foreground">Across all subjects</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subjects.length}</div>
                <p className="text-xs text-muted-foreground">{subjects.filter(s => s.isCore).length} core subjects</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left">Subject</th>
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-left">Teachers</th>
                      <th className="p-3 text-left">Classes</th>
                      <th className="p-3 text-left">Avg Score</th>
                      <th className="p-3 text-left">Pass Rate</th>
                      <th className="p-3 text-left">Difficulty</th>
                      <th className="p-3 text-left">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => {
                      const analytics = getSubjectAnalytics(subject.id)
                      const subjectTeachers = getSubjectTeachers(subject.id)
                      const subjectClasses = getSubjectClasses(subject.id)
                      
                      return (
                        <tr key={subject.id} className="border-b last:border-0">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{subject.name}</div>
                              <div className="text-xs text-muted-foreground">{subject.code}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant={subject.isCore ? "default" : "secondary"}>
                              {subject.isCore ? "Core" : "Elective"}
                            </Badge>
                          </td>
                          <td className="p-3">{subjectTeachers.length}</td>
                          <td className="p-3">{subjectClasses.length}</td>
                          <td className="p-3">{analytics.avgScore}%</td>
                          <td className="p-3">{analytics.passRate}%</td>
                          <td className="p-3">
                            <Badge variant={
                              analytics.difficulty === "Easy" ? "default" : 
                              analytics.difficulty === "Hard" ? "destructive" : "secondary"
                            }>
                              {analytics.difficulty}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className={`flex items-center gap-1 ${analytics.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {analytics.trend >= 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {Math.abs(analytics.trend)}%
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SubjectForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    isCore: true,
    description: "",
    creditHours: 3,
    passingGrade: 50
  })

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="subjectName">Subject Name</Label>
          <Input 
            id="subjectName"
            placeholder="e.g., Mathematics"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="subjectCode">Subject Code</Label>
          <Input 
            id="subjectCode"
            placeholder="e.g., MTH"
            value={formData.code}
            onChange={(e) => setFormData({...formData, code: e.target.value})}
          />
        </div>
        <div>
          <Label>Subject Type</Label>
          <Select value={formData.isCore ? "core" : "elective"} onValueChange={(value) => setFormData({...formData, isCore: value === "core"})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="core">Core Subject</SelectItem>
              <SelectItem value="elective">Elective Subject</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            placeholder="Brief description of the subject"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="creditHours">Credit Hours</Label>
            <Input 
              id="creditHours"
              type="number"
              value={formData.creditHours}
              onChange={(e) => setFormData({...formData, creditHours: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <Label htmlFor="passingGrade">Passing Grade</Label>
            <Input 
              id="passingGrade"
              type="number"
              value={formData.passingGrade}
              onChange={(e) => setFormData({...formData, passingGrade: parseInt(e.target.value)})}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Create Subject</Button>
      </div>
    </div>
  )
}

function SubjectMatrix({ subjects, classes, teachers }: { subjects: any[], classes: any[], teachers: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject-Class Assignment Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-muted/50 text-left font-medium sticky left-0">Subject</th>
                {classes.map((classItem) => (
                  <th key={classItem.id} className="border p-2 bg-muted/50 text-center font-medium min-w-20">
                    {classItem.name}
                  </th>
                ))}
                <th className="border p-2 bg-muted/50 text-center font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => {
                const assignedClassCount = classes.filter(c => c.subjectIds.includes(subject.id)).length
                return (
                  <tr key={subject.id}>
                    <td className="border p-2 font-medium sticky left-0 bg-white">
                      <div>
                        <div>{subject.name}</div>
                        <div className="text-xs text-muted-foreground">{subject.code}</div>
                      </div>
                    </td>
                    {classes.map((classItem) => {
                      const isAssigned = classItem.subjectIds.includes(subject.id)
                      return (
                        <td key={classItem.id} className="border p-2 text-center">
                          {isAssigned ? (
                            <div className="w-6 h-6 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-gray-200 rounded-full mx-auto" />
                          )}
                        </td>
                      )
                    })}
                    <td className="border p-2 text-center font-medium">{assignedClassCount}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
