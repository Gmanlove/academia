"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { db } from "@/lib/mock-db"
import { Student, School, ClassRoom, PerformanceLevel } from "@/lib/types"
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  Upload,
  UserPlus,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  X,
  SlidersHorizontal,
  MessageSquare,
  User,
  GraduationCap,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GraduationCap,
} from "lucide-react"
import { AddStudentForm } from "@/components/add-student-form"

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSchool, setFilterSchool] = useState<string>("all")
  const [filterClass, setFilterClass] = useState<string>("all")
  const [filterPerformance, setFilterPerformance] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  const studentsData = db.listStudents()
  const schoolsData = db.listSchools()
  const classesData = db.listClasses()
  
  const students = Array.isArray(studentsData) ? studentsData : studentsData.data || []
  const schools = Array.isArray(schoolsData) ? schoolsData : schoolsData.data || []
  const classes = Array.isArray(classesData) ? classesData : classesData.data || []
  
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.parentEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSchool = filterSchool === "all" || student.schoolId === filterSchool
    const matchesClass = filterClass === "all" || student.classId === filterClass
    const matchesPerformance = filterPerformance === "all" || student.performanceLevel === filterPerformance
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && student.active) ||
                         (filterStatus === "inactive" && !student.active)
    
    return matchesSearch && matchesSchool && matchesClass && matchesPerformance && matchesStatus
  })

  const totalStudents = students.length
  const activeStudents = students.filter(s => s.active).length
  const excellentPerformers = students.filter(s => s.performanceLevel === "Excellent").length
  const averageGPA = students.length > 0 ? 
    students.reduce((sum, s) => sum + s.currentGPA, 0) / students.length : 0

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId])
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map(s => s.id))
    } else {
      setSelectedStudents([])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">
            Manage student records, track performance, and handle enrollments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Link href="/admin/students/import">
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Create a new student profile and enrollment record.
                </DialogDescription>
              </DialogHeader>
              <AddStudentForm schools={schools} classes={classes} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{activeStudents} active</span> • {totalStudents - activeStudents} inactive
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1 text-green-600" />
              +0.2 from last term
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{excellentPerformers}</div>
            <p className="text-xs text-muted-foreground">
              Excellent performance level
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Enrollments</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
          <CardDescription>
            Search, filter, and manage student records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, email, or parent email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={filterSchool} onValueChange={setFilterSchool}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Schools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {schools.map(school => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterPerformance} onValueChange={setFilterPerformance}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performance</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Average">Average</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedStudents.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium">
                {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Assign Class
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedStudents([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          )}

          {/* Students Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Parent Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={(checked) => handleSelectStudent(student.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{student.studentId}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {schools.find(s => s.id === student.schoolId)?.name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {classes.find(c => c.id === student.classId)?.name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          student.performanceLevel === "Excellent" ? "default" :
                          student.performanceLevel === "Good" ? "secondary" :
                          student.performanceLevel === "Average" ? "outline" :
                          "destructive"
                        }
                      >
                        {student.performanceLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{student.currentGPA.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{student.parentName}</div>
                        <div className="text-muted-foreground">{student.parentEmail}</div>
                        {student.parentPhone && (
                          <div className="text-muted-foreground">{student.parentPhone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.active ? "default" : "secondary"}>
                        {student.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/students/${student.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Student
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BookOpen className="h-4 w-4 mr-2" />
                            View Results
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Contact Parent
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No students found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Student
              </Button>
            </div>
          )}

          {/* Pagination */}
          {filteredStudents.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredStudents.length} of {totalStudents} students
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
