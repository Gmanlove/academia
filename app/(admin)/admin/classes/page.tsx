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
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Plus,
  Eye,
  Settings,
  ChevronRight,
  Award,
  Clock,
  Target
} from "lucide-react"

export default function Page() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [showCreateWizard, setShowCreateWizard] = useState(false)
  
  const classes = db.listClasses()
  const teachers = db.listTeachers()
  const subjects = db.listSubjects()
  const students = db.listStudents()

  // Calculate performance metrics for each class
  const getClassMetrics = (classId: string) => {
    const classStudents = students.filter(s => s.classId === classId)
    const results = db.listResults().filter(r => r.classId === classId)
    
    if (results.length === 0) return { avgScore: 0, passRate: 0, trend: 0 }
    
    const avgScore = results.reduce((sum, r) => sum + r.total, 0) / results.length
    const passCount = results.filter(r => r.total >= 50).length
    const passRate = (passCount / results.length) * 100
    
    return { avgScore: Math.round(avgScore), passRate: Math.round(passRate), trend: 5.2 }
  }

  const getClassTeacher = (teacherId?: string) => {
    if (!teacherId) return "Unassigned"
    return teachers.find(t => t.id === teacherId)?.name || "Unknown"
  }

  const getClassSubjects = (subjectIds: string[]) => {
    return subjects.filter(s => subjectIds.includes(s.id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Classes Management</h1>
          <p className="text-muted-foreground">Manage class structures, assignments, and performance</p>
        </div>
        <Dialog open={showCreateWizard} onOpenChange={setShowCreateWizard}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>Set up a new class with teacher assignment and subject allocation</DialogDescription>
            </DialogHeader>
            <ClassCreationWizard onClose={() => setShowCreateWizard(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Class Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="assignments">Teacher Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((classItem) => {
              const metrics = getClassMetrics(classItem.id)
              const teacher = getClassTeacher(classItem.teacherId)
              const classSubjects = getClassSubjects(classItem.subjectIds)
              
              return (
                <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{classItem.name}</CardTitle>
                      <Badge variant="outline">{classItem.level}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Academic Year: {classItem.academicYear || "2024/2025"}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Teacher Assignment */}
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Teacher: {teacher}</span>
                    </div>

                    {/* Student Count */}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {classItem.studentCount} students
                        {classItem.capacity && (
                          <span className="text-muted-foreground">
                            /{classItem.capacity}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Subject List */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Subjects ({classSubjects.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {classSubjects.slice(0, 3).map((subject) => (
                          <Badge key={subject.id} variant="secondary" className="text-xs">
                            {subject.code}
                          </Badge>
                        ))}
                        {classSubjects.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{classSubjects.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Average Score</span>
                        <span className="font-medium">{metrics.avgScore}%</span>
                      </div>
                      <Progress value={metrics.avgScore} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Pass Rate</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="font-medium">{metrics.passRate}%</span>
                        </div>
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
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Performance Summary Cards */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Top Performing Class</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">JSS 3A</div>
                <p className="text-xs text-muted-foreground">85% average score</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">JSS 1B</div>
                <p className="text-xs text-muted-foreground">62% average score</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overall Pass Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">+5% from last term</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Enrollment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students.length}</div>
                <p className="text-xs text-muted-foreground">Across {classes.length} classes</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Class Performance Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left">Class</th>
                      <th className="p-3 text-left">Teacher</th>
                      <th className="p-3 text-left">Students</th>
                      <th className="p-3 text-left">Avg Score</th>
                      <th className="p-3 text-left">Pass Rate</th>
                      <th className="p-3 text-left">Trend</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((classItem) => {
                      const metrics = getClassMetrics(classItem.id)
                      const teacher = getClassTeacher(classItem.teacherId)
                      
                      return (
                        <tr key={classItem.id} className="border-b last:border-0">
                          <td className="p-3 font-medium">{classItem.name}</td>
                          <td className="p-3">{teacher}</td>
                          <td className="p-3">{classItem.studentCount}</td>
                          <td className="p-3">{metrics.avgScore}%</td>
                          <td className="p-3">{metrics.passRate}%</td>
                          <td className="p-3">
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="h-3 w-3" />
                              +{metrics.trend}%
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge 
                              variant={metrics.avgScore >= 75 ? "default" : metrics.avgScore >= 60 ? "secondary" : "destructive"}
                            >
                              {metrics.avgScore >= 75 ? "Excellent" : metrics.avgScore >= 60 ? "Good" : "Needs Attention"}
                            </Badge>
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

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teacher-Class Assignments</CardTitle>
              <p className="text-sm text-muted-foreground">Manage teacher assignments and workload distribution</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teachers.map((teacher) => {
                  const teacherClasses = classes.filter(c => c.teacherId === teacher.id)
                  const totalStudents = teacherClasses.reduce((sum, c) => sum + c.studentCount, 0)
                  
                  return (
                    <div key={teacher.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{teacher.name}</h4>
                          <p className="text-sm text-muted-foreground">{teacher.email}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{teacherClasses.length} Classes</div>
                          <div className="text-sm text-muted-foreground">{totalStudents} Students</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {teacherClasses.map((classItem) => (
                          <Badge key={classItem.id} variant="outline">
                            {classItem.name} ({classItem.studentCount})
                          </Badge>
                        ))}
                        {teacherClasses.length === 0 && (
                          <span className="text-sm text-muted-foreground">No classes assigned</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Workload: {teacher.workload?.weeklyHours || 0}hrs/week
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Performance: {teacher.performance?.classAverage || 0}%
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ClassCreationWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [classData, setClassData] = useState({
    name: "",
    level: "",
    teacherId: "",
    subjects: [] as string[],
    capacity: 30
  })

  const teachers = db.listTeachers()
  const subjects = db.listSubjects()

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNum ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {stepNum}
            </div>
            {stepNum < 4 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Class Information</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="className">Class Name</Label>
              <Input 
                id="className"
                placeholder="e.g., JSS 1A"
                value={classData.name}
                onChange={(e) => setClassData({...classData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="classLevel">Class Level</Label>
              <Select value={classData.level} onValueChange={(value) => setClassData({...classData, level: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JSS 1">JSS 1</SelectItem>
                  <SelectItem value="JSS 2">JSS 2</SelectItem>
                  <SelectItem value="JSS 3">JSS 3</SelectItem>
                  <SelectItem value="SSS 1">SSS 1</SelectItem>
                  <SelectItem value="SSS 2">SSS 2</SelectItem>
                  <SelectItem value="SSS 3">SSS 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="capacity">Class Capacity</Label>
              <Input 
                id="capacity"
                type="number"
                value={classData.capacity}
                onChange={(e) => setClassData({...classData, capacity: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Teacher Assignment</h3>
          <div>
            <Label>Assign Class Teacher</Label>
            <Select value={classData.teacherId} onValueChange={(value) => setClassData({...classData, teacherId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.subjects.join(", ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Subject Allocation</h3>
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {subjects.map((subject) => (
              <label key={subject.id} className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  checked={classData.subjects.includes(subject.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setClassData({...classData, subjects: [...classData.subjects, subject.id]})
                    } else {
                      setClassData({...classData, subjects: classData.subjects.filter(s => s !== subject.id)})
                    }
                  }}
                />
                <span>{subject.name} ({subject.code})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Review & Create</h3>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div><strong>Class Name:</strong> {classData.name}</div>
            <div><strong>Level:</strong> {classData.level}</div>
            <div><strong>Capacity:</strong> {classData.capacity} students</div>
            <div><strong>Teacher:</strong> {teachers.find(t => t.id === classData.teacherId)?.name || "Not assigned"}</div>
            <div><strong>Subjects:</strong> {classData.subjects.length} selected</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => step > 1 ? setStep(step - 1) : onClose()}
        >
          {step === 1 ? "Cancel" : "Previous"}
        </Button>
        <Button 
          onClick={() => step < 4 ? setStep(step + 1) : onClose()}
          disabled={step === 1 && (!classData.name || !classData.level)}
        >
          {step === 4 ? "Create Class" : "Next"}
        </Button>
      </div>
    </div>
  )
}
