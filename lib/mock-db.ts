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
} from "./types"

function uid() {
  try {
    return randomUUID()
  } catch {
    // randomUUID not always available in all runtimes
    return Math.random().toString(36).slice(2)
  }
}

const brands: Brand[] = ["Acme", "Contoso", "Globex"]

const now = () => new Date().toISOString()

// Seed
const schools: School[] = [
  {
    id: uid(),
    name: "Acme High School",
    brand: "Acme",
    contactEmail: "admin@acmehigh.edu",
    createdAt: now(),
    active: true,
    stats: { students: 120, teachers: 8, classes: 6 },
    adminAssigned: "jane@acme.com",
  },
  {
    id: uid(),
    name: "Contoso Junior School",
    brand: "Contoso",
    contactEmail: "info@contosojunior.edu",
    createdAt: now(),
    active: true,
    stats: { students: 85, teachers: 6, classes: 5 },
  },
  {
    id: uid(),
    name: "Globex Academy",
    brand: "Globex",
    contactEmail: "contact@globexacademy.edu",
    createdAt: now(),
    active: false,
    stats: { students: 42, teachers: 3, classes: 3 },
  },
]

const subjects: Subject[] = [
  { id: uid(), code: "MTH", name: "Mathematics", schoolId: schools[0].id, teacherIds: [] },
  { id: uid(), code: "ENG", name: "English", schoolId: schools[0].id, teacherIds: [] },
  { id: uid(), code: "SCI", name: "Science", schoolId: schools[0].id, teacherIds: [] },
]

const teachers: Teacher[] = [
  {
    id: uid(),
    name: "John Smith",
    email: "john.smith@acmehigh.edu",
    subjects: ["Mathematics"],
    classes: [],
    active: true,
    lastLogin: now(),
    photoUrl: "/placeholder.svg?height=80&width=80",
  },
  {
    id: uid(),
    name: "Mary Johnson",
    email: "mary.johnson@acmehigh.edu",
    subjects: ["English"],
    classes: [],
    active: true,
    photoUrl: "/placeholder.svg?height=80&width=80",
  },
  {
    id: uid(),
    name: "Tim Green",
    email: "tim.green@globexacademy.edu",
    subjects: ["Science"],
    classes: [],
    active: false,
    photoUrl: "/placeholder.svg?height=80&width=80",
  },
]

const classes: ClassRoom[] = [
  { id: uid(), name: "JSS 1A", level: "JSS 1", schoolId: schools[0].id, teacherId: teachers[0].id, subjectIds: [subjects[0].id, subjects[1].id], studentCount: 20 },
  { id: uid(), name: "JSS 2B", level: "JSS 2", schoolId: schools[0].id, teacherId: teachers[1].id, subjectIds: [subjects[1].id, subjects[2].id], studentCount: 22 },
  { id: uid(), name: "JSS 3A", level: "JSS 3", schoolId: schools[1].id, teacherId: undefined, subjectIds: [subjects[0].id], studentCount: 18 },
]

const students: Student[] = Array.from({ length: 24 }).map((_, i) => {
  const s = schools[i % schools.length]
  const c = classes[i % classes.length]
  return {
    id: uid(),
    studentId: `STU-${1000 + i}`,
    name: `Student ${i + 1}`,
    schoolId: s.id,
    classId: c.id,
    parentName: `Parent ${i + 1}`,
    parentEmail: `parent${i + 1}@mail.com`,
    parentPhone: `0803-000-00${i}`,
    lastLogin: i % 3 === 0 ? now() : undefined,
    performance: {
      gpa: Math.round((2 + Math.random() * 2) * 100) / 100,
      level: (["Low", "Average", "High"] as const)[i % 3],
    },
  }
})

const results: ResultEntry[] = Array.from({ length: 60 }).map((_, i) => {
  const st = students[i % students.length]
  const subj = subjects[i % subjects.length]
  const ca = Math.floor(10 + Math.random() * 30)
  const exam = Math.floor(20 + Math.random() * 50)
  return {
    id: uid(),
    studentId: st.id,
    schoolId: st.schoolId,
    classId: st.classId,
    subjectId: subj.id,
    ca,
    exam,
    total: ca + exam,
    term: (["Term 1", "Term 2", "Term 3"] as const)[i % 3],
    session: "2024/2025",
    submittedAt: now(),
    teacherRemark: i % 4 === 0 ? "Good effort" : undefined,
  }
})

const notifications: NotificationItem[] = [
  {
    id: uid(),
    title: "Welcome Back",
    message: "New term begins next week.",
    createdAt: now(),
    audience: "School",
    delivery: "Email",
    status: "Sent",
    schoolId: schools[0].id,
  },
  {
    id: uid(),
    title: "Reminder: Submit Results",
    message: "Deadline approaching.",
    createdAt: now(),
    audience: "Class",
    delivery: "App",
    status: "Scheduled",
    classId: classes[0].id,
  },
]

const tokens: TokenRecord[] = [
  {
    id: uid(),
    studentId: "STU-1001",
    attempts: 0,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  },
]

// Simple helpers
export const db = {
  // Schools
  listSchools(params?: { brand?: Brand; minStudents?: number; maxStudents?: number; q?: string; active?: boolean }) {
    let data = [...schools]
    if (params?.brand) data = data.filter((s) => s.brand === params.brand)
    if (typeof params?.active === "boolean") data = data.filter((s) => s.active === params.active)
    if (params?.minStudents) data = data.filter((s) => s.stats.students >= (params.minStudents as number))
    if (params?.maxStudents) data = data.filter((s) => s.stats.students <= (params.maxStudents as number))
    if (params?.q) {
      const q = params.q.toLowerCase()
      data = data.filter((s) => s.name.toLowerCase().includes(q))
    }
    return data
  },
  getSchool(id: ID) {
    return schools.find((s) => s.id === id)
  },
  toggleSchoolActive(id: ID, active: boolean) {
    const s = schools.find((x) => x.id === id)
    if (!s) return null
    s.active = active
    return s
  },
  deleteSchool(id: ID) {
    const idx = schools.findIndex((x) => x.id === id)
    if (idx >= 0) {
      schools.splice(idx, 1)
      return true
    }
    return false
  },

  // Students
  listStudents(params?: {
    schoolId?: ID
    classId?: ID
    performanceLevel?: "Low" | "Average" | "High"
    q?: string
  }) {
    let data = [...students]
    if (params?.schoolId) data = data.filter((s) => s.schoolId === params.schoolId)
    if (params?.classId) data = data.filter((s) => s.classId === params.classId)
    if (params?.performanceLevel) data = data.filter((s) => s.performance.level === params.performanceLevel)
    if (params?.q) {
      const q = params.q.toLowerCase()
      data = data.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          (s.parentEmail?.toLowerCase().includes(q) ?? false) ||
          (s.parentPhone?.toLowerCase().includes(q) ?? false)
      )
    }
    return data
  },
  addStudent(payload: Omit<Student, "id">) {
    const newS: Student = { id: uid(), ...payload }
    students.push(newS)
    // update school/class counts
    const school = schools.find((s) => s.id === newS.schoolId)
    if (school) school.stats.students += 1
    const klass = classes.find((c) => c.id === newS.classId)
    if (klass) klass.studentCount += 1
    return newS
  },
  bulkImportStudents(payload: Omit<Student, "id">[]) {
    return payload.map((p) => this.addStudent(p))
  },
  getStudent(id: ID) {
    return students.find((s) => s.id === id)
  },

  // Teachers
  listTeachers(params?: { active?: boolean }) {
    let data = [...teachers]
    if (typeof params?.active === "boolean") data = data.filter((t) => t.active === params.active)
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

  // Subjects
  listSubjects(params?: { schoolId?: ID }) {
    let data = [...subjects]
    if (params?.schoolId) data = data.filter((s) => s.schoolId === params.schoolId)
    return data
  },

  // Results
  listResults(params?: { studentId?: ID; schoolId?: ID }) {
    let data = [...results]
    if (params?.studentId) data = data.filter((r) => r.studentId === params.studentId)
    if (params?.schoolId) data = data.filter((r) => r.schoolId === params.schoolId)
    return data
  },

  // Notifications
  listNotifications(params?: { schoolId?: ID }) {
    let data = [...notifications]
    if (params?.schoolId) data = data.filter((n) => n.schoolId === params.schoolId)
    return data
  },
  addNotification(payload: Omit<NotificationItem, "id" | "createdAt" | "status"> & { status?: NotificationItem["status"] }) {
    const n: NotificationItem = { id: uid(), createdAt: now(), status: payload.status ?? "Scheduled", ...payload }
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
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
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
    }))

    const studentTrend = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
      month: m,
      avg: Math.round((2.5 + Math.sin(i) + Math.random() * 0.5) * 100) / 100,
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
    }))

    const notificationStats = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => ({
      month: m,
      delivered: Math.round(100 + Math.random() * 200),
      failed: Math.round(Math.random() * 20),
    }))

    const recentActivities = [
      { id: uid(), type: "student", message: "New student registration: STU-1009", at: now() },
      { id: uid(), type: "result", message: "Score submission by John Smith", at: now() },
      { id: uid(), type: "teacher", message: "Teacher login: Mary Johnson", at: now() },
      { id: uid(), type: "system", message: "System health check: OK", at: now() },
    ]

    return {
      totals: { students: totalStudents, teachers: totalTeachers, classes: totalClasses },
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
