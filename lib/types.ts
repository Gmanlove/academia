export type ID = string

export type Brand = "Acme" | "Contoso" | "Globex"

export type School = {
  id: ID
  name: string
  brand: Brand
  contactEmail: string
  contactPhone?: string
  createdAt: string
  active: boolean
  stats: {
    students: number
    teachers: number
    classes: number
  }
  adminAssigned?: string
}

export type Teacher = {
  id: ID
  name: string
  email: string
  photoUrl?: string
  subjects: string[]
  classes: ID[]
  active: boolean
  lastLogin?: string
}

export type Student = {
  id: ID
  studentId: string
  name: string
  schoolId: ID
  classId: ID
  parentName?: string
  parentEmail?: string
  parentPhone?: string
  lastLogin?: string
  performance: {
    gpa: number
    level: "Low" | "Average" | "High"
  }
}

export type ClassRoom = {
  id: ID
  name: string // e.g. "JSS 1A"
  level: string // e.g. "JSS 1"
  schoolId: ID
  teacherId?: ID
  subjectIds: ID[]
  studentCount: number
}

export type Subject = {
  id: ID
  code: string // e.g. "MTH"
  name: string // e.g. "Mathematics"
  schoolId: ID
  teacherIds: ID[]
}

export type ResultEntry = {
  id: ID
  studentId: ID
  schoolId: ID
  classId: ID
  subjectId: ID
  ca: number
  exam: number
  total: number
  term: "Term 1" | "Term 2" | "Term 3"
  session: string // e.g. "2024/2025"
  submittedAt: string
  teacherRemark?: string
}

export type NotificationItem = {
  id: ID
  title: string
  message: string
  createdAt: string
  audience: "School" | "Class" | "Custom"
  delivery: "Email" | "SMS" | "App"
  status: "Scheduled" | "Sent" | "Failed"
  schoolId?: ID
  classId?: ID
}

export type TokenRecord = {
  id: ID
  studentId: string // student public ID (not DB id)
  attempts: number
  expiresAt: string
}

export type AdminDashboardStats = {
  totals: {
    students: number
    teachers: number
    classes: number
  }
  growthPercent: number
  teachersActive: number
  teachersInactive: number
  byGrade: { grade: string; count: number }[]
  recentResults: ResultEntry[]
  pendingNotifications: number
  systemHealth: "Healthy" | "Degraded" | "Issues"
  charts: {
    studentTrend: { month: string; avg: number }[]
    subjectDistribution: { subject: string; avg: number }[]
    classComparison: { className: string; math: number; eng: number; sci: number }[]
    monthlySubmissions: { month: string; submissions: number }[]
    notificationStats: { month: string; delivered: number; failed: number }[]
  }
  recentActivities: { id: ID; type: string; message: string; at: string }[]
}
