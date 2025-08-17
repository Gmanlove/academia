// Mock Database for Academia School Management System
// This provides a comprehensive data layer for the application

export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "Male" | "Female"
  address: string
  guardianName: string
  guardianPhone: string
  guardianEmail: string
  classId: string
  schoolId: string
  admissionNumber: string
  admissionDate: string
  status: "Active" | "Inactive" | "Graduated" | "Transferred"
  profileImage?: string
  bloodGroup?: string
  medicalConditions?: string[]
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  createdAt: string
  updatedAt: string
}

export interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "Male" | "Female"
  address: string
  qualification: string[]
  experience: number
  specialization: string[]
  employeeId: string
  dateOfJoining: string
  salary: number
  status: "Active" | "Inactive" | "On Leave"
  schoolId: string
  subjectIds: string[]
  classIds: string[]
  profileImage?: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  createdAt: string
  updatedAt: string
}

export interface School {
  id: string
  name: string
  address: string
  phone: string
  email: string
  website?: string
  principalName: string
  principalPhone: string
  principalEmail: string
  establishedYear: number
  schoolType: "Primary" | "Secondary" | "Mixed"
  ownership: "Public" | "Private" | "Federal" | "State"
  logo?: string
  motto?: string
  vision?: string
  mission?: string
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  status: "Active" | "Inactive"
  createdAt: string
  updatedAt: string
}

export interface Class {
  id: string
  name: string
  level: string
  section?: string
  schoolId: string
  teacherId: string
  capacity: number
  currentStrength: number
  academicYear: string
  status: "Active" | "Inactive"
  createdAt: string
  updatedAt: string
}

export interface Subject {
  id: string
  name: string
  code: string
  description?: string
  category: "Core" | "Elective" | "Vocational"
  creditHours: number
  schoolId: string
  classIds: string[]
  teacherIds: string[]
  status: "Active" | "Inactive"
  createdAt: string
  updatedAt: string
}

export interface Result {
  id: string
  studentId: string
  subjectId: string
  classId: string
  schoolId: string
  term: "First" | "Second" | "Third"
  academicYear: string
  assessmentType: "CA1" | "CA2" | "CA3" | "Exam" | "Project"
  score: number
  maxScore: number
  grade: string
  remark?: string
  teacherId: string
  dateRecorded: string
  status: "Draft" | "Published" | "Verified"
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "Academic" | "Administrative" | "Event" | "Emergency" | "General"
  priority: "Low" | "Medium" | "High" | "Urgent"
  audience: "All" | "Students" | "Teachers" | "Parents" | "Staff"
  targetIds?: string[]
  schoolId: string
  senderId: string
  senderType: "Admin" | "Teacher" | "System"
  deliveryMethod: "Email" | "SMS" | "App" | "All"
  scheduledFor?: string
  sentAt?: string
  status: "Draft" | "Scheduled" | "Sent" | "Failed"
  readBy: string[]
  createdAt: string
  updatedAt: string
}

// Mock Data
const mockStudents: Student[] = [
  {
    id: "1",
    firstName: "Adebayo",
    lastName: "Johnson",
    email: "adebayo.johnson@student.edu.ng",
    phone: "+234-803-123-4567",
    dateOfBirth: "2008-03-15",
    gender: "Male",
    address: "15 Ikeja Road, Lagos State",
    guardianName: "Mrs. Folake Johnson",
    guardianPhone: "+234-803-123-4568",
    guardianEmail: "folake.johnson@gmail.com",
    classId: "1",
    schoolId: "1",
    admissionNumber: "ACA/2023/001",
    admissionDate: "2023-09-01",
    status: "Active",
    bloodGroup: "O+",
    emergencyContact: {
      name: "Mr. Tunde Johnson",
      phone: "+234-803-123-4569",
      relationship: "Father",
    },
    createdAt: "2023-09-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    firstName: "Chioma",
    lastName: "Okafor",
    email: "chioma.okafor@student.edu.ng",
    phone: "+234-805-234-5678",
    dateOfBirth: "2007-07-22",
    gender: "Female",
    address: "23 Enugu Road, Enugu State",
    guardianName: "Mr. Emeka Okafor",
    guardianPhone: "+234-805-234-5679",
    guardianEmail: "emeka.okafor@yahoo.com",
    classId: "2",
    schoolId: "1",
    admissionNumber: "ACA/2023/002",
    admissionDate: "2023-09-01",
    status: "Active",
    bloodGroup: "A+",
    emergencyContact: {
      name: "Mrs. Ngozi Okafor",
      phone: "+234-805-234-5680",
      relationship: "Mother",
    },
    createdAt: "2023-09-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

const mockTeachers: Teacher[] = [
  {
    id: "1",
    firstName: "Dr. Amina",
    lastName: "Hassan",
    email: "amina.hassan@school.edu.ng",
    phone: "+234-807-345-6789",
    dateOfBirth: "1985-05-10",
    gender: "Female",
    address: "45 Ahmadu Bello Way, Kaduna State",
    qualification: ["B.Ed Mathematics", "M.Ed Educational Management", "Ph.D Mathematics Education"],
    experience: 12,
    specialization: ["Mathematics", "Further Mathematics", "Statistics"],
    employeeId: "TCH/001",
    dateOfJoining: "2015-01-15",
    salary: 350000,
    status: "Active",
    schoolId: "1",
    subjectIds: ["1", "2"],
    classIds: ["1", "2"],
    emergencyContact: {
      name: "Malam Ibrahim Hassan",
      phone: "+234-807-345-6790",
      relationship: "Husband",
    },
    createdAt: "2015-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

const mockSchools: School[] = [
  {
    id: "1",
    name: "Academia International School",
    address: "123 Education Avenue, Victoria Island, Lagos State",
    phone: "+234-701-234-5678",
    email: "info@academia.edu.ng",
    website: "https://academia.edu.ng",
    principalName: "Mrs. Funmilayo Adebayo",
    principalPhone: "+234-701-234-5679",
    principalEmail: "principal@academia.edu.ng",
    establishedYear: 2010,
    schoolType: "Mixed",
    ownership: "Private",
    motto: "Excellence in Education",
    vision: "To be the leading educational institution in Nigeria",
    mission: "Providing quality education for the future leaders of tomorrow",
    totalStudents: 1250,
    totalTeachers: 85,
    totalClasses: 36,
    status: "Active",
    createdAt: "2010-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

const mockClasses: Class[] = [
  {
    id: "1",
    name: "JSS 1A",
    level: "JSS 1",
    section: "A",
    schoolId: "1",
    teacherId: "1",
    capacity: 35,
    currentStrength: 32,
    academicYear: "2023/2024",
    status: "Active",
    createdAt: "2023-09-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "JSS 2B",
    level: "JSS 2",
    section: "B",
    schoolId: "1",
    teacherId: "1",
    capacity: 35,
    currentStrength: 30,
    academicYear: "2023/2024",
    status: "Active",
    createdAt: "2023-09-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

const mockSubjects: Subject[] = [
  {
    id: "1",
    name: "Mathematics",
    code: "MTH101",
    description: "Basic Mathematics for Junior Secondary School",
    category: "Core",
    creditHours: 4,
    schoolId: "1",
    classIds: ["1", "2"],
    teacherIds: ["1"],
    status: "Active",
    createdAt: "2023-09-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "English Language",
    code: "ENG101",
    description: "English Language and Literature",
    category: "Core",
    creditHours: 4,
    schoolId: "1",
    classIds: ["1", "2"],
    teacherIds: ["1"],
    status: "Active",
    createdAt: "2023-09-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

const mockResults: Result[] = [
  {
    id: "1",
    studentId: "1",
    subjectId: "1",
    classId: "1",
    schoolId: "1",
    term: "First",
    academicYear: "2023/2024",
    assessmentType: "CA1",
    score: 18,
    maxScore: 20,
    grade: "A",
    teacherId: "1",
    dateRecorded: "2023-10-15",
    status: "Published",
    createdAt: "2023-10-15T00:00:00Z",
    updatedAt: "2023-10-15T00:00:00Z",
  },
]

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "First Term Results Released",
    message:
      "Dear Parents and Students, the First Term results for the 2023/2024 academic session have been released. Please check your portal for detailed results.",
    type: "Academic",
    priority: "High",
    audience: "All",
    schoolId: "1",
    senderId: "1",
    senderType: "Admin",
    deliveryMethod: "All",
    sentAt: "2024-01-15T10:00:00Z",
    status: "Sent",
    readBy: ["1", "2"],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
]

// Database Interface
export const db = {
  // Students
  students: {
    findAll: async (): Promise<Student[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(mockStudents), 100))
    },
    findById: async (id: string): Promise<Student | null> => {
      return new Promise((resolve) => setTimeout(() => resolve(mockStudents.find((s) => s.id === id) || null), 100))
    },
    findBySchool: async (schoolId: string): Promise<Student[]> => {
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockStudents.filter((s) => s.schoolId === schoolId)), 100),
      )
    },
    create: async (student: Omit<Student, "id" | "createdAt" | "updatedAt">): Promise<Student> => {
      const newStudent: Student = {
        ...student,
        id: (mockStudents.length + 1).toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockStudents.push(newStudent)
      return new Promise((resolve) => setTimeout(() => resolve(newStudent), 100))
    },
    update: async (id: string, updates: Partial<Student>): Promise<Student | null> => {
      const index = mockStudents.findIndex((s) => s.id === id)
      if (index === -1) return null

      mockStudents[index] = {
        ...mockStudents[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      return new Promise((resolve) => setTimeout(() => resolve(mockStudents[index]), 100))
    },
    delete: async (id: string): Promise<boolean> => {
      const index = mockStudents.findIndex((s) => s.id === id)
      if (index === -1) return false

      mockStudents.splice(index, 1)
      return new Promise((resolve) => setTimeout(() => resolve(true), 100))
    },
  },

  // Teachers
  teachers: {
    findAll: async (): Promise<Teacher[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(mockTeachers), 100))
    },
    findById: async (id: string): Promise<Teacher | null> => {
      return new Promise((resolve) => setTimeout(() => resolve(mockTeachers.find((t) => t.id === id) || null), 100))
    },
    findBySchool: async (schoolId: string): Promise<Teacher[]> => {
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockTeachers.filter((t) => t.schoolId === schoolId)), 100),
      )
    },
    create: async (teacher: Omit<Teacher, "id" | "createdAt" | "updatedAt">): Promise<Teacher> => {
      const newTeacher: Teacher = {
        ...teacher,
        id: (mockTeachers.length + 1).toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockTeachers.push(newTeacher)
      return new Promise((resolve) => setTimeout(() => resolve(newTeacher), 100))
    },
  },

  // Schools
  schools: {
    findAll: async (): Promise<School[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(mockSchools), 100))
    },
    findById: async (id: string): Promise<School | null> => {
      return new Promise((resolve) => setTimeout(() => resolve(mockSchools.find((s) => s.id === id) || null), 100))
    },
    create: async (school: Omit<School, "id" | "createdAt" | "updatedAt">): Promise<School> => {
      const newSchool: School = {
        ...school,
        id: (mockSchools.length + 1).toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockSchools.push(newSchool)
      return new Promise((resolve) => setTimeout(() => resolve(newSchool), 100))
    },
  },

  // Classes
  classes: {
    findAll: async (): Promise<Class[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(mockClasses), 100))
    },
    findBySchool: async (schoolId: string): Promise<Class[]> => {
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockClasses.filter((c) => c.schoolId === schoolId)), 100),
      )
    },
  },

  // Subjects
  subjects: {
    findAll: async (): Promise<Subject[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(mockSubjects), 100))
    },
    findBySchool: async (schoolId: string): Promise<Subject[]> => {
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockSubjects.filter((s) => s.schoolId === schoolId)), 100),
      )
    },
  },

  // Results
  results: {
    findAll: async (): Promise<Result[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(mockResults), 100))
    },
    findByStudent: async (studentId: string): Promise<Result[]> => {
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockResults.filter((r) => r.studentId === studentId)), 100),
      )
    },
    findByClass: async (classId: string): Promise<Result[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(mockResults.filter((r) => r.classId === classId)), 100))
    },
  },

  // Notifications
  notifications: {
    findAll: async (): Promise<Notification[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(mockNotifications), 100))
    },
    findBySchool: async (schoolId: string): Promise<Notification[]> => {
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockNotifications.filter((n) => n.schoolId === schoolId)), 100),
      )
    },
    create: async (notification: Omit<Notification, "id" | "createdAt" | "updatedAt">): Promise<Notification> => {
      const newNotification: Notification = {
        ...notification,
        id: (mockNotifications.length + 1).toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockNotifications.push(newNotification)
      return new Promise((resolve) => setTimeout(() => resolve(newNotification), 100))
    },
  },

  // Analytics
  analytics: {
    getSchoolStats: async (schoolId: string) => {
      return new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              totalStudents: mockStudents.filter((s) => s.schoolId === schoolId).length,
              totalTeachers: mockTeachers.filter((t) => t.schoolId === schoolId).length,
              totalClasses: mockClasses.filter((c) => c.schoolId === schoolId).length,
              totalSubjects: mockSubjects.filter((s) => s.schoolId === schoolId).length,
              averageScore: 85.5,
              passRate: 92.3,
              attendanceRate: 94.7,
              graduationRate: 98.1,
            }),
          100,
        ),
      )
    },
    getPerformanceData: async (schoolId: string) => {
      return new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              monthlyPerformance: [
                { month: "Jan", average: 82 },
                { month: "Feb", average: 85 },
                { month: "Mar", average: 88 },
                { month: "Apr", average: 86 },
                { month: "May", average: 89 },
                { month: "Jun", average: 91 },
              ],
              subjectPerformance: [
                { subject: "Mathematics", average: 87 },
                { subject: "English", average: 89 },
                { subject: "Science", average: 85 },
                { subject: "Social Studies", average: 88 },
              ],
            }),
          100,
        ),
      )
    },
  },
}

export default db
