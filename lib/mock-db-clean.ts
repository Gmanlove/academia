import { randomUUID } from "crypto"
import type {
  AdminDashboardStats,
  Brand,
  ClassRoom,
  ID,
  NotificationItem,
  ResultEntry,
  School,
  Student,
  Subject,
  Teacher,
  TokenRecord,
  PricingPlan,
  ActivityLog,
  Assessment,
  NotificationTemplate,
  Report,
  BulkImport,
  Analytics,
  Token,
  PaymentRecord,
  SystemConfig,
} from "./types"

function uid() {
  try {
    return randomUUID()
  } catch {
    return Math.random().toString(36).slice(2)
  }
}

const brands: Brand[] = ["Acme", "Contoso", "Globex"]
const now = () => new Date().toISOString()

// Enhanced seed data
const schools: School[] = [
  {
    id: uid(),
    name: "Acme High School",
    brand: "Acme",
    contactEmail: "admin@acmehigh.edu",
    contactPhone: "+234-803-123-4567",
    address: "123 Education Street, Lagos, Nigeria",
    website: "https://acmehigh.edu",
    createdAt: now(),
    active: true,
    plan: "Pro",
    maxStudents: 500,
    currentStudentCount: 120,
    currentBilling: {
      plan: "Pro",
      amount: 75000,
      billingCycle: "annual",
      nextBilling: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
      paymentMethod: "Bank Transfer",
      paymentStatus: "Active",
    },
    stats: { 
      students: 120, 
      teachers: 8, 
      classes: 6, 
      subjects: 12, 
      averagePerformance: 74.5,
      lastResultSubmission: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    adminAssigned: "jane@acme.com",
    settings: {
      gradingScale: ["A", "B", "C", "D", "F"],
      terms: ["Term 1", "Term 2", "Term 3"],
      academicYear: "2024/2025",
      allowParentAccess: true,
      smsCredits: 1000,
      maxCA: 30,
      maxExam: 70,
      passingGrade: 50,
      resultVisibility: "Token",
      notificationChannels: ["Email", "SMS", "App"],
    },
  },
  {
    id: uid(),
    name: "Contoso Junior School",
    brand: "Contoso",
    contactEmail: "info@contosojunior.edu",
    contactPhone: "+234-802-987-6543",
    address: "456 Learning Avenue, Abuja, Nigeria",
    createdAt: now(),
    active: true,
    plan: "Basic",
    maxStudents: 200,
    currentStudentCount: 85,
    currentBilling: {
      plan: "Basic",
      amount: 25500,
      billingCycle: "annual",
      nextBilling: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString(),
      paymentMethod: "Bank Transfer",
      paymentStatus: "Active",
    },
    stats: { 
      students: 85, 
      teachers: 6, 
      classes: 5, 
      subjects: 8, 
      averagePerformance: 68.2,
      lastResultSubmission: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    settings: {
      gradingScale: ["Excellent", "Good", "Fair", "Poor"],
      terms: ["First Term", "Second Term", "Third Term"],
      academicYear: "2024/2025",
      allowParentAccess: true,
      smsCredits: 500,
      maxCA: 40,
      maxExam: 60,
      passingGrade: 45,
      resultVisibility: "Public",
      notificationChannels: ["Email", "SMS"],
    },
  },
]

const subjects: Subject[] = [
  { 
    id: uid(), 
    code: "MTH", 
    name: "Mathematics", 
    schoolId: schools[0].id, 
    teacherIds: [], 
    classIds: [],
    isCore: true,
    creditHours: 4,
    description: "Mathematical concepts and problem solving",
    passingGrade: 50,
    performance: {
      averageCA: 24,
      averageExam: 58,
      passRate: 78,
      difficulty: "Medium",
    }
  },
  { 
    id: uid(), 
    code: "ENG", 
    name: "English Language", 
    schoolId: schools[0].id, 
    teacherIds: [], 
    classIds: [],
    isCore: true,
    creditHours: 4,
    description: "Language and communication skills",
    passingGrade: 50,
    performance: {
      averageCA: 26,
      averageExam: 62,
      passRate: 82,
      difficulty: "Easy",
    }
  },
]

const classes: ClassRoom[] = [
  {
    id: uid(),
    name: "JSS 1A",
    schoolId: schools[0].id,
    level: "Junior",
    section: "A",
    teacherId: uid(),
    studentCount: 25,
    maxCapacity: 30,
    subjects: [],
    schedule: [],
    academicYear: "2024/2025",
    term: "Term 1",
    active: true,
    performance: {
      averageScore: 72.5,
      attendance: 89.2,
      topPerformer: "STU20241001",
      subjectPerformance: [],
    }
  },
]

const teachers: Teacher[] = [
  {
    id: uid(),
    teacherId: "TCH20241001",
    name: "John Smith",
    email: "john.smith@acmehigh.edu",
    phone: "+234-803-555-0101",
    schoolId: schools[0].id,
    subjects: ["Mathematics", "Physics"],
    classes: ["JSS 1A", "JSS 2A"],
    dateJoined: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
    qualification: "B.Sc Mathematics, M.Ed Education",
    experience: 5,
    active: true,
    salary: 180000,
    address: "789 Teacher Street, Lagos",
    emergencyContact: {
      name: "Jane Smith",
      phone: "+234-803-555-0102",
      relationship: "Spouse"
    },
    performance: {
      rating: 4.2,
      studentsAvgScore: 78.5,
      attendanceRate: 96.8,
      punctuality: 94.2,
      feedback: "Excellent teacher with great rapport with students"
    }
  },
]

const students: Student[] = [
  {
    id: uid(),
    studentId: "STU20241001",
    name: "Alice Johnson",
    email: "alice.johnson@student.acmehigh.edu",
    dateOfBirth: "2010-05-15",
    gender: "Female",
    schoolId: schools[0].id,
    classId: classes[0].id,
    enrollmentDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    parentName: "Robert Johnson",
    parentEmail: "robert.johnson@email.com",
    parentPhone: "+234-803-555-0201",
    address: "456 Student Avenue, Lagos",
    active: true,
    performanceLevel: "Good",
    currentGPA: 3.2,
    medicalInfo: {
      allergies: ["Peanuts"],
      medications: [],
      emergencyContact: {
        name: "Sarah Johnson",
        phone: "+234-803-555-0202",
        relationship: "Mother"
      }
    },
    documents: {
      birthCertificate: true,
      transcripts: true,
      medicalRecords: true,
      passport: "/uploads/students/STU20241001/passport.jpg"
    }
  },
]

const results: ResultEntry[] = [
  {
    id: uid(),
    studentId: students[0].id,
    subjectId: subjects[0].id,
    teacherId: teachers[0].id,
    term: "Term 1",
    session: "2024/2025",
    ca: 25,
    exam: 68,
    total: 93,
    grade: "A",
    position: 3,
    classAverage: 72.5,
    submittedBy: teachers[0].id,
    submittedAt: now(),
    remarks: "Excellent performance, keep it up!",
    isPublished: true,
    skills: {
      punctuality: "Good",
      neatness: "Excellent", 
      leadership: "Good",
      honesty: "Excellent",
      relationship: "Good"
    }
  },
]

const notifications: NotificationItem[] = [
  {
    id: uid(),
    type: "Grade Release",
    title: "Term 1 Results Published",
    message: "Term 1 examination results have been published and are now available for viewing.",
    schoolId: schools[0].id,
    recipients: ["all_parents"],
    channels: ["Email", "SMS", "App"],
    status: "Delivered",
    priority: "High",
    scheduledAt: now(),
    createdAt: now(),
    stats: {
      sent: 120,
      delivered: 118,
      failed: 2,
      opened: 89,
      clicked: 45
    }
  },
]

const tokens: TokenRecord[] = [
  {
    id: uid(),
    studentId: students[0].studentId,
    attempts: 0,
    maxAttempts: 5,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    createdAt: now(),
    isActive: true,
  }
]

// Database operations
export const db = {
  // Schools
  listSchools() {
    return [...schools]
  },

  getSchool(id: ID) {
    return schools.find((s) => s.id === id)
  },

  addSchool(payload: Omit<School, "id" | "createdAt">) {
    const school: School = { 
      id: uid(), 
      createdAt: now(), 
      ...payload 
    }
    schools.push(school)
    return school
  },

  updateSchool(id: ID, payload: Partial<Omit<School, "id">>) {
    const school = schools.find((s) => s.id === id)
    if (school) {
      Object.assign(school, payload)
    }
    return school
  },

  deleteSchool(id: ID) {
    const index = schools.findIndex((s) => s.id === id)
    if (index !== -1) {
      schools.splice(index, 1)
      return true
    }
    return false
  },

  // Students with enhanced filtering
  listStudents(params?: {
    schoolId?: ID
    classId?: ID
    search?: string
    active?: boolean
    performanceLevel?: "Poor" | "Average" | "Good" | "Excellent"
  }) {
    let data = [...students]
    if (params?.schoolId) data = data.filter((s) => s.schoolId === params.schoolId)
    if (params?.classId) data = data.filter((s) => s.classId === params.classId)
    if (params?.search) {
      const search = params.search.toLowerCase()
      data = data.filter((s) => 
        s.name.toLowerCase().includes(search) || 
        s.studentId.toLowerCase().includes(search) ||
        s.email?.toLowerCase().includes(search)
      )
    }
    if (typeof params?.active === "boolean") data = data.filter((s) => s.active === params.active)
    if (params?.performanceLevel) data = data.filter((s) => s.performanceLevel === params.performanceLevel)
    return data
  },

  getStudent(id: ID) {
    return students.find((s) => s.id === id)
  },

  addStudent(payload: Omit<Student, "id">) {
    const student: Student = { id: uid(), ...payload }
    students.push(student)
    
    // Update class student count
    const cls = classes.find(c => c.id === student.classId)
    if (cls) cls.studentCount++
    
    return student
  },

  updateStudent(id: ID, payload: Partial<Omit<Student, "id">>) {
    const student = students.find((s) => s.id === id)
    if (student) {
      Object.assign(student, payload)
    }
    return student
  },

  deleteStudent(id: ID) {
    const index = students.findIndex((s) => s.id === id)
    if (index !== -1) {
      const student = students[index]
      
      // Update class student count
      const cls = classes.find(c => c.id === student.classId)
      if (cls && cls.studentCount > 0) cls.studentCount--
      
      students.splice(index, 1)
      return true
    }
    return false
  },

  bulkImportStudents(payload: Omit<Student, "id">[]) {
    return payload.map((p) => this.addStudent(p))
  },

  getStudentResults(studentId: ID) {
    return results.filter((r) => r.studentId === studentId)
  },

  // Teachers
  listTeachers(params?: { active?: boolean; schoolId?: ID }) {
    let data = [...teachers]
    if (typeof params?.active === "boolean") data = data.filter((t) => t.active === params.active)
    if (params?.schoolId) data = data.filter((t) => t.schoolId === params.schoolId)
    return data
  },

  getTeacher(id: ID) {
    return teachers.find((t) => t.id === id)
  },

  // Classes
  listClasses(params?: { schoolId?: ID }) {
    let data = [...classes]
    if (params?.schoolId) data = data.filter((c) => c.schoolId === params.schoolId)
    return data
  },

  getClass(id: ID) {
    return classes.find((c) => c.id === id)
  },

  // Subjects
  listSubjects(params?: { schoolId?: ID }) {
    let data = [...subjects]
    if (params?.schoolId) data = data.filter((s) => s.schoolId === params.schoolId)
    return data
  },

  getSubject(id: ID) {
    return subjects.find((s) => s.id === id)
  },

  // Results
  listResults(params?: { studentId?: ID; schoolId?: ID; classId?: ID; subjectId?: ID }) {
    let data = [...results]
    if (params?.studentId) data = data.filter((r) => r.studentId === params.studentId)
    if (params?.schoolId) {
      const schoolStudents = students.filter(s => s.schoolId === params.schoolId).map(s => s.id)
      data = data.filter((r) => schoolStudents.includes(r.studentId))
    }
    if (params?.classId) {
      const classStudents = students.filter(s => s.classId === params.classId).map(s => s.id)
      data = data.filter((r) => classStudents.includes(r.studentId))
    }
    if (params?.subjectId) data = data.filter((r) => r.subjectId === params.subjectId)
    return data
  },

  // Notifications
  listNotifications(params?: { schoolId?: ID }) {
    let data = [...notifications]
    if (params?.schoolId) data = data.filter((n) => n.schoolId === params.schoolId)
    return data
  },

  addNotification(payload: Omit<NotificationItem, "id" | "createdAt" | "status"> & { status?: NotificationItem["status"] }) {
    const n: NotificationItem = { 
      id: uid(), 
      createdAt: now(), 
      status: payload.status ?? "Scheduled", 
      ...payload 
    }
    notifications.push(n)
    return n
  },

  // Tokens
  findTokenByStudentPublicId(studentPublicId: string) {
    return tokens.find((t) => t.studentId === studentPublicId)
  },

  createToken(studentPublicId: string) {
    const rec: TokenRecord = {
      id: uid(),
      studentId: studentPublicId,
      attempts: 0,
      maxAttempts: 5,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      createdAt: now(),
      isActive: true,
    }
    tokens.push(rec)
    return rec
  },

  incrementTokenAttempt(id: ID) {
    const t = tokens.find((x) => x.id === id)
    if (t) t.attempts++
    return t
  },

  // Dashboard
  getAdminDashboard(): AdminDashboardStats {
    const totalStudents = students.length
    const totalTeachers = teachers.length
    const totalClasses = classes.length
    const totalSchools = schools.length
    const teachersActive = teachers.filter((t) => t.active).length
    const teachersInactive = totalTeachers - teachersActive

    const byGradeMap = new Map<string, number>()
    classes.forEach((c) => {
      byGradeMap.set(c.level, (byGradeMap.get(c.level) ?? 0) + c.studentCount)
    })
    const byGrade = Array.from(byGradeMap.entries()).map(([grade, count]) => ({ grade, count }))

    const subjectAverages = new Map<string, { total: number; count: number }>()
    results.forEach((r) => {
      const subj = subjects.find((s) => s.id === r.subjectId)
      if (!subj) return
      const k = subj.name
      const prev = subjectAverages.get(k) ?? { total: 0, count: 0 }
      subjectAverages.set(k, { total: prev.total + r.total, count: prev.count + 1 })
    })
    const subjectDistribution = Array.from(subjectAverages.entries()).map(([subject, agg]) => ({
      subject,
      avg: Math.round((agg.total / Math.max(1, agg.count)) * 100) / 100,
      students: agg.count,
    }))

    const studentTrend = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
      month: m,
      count: Math.round(80 + Math.sin(i) * 10 + Math.random() * 20),
      growth: Math.round((5 + Math.sin(i) + Math.random() * 3) * 100) / 100,
    }))

    const classComparison = classes.slice(0, 5).map((c) => ({
      className: c.name,
      math: Math.round(50 + Math.random() * 50),
      eng: Math.round(50 + Math.random() * 50),
      sci: Math.round(50 + Math.random() * 50),
    }))

    const monthlySubmissions = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => ({
      month: m,
      submissions: Math.round(30 + Math.random() * 80),
      onTime: Math.round(25 + Math.random() * 60),
    }))

    const notificationStats = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => ({
      month: m,
      delivered: Math.round(100 + Math.random() * 200),
      failed: Math.round(Math.random() * 20),
      opened: Math.round(80 + Math.random() * 150),
    }))

    const recentActivities = [
      { id: uid(), type: "student" as const, message: "New student registration: STU-1009", at: now(), severity: "success" as const },
      { id: uid(), type: "result" as const, message: "Score submission by John Smith", at: now(), severity: "info" as const },
      { id: uid(), type: "teacher" as const, message: "Teacher login: Mary Johnson", at: now(), severity: "info" as const },
      { id: uid(), type: "system" as const, message: "System health check: OK", at: now(), severity: "success" as const },
    ]

    return {
      totals: { students: totalStudents, teachers: totalTeachers, classes: totalClasses, schools: totalSchools },
      growthPercent: 6.4,
      teachersActive,
      teachersInactive,
      byGrade,
      recentResults: results.slice(-5).reverse(),
      pendingNotifications: notifications.filter((n) => n.status === "Scheduled").length,
      systemHealth: "Healthy",
      charts: { studentTrend, subjectDistribution, classComparison, monthlySubmissions, notificationStats },
      recentActivities,
    }
  },
}
