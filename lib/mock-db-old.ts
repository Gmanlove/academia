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
    // randomUUID not always available in all runtimes
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
  {
    id: uid(),
    name: "Globex Academy",
    brand: "Globex",
    contactEmail: "contact@globexacademy.edu",
    contactPhone: "+234-805-555-0123",
    address: "789 Knowledge Road, Port Harcourt, Nigeria",
    createdAt: now(),
    active: false,
    plan: "Free",
    maxStudents: 20,
    currentStudentCount: 18,
    stats: { 
      students: 18, 
      teachers: 3, 
      classes: 3, 
      subjects: 6, 
      averagePerformance: 55.8,
    },
    settings: {
      gradingScale: ["90-100", "80-89", "70-79", "60-69", "Below 60"],
      terms: ["Term 1", "Term 2", "Term 3"],
      academicYear: "2024/2025",
      allowParentAccess: false,
      smsCredits: 0,
      maxCA: 30,
      maxExam: 70,
      passingGrade: 50,
      resultVisibility: "Private",
      notificationChannels: ["Email"],
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
  { 
    id: uid(), 
    code: "SCI", 
    name: "Basic Science", 
    schoolId: schools[0].id, 
    teacherIds: [], 
    classIds: [],
    isCore: true,
    creditHours: 3,
    description: "Introduction to scientific concepts",
    passingGrade: 50,
    performance: {
      averageCA: 22,
      averageExam: 55,
      passRate: 74,
      difficulty: "Hard",
    }
  },
]

const teachers: Teacher[] = [
  {
    id: uid(),
    name: "John Smith",
    email: "john.smith@acmehigh.edu",
    phoneNumber: "+234-803-111-2233",
    subjects: ["Mathematics"],
    classes: [],
    schoolId: schools[0].id,
    active: true,
    lastLogin: now(),
    photoUrl: "/placeholder.svg?height=80&width=80",
    qualifications: ["B.Sc Mathematics", "M.Ed Educational Management"],
    experience: 8,
    dateJoined: "2020-09-01",
    workload: {
      totalClasses: 4,
      totalStudents: 120,
      weeklyHours: 24,
    },
    performance: {
      submissionTimeliness: 95,
      studentFeedback: 4.2,
      classAverage: 73.5,
      communicationActivity: 85,
    },
  },
  {
    id: uid(),
    name: "Mary Johnson",
    email: "mary.johnson@acmehigh.edu",
    phoneNumber: "+234-803-444-5566",
    subjects: ["English Language"],
    classes: [],
    schoolId: schools[0].id,
    active: true,
    lastLogin: now(),
    photoUrl: "/placeholder.svg?height=80&width=80",
    qualifications: ["B.A English", "PGDE"],
    experience: 5,
    dateJoined: "2022-01-15",
    workload: {
      totalClasses: 3,
      totalStudents: 90,
      weeklyHours: 18,
    },
    performance: {
      submissionTimeliness: 88,
      studentFeedback: 4.5,
      classAverage: 76.8,
      communicationActivity: 92,
    },
  },
  {
    id: uid(),
    name: "Tim Green",
    email: "tim.green@globexacademy.edu",
    phoneNumber: "+234-805-777-8899",
    subjects: ["Basic Science"],
    classes: [],
    schoolId: schools[2].id,
    active: false,
    photoUrl: "/placeholder.svg?height=80&width=80",
    qualifications: ["B.Sc Biology", "M.Sc Microbiology"],
    experience: 12,
    dateJoined: "2018-03-10",
    workload: {
      totalClasses: 2,
      totalStudents: 60,
      weeklyHours: 12,
    },
    performance: {
      submissionTimeliness: 92,
      studentFeedback: 4.0,
      classAverage: 69.2,
      communicationActivity: 75,
    },
  },
]

const classes: ClassRoom[] = [
  { 
    id: uid(), 
    name: "JSS 1A", 
    level: "JSS 1", 
    schoolId: schools[0].id, 
    teacherId: teachers[0].id, 
    subjectIds: [subjects[0].id, subjects[1].id], 
    studentCount: 20,
    capacity: 25,
    academicYear: "2024/2025",
    term: "Term 1",
    schedule: {
      periods: 8,
      startTime: "08:00",
      endTime: "14:30",
    },
    performance: {
      averageCA: 24.5,
      averageExam: 61.2,
      overallAverage: 71.8,
      topPerformers: [],
      needsAttention: [],
    }
  },
  { 
    id: uid(), 
    name: "JSS 2B", 
    level: "JSS 2", 
    schoolId: schools[0].id, 
    teacherId: teachers[1].id, 
    subjectIds: [subjects[1].id, subjects[2].id], 
    studentCount: 22,
    capacity: 30,
    academicYear: "2024/2025", 
    term: "Term 1",
    schedule: {
      periods: 8,
      startTime: "08:00",
      endTime: "14:30",
    },
    performance: {
      averageCA: 25.8,
      averageExam: 63.4,
      overallAverage: 74.6,
      topPerformers: [],
      needsAttention: [],
    }
  },
  { 
    id: uid(), 
    name: "JSS 3A", 
    level: "JSS 3", 
    schoolId: schools[1].id, 
    teacherId: undefined, 
    subjectIds: [subjects[0].id], 
    studentCount: 18,
    capacity: 20,
    academicYear: "2024/2025",
    term: "Term 1",
    schedule: {
      periods: 8,
      startTime: "07:30",
      endTime: "14:00",
    },
    performance: {
      averageCA: 23.2,
      averageExam: 58.9,
      overallAverage: 68.7,
      topPerformers: [],
      needsAttention: [],
    }
  },
]
const students: Student[] = Array.from({ length: 24 }).map((_, i) => {
  const s = schools[i % schools.length]
  const c = classes[i % classes.length]
  const gpa = Math.round((2 + Math.random() * 2) * 100) / 100
  const performanceLevel: "Excellent" | "Good" | "Average" | "Poor" | "Critical" = 
    gpa >= 3.5 ? "Excellent" : gpa >= 3.0 ? "Good" : gpa >= 2.5 ? "Average" : gpa >= 2.0 ? "Poor" : "Critical"
  
  return {
    id: uid(),
    studentId: `STU-${1000 + i}`,
    name: `Student ${i + 1}`,
    email: `student${i + 1}@${s.name.toLowerCase().replace(/\s+/g, '')}.edu`,
    photoUrl: `/placeholder-user.jpg`,
    dateOfBirth: new Date(2008 + Math.floor(i / 8), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    gender: i % 2 === 0 ? "Male" : "Female",
    schoolId: s.id,
    classId: c.id,
    parentName: `Parent ${i + 1}`,
    parentEmail: `parent${i + 1}@mail.com`,
    parentPhone: `+234-803-000-00${String(i).padStart(2, '0')}`,
    secondaryParentName: i % 3 === 0 ? `Secondary Parent ${i + 1}` : undefined,
    secondaryParentEmail: i % 3 === 0 ? `parent2-${i + 1}@mail.com` : undefined,
    secondaryParentPhone: i % 3 === 0 ? `+234-805-000-00${String(i).padStart(2, '0')}` : undefined,
    address: `${i + 1} Student Street, Lagos, Nigeria`,
    enrollmentDate: new Date(2023, 8, 1 + i).toISOString(),
    active: i % 20 !== 0,
    lastLogin: i % 3 === 0 ? now() : undefined,
    performanceLevel,
    currentGPA: gpa,
    attendance: {
      totalDays: 100,
      presentDays: Math.floor(80 + Math.random() * 20),
      absentDays: Math.floor(Math.random() * 10),
      percentage: Math.floor(80 + Math.random() * 20),
    },
    achievements: i % 5 === 0 ? [{
      id: uid(),
      title: "Academic Excellence",
      description: "Top performer in mathematics",
      dateEarned: now(),
      category: "Academic" as const,
    }] : undefined,
  }
})

const results: ResultEntry[] = Array.from({ length: 120 }).map((_, i) => {
  const st = students[i % students.length]
  const subj = subjects[i % subjects.length]
  const ca = Math.floor(10 + Math.random() * 30)
  const exam = Math.floor(20 + Math.random() * 50)
  const total = ca + exam
  const grade = total >= 70 ? "A" : total >= 60 ? "B" : total >= 50 ? "C" : total >= 40 ? "D" : "F"
  
  return {
    id: uid(),
    studentId: st.id,
    schoolId: st.schoolId,
    classId: st.classId,
    subjectId: subj.id,
    ca,
    exam,
    total,
    grade,
    position: Math.floor(Math.random() * 25) + 1,
    term: (["Term 1", "Term 2", "Term 3"] as const)[i % 3],
    session: "2024/2025",
    submittedAt: now(),
    submittedBy: teachers[i % teachers.length].id,
    teacherRemark: i % 4 === 0 ? (total >= 70 ? "Excellent work!" : total >= 50 ? "Good effort, keep it up!" : "Needs improvement") : undefined,
    verified: i % 10 !== 0,
  }
})

const assessments: Assessment[] = Array.from({ length: 15 }).map((_, i) => ({
  id: uid(),
  title: `${subjects[i % subjects.length].name} ${i % 2 === 0 ? "Test" : "Assignment"} ${Math.floor(i / 3) + 1}`,
  type: i % 2 === 0 ? "CA" : "Exam",
  subjectId: subjects[i % subjects.length].id,
  classId: classes[i % classes.length].id,
  schoolId: schools[i % schools.length].id,
  maxScore: i % 2 === 0 ? 40 : 70,
  date: new Date(Date.now() + (i - 7) * 1000 * 60 * 60 * 24 * 7).toISOString(),
  term: "Term 1",
  session: "2024/2025",
  instructions: `Complete this ${i % 2 === 0 ? "test" : "exam"} within the allocated time. Show all working clearly.`,
  duration: i % 2 === 0 ? 60 : 120,
  createdBy: teachers[i % teachers.length].id,
}))

const notifications: NotificationItem[] = [
  {
    id: uid(),
    title: "Welcome Back to School",
    message: "Welcome back students! New term begins next week. Please ensure all fees are paid and you have your complete list of required materials.",
    createdAt: now(),
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    audience: "School",
    delivery: "Email",
    status: "Scheduled",
    priority: "Medium",
    schoolId: schools[0].id,
    metadata: {
      emailsSent: 0,
      smssSent: 0,
      deliveryRate: 0,
    },
  },
  {
    id: uid(),
    title: "Result Submission Reminder",
    message: "Dear teachers, please remember to submit all Term 1 results by Friday. The deadline is approaching fast.",
    createdAt: now(),
    audience: "Teacher",
    delivery: "App",
    status: "Sent",
    priority: "High",
    classId: classes[0].id,
    metadata: {
      emailsSent: 8,
      smssSent: 0,
      deliveryRate: 100,
      openRate: 87.5,
    },
  },
  {
    id: uid(),
    title: "Parent-Teacher Meeting",
    message: "You are invited to attend the parent-teacher meeting scheduled for next Saturday at 10:00 AM in the school hall.",
    createdAt: now(),
    audience: "Parent",
    delivery: "SMS",
    status: "Sent",
    priority: "High",
    schoolId: schools[0].id,
    metadata: {
      emailsSent: 0,
      smssSent: 45,
      deliveryRate: 95.6,
    },
  },
]

const notificationTemplates: NotificationTemplate[] = [
  {
    id: uid(),
    name: "Result Published",
    category: "Academic",
    subject: "Your {{term}} Results Are Now Available",
    message: "Dear {{studentName}}, your {{term}} results for {{className}} have been published. Please check your student portal to view your performance.",
    variables: ["studentName", "term", "className"],
    isSystem: true,
    createdBy: "system",
    createdAt: now(),
  },
  {
    id: uid(),
    name: "Fee Reminder",
    category: "Administrative",
    subject: "School Fee Payment Reminder",
    message: "Dear Parent/Guardian of {{studentName}}, this is a friendly reminder that the {{term}} school fees are due. Please make payment by {{dueDate}}.",
    variables: ["studentName", "term", "dueDate"],
    isSystem: true,
    createdBy: "system",
    createdAt: now(),
  },
]

const tokens: TokenRecord[] = [
  {
    id: uid(),
    studentId: "STU-1001",
    attempts: 0,
    maxAttempts: 3,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    createdAt: now(),
    isActive: true,
  },
  {
    id: uid(),
    studentId: "STU-1002", 
    attempts: 1,
    maxAttempts: 3,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    lastAttempt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    isActive: true,
  },
]

const activityLogs: ActivityLog[] = Array.from({ length: 50 }).map((_, i) => ({
  id: uid(),
  userId: i % 2 === 0 ? teachers[i % teachers.length].id : students[i % students.length].id,
  userRole: i % 2 === 0 ? "Teacher" : "Student",
  action: i % 4 === 0 ? "login" : i % 4 === 1 ? "result_entry" : i % 4 === 2 ? "view_results" : "update_profile",
  details: i % 4 === 0 ? "User logged in" : i % 4 === 1 ? "Entered results for Mathematics" : i % 4 === 2 ? "Viewed term results" : "Updated profile information",
  timestamp: new Date(Date.now() - i * 1000 * 60 * 60 * 2).toISOString(),
  schoolId: schools[i % schools.length].id,
  affectedResource: i % 3 === 0 ? {
    type: "Student",
    id: students[i % students.length].id,
    name: students[i % students.length].name,
  } : undefined,
}))

const reports: Report[] = [
  {
    id: uid(),
    title: "Term 1 Class Performance Report",
    type: "Class",
    format: "PDF",
    parameters: { classId: classes[0].id, term: "Term 1" },
    generatedBy: teachers[0].id,
    generatedAt: now(),
    schoolId: schools[0].id,
    status: "Ready",
    fileUrl: "/reports/class-performance-term1.pdf",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: uid(),
    title: "Student Academic Transcript",
    type: "Student", 
    format: "PDF",
    parameters: { studentId: students[0].id, includeAllTerms: true },
    generatedBy: teachers[1].id,
    generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    schoolId: schools[0].id,
    status: "Ready",
    fileUrl: "/reports/student-transcript.pdf",
  },
]

// Enhanced database helpers
export const db = {
  // Schools
  listSchools(params?: { 
    brand?: Brand
    plan?: PricingPlan
    minStudents?: number
    maxStudents?: number
    q?: string
    active?: boolean
    page?: number
    limit?: number
  }) {
    let data = [...schools]
    if (params?.brand) data = data.filter((s) => s.brand === params.brand)
    if (params?.plan) data = data.filter((s) => s.plan === params.plan)
    if (typeof params?.active === "boolean") data = data.filter((s) => s.active === params.active)
    if (params?.minStudents) data = data.filter((s) => s.stats.students >= (params.minStudents as number))
    if (params?.maxStudents) data = data.filter((s) => s.stats.students <= (params.maxStudents as number))
    if (params?.q) {
      const q = params.q.toLowerCase()
      data = data.filter((s) => 
        s.name.toLowerCase().includes(q) || 
        s.contactEmail.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q)
      )
    }
    
    // Pagination
    const page = params?.page || 1
    const limit = params?.limit || 10
    const start = (page - 1) * limit
    const paginatedData = data.slice(start, start + limit)
    
    return {
      data: paginatedData,
      total: data.length,
      page,
      limit,
      totalPages: Math.ceil(data.length / limit),
    }
  },

  getSchool(id: ID) {
    return schools.find((s) => s.id === id)
  },

  createSchool(payload: Omit<School, "id" | "createdAt" | "stats">) {
    const newSchool: School = {
      id: uid(),
      createdAt: now(),
      stats: { students: 0, teachers: 0, classes: 0 },
      ...payload,
    }
    schools.push(newSchool)
    return newSchool
  },

  updateSchool(id: ID, updates: Partial<School>) {
    const school = schools.find((s) => s.id === id)
    if (!school) return null
    Object.assign(school, updates)
    return school
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
    status?: "Active" | "Inactive" | "Graduated" | "Transferred"
    q?: string
    page?: number
    limit?: number
  }) {
    let data = [...students]
    if (params?.schoolId) data = data.filter((s) => s.schoolId === params.schoolId)
    if (params?.classId) data = data.filter((s) => s.classId === params.classId)
    if (params?.performanceLevel) data = data.filter((s) => s.performance.level === params.performanceLevel)
    if (params?.status) data = data.filter((s) => s.status === params.status)
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

    // Pagination
    const page = params?.page || 1
    const limit = params?.limit || 20
    const start = (page - 1) * limit
    const paginatedData = data.slice(start, start + limit)
    
    return {
      data: paginatedData,
      total: data.length,
      page,
      limit,
      totalPages: Math.ceil(data.length / limit),
    }
  },

  getStudent(id: ID) {
    return students.find((s) => s.id === id)
  },

  getStudentByPublicId(studentId: string) {
    return students.find((s) => s.studentId === studentId)
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

  updateStudent(id: ID, updates: Partial<Student>) {
    const student = students.find((s) => s.id === id)
    if (!student) return null
    Object.assign(student, updates)
    return student
  },

  bulkImportStudents(payload: Omit<Student, "id">[]) {
    return payload.map((p) => this.addStudent(p))
  },

  createStudent(payload: Omit<Student, "id">) {
    try {
      const newStudent = this.addStudent(payload)
      return { success: true, data: newStudent }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  },

  getStudentResults(studentId: ID) {
    return results.filter((r) => r.studentId === studentId)
  },

  deleteStudent(id: ID) {
    const idx = students.findIndex((s) => s.id === id)
    if (idx >= 0) {
      const student = students[idx]
      students.splice(idx, 1)
      
      // Update counts
      const school = schools.find((s) => s.id === student.schoolId)
      if (school) school.stats.students -= 1
      const klass = classes.find((c) => c.id === student.classId)
      if (klass) klass.studentCount -= 1
      
      return true
    }
    return false
  },

  // Teachers
  listTeachers(params?: { 
    schoolId?: ID
    active?: boolean
    subjectId?: ID
    page?: number
    limit?: number
  }) {
    let data = [...teachers]
    if (params?.schoolId) data = data.filter((t) => t.schoolId === params.schoolId)
    if (typeof params?.active === "boolean") data = data.filter((t) => t.active === params.active)
    if (params?.subjectId) {
      const subject = subjects.find((s) => s.id === params.subjectId)
      if (subject) {
        data = data.filter((t) => t.subjects.includes(subject.name))
      }
    }

    // Pagination
    const page = params?.page || 1
    const limit = params?.limit || 20
    const start = (page - 1) * limit
    const paginatedData = data.slice(start, start + limit)
    
    return {
      data: paginatedData,
      total: data.length,
      page,
      limit,
      totalPages: Math.ceil(data.length / limit),
    }
  },

  getTeacher(id: ID) {
    return teachers.find((t) => t.id === id)
  },

  addTeacher(payload: Omit<Teacher, "id">) {
    const newT: Teacher = { id: uid(), ...payload }
    teachers.push(newT)
    
    // Update school count
    const school = schools.find((s) => s.id === newT.schoolId)
    if (school) school.stats.teachers += 1
    
    return newT
  },

  updateTeacher(id: ID, updates: Partial<Teacher>) {
    const teacher = teachers.find((t) => t.id === id)
    if (!teacher) return null
    Object.assign(teacher, updates)
    return teacher
  },

  // Classes
  listClasses(params?: { schoolId?: ID; teacherId?: ID; level?: string }) {
    let data = [...classes]
    if (params?.schoolId) data = data.filter((c) => c.schoolId === params.schoolId)
    if (params?.teacherId) data = data.filter((c) => c.teacherId === params.teacherId)
    if (params?.level) data = data.filter((c) => c.level === params.level)
    return data
  },

  getClass(id: ID) {
    return classes.find((c) => c.id === id)
  },

  addClass(payload: Omit<ClassRoom, "id">) {
    const newC: ClassRoom = { id: uid(), ...payload }
    classes.push(newC)
    
    // Update school count
    const school = schools.find((s) => s.id === newC.schoolId)
    if (school) school.stats.classes += 1
    
    return newC
  },

  // Subjects
  listSubjects(params?: { schoolId?: ID; teacherId?: ID }) {
    let data = [...subjects]
    if (params?.schoolId) data = data.filter((s) => s.schoolId === params.schoolId)
    if (params?.teacherId) {
      const teacher = teachers.find((t) => t.id === params.teacherId)
      if (teacher) {
        data = data.filter((s) => teacher.subjects.includes(s.name))
      }
    }
    return data
  },

  getSubject(id: ID) {
    return subjects.find((s) => s.id === id)
  },

  // Results
  listResults(params?: { 
    studentId?: ID
    schoolId?: ID
    classId?: ID
    subjectId?: ID
    term?: string
    session?: string
  }) {
    let data = [...results]
    if (params?.studentId) data = data.filter((r) => r.studentId === params.studentId)
    if (params?.schoolId) data = data.filter((r) => r.schoolId === params.schoolId)
    if (params?.classId) data = data.filter((r) => r.classId === params.classId)
    if (params?.subjectId) data = data.filter((r) => r.subjectId === params.subjectId)
    if (params?.term) data = data.filter((r) => r.term === params.term)
    if (params?.session) data = data.filter((r) => r.session === params.session)
    return data
  },

  addResult(payload: Omit<ResultEntry, "id" | "submittedAt">) {
    const newR: ResultEntry = { 
      id: uid(), 
      submittedAt: now(),
      ...payload 
    }
    results.push(newR)
    return newR
  },

  updateResult(id: ID, updates: Partial<ResultEntry>) {
    const result = results.find((r) => r.id === id)
    if (!result) return null
    Object.assign(result, { ...updates, modifiedAt: now() })
    return result
  },

  // Assessments
  listAssessments(params?: { schoolId?: ID; classId?: ID; subjectId?: ID; type?: string }) {
    let data = [...assessments]
    if (params?.schoolId) data = data.filter((a) => a.schoolId === params.schoolId)
    if (params?.classId) data = data.filter((a) => a.classId === params.classId)
    if (params?.subjectId) data = data.filter((a) => a.subjectId === params.subjectId)
    if (params?.type) data = data.filter((a) => a.type === params.type)
    return data
  },

  addAssessment(payload: Omit<Assessment, "id">) {
    const newA: Assessment = { id: uid(), ...payload }
    assessments.push(newA)
    return newA
  },

  // Notifications
  listNotifications(params?: { 
    schoolId?: ID
    classId?: ID
    audience?: string
    status?: string
    priority?: string
  }) {
    let data = [...notifications]
    if (params?.schoolId) data = data.filter((n) => n.schoolId === params.schoolId)
    if (params?.classId) data = data.filter((n) => n.classId === params.classId)
    if (params?.audience) data = data.filter((n) => n.audience === params.audience)
    if (params?.status) data = data.filter((n) => n.status === params.status)
    if (params?.priority) data = data.filter((n) => n.priority === params.priority)
    return data
  },

  addNotification(payload: Omit<NotificationItem, "id" | "createdAt" | "status"> & { status?: NotificationItem["status"] }) {
    const n: NotificationItem = { 
      id: uid(), 
      createdAt: now(), 
      status: payload.status ?? "Draft",
      priority: payload.priority ?? "Medium",
      ...payload 
    }
    notifications.push(n)
    return n
  },

  updateNotification(id: ID, updates: Partial<NotificationItem>) {
    const notification = notifications.find((n) => n.id === id)
    if (!notification) return null
    Object.assign(notification, updates)
    return notification
  },

  // Activity Logs
  listActivityLogs(params?: { 
    schoolId?: ID
    userId?: ID
    userRole?: string
    action?: string
    limit?: number
  }) {
    let data = [...activityLogs]
    if (params?.schoolId) data = data.filter((a) => a.schoolId === params.schoolId)
    if (params?.userId) data = data.filter((a) => a.userId === params.userId)
    if (params?.userRole) data = data.filter((a) => a.userRole === params.userRole)
    if (params?.action) data = data.filter((a) => a.action === params.action)
    
    data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    if (params?.limit) data = data.slice(0, params.limit)
    return data
  },

  addActivityLog(payload: Omit<ActivityLog, "id" | "timestamp">) {
    const log: ActivityLog = {
      id: uid(),
      timestamp: now(),
      ...payload
    }
    activityLogs.push(log)
    return log
  },

  // Tokens
  findTokenByStudentPublicId(studentPublicId: string) {
    return tokens.find((t) => t.studentId === studentPublicId && t.isActive)
  },

  createToken(studentPublicId: string) {
    // Deactivate existing tokens
    tokens.forEach((t) => {
      if (t.studentId === studentPublicId) t.isActive = false
    })

    const rec: TokenRecord = {
      id: uid(),
      studentId: studentPublicId,
      attempts: 0,
      maxAttempts: 3,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      createdAt: now(),
      isActive: true,
    }
    tokens.push(rec)
    return rec
  },

  incrementTokenAttempt(id: ID) {
    const t = tokens.find((x) => x.id === id)
    if (t) {
      t.attempts++
      t.lastAttempt = now()
      if (t.attempts >= t.maxAttempts) {
        t.isActive = false
      }
    }
    return t
  },

  // Reports
  listReports(params?: { schoolId?: ID; type?: string; generatedBy?: ID }) {
    let data = [...reports]
    if (params?.schoolId) data = data.filter((r) => r.schoolId === params.schoolId)
    if (params?.type) data = data.filter((r) => r.type === params.type)
    if (params?.generatedBy) data = data.filter((r) => r.generatedBy === params.generatedBy)
    return data.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
  },

  generateReport(payload: Omit<Report, "id" | "generatedAt" | "status">) {
    const report: Report = {
      id: uid(),
      generatedAt: now(),
      status: "Generating",
      ...payload
    }
    reports.push(report)
    
    // Simulate report generation
    setTimeout(() => {
      report.status = "Ready"
      report.fileUrl = `/reports/${report.id}.${report.format.toLowerCase()}`
    }, 2000)
    
    return report
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
