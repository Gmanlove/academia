"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Student, Subject, ClassRoom, ResultEntry } from "@/lib/types"
import {
  Save,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  BarChart3,
  Calculator,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  Copy,
  Eye,
  EyeOff,
  MoreHorizontal,
  History,
  AlertTriangle,
  CheckSquare,
  Square,
  UserCircle,
  Edit2,
  Trash2,
  Plus,
  ArrowUpDown,
  Settings,
  Shield,
  Zap,
  Target,
  Star
} from "lucide-react"

interface ScoreEntry {
  studentId: string
  ca: number | ""
  exam: number | ""
  total: number
  grade: string
  remarks?: string
  modified: boolean
  saved: boolean
  previousCA?: number
  previousExam?: number
  previousTotal?: number
  lastModified?: string
  validationWarnings?: string[]
}

interface BulkOperation {
  type: "copy_ca" | "copy_exam" | "copy_remarks" | "clear_all" | "set_remarks"
  sourceValue?: string | number
  targetStudents: string[]
}

interface ValidationRule {
  field: "ca" | "exam" | "total"
  min: number
  max: number
  warningThreshold?: number
}

interface ScoreHistory {
  studentId: string
  subjectId: string
  term: string
  action: "create" | "update" | "delete"
  oldValues?: Partial<ScoreEntry>
  newValues?: Partial<ScoreEntry>
  timestamp: string
  teacherId: string
}

export default function ScoreEntryPage() {
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("")
  const [selectedTerm, setSelectedTerm] = useState<"Term 1" | "Term 2" | "Term 3">("Term 1")
  const [selectedSession, setSelectedSession] = useState<string>("2024/2025")
  const [scores, setScores] = useState<Record<string, ScoreEntry>>({})
  const [students, setStudents] = useState<Student[]>([])
  const [saving, setSaving] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  // Enhanced state for new features
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [bulkOperationDialogOpen, setBulkOperationDialogOpen] = useState(false)
  const [bulkOperationType, setBulkOperationType] = useState<BulkOperation["type"]>("copy_ca")
  const [bulkValue, setBulkValue] = useState("")
  const [showStudentPhotos, setShowStudentPhotos] = useState(true)
  const [sortField, setSortField] = useState<"name" | "studentId" | "total" | "ca" | "exam">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [validationWarnings, setValidationWarnings] = useState<Record<string, string[]>>({})
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [autoSaveInterval, setAutoSaveInterval] = useState(2000) // 2 seconds default
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const [pendingSubmission, setPendingSubmission] = useState(false)

  // Mock data - in real app, these would come from API
  const classes = db.listClasses()
  const subjects = db.listSubjects()
  const teacherClasses = classes.data.filter(c => c.teacherId === "current-teacher-id") // Mock current teacher
  const classSubjects = subjects.data.filter(s => selectedClassId ? s.classIds?.includes(selectedClassId) : false)

  const selectedClass = classes.data.find(c => c.id === selectedClassId)
  const selectedSubject = subjects.data.find(s => s.id === selectedSubjectId)

  // Validation rules based on subject and class
  const validationRules: ValidationRule[] = [
    { field: "ca", min: 0, max: 30, warningThreshold: 25 },
    { field: "exam", min: 0, max: 70, warningThreshold: 60 },
    { field: "total", min: 0, max: 100, warningThreshold: 80 }
  ]

  // Load students when class is selected
  useEffect(() => {
    if (selectedClassId) {
      const classStudents = db.listStudents().data.filter(s => s.classId === selectedClassId)
      setStudents(classStudents)
      
      // Initialize scores with existing data or empty values
      const initialScores: Record<string, ScoreEntry> = {}
      classStudents.forEach(student => {
        const existingResults = db.getStudentResults(student.id)
        const existingResult = existingResults.find(r => 
          r.subjectId === selectedSubjectId && r.term === selectedTerm
        )
        
        // Get previous term results for comparison
        const previousTerms = ["Term 1", "Term 2", "Term 3"]
        const currentTermIndex = previousTerms.indexOf(selectedTerm)
        const previousTerm = currentTermIndex > 0 ? previousTerms[currentTermIndex - 1] : null
        const previousResult = previousTerm ? 
          existingResults.find(r => r.subjectId === selectedSubjectId && r.term === previousTerm) : null
        
        initialScores[student.id] = {
          studentId: student.id,
          ca: existingResult?.ca ?? "",
          exam: existingResult?.exam ?? "",
          total: existingResult?.total ?? 0,
          grade: existingResult?.grade ?? "",
          remarks: existingResult?.teacherRemark ?? "",
          modified: false,
          saved: !!existingResult,
          previousCA: previousResult?.ca,
          previousExam: previousResult?.exam,
          previousTotal: previousResult?.total,
          lastModified: existingResult?.lastModified,
          validationWarnings: []
        }
      })
      setScores(initialScores)
      setSelectedStudents(new Set()) // Clear selection when class changes
    } else {
      setStudents([])
      setScores({})
      setSelectedStudents(new Set())
    }
  }, [selectedClassId, selectedSubjectId, selectedTerm])

  // Calculate total and grade with enhanced validation
  const calculateScore = useCallback((ca: number | "", exam: number | "") => {
    const caNum = typeof ca === "number" ? ca : 0
    const examNum = typeof exam === "number" ? exam : 0
    const total = caNum + examNum
    
    let grade = "F"
    if (total >= 80) grade = "A"
    else if (total >= 70) grade = "B"
    else if (total >= 60) grade = "C"
    else if (total >= 50) grade = "D"
    
    // Generate validation warnings
    const warnings: string[] = []
    
    // Check for unusually high scores
    if (caNum > 25) warnings.push("CA score is unusually high")
    if (examNum > 60) warnings.push("Exam score is very high")
    
    // Check for dramatic improvements or drops compared to previous term
    // This would be implemented with actual previous scores
    
    return { total, grade, warnings }
  }, [])

  // Update individual score with enhanced features
  const updateScore = (studentId: string, field: "ca" | "exam" | "remarks", value: string | number) => {
    setScores(prev => {
      const current = prev[studentId] || {
        studentId,
        ca: "",
        exam: "",
        total: 0,
        grade: "",
        modified: false,
        saved: false,
        validationWarnings: []
      }

      const updated = { 
        ...current, 
        [field]: value, 
        modified: true,
        lastModified: new Date().toISOString()
      }
      
      if (field === "ca" || field === "exam") {
        const numValue = value === "" ? "" : Number(value)
        updated[field] = numValue
        const { total, grade, warnings } = calculateScore(updated.ca, updated.exam)
        updated.total = total
        updated.grade = grade
        updated.validationWarnings = warnings
        
        // Add to score history
        const historyEntry: ScoreHistory = {
          studentId,
          subjectId: selectedSubjectId,
          term: selectedTerm,
          action: current.saved ? "update" : "create",
          oldValues: { [field]: current[field] },
          newValues: { [field]: numValue },
          timestamp: new Date().toISOString(),
          teacherId: "current-teacher-id"
        }
        setScoreHistory(prev => [historyEntry, ...prev.slice(0, 99)]) // Keep last 100 entries
      }

      return { ...prev, [studentId]: updated }
    })

    // Enhanced validation
    if (field === "ca" && typeof value === "number") {
      const rule = validationRules.find(r => r.field === "ca")
      if (rule) {
        if (value < rule.min || value > rule.max) {
          setValidationErrors(prev => ({
            ...prev,
            [`${studentId}_ca`]: `CA score must be between ${rule.min} and ${rule.max}`
          }))
        } else {
          setValidationErrors(prev => {
            const { [`${studentId}_ca`]: removed, ...rest } = prev
            return rest
          })
          
          // Set warning if above threshold
          if (rule.warningThreshold && value > rule.warningThreshold) {
            setValidationWarnings(prev => ({
              ...prev,
              [`${studentId}_ca`]: [`Score is above ${rule.warningThreshold} (${value})`]
            }))
          } else {
            setValidationWarnings(prev => {
              const { [`${studentId}_ca`]: removed, ...rest } = prev
              return rest
            })
          }
        }
      }
    }

    if (field === "exam" && typeof value === "number") {
      const rule = validationRules.find(r => r.field === "exam")
      if (rule) {
        if (value < rule.min || value > rule.max) {
          setValidationErrors(prev => ({
            ...prev,
            [`${studentId}_exam`]: `Exam score must be between ${rule.min} and ${rule.max}`
          }))
        } else {
          setValidationErrors(prev => {
            const { [`${studentId}_exam`]: removed, ...rest } = prev
            return rest
          })
          
          // Set warning if above threshold
          if (rule.warningThreshold && value > rule.warningThreshold) {
            setValidationWarnings(prev => ({
              ...prev,
              [`${studentId}_exam`]: [`Score is above ${rule.warningThreshold} (${value})`]
            }))
          } else {
            setValidationWarnings(prev => {
              const { [`${studentId}_exam`]: removed, ...rest } = prev
              return rest
            })
          }
        }
      }
    }
  }

  // Enhanced auto-save functionality
  useEffect(() => {
    const modifiedEntries = Object.values(scores).filter(s => s.modified && !s.saved)
    
    if (modifiedEntries.length > 0) {
      const timer = setTimeout(async () => {
        setAutoSaving(true)
        try {
          // Mock auto-save - in real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 800))
          
          setScores(prev => {
            const updated = { ...prev }
            modifiedEntries.forEach(entry => {
              updated[entry.studentId] = { 
                ...entry, 
                saved: true, 
                modified: false,
                lastModified: new Date().toISOString()
              }
            })
            return updated
          })
          
          console.log(`Auto-saved ${modifiedEntries.length} entries`)
        } catch (error) {
          console.error("Auto-save failed:", error)
        } finally {
          setAutoSaving(false)
        }
      }, autoSaveInterval)

      return () => clearTimeout(timer)
    }
  }, [scores, autoSaveInterval])

  // Bulk operations
  const handleBulkOperation = (operation: BulkOperation) => {
    setScores(prev => {
      const updated = { ...prev }
      
      operation.targetStudents.forEach(studentId => {
        const current = updated[studentId] || {
          studentId,
          ca: "",
          exam: "",
          total: 0,
          grade: "",
          modified: false,
          saved: false,
          validationWarnings: []
        }
        
        switch (operation.type) {
          case "copy_ca":
            if (typeof operation.sourceValue === "number") {
              const { total, grade, warnings } = calculateScore(operation.sourceValue, current.exam)
              updated[studentId] = {
                ...current,
                ca: operation.sourceValue,
                total,
                grade,
                validationWarnings: warnings,
                modified: true,
                lastModified: new Date().toISOString()
              }
            }
            break
            
          case "copy_exam":
            if (typeof operation.sourceValue === "number") {
              const { total, grade, warnings } = calculateScore(current.ca, operation.sourceValue)
              updated[studentId] = {
                ...current,
                exam: operation.sourceValue,
                total,
                grade,
                validationWarnings: warnings,
                modified: true,
                lastModified: new Date().toISOString()
              }
            }
            break
            
          case "copy_remarks":
            if (typeof operation.sourceValue === "string") {
              updated[studentId] = {
                ...current,
                remarks: operation.sourceValue,
                modified: true,
                lastModified: new Date().toISOString()
              }
            }
            break
            
          case "clear_all":
            updated[studentId] = {
              ...current,
              ca: "",
              exam: "",
              total: 0,
              grade: "",
              remarks: "",
              modified: true,
              lastModified: new Date().toISOString()
            }
            break
            
          case "set_remarks":
            if (typeof operation.sourceValue === "string") {
              updated[studentId] = {
                ...current,
                remarks: operation.sourceValue,
                modified: true,
                lastModified: new Date().toISOString()
              }
            }
            break
        }
      })
      
      return updated
    })
    
    setSelectedStudents(new Set())
    setBulkOperationDialogOpen(false)
    setBulkValue("")
  }

  // Student selection handlers
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev)
      if (newSet.has(studentId)) {
        newSet.delete(studentId)
      } else {
        newSet.add(studentId)
      }
      return newSet
    })
  }

  const selectAllStudents = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set())
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)))
    }
  }

  // Enhanced save all scores with confirmation
  const saveAllScores = async () => {
    if (Object.values(validationErrors).length > 0) {
      alert("Please fix validation errors before saving.")
      return
    }
    
    setConfirmationDialogOpen(true)
  }

  const confirmSaveAllScores = async () => {
    setSaving(true)
    setConfirmationDialogOpen(false)
    
    try {
      const entriesToSave = Object.values(scores)
        .filter(s => s.ca !== "" || s.exam !== "" || s.remarks)
        .map(s => ({
          studentId: s.studentId,
          classId: selectedClassId,
          subjectId: selectedSubjectId,
          ca: typeof s.ca === "number" ? s.ca : 0,
          exam: typeof s.exam === "number" ? s.exam : 0,
          total: s.total,
          grade: s.grade,
          term: selectedTerm,
          session: selectedSession,
          teacherRemark: s.remarks || "",
          lastModified: new Date().toISOString(),
          teacherId: "current-teacher-id"
        }))

      // Mock API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mark all as saved
      setScores(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(studentId => {
          updated[studentId] = { 
            ...updated[studentId], 
            saved: true, 
            modified: false,
            lastModified: new Date().toISOString()
          }
        })
        return updated
      })

      // Add success notification (in real app, use toast/notification system)
      alert(`✅ Successfully saved scores for ${entriesToSave.length} students`)
      
    } catch (error) {
      alert("❌ Error saving scores. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  // Enhanced filtering and sorting
  const filteredAndSortedStudents = students
    .filter(student => {
      const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (!matchesSearch) return false
      
      if (showOnlyIncomplete) {
        const score = scores[student.id]
        return !score || score.ca === "" || score.exam === ""
      }
      
      return true
    })
    .sort((a, b) => {
      let aValue, bValue
      
      switch (sortField) {
        case "name":
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase()
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase()
          break
        case "studentId":
          aValue = a.studentId.toLowerCase()
          bValue = b.studentId.toLowerCase()
          break
        case "total":
          aValue = scores[a.id]?.total || 0
          bValue = scores[b.id]?.total || 0
          break
        case "ca":
          aValue = typeof scores[a.id]?.ca === "number" ? scores[a.id].ca : -1
          bValue = typeof scores[b.id]?.ca === "number" ? scores[b.id].ca : -1
          break
        case "exam":
          aValue = typeof scores[a.id]?.exam === "number" ? scores[a.id].exam : -1
          bValue = typeof scores[b.id]?.exam === "number" ? scores[b.id].exam : -1
          break
        default:
          aValue = a.firstName
          bValue = b.firstName
      }
      
      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  // Enhanced statistics calculation
  const stats = {
    totalStudents: students.length,
    completedEntries: Object.values(scores).filter(s => s.ca !== "" && s.exam !== "").length,
    averageCA: Object.values(scores)
      .filter(s => typeof s.ca === "number")
      .reduce((sum, s) => sum + (s.ca as number), 0) / 
      Object.values(scores).filter(s => typeof s.ca === "number").length || 0,
    averageExam: Object.values(scores)
      .filter(s => typeof s.exam === "number")
      .reduce((sum, s) => sum + (s.exam as number), 0) / 
      Object.values(scores).filter(s => typeof s.exam === "number").length || 0,
    averageTotal: Object.values(scores)
      .filter(s => s.total > 0)
      .reduce((sum, s) => sum + s.total, 0) / 
      Object.values(scores).filter(s => s.total > 0).length || 0,
    passRate: Object.values(scores)
      .filter(s => s.total >= 50).length / 
      Object.values(scores).filter(s => s.total > 0).length * 100 || 0,
    gradeDistribution: {
      A: Object.values(scores).filter(s => s.grade === "A").length,
      B: Object.values(scores).filter(s => s.grade === "B").length,
      C: Object.values(scores).filter(s => s.grade === "C").length,
      D: Object.values(scores).filter(s => s.grade === "D").length,
      F: Object.values(scores).filter(s => s.grade === "F").length,
    },
    modifiedCount: Object.values(scores).filter(s => s.modified).length,
    savedCount: Object.values(scores).filter(s => s.saved).length,
    warningsCount: Object.values(validationWarnings).flat().length + 
                   Object.values(scores).reduce((acc, s) => acc + (s.validationWarnings?.length || 0), 0)
  }

  const completionPercent = students.length > 0 ? 
    (stats.completedEntries / students.length * 100) : 0

  // Helper functions
  const getStudentPhoto = (student: Student) => {
    // In real app, this would return actual photo URL
    return "/placeholder-user.jpg"
  }

  const getGradeBadgeVariant = (grade: string) => {
    switch (grade) {
      case "A": return "default"
      case "B": return "secondary"  
      case "C": return "outline"
      case "D": return "secondary"
      case "F": return "destructive"
      default: return "outline"
    }
  }

  const getPerformanceComparison = (current: number, previous?: number) => {
    if (!previous) return null
    const diff = current - previous
    if (Math.abs(diff) < 2) return { type: "stable", diff }
    return { type: diff > 0 ? "improved" : "declined", diff }
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calculator className="h-8 w-8 text-primary" />
            📝 Score Entry & Management
          </h1>
          <p className="text-muted-foreground">
            Intuitive score entry with real-time calculation, validation, and auto-save
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {autoSaving && (
            <Badge variant="secondary" className="flex items-center space-x-1 animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Auto-saving...</span>
            </Badge>
          )}
          {stats.modifiedCount > 0 && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{stats.modifiedCount} unsaved changes</span>
            </Badge>
          )}
          {stats.warningsCount > 0 && (
            <Badge variant="destructive" className="flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3" />
              <span>{stats.warningsCount} warnings</span>
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center space-x-1"
          >
            <History className="h-4 w-4" />
            <span>History</span>
          </Button>
          <Button
            onClick={saveAllScores}
            disabled={saving || !selectedClassId || !selectedSubjectId || stats.modifiedCount === 0}
            className="flex items-center space-x-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? "Saving..." : `Save All (${stats.modifiedCount})`}</span>
          </Button>
        </div>
      </div>

      {/* Enhanced Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>Class & Subject Selection</span>
          </CardTitle>
          <CardDescription>
            Select the class, subject, and academic period for score entry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class..." />
                </SelectTrigger>
                <SelectContent>
                  {teacherClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.capacity} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={selectedSubjectId} 
                onValueChange={setSelectedSubjectId}
                disabled={!selectedClassId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject..." />
                </SelectTrigger>
                <SelectContent>
                  {classSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Term</Label>
              <Select value={selectedTerm} onValueChange={(value: any) => setSelectedTerm(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Term 1">Term 1</SelectItem>
                  <SelectItem value="Term 2">Term 2</SelectItem>
                  <SelectItem value="Term 3">Term 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session">Session</Label>
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
          </div>
          
          {selectedClassId && selectedSubjectId && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
              <div className="flex items-center space-x-2 text-blue-800">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">
                  Ready to enter scores for {selectedClass?.name} - {selectedSubject?.name} ({selectedTerm})
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedClassId && selectedSubjectId && (
        <>
          {/* Enhanced Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalStudents}</p>
                    <p className="text-muted-foreground">Total Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.completedEntries}</p>
                    <p className="text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.averageCA.toFixed(1)}</p>
                    <p className="text-muted-foreground">Avg CA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.averageExam.toFixed(1)}</p>
                    <p className="text-muted-foreground">Avg Exam</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-8 w-8 text-indigo-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.averageTotal.toFixed(1)}</p>
                    <p className="text-muted-foreground">Avg Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.passRate.toFixed(1)}%</p>
                    <p className="text-muted-foreground">Pass Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Grade Distribution & Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Completion Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Entry Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.completedEntries} of {stats.totalStudents} students
                      </span>
                    </div>
                    <Progress value={completionPercent} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      {completionPercent.toFixed(1)}% completed
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Grade Distribution</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
                      <div key={grade} className="text-center">
                        <div className={`w-full h-8 rounded flex items-center justify-center text-white text-sm font-bold ${
                          grade === 'A' ? 'bg-green-500' :
                          grade === 'B' ? 'bg-blue-500' :
                          grade === 'C' ? 'bg-yellow-500' :
                          grade === 'D' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}>
                          {count}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{grade}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Filters and Controls */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="incomplete"
                      checked={showOnlyIncomplete}
                      onCheckedChange={setShowOnlyIncomplete}
                    />
                    <Label htmlFor="incomplete">Show only incomplete</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-photos"
                      checked={showStudentPhotos}
                      onCheckedChange={setShowStudentPhotos}
                    />
                    <Label htmlFor="show-photos">Show photos</Label>
                  </div>
                  
                  <Select value={sortField} onValueChange={(value: any) => setSortField(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="studentId">ID</SelectItem>
                      <SelectItem value="total">Total</SelectItem>
                      <SelectItem value="ca">CA</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                  
                  {selectedStudents.size > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBulkOperationDialogOpen(true)}
                      className="flex items-center space-x-1"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Bulk ({selectedStudents.size})</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Score Entry Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Score Entry - {selectedClass?.name} - {selectedSubject?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllStudents}
                    className="flex items-center space-x-1"
                  >
                    {selectedStudents.size === filteredAndSortedStudents.length ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                    <span>Select All</span>
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Enter CA scores (0-30) and Exam scores (0-70). Total and grade are calculated automatically.
                {stats.modifiedCount > 0 && (
                  <span className="text-orange-600 font-medium ml-2">
                    • {stats.modifiedCount} unsaved changes
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedStudents.size === filteredAndSortedStudents.length && filteredAndSortedStudents.length > 0}
                          onCheckedChange={selectAllStudents}
                        />
                      </TableHead>
                      <TableHead className="w-[60px]">#</TableHead>
                      {showStudentPhotos && <TableHead className="w-[60px]">Photo</TableHead>}
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">CA (30)</TableHead>
                      <TableHead className="text-center">Exam (70)</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedStudents.map((student, index) => {
                      const score = scores[student.id] || {
                        studentId: student.id,
                        ca: "",
                        exam: "",
                        total: 0,
                        grade: "",
                        modified: false,
                        saved: false,
                        validationWarnings: []
                      }

                      const isSelected = selectedStudents.has(student.id)
                      const hasWarnings = (score.validationWarnings?.length || 0) > 0 || 
                                        validationWarnings[`${student.id}_ca`] || 
                                        validationWarnings[`${student.id}_exam`]
                      const hasErrors = validationErrors[`${student.id}_ca`] || 
                                       validationErrors[`${student.id}_exam`]

                      return (
                        <TableRow 
                          key={student.id} 
                          className={`${isSelected ? 'bg-blue-50' : ''} ${hasErrors ? 'bg-red-50' : ''} ${hasWarnings ? 'bg-yellow-50' : ''}`}
                        >
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleStudentSelection(student.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          
                          {showStudentPhotos && (
                            <TableCell>
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                                <img
                                  src={getStudentPhoto(student)}
                                  alt={`${student.firstName} ${student.lastName}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </TableCell>
                          )}
                          
                          <TableCell className="font-mono">{student.studentId}</TableCell>
                          <TableCell className="font-medium">
                            <div>
                              {student.firstName} {student.lastName}
                              {score.previousTotal && (
                                <div className="text-xs text-muted-foreground">
                                  Previous: {score.previousTotal}
                                  {(() => {
                                    const comparison = getPerformanceComparison(score.total, score.previousTotal)
                                    if (comparison) {
                                      return (
                                        <span className={`ml-1 ${
                                          comparison.type === 'improved' ? 'text-green-600' :
                                          comparison.type === 'declined' ? 'text-red-600' :
                                          'text-gray-600'
                                        }`}>
                                          ({comparison.diff > 0 ? '+' : ''}{comparison.diff.toFixed(1)})
                                        </span>
                                      )
                                    }
                                    return null
                                  })()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-center">
                            <div className="space-y-1">
                              <Input
                                type="number"
                                min="0"
                                max="30"
                                step="0.5"
                                value={score.ca}
                                onChange={(e) => updateScore(student.id, "ca", e.target.value === "" ? "" : Number(e.target.value))}
                                className={`w-20 text-center ${
                                  validationErrors[`${student.id}_ca`] ? "border-red-500" : 
                                  validationWarnings[`${student.id}_ca`] ? "border-yellow-500" : ""
                                }`}
                                placeholder="0"
                              />
                              {validationErrors[`${student.id}_ca`] && (
                                <p className="text-xs text-red-500">
                                  {validationErrors[`${student.id}_ca`]}
                                </p>
                              )}
                              {validationWarnings[`${student.id}_ca`] && (
                                <p className="text-xs text-yellow-600">
                                  ⚠️ {validationWarnings[`${student.id}_ca`][0]}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-center">
                            <div className="space-y-1">
                              <Input
                                type="number"
                                min="0"
                                max="70"
                                step="0.5"
                                value={score.exam}
                                onChange={(e) => updateScore(student.id, "exam", e.target.value === "" ? "" : Number(e.target.value))}
                                className={`w-20 text-center ${
                                  validationErrors[`${student.id}_exam`] ? "border-red-500" : 
                                  validationWarnings[`${student.id}_exam`] ? "border-yellow-500" : ""
                                }`}
                                placeholder="0"
                              />
                              {validationErrors[`${student.id}_exam`] && (
                                <p className="text-xs text-red-500">
                                  {validationErrors[`${student.id}_exam`]}
                                </p>
                              )}
                              {validationWarnings[`${student.id}_exam`] && (
                                <p className="text-xs text-yellow-600">
                                  ⚠️ {validationWarnings[`${student.id}_exam`][0]}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-center">
                            <div className="font-bold">
                              {score.total > 0 ? (
                                <span className={
                                  score.total >= 70 ? 'text-green-600' :
                                  score.total >= 50 ? 'text-blue-600' :
                                  'text-red-600'
                                }>
                                  {score.total.toFixed(1)}
                                </span>
                              ) : "—"}
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-center">
                            {score.grade && (
                              <Badge variant={getGradeBadgeVariant(score.grade)}>
                                {score.grade}
                              </Badge>
                            )}
                          </TableCell>
                          
                          <TableCell>
                            <Input
                              placeholder="Optional remarks..."
                              value={score.remarks || ""}
                              onChange={(e) => updateScore(student.id, "remarks", e.target.value)}
                              className="w-full"
                            />
                          </TableCell>
                          
                          <TableCell className="text-center">
                            <div className="flex flex-col space-y-1">
                              {score.saved && !score.modified ? (
                                <Badge variant="default" className="flex items-center space-x-1">
                                  <CheckCircle className="h-3 w-3" />
                                  <span>Saved</span>
                                </Badge>
                              ) : score.modified ? (
                                <Badge variant="secondary" className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Modified</span>
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  Not started
                                </Badge>
                              )}
                              
                              {score.validationWarnings && score.validationWarnings.length > 0 && (
                                <Badge variant="destructive" className="flex items-center space-x-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span>Warnings</span>
                                </Badge>
                              )}
                              
                              {score.lastModified && (
                                <p className="text-xs text-muted-foreground">
                                  {new Date(score.lastModified).toLocaleTimeString()}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => {
                                  // Copy CA to all selected students
                                  if (typeof score.ca === "number" && selectedStudents.size > 0) {
                                    handleBulkOperation({
                                      type: "copy_ca",
                                      sourceValue: score.ca,
                                      targetStudents: Array.from(selectedStudents)
                                    })
                                  }
                                }}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy CA to Selected
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  // Copy Exam to all selected students
                                  if (typeof score.exam === "number" && selectedStudents.size > 0) {
                                    handleBulkOperation({
                                      type: "copy_exam",
                                      sourceValue: score.exam,
                                      targetStudents: Array.from(selectedStudents)
                                    })
                                  }
                                }}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Exam to Selected
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  // Clear this student's scores
                                  handleBulkOperation({
                                    type: "clear_all",
                                    targetStudents: [student.id]
                                  })
                                }}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Clear Scores
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              
              {filteredAndSortedStudents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No students match your search." : "No students in this class."}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Bulk Operations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Batch Operations & Tools</span>
              </CardTitle>
              <CardDescription>
                Perform operations on multiple students at once and manage score data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Import/Export</h4>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" className="flex items-center justify-start space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Import Scores (CSV)</span>
                    </Button>
                    <Button variant="outline" className="flex items-center justify-start space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Export Template</span>
                    </Button>
                    <Button variant="outline" className="flex items-center justify-start space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Export Current Scores</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Reports & Analysis</h4>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" className="flex items-center justify-start space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Generate Class Report</span>
                    </Button>
                    <Button variant="outline" className="flex items-center justify-start space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Performance Analytics</span>
                    </Button>
                    <Button variant="outline" className="flex items-center justify-start space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Comparison Report</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Settings & Preferences</h4>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-save">Auto-save interval (ms)</Label>
                      <Input
                        id="auto-save"
                        type="number"
                        min="1000"
                        max="10000"
                        step="500"
                        value={autoSaveInterval}
                        onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <Button variant="outline" className="flex items-center justify-start space-x-2">
                      <RefreshCw className="h-4 w-4" />
                      <span>Reload Data</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Operations Dialog */}
          <Dialog open={bulkOperationDialogOpen} onOpenChange={setBulkOperationDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Operations</DialogTitle>
                <DialogDescription>
                  Apply operations to {selectedStudents.size} selected student(s)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="operation-type">Operation Type</Label>
                  <Select value={bulkOperationType} onValueChange={(value: any) => setBulkOperationType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="copy_ca">Copy CA Score</SelectItem>
                      <SelectItem value="copy_exam">Copy Exam Score</SelectItem>
                      <SelectItem value="copy_remarks">Copy Remarks</SelectItem>
                      <SelectItem value="set_remarks">Set Remarks</SelectItem>
                      <SelectItem value="clear_all">Clear All Scores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(bulkOperationType === "copy_ca" || bulkOperationType === "copy_exam") && (
                  <div>
                    <Label htmlFor="bulk-score">
                      {bulkOperationType === "copy_ca" ? "CA Score (0-30)" : "Exam Score (0-70)"}
                    </Label>
                    <Input
                      id="bulk-score"
                      type="number"
                      min="0"
                      max={bulkOperationType === "copy_ca" ? "30" : "70"}
                      step="0.5"
                      value={bulkValue}
                      onChange={(e) => setBulkValue(e.target.value)}
                      placeholder="Enter score"
                    />
                  </div>
                )}
                
                {(bulkOperationType === "copy_remarks" || bulkOperationType === "set_remarks") && (
                  <div>
                    <Label htmlFor="bulk-remarks">Remarks</Label>
                    <Textarea
                      id="bulk-remarks"
                      value={bulkValue}
                      onChange={(e) => setBulkValue(e.target.value)}
                      placeholder="Enter remarks"
                      rows={3}
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBulkOperationDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const sourceValue = bulkOperationType === "copy_ca" || bulkOperationType === "copy_exam" 
                      ? Number(bulkValue) 
                      : bulkValue
                    handleBulkOperation({
                      type: bulkOperationType,
                      sourceValue,
                      targetStudents: Array.from(selectedStudents)
                    })
                  }}
                  disabled={
                    !bulkValue && bulkOperationType !== "clear_all" ||
                    selectedStudents.size === 0
                  }
                >
                  Apply to {selectedStudents.size} student(s)
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Save Confirmation Dialog */}
          <Dialog open={confirmationDialogOpen} onOpenChange={setConfirmationDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Save Operation</DialogTitle>
                <DialogDescription>
                  You are about to save scores for {stats.modifiedCount} students.
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Review Summary:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• Modified entries: {stats.modifiedCount}</li>
                      <li>• Validation warnings: {stats.warningsCount}</li>
                      <li>• Class average (current): {stats.averageTotal.toFixed(1)}</li>
                      <li>• Pass rate: {stats.passRate.toFixed(1)}%</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmationDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmSaveAllScores}>
                  Confirm Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {!selectedClassId && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calculator className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">📝 Smart Score Entry System</h3>
            <p className="text-muted-foreground mb-4">
              Choose a class and subject from the dropdown menus above to start entering scores with our enhanced interface.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm">
              <div className="p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-blue-800">Auto-Save</h4>
                <p className="text-blue-700">Automatic saving prevents data loss</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <Target className="h-6 w-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-green-800">Real-time Calculation</h4>
                <p className="text-green-700">Instant total and grade calculation</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-purple-800">Bulk Operations</h4>
                <p className="text-purple-700">Efficient batch score management</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
