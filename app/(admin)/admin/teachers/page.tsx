"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/mock-db"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  UserPlus,
  Download,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  AlertTriangle,
  Eye,
  Edit,
  UserCheck,
  UserX,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from "lucide-react"

export default function TeachersPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [subjectFilter, setSubjectFilter] = useState<string>("all")
  const [experienceFilter, setExperienceFilter] = useState<string>("all")
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const teachers = db.listTeachers()
  const schools = db.listSchools()
  const classes = db.listClasses({})
  const subjects = db.listSubjects({})

  // Get unique subjects from all teachers
  const allSubjects = Array.from(new Set(teachers.flatMap(t => t.subjects)))

  // Enhanced teacher data with additional metrics
  const enhancedTeachers = teachers.map(teacher => {
    const assignedClasses = classes.filter(cls => cls.teacherId === teacher.id)
    const school = schools.find(s => s.id === teacher.schoolId)
    const totalStudents = assignedClasses.reduce((sum, cls) => sum + cls.studentCount, 0)
    
    return {
      ...teacher,
      school: school?.name || "Not Assigned",
      classCount: assignedClasses.length,
      studentCount: totalStudents,
      workload: Math.min(100, (assignedClasses.length / 6) * 100), // Assuming 6 classes is 100% workload
      scheduleConflicts: Math.random() > 0.8 ? 1 : 0, // Mock conflict detection
      feedbackScore: teacher.performance?.studentFeedback || 0,
      submissionTimeliness: Math.random() * 100, // Mock timeliness score
    }
  })

  // Apply filters and search
  const filteredTeachers = enhancedTeachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subjects.some(subject => 
                           subject.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && teacher.active) ||
                         (statusFilter === "inactive" && !teacher.active)
    
    const matchesSubject = subjectFilter === "all" || 
                          teacher.subjects.includes(subjectFilter)
    
    const matchesExperience = experienceFilter === "all" ||
                             (experienceFilter === "junior" && (teacher.experience || 0) < 3) ||
                             (experienceFilter === "mid" && (teacher.experience || 0) >= 3 && (teacher.experience || 0) <= 7) ||
                             (experienceFilter === "senior" && (teacher.experience || 0) > 7)

    return matchesSearch && matchesStatus && matchesSubject && matchesExperience
  })

  // Apply sorting
  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case "name":
        aValue = a.name
        bValue = b.name
        break
      case "experience":
          aValue = a.experience || 0
          bValue = b.experience || 0
          break
      case "classCount":
        aValue = a.classCount
        bValue = b.classCount
        break
      case "studentCount":
        aValue = a.studentCount
        bValue = b.studentCount
        break
      case "performance":
        aValue = a.feedbackScore
        bValue = b.feedbackScore
        break
      default:
        aValue = a.name
        bValue = b.name
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    } else {
      return sortOrder === "asc" 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    }
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTeachers(sortedTeachers.map(t => t.id))
    } else {
      setSelectedTeachers([])
    }
  }

  const handleSelectTeacher = (teacherId: string, checked: boolean) => {
    if (checked) {
      setSelectedTeachers([...selectedTeachers, teacherId])
    } else {
      setSelectedTeachers(selectedTeachers.filter(id => id !== teacherId))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on`, selectedTeachers)
    // Implement bulk actions here
    setSelectedTeachers([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">
            Manage teaching staff, assignments, and performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-xs text-muted-foreground">
              {teachers.filter(t => t.active).length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Experience</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(teachers.reduce((sum, t) => sum + (t.experience || 0), 0) / teachers.length).toFixed(1)} years
            </div>
            <p className="text-xs text-muted-foreground">
              Across all teachers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(teachers.reduce((sum, t) => sum + (t.performance?.studentFeedback || 0), 0) / teachers.length).toFixed(1)}/5
            </div>
            <p className="text-xs text-muted-foreground">
              Student feedback score
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schedule Conflicts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enhancedTeachers.filter(t => t.scheduleConflicts > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search">Search Teachers</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or subject..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="min-w-[150px]">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-[150px]">
              <Label>Subject</Label>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {allSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-[150px]">
              <Label>Experience</Label>
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experience</SelectItem>
                  <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid-level (3-7 years)</SelectItem>
                  <SelectItem value="senior">Senior (8+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="classCount">Class Count</SelectItem>
                    <SelectItem value="studentCount">Student Count</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {sortedTeachers.length} of {teachers.length} teachers
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedTeachers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {selectedTeachers.length} teacher(s) selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("email")}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("assign")}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Bulk Assign
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("export")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedTeachers([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Teacher Directory */}
      <Card>
        <CardHeader>
          <CardTitle>Teacher Directory</CardTitle>
          <CardDescription>
            Teacher profiles with contact information and assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedTeachers.map((teacher) => (
                <Card key={teacher.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedTeachers.includes(teacher.id)}
                          onCheckedChange={(checked) => 
                            handleSelectTeacher(teacher.id, checked as boolean)
                          }
                        />
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {teacher.photoUrl ? (
                            <Image
                              src={teacher.photoUrl}
                              alt={teacher.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-lg font-semibold">
                              {teacher.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{teacher.name}</h3>
                          <p className="text-sm text-muted-foreground">{teacher.email}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/teachers/${teacher.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Teacher
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Assign Classes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={teacher.active ? "default" : "secondary"}>
                        {teacher.active ? "Active" : "Inactive"}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{teacher.feedbackScore.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span>{teacher.experience || 0} years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{teacher.classCount} classes, {teacher.studentCount} students</span>
                      </div>
                      {teacher.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{teacher.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Subjects</div>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.slice(0, 3).map(subject => (
                          <Badge key={subject} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {teacher.subjects.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{teacher.subjects.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Workload</span>
                        <span>{teacher.workload.toFixed(0)}%</span>
                      </div>
                      <Progress value={teacher.workload} className="h-2" />
                    </div>
                    
                    {teacher.scheduleConflicts > 0 && (
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Schedule conflict detected</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedTeachers.length === sortedTeachers.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Workload</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTeachers.includes(teacher.id)}
                        onCheckedChange={(checked) => 
                          handleSelectTeacher(teacher.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {teacher.photoUrl ? (
                            <Image
                              src={teacher.photoUrl}
                              alt={teacher.name}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold">
                              {teacher.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{teacher.name}</div>
                          <div className="text-sm text-muted-foreground">{teacher.school}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{teacher.email}</div>
                        {teacher.phoneNumber && (
                          <div className="text-sm text-muted-foreground">{teacher.phoneNumber}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.slice(0, 2).map(subject => (
                          <Badge key={subject} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {teacher.subjects.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{teacher.subjects.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{teacher.experience || 0} years</TableCell>
                    <TableCell>{teacher.classCount}</TableCell>
                    <TableCell>{teacher.studentCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{teacher.feedbackScore.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-20">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{teacher.workload.toFixed(0)}%</span>
                        </div>
                        <Progress value={teacher.workload} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={teacher.active ? "default" : "secondary"}>
                          {teacher.active ? "Active" : "Inactive"}
                        </Badge>
                        {teacher.scheduleConflicts > 0 && (
                          <div className="flex items-center gap-1 text-xs text-orange-600">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Conflict</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/teachers/${teacher.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Teacher
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Assign Classes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
