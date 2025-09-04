import type { Student, Teacher, ClassRoom, School, Subject, Result, Notification, User, AdminDashboard } from "./types"

// Mock data for development and testing
class MockDatabase {
  private students: Student[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@student.edu",
      studentId: "STU001",
      dateOfBirth: "2005-03-15",
      grade: "Grade 10",
      classId: "1",
      schoolId: "1",
      parentName: "Jane Doe",
      parentEmail: "jane.doe@parent.com",
      parentPhone: "+1234567890",
      address: "123 Main St, City, State",
      enrollmentDate: "2023-09-01",
      status: "active",
      gpa: 3.8,
      attendance: 95,
      subjects: ["Mathematics", "English", "Science", "History"],
      emergencyContact: {
        name: "Jane Doe",
        relationship: "Mother",
        phone: "+1234567890",
      },
    },
    {
      id: "2",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@student.edu",
      studentId: "STU002",
      dateOfBirth: "2005-07-22",
      grade: "Grade 10",
      classId: "1",
      schoolId: "1",
      parentName: "Bob Johnson",
      parentEmail: "bob.johnson@parent.com",
      parentPhone: "+1234567891",
      address: "456 Oak Ave, City, State",
      enrollmentDate: "2023-09-01",
      status: "active",
      gpa: 3.9,
      attendance: 98,
      subjects: ["Mathematics", "English", "Science", "Art"],
      emergencyContact: {
        name: "Bob Johnson",
        relationship: "Father",
        phone: "+1234567891",
      },
    },
    {
      id: "3",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@student.edu",
      studentId: "STU003",
      dateOfBirth: "2005-11-08",
      grade: "Grade 9",
      classId: "2",
      schoolId: "1",
      parentName: "Sarah Brown",
      parentEmail: "sarah.brown@parent.com",
      parentPhone: "+1234567892",
      address: "789 Pine St, City, State",
      enrollmentDate: "2023-09-01",
      status: "active",
      gpa: 3.6,
      attendance: 92,
      subjects: ["Mathematics", "English", "Science", "PE"],
      emergencyContact: {
        name: "Sarah Brown",
        relationship: "Mother",
        phone: "+1234567892",
      },
    },
  ]

  private teachers: Teacher[] = [
    {
      id: "1",
      firstName: "Dr. Sarah",
      lastName: "Wilson",
      email: "sarah.wilson@school.edu",
      employeeId: "TCH001",
      department: "Mathematics",
      subjects: ["Mathematics", "Statistics"],
      classIds: ["1", "2"],
      schoolId: "1",
      phone: "+1234567893",
      hireDate: "2020-08-15",
      qualification: "PhD in Mathematics",
      experience: 8,
      status: "active",
      salary: 65000,
      address: "321 Teacher Lane, City, State",
    },
    {
      id: "2",
      firstName: "Mr. James",
      lastName: "Davis",
      email: "james.davis@school.edu",
      employeeId: "TCH002",
      department: "English",
      subjects: ["English Literature", "Creative Writing"],
      classIds: ["1", "3"],
      schoolId: "1",
      phone: "+1234567894",
      hireDate: "2019-09-01",
      qualification: "MA in English Literature",
      experience: 10,
      status: "active",
      salary: 58000,
      address: "654 Faculty St, City, State",
    },
  ]

  private classes: ClassRoom[] = [
    {
      id: "1",
      name: "Grade 10A",
      grade: "Grade 10",
      section: "A",
      teacherId: "1",
      schoolId: "1",
      capacity: 30,
      currentEnrollment: 25,
      subjects: ["Mathematics", "English", "Science", "History"],
      schedule: {
        monday: ["Math", "English", "Science", "History"],
        tuesday: ["English", "Math", "PE", "Art"],
        wednesday: ["Science", "Math", "English", "Music"],
        thursday: ["History", "Science", "Math", "English"],
        friday: ["Math", "English", "Science", "Review"],
      },
      room: "Room 101",
      academicYear: "2023-2024",
    },
    {
      id: "2",
      name: "Grade 9B",
      grade: "Grade 9",
      section: "B",
      teacherId: "2",
      schoolId: "1",
      capacity: 28,
      currentEnrollment: 22,
      subjects: ["Mathematics", "English", "Science", "PE"],
      schedule: {
        monday: ["Math", "English", "Science", "PE"],
        tuesday: ["English", "Math", "Art", "Science"],
        wednesday: ["Science", "Math", "English", "Music"],
        thursday: ["PE", "Science", "Math", "English"],
        friday: ["Math", "English", "Science", "Review"],
      },
      room: "Room 102",
      academicYear: "2023-2024",
    },
  ]

  private schools: School[] = [
    {
      id: "1",
      name: "Greenwood High School",
      address: "123 Education Blvd, Learning City, State 12345",
      phone: "+1234567895",
      email: "info@greenwood.edu",
      website: "https://greenwood.edu",
      principalName: "Dr. Robert Smith",
      establishedYear: 1985,
      type: "Public",
      grades: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
      totalStudents: 1200,
      totalTeachers: 85,
      facilities: ["Library", "Computer Lab", "Science Lab", "Gymnasium", "Cafeteria"],
      accreditation: "State Board Certified",
    },
  ]

  private subjects: Subject[] = [
    {
      id: "1",
      name: "Mathematics",
      code: "MATH",
      description: "Advanced Mathematics including Algebra, Geometry, and Calculus",
      credits: 4,
      department: "Mathematics",
      prerequisites: [],
      grade: "Grade 10",
    },
    {
      id: "2",
      name: "English Literature",
      code: "ENG",
      description: "English Language and Literature studies",
      credits: 3,
      department: "English",
      prerequisites: [],
      grade: "Grade 10",
    },
    {
      id: "3",
      name: "Science",
      code: "SCI",
      description: "General Science including Physics, Chemistry, and Biology",
      credits: 4,
      department: "Science",
      prerequisites: [],
      grade: "Grade 10",
    },
  ]

  private results: Result[] = [
    {
      id: "1",
      studentId: "1",
      subjectId: "1",
      examType: "Midterm",
      score: 85,
      maxScore: 100,
      grade: "A",
      examDate: "2024-01-15",
      teacherId: "1",
      term: "Fall 2023",
      academicYear: "2023-2024",
      remarks: "Excellent performance in algebra",
    },
    {
      id: "2",
      studentId: "1",
      subjectId: "2",
      examType: "Midterm",
      score: 78,
      maxScore: 100,
      grade: "B+",
      examDate: "2024-01-16",
      teacherId: "2",
      term: "Fall 2023",
      academicYear: "2023-2024",
      remarks: "Good understanding of literature concepts",
    },
  ]

  private notifications: Notification[] = [
    {
      id: "1",
      title: "Parent-Teacher Conference",
      message:
        "Parent-teacher conferences are scheduled for next week. Please check your email for appointment details.",
      type: "announcement",
      priority: "high",
      targetAudience: "parents",
      createdAt: "2024-01-10T10:00:00Z",
      createdBy: "admin",
      isRead: false,
      scheduledFor: "2024-01-20T09:00:00Z",
    },
    {
      id: "2",
      title: "Exam Schedule Released",
      message:
        "The final exam schedule has been released. Students can view their exam timetable in the student portal.",
      type: "academic",
      priority: "medium",
      targetAudience: "students",
      createdAt: "2024-01-08T14:30:00Z",
      createdBy: "academic_office",
      isRead: false,
      scheduledFor: "2024-01-25T08:00:00Z",
    },
  ]

  private users: User[] = [
    {
      id: "1",
      email: "admin@school.edu",
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      schoolId: "1",
      isActive: true,
      lastLogin: "2024-01-15T09:00:00Z",
      createdAt: "2023-08-01T00:00:00Z",
    },
    {
      id: "2",
      email: "sarah.wilson@school.edu",
      role: "teacher",
      firstName: "Sarah",
      lastName: "Wilson",
      schoolId: "1",
      isActive: true,
      lastLogin: "2024-01-15T08:30:00Z",
      createdAt: "2020-08-15T00:00:00Z",
    },
  ]

  // CRUD Operations for Students
  listStudents(filters?: { grade?: string; classId?: string; status?: string }) {
    let filteredStudents = [...this.students]

    if (filters?.grade) {
      filteredStudents = filteredStudents.filter((s) => s.grade === filters.grade)
    }
    if (filters?.classId) {
      filteredStudents = filteredStudents.filter((s) => s.classId === filters.classId)
    }
    if (filters?.status) {
      filteredStudents = filteredStudents.filter((s) => s.status === filters.status)
    }

    return {
      data: filteredStudents,
      total: filteredStudents.length,
      success: true,
    }
  }

  getStudent(id: string) {
    const student = this.students.find((s) => s.id === id)
    return {
      data: student,
      success: !!student,
      error: student ? null : "Student not found",
    }
  }

  createStudent(studentData: Omit<Student, "id">) {
    const newStudent: Student = {
      ...studentData,
      id: (this.students.length + 1).toString(),
    }
    this.students.push(newStudent)
    return {
      data: newStudent,
      success: true,
    }
  }

  updateStudent(id: string, updates: Partial<Student>) {
    const index = this.students.findIndex((s) => s.id === id)
    if (index === -1) {
      return {
        data: null,
        success: false,
        error: "Student not found",
      }
    }

    this.students[index] = { ...this.students[index], ...updates }
    return {
      data: this.students[index],
      success: true,
    }
  }

  deleteStudent(id: string) {
    const index = this.students.findIndex((s) => s.id === id)
    if (index === -1) {
      return {
        success: false,
        error: "Student not found",
      }
    }

    this.students.splice(index, 1)
    return {
      success: true,
    }
  }

  // CRUD Operations for Teachers
  listTeachers(filters?: { department?: string; status?: string }) {
    let filteredTeachers = [...this.teachers]

    if (filters?.department) {
      filteredTeachers = filteredTeachers.filter((t) => t.department === filters.department)
    }
    if (filters?.status) {
      filteredTeachers = filteredTeachers.filter((t) => t.status === filters.status)
    }

    return {
      data: filteredTeachers,
      total: filteredTeachers.length,
      success: true,
    }
  }

  getTeacher(id: string) {
    const teacher = this.teachers.find((t) => t.id === id)
    return {
      data: teacher,
      success: !!teacher,
      error: teacher ? null : "Teacher not found",
    }
  }

  // CRUD Operations for Classes
  listClasses(filters?: { grade?: string; teacherId?: string }) {
    let filteredClasses = [...this.classes]

    if (filters?.grade) {
      filteredClasses = filteredClasses.filter((c) => c.grade === filters.grade)
    }
    if (filters?.teacherId) {
      filteredClasses = filteredClasses.filter((c) => c.teacherId === filters.teacherId)
    }

    return {
      data: filteredClasses,
      total: filteredClasses.length,
      success: true,
    }
  }

  getClass(id: string) {
    const classRoom = this.classes.find((c) => c.id === id)
    return {
      data: classRoom,
      success: !!classRoom,
      error: classRoom ? null : "Class not found",
    }
  }

  // CRUD Operations for Schools
  listSchools() {
    return {
      data: this.schools,
      total: this.schools.length,
      success: true,
    }
  }

  getSchool(id: string) {
    const school = this.schools.find((s) => s.id === id)
    return {
      data: school,
      success: !!school,
      error: school ? null : "School not found",
    }
  }

  // CRUD Operations for Subjects
  listSubjects(filters?: { department?: string; grade?: string }) {
    let filteredSubjects = [...this.subjects]

    if (filters?.department) {
      filteredSubjects = filteredSubjects.filter((s) => s.department === filters.department)
    }
    if (filters?.grade) {
      filteredSubjects = filteredSubjects.filter((s) => s.grade === filters.grade)
    }

    return {
      data: filteredSubjects,
      total: filteredSubjects.length,
      success: true,
    }
  }

  // CRUD Operations for Results
  listResults(filters?: { studentId?: string; subjectId?: string; term?: string }) {
    let filteredResults = [...this.results]

    if (filters?.studentId) {
      filteredResults = filteredResults.filter((r) => r.studentId === filters.studentId)
    }
    if (filters?.subjectId) {
      filteredResults = filteredResults.filter((r) => r.subjectId === filters.subjectId)
    }
    if (filters?.term) {
      filteredResults = filteredResults.filter((r) => r.term === filters.term)
    }

    return {
      data: filteredResults,
      total: filteredResults.length,
      success: true,
    }
  }

  // CRUD Operations for Notifications
  listNotifications(filters?: { type?: string; targetAudience?: string; isRead?: boolean }) {
    let filteredNotifications = [...this.notifications]

    if (filters?.type) {
      filteredNotifications = filteredNotifications.filter((n) => n.type === filters.type)
    }
    if (filters?.targetAudience) {
      filteredNotifications = filteredNotifications.filter((n) => n.targetAudience === filters.targetAudience)
    }
    if (filters?.isRead !== undefined) {
      filteredNotifications = filteredNotifications.filter((n) => n.isRead === filters.isRead)
    }

    return {
      data: filteredNotifications,
      total: filteredNotifications.length,
      success: true,
    }
  }

  createNotification(notificationData: Omit<Notification, "id" | "createdAt">) {
    const newNotification: Notification = {
      ...notificationData,
      id: (this.notifications.length + 1).toString(),
      createdAt: new Date().toISOString(),
    }
    this.notifications.push(newNotification)
    return {
      data: newNotification,
      success: true,
    }
  }

  // Dashboard Analytics
  getAdminDashboard(): AdminDashboard {
    const totalStudents = this.students.length
    const totalTeachers = this.teachers.length
    const totalClasses = this.classes.length
    const activeStudents = this.students.filter((s) => s.status === "active").length

    // Calculate average attendance
    const avgAttendance = this.students.reduce((sum, s) => sum + s.attendance, 0) / totalStudents

    // Calculate average GPA
    const avgGPA = this.students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents

    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      activeStudents,
      avgAttendance: Math.round(avgAttendance * 100) / 100,
      avgGPA: Math.round(avgGPA * 100) / 100,
      recentActivities: [
        {
          id: "1",
          type: "enrollment",
          description: "New student enrolled: Alice Johnson",
          timestamp: "2024-01-15T10:30:00Z",
          userId: "admin",
        },
        {
          id: "2",
          type: "grade_update",
          description: "Grades updated for Mathematics - Grade 10A",
          timestamp: "2024-01-15T09:15:00Z",
          userId: "1",
        },
      ],
      charts: {
        enrollmentTrend: [
          { month: "Jan", students: 1150 },
          { month: "Feb", students: 1165 },
          { month: "Mar", students: 1180 },
          { month: "Apr", students: 1195 },
          { month: "May", students: 1200 },
        ],
        gradeDistribution: [
          { grade: "A", count: 45, percentage: 37.5 },
          { grade: "B", count: 38, count: 31.7 },
          { grade: "C", count: 25, percentage: 20.8 },
          { grade: "D", count: 8, percentage: 6.7 },
          { grade: "F", count: 4, percentage: 3.3 },
        ],
        subjectDistribution: [
          { subject: "Mathematics", students: 120, avgScore: 82 },
          { subject: "English", students: 118, avgScore: 78 },
          { subject: "Science", students: 115, avgScore: 85 },
          { subject: "History", students: 95, avgScore: 76 },
        ],
        attendanceTrend: [
          { month: "Jan", attendance: 94 },
          { month: "Feb", attendance: 95 },
          { month: "Mar", attendance: 93 },
          { month: "Apr", attendance: 96 },
          { month: "May", attendance: 95 },
        ],
      },
    }
  }

  // Search functionality
  searchStudents(query: string) {
    const lowercaseQuery = query.toLowerCase()
    const results = this.students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(lowercaseQuery) ||
        student.lastName.toLowerCase().includes(lowercaseQuery) ||
        student.studentId.toLowerCase().includes(lowercaseQuery) ||
        student.email.toLowerCase().includes(lowercaseQuery),
    )

    return {
      data: results,
      total: results.length,
      success: true,
    }
  }

  searchTeachers(query: string) {
    const lowercaseQuery = query.toLowerCase()
    const results = this.teachers.filter(
      (teacher) =>
        teacher.firstName.toLowerCase().includes(lowercaseQuery) ||
        teacher.lastName.toLowerCase().includes(lowercaseQuery) ||
        teacher.employeeId.toLowerCase().includes(lowercaseQuery) ||
        teacher.email.toLowerCase().includes(lowercaseQuery) ||
        teacher.department.toLowerCase().includes(lowercaseQuery),
    )

    return {
      data: results,
      total: results.length,
      success: true,
    }
  }

  // Bulk operations
  bulkUpdateStudents(studentIds: string[], updates: Partial<Student>) {
    const updatedStudents = []

    for (const id of studentIds) {
      const index = this.students.findIndex((s) => s.id === id)
      if (index !== -1) {
        this.students[index] = { ...this.students[index], ...updates }
        updatedStudents.push(this.students[index])
      }
    }

    return {
      data: updatedStudents,
      success: true,
      updated: updatedStudents.length,
    }
  }

  // Import/Export functionality
  exportStudents(format: "csv" | "json" = "json") {
    if (format === "json") {
      return {
        data: JSON.stringify(this.students, null, 2),
        filename: `students_export_${new Date().toISOString().split("T")[0]}.json`,
        success: true,
      }
    }

    // CSV export logic would go here
    const csvHeaders = "ID,First Name,Last Name,Email,Student ID,Grade,Class ID"
    const csvRows = this.students.map(
      (s) => `${s.id},${s.firstName},${s.lastName},${s.email},${s.studentId},${s.grade},${s.classId}`,
    )

    return {
      data: [csvHeaders, ...csvRows].join("\n"),
      filename: `students_export_${new Date().toISOString().split("T")[0]}.csv`,
      success: true,
    }
  }

  importStudents(data: Student[]) {
    const importedStudents = []

    for (const studentData of data) {
      // Validate and create new student
      const newStudent: Student = {
        ...studentData,
        id: (this.students.length + importedStudents.length + 1).toString(),
      }

      this.students.push(newStudent)
      importedStudents.push(newStudent)
    }

    return {
      data: importedStudents,
      success: true,
      imported: importedStudents.length,
    }
  }
}

// Export singleton instance
export const db = new MockDatabase()
