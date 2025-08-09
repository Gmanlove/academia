export type ID = string

export type Brand = "Acme" | "Contoso" | "Globex"

export type PricingPlan = "Free" | "Basic" | "Pro" | "Enterprise"

export type UserRole = "Admin" | "Teacher" | "Student" | "Parent"

export type BillingCycle = "term" | "annual"

export type NotificationChannel = "Email" | "SMS" | "App" | "All"

export type NotificationStatus = "Sent" | "Delivered" | "Failed" | "Pending"

export type PerformanceLevel = "Excellent" | "Good" | "Average" | "Poor" | "Critical"

export type SystemStatus = "Healthy" | "Warning" | "Critical" | "Maintenance"

export type School = {
  id: ID
  name: string
  brand: Brand
  contactEmail: string
  contactPhone?: string
  address?: string
  website?: string
  createdAt: string
  active: boolean
  plan: PricingPlan
  maxStudents: number
  currentStudentCount: number
  currentBilling?: {
    plan: PricingPlan
    amount: number
    billingCycle: BillingCycle
    nextBilling: string
    paymentMethod?: string
    paymentStatus: "Active" | "Overdue" | "Cancelled"
  }
  stats: {
    students: number
    teachers: number
    classes: number
    subjects: number
    averagePerformance: number
    lastResultSubmission?: string
  }
  adminAssigned?: string
  settings: {
    gradingScale: string[]
    terms: string[]
    academicYear: string
    allowParentAccess: boolean
    smsCredits: number
    maxCA: number
    maxExam: number
    passingGrade: number
    resultVisibility: "Public" | "Private" | "Token"
    notificationChannels: NotificationChannel[]
  }
}

export type Teacher = {
  id: ID
  name: string
  email: string
  phoneNumber?: string
  photoUrl?: string
  subjects: string[]
  classes: ID[]
  schoolId: ID
  active: boolean
  lastLogin?: string
  qualifications?: string[]
  experience?: number
  dateJoined?: string
  specializations?: string[]
  workload: {
    totalClasses: number
    totalStudents: number
    weeklyHours: number
  }
  performance: {
    submissionTimeliness: number
    studentFeedback: number
    classAverage: number
    communicationActivity: number
  }
  schedule?: {
    monday?: string[]
    tuesday?: string[]
    wednesday?: string[]
    thursday?: string[]
    friday?: string[]
  }
}

export type Student = {
  id: ID
  studentId: string
  name: string
  email?: string
  photoUrl?: string
  dateOfBirth?: string
  gender?: "Male" | "Female"
  schoolId: ID
  classId: ID
  parentName?: string
  parentEmail?: string
  parentPhone?: string
  secondaryParentName?: string
  secondaryParentEmail?: string
  secondaryParentPhone?: string
  address?: string
  enrollmentDate: string
  active: boolean
  lastLogin?: string
  performanceLevel: PerformanceLevel
  currentGPA: number
  attendance?: {
    totalDays: number
    presentDays: number
    absentDays: number
    percentage: number
  }
  achievements?: {
    id: string
    title: string
    description: string
    dateEarned: string
    category: "Academic" | "Behavior" | "Sports" | "Leadership"
  }[]
  medicalInfo?: {
    allergies?: string[]
    medications?: string[]
    emergencyContact?: string
    bloodGroup?: string
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
  capacity?: number
  academicYear?: string
  term?: string
  schedule?: {
    periods: number
    startTime: string
    endTime: string
  }
  performance?: {
    averageCA: number
    averageExam: number
    overallAverage: number
    topPerformers: ID[]
    needsAttention: ID[]
  }
}

export type Subject = {
  id: ID
  code: string // e.g. "MTH"
  name: string // e.g. "Mathematics"
  schoolId: ID
  teacherIds: ID[]
  classIds: ID[]
  isCore?: boolean
  creditHours?: number
  description?: string
  passingGrade?: number
  performance?: {
    averageCA: number
    averageExam: number
    passRate: number
    difficulty: "Easy" | "Medium" | "Hard"
  }
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
  grade?: string
  position?: number
  term: "Term 1" | "Term 2" | "Term 3"
  session: string // e.g. "2024/2025"
  submittedAt: string
  submittedBy?: ID // teacher ID
  teacherRemark?: string
  modifiedAt?: string
  verified?: boolean
}

export type Assessment = {
  id: ID
  title: string
  type: "CA" | "Exam" | "Project" | "Assignment"
  subjectId: ID
  classId: ID
  schoolId: ID
  maxScore: number
  date: string
  term: "Term 1" | "Term 2" | "Term 3"
  session: string
  instructions?: string
  duration?: number // in minutes
  createdBy: ID
  results?: {
    studentId: ID
    score: number
    submittedAt?: string
  }[]
}

export type NotificationItem = {
  id: ID
  title: string
  message: string
  createdAt: string
  scheduledFor?: string
  audience: "School" | "Class" | "Student" | "Teacher" | "Parent" | "Custom"
  delivery: "Email" | "SMS" | "App" | "Push"
  status: "Draft" | "Scheduled" | "Sent" | "Failed" | "Cancelled"
  priority: "Low" | "Medium" | "High" | "Urgent"
  schoolId?: ID
  classId?: ID
  recipientIds?: ID[]
  templateId?: string
  metadata?: {
    emailsSent?: number
    smssSent?: number
    deliveryRate?: number
    openRate?: number
    clickRate?: number
    unsubscribeRate?: number
    bounceRate?: number
  }
  attachments?: {
    fileName: string
    fileUrl: string
    fileSize: number
  }[]
  // Multi-channel delivery support
  channels?: ("Email" | "SMS" | "App" | "Push")[]
  // A/B testing support
  abTestConfig?: {
    enabled: boolean
    variantA: {
      title: string
      message: string
      percentage: number
    }
    variantB: {
      title: string
      message: string
      percentage: number
    }
    results?: {
      variantA: {
        sent: number
        delivered: number
        opened: number
        clicked: number
      }
      variantB: {
        sent: number
        delivered: number
        opened: number
        clicked: number
      }
    }
  }
  // Delivery tracking
  deliveryTracking?: {
    sentAt?: string
    deliveredAt?: string
    openedAt?: string
    clickedAt?: string
    failureReason?: string
  }
}

export type NotificationTemplate = {
  id: ID
  name: string
  category: "Academic" | "Administrative" | "Event" | "Reminder" | "Alert"
  subject: string
  message: string
  variables: string[] // e.g., ["studentName", "className", "date"]
  schoolId?: ID
  isSystem: boolean
  createdBy: ID
  createdAt: string
  updatedAt?: string
  // Template usage statistics
  usageStats?: {
    timesUsed: number
    lastUsed?: string
    avgOpenRate?: number
    avgClickRate?: number
  }
  // Template versioning
  version?: number
  previousVersionId?: ID
  // Template customization
  customFields?: {
    key: string
    label: string
    type: "text" | "number" | "date" | "select"
    options?: string[]
    required: boolean
  }[]
}

export type TokenRecord = {
  id: ID
  studentId: string // student public ID (not DB id)
  attempts: number
  maxAttempts: number
  expiresAt: string
  createdAt: string
  lastAttempt?: string
  isActive: boolean
}

export type ActivityLog = {
  id: ID
  userId: ID
  userRole: UserRole
  action: string
  details: string
  ipAddress?: string
  userAgent?: string
  timestamp: string
  schoolId?: ID
  affectedResource?: {
    type: "Student" | "Teacher" | "Class" | "Subject" | "Result" | "School"
    id: ID
    name: string
  }
}

export type AdminDashboardStats = {
  totals: {
    students: number
    teachers: number
    classes: number
    schools: number
  }
  growthPercent: number
  teachersActive: number
  teachersInactive: number
  byGrade: { grade: string; count: number }[]
  byPlan: { plan: PricingPlan; count: number; revenue: number }[]
  recentResults: ResultEntry[]
  pendingNotifications: number
  systemHealth: "Healthy" | "Degraded" | "Issues"
  performance: {
    averageGPA: number
    passRate: number
    topPerformingSchools: { schoolId: ID; schoolName: string; average: number }[]
    subjectPerformance: { subject: string; average: number; improvement: number }[]
  }
  financials?: {
    monthlyRevenue: number
    totalRevenue: number
    outstandingPayments: number
    churnRate: number
  }
  charts: {
    studentTrend: { month: string; count: number; growth: number }[]
    performanceTrend: { month: string; avg: number }[]
    subjectDistribution: { subject: string; avg: number; students: number }[]
    classComparison: { className: string; math: number; eng: number; sci: number }[]
    monthlySubmissions: { month: string; submissions: number; onTime: number }[]
    notificationStats: { month: string; delivered: number; failed: number; opened: number }[]
    revenueGrowth: { month: string; revenue: number; newSubscriptions: number }[]
  }
  recentActivities: { 
    id: ID
    type: "student" | "teacher" | "result" | "system" | "billing" | "notification"
    message: string
    at: string
    severity: "info" | "warning" | "error" | "success"
    schoolId?: ID
    userId?: ID
  }[]
}

export type StudentDashboardStats = {
  student: Student
  currentResults: ResultEntry[]
  performance: {
    currentGPA: number
    termAverage: number
    classRank?: number
    totalStudentsInClass: number
    subjectBreakdown: {
      subjectId: ID
      subjectName: string
      ca: number
      exam: number
      total: number
      grade: string
      trend: "up" | "down" | "stable"
    }[]
    strengths: string[]
    improvements: string[]
  }
  notifications: NotificationItem[]
  upcomingAssessments: Assessment[]
  achievements: {
    id: ID
    title: string
    description: string
    earnedAt: string
    type: "Academic" | "Attendance" | "Behavior" | "Special"
  }[]
}

export type TeacherDashboardStats = {
  teacher: Teacher
  myClasses: (ClassRoom & {
    students: Student[]
    averagePerformance: number
    pendingSubmissions: number
  })[]
  mySubjects: Subject[]
  pendingTasks: {
    resultEntries: number
    assessments: number
    notifications: number
  }
  performance: {
    submissionTimeliness: number
    studentFeedback: number
    classAverages: { classId: ID; className: string; average: number }[]
  }
  recentActivities: ActivityLog[]
  quickStats: {
    totalStudents: number
    resultsThisTerm: number
    averageClassPerformance: number
    notificationsSent: number
  }
}

// Enhanced types for comprehensive system
export type BulkImport = {
  id: ID
  type: "Students" | "Teachers" | "Results"
  fileName: string
  uploadedBy: ID
  uploadedAt: string
  status: "Processing" | "Completed" | "Failed" | "Cancelled"
  totalRecords: number
  processedRecords: number
  failedRecords: number
  errors?: {
    row: number
    field: string
    error: string
  }[]
  schoolId: ID
}

export type Report = {
  id: ID
  name: string
  type: "Student" | "Class" | "Subject" | "School" | "Teacher" | "Custom"
  parameters: {
    schoolId?: ID
    classId?: ID
    subjectId?: ID
    studentId?: ID
    teacherId?: ID
    dateRange?: {
      start: string
      end: string
    }
    term?: string
    session?: string
  }
  generatedBy: ID
  generatedAt: string
  fileUrl?: string
  status: "Generating" | "Ready" | "Failed" | "Expired"
  expiresAt?: string
  format: "PDF" | "Excel" | "CSV"
  size?: number
}

export type Analytics = {
  schoolPerformance: {
    averageGPA: number
    passRate: number
    topSubjects: { subjectName: string; average: number }[]
    bottomSubjects: { subjectName: string; average: number }[]
    trendData: { month: string; performance: number }[]
  }
  classComparison: {
    classId: ID
    className: string
    average: number
    studentCount: number
    passRate: number
  }[]
  subjectAnalysis: {
    subjectId: ID
    subjectName: string
    difficulty: "Easy" | "Medium" | "Hard"
    averageCA: number
    averageExam: number
    passRate: number
    teacherEffectiveness: number
  }[]
  studentInsights: {
    topPerformers: { studentId: ID; name: string; gpa: number }[]
    strugglingStudents: { studentId: ID; name: string; gpa: number; issues: string[] }[]
    improvementCandidates: { studentId: ID; name: string; potential: number }[]
  }
}

export type Token = {
  id: ID
  token: string
  studentId: ID
  classId: ID
  schoolId: ID
  generatedAt: string
  expiresAt: string
  usageCount: number
  maxUsage: number
  active: boolean
  requestedBy?: string // parent email or phone
  purpose: "Result_Access" | "Report_Download" | "Profile_View"
}

export type PaymentRecord = {
  id: ID
  schoolId: ID
  amount: number
  plan: PricingPlan
  billingCycle: BillingCycle
  studentCount: number
  paymentDate: string
  dueDate: string
  status: "Paid" | "Pending" | "Overdue" | "Failed"
  paymentMethod: "Bank_Transfer" | "Card" | "USSD" | "Wallet"
  transactionRef?: string
  invoice?: {
    number: string
    downloadUrl: string
  }
}

export type SystemConfig = {
  maintenance: {
    enabled: boolean
    message: string
    scheduledStart?: string
    scheduledEnd?: string
  }
  features: {
    smsNotifications: boolean
    emailNotifications: boolean
    bulkImports: boolean
    analyticsReports: boolean
    publicResultCheck: boolean
    parentPortal: boolean
  }
  limits: {
    maxStudentsPerSchool: { [key in PricingPlan]: number }
    maxTeachersPerSchool: { [key in PricingPlan]: number }
    smsCreditsPerTerm: { [key in PricingPlan]: number }
  }
  pricing: {
    [key in PricingPlan]: {
      studentPrice: number
      features: string[]
      smsCredits: number
    }
  }
}
