import { createClient } from './supabase/client'
import type {
  School,
  Teacher,
  Student,
  ClassRoom,
  Subject,
  ResultEntry,
  NotificationItem,
  TokenRecord,
  AdminDashboardStats,
  ID
} from './types'

const supabase = createClient()

export const supabaseDb = {
  // Schools
  async listSchools(params?: { 
    brand?: string
    minStudents?: number
    maxStudents?: number
    q?: string
    active?: boolean 
  }) {
    let query = supabase
      .from('schools')
      .select('*')

    if (params?.brand) {
      query = query.eq('brand', params.brand)
    }
    if (typeof params?.active === 'boolean') {
      query = query.eq('active', params.active)
    }
    if (params?.minStudents) {
      query = query.gte('current_student_count', params.minStudents)
    }
    if (params?.maxStudents) {
      query = query.lte('current_student_count', params.maxStudents)
    }
    if (params?.q) {
      query = query.ilike('name', `%${params.q}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async getSchool(id: string) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async toggleSchoolActive(id: string, active: boolean) {
    const { data, error } = await supabase
      .from('schools')
      .update({ active })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteSchool(id: string) {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Students
  async listStudents(params?: {
    schoolId?: string
    classId?: string
    performanceLevel?: string
    q?: string
  }) {
    let query = supabase
      .from('students')
      .select(`
        *,
        schools:school_id(*),
        classes:class_id(*)
      `)

    if (params?.schoolId) {
      query = query.eq('school_id', params.schoolId)
    }
    if (params?.classId) {
      query = query.eq('class_id', params.classId)
    }
    if (params?.performanceLevel) {
      query = query.eq('performance_level', params.performanceLevel)
    }
    if (params?.q) {
      query = query.or(`name.ilike.%${params.q}%,student_id.ilike.%${params.q}%,parent_email.ilike.%${params.q}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async addStudent(payload: Omit<Student, 'id'>) {
    const { data, error } = await supabase
      .from('students')
      .insert([{
        student_id: payload.studentId,
        name: payload.name,
        email: payload.email,
        school_id: payload.schoolId,
        class_id: payload.classId,
        parent_name: payload.parentName,
        parent_email: payload.parentEmail,
        parent_phone: payload.parentPhone,
        performance_level: payload.performanceLevel || 'Average',
        current_gpa: payload.currentGPA || 3.0,
        active: true,
        enrollment_date: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async bulkImportStudents(payload: Omit<Student, 'id'>[]) {
    const studentsData = payload.map(p => ({
      student_id: p.studentId,
      name: p.name,
      email: p.email,
      school_id: p.schoolId,
      class_id: p.classId,
      parent_name: p.parentName,
      parent_email: p.parentEmail,
      parent_phone: p.parentPhone,
      performance_level: p.performanceLevel || 'Average',
      current_gpa: p.currentGPA || 3.0,
      active: true,
      enrollment_date: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('students')
      .insert(studentsData)
      .select()

    if (error) throw error
    return data || []
  },

  async getStudent(id: string) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        schools:school_id(*),
        classes:class_id(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Teachers
  async listTeachers(params?: { active?: boolean; schoolId?: string }) {
    let query = supabase
      .from('teachers')
      .select(`
        *,
        schools:school_id(*),
        teacher_subjects(subjects(*))
      `)

    if (typeof params?.active === 'boolean') {
      query = query.eq('active', params.active)
    }
    if (params?.schoolId) {
      query = query.eq('school_id', params.schoolId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async getTeacher(id: string) {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        *,
        schools:school_id(*),
        teacher_subjects(subjects(*))
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Classes
  async listClasses(params?: { schoolId?: string }) {
    let query = supabase
      .from('classes')
      .select(`
        *,
        schools:school_id(*),
        teachers:teacher_id(*)
      `)

    if (params?.schoolId) {
      query = query.eq('school_id', params.schoolId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  // Subjects
  async listSubjects(params?: { schoolId?: string }) {
    let query = supabase
      .from('subjects')
      .select(`
        *,
        schools:school_id(*)
      `)

    if (params?.schoolId) {
      query = query.eq('school_id', params.schoolId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  // Results
  async listResults(params?: { studentId?: string; schoolId?: string }) {
    let query = supabase
      .from('results')
      .select(`
        *,
        students:student_id(*),
        subjects:subject_id(*),
        classes:class_id(*),
        schools:school_id(*)
      `)

    if (params?.studentId) {
      query = query.eq('student_id', params.studentId)
    }
    if (params?.schoolId) {
      query = query.eq('school_id', params.schoolId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  // Notifications
  async listNotifications(params?: { schoolId?: string }) {
    let query = supabase
      .from('notifications')
      .select('*')

    if (params?.schoolId) {
      query = query.eq('school_id', params.schoolId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async addNotification(payload: Omit<NotificationItem, 'id' | 'createdAt' | 'status'> & { status?: string }) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        title: payload.title,
        message: payload.message,
        school_id: payload.schoolId,
        audience: payload.audience,
        delivery: payload.delivery,
        status: payload.status || 'Scheduled',
        scheduled_for: payload.scheduledFor ? new Date(payload.scheduledFor).toISOString() : null
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Tokens
  async findTokenByStudentPublicId(studentPublicId: string) {
    const { data, error } = await supabase
      .from('result_tokens')
      .select('*')
      .eq('student_id', studentPublicId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async createToken(studentPublicId: string) {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    const { data, error } = await supabase
      .from('result_tokens')
      .insert([{
        student_id: studentPublicId,
        attempts: 0,
        expires_at: expiresAt.toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async incrementTokenAttempt(id: string) {
    const { data, error } = await supabase
      .from('result_tokens')
      .update({ attempts: supabase.rpc('increment_attempts', { token_id: id }) })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Dashboard stats
  async getAdminDashboard(): Promise<AdminDashboardStats> {
    // Get basic counts
    const [schoolsResult, teachersResult, studentsResult, classesResult] = await Promise.all([
      supabase.from('schools').select('id', { count: 'exact' }),
      supabase.from('teachers').select('id', { count: 'exact' }),
      supabase.from('students').select('id', { count: 'exact' }),
      supabase.from('classes').select('id', { count: 'exact' })
    ])

    const totalStudents = studentsResult.count || 0
    const totalTeachers = teachersResult.count || 0
    const totalClasses = classesResult.count || 0

    // Get active/inactive teachers
    const activeTeachersResult = await supabase
      .from('teachers')
      .select('id', { count: 'exact' })
      .eq('active', true)

    const teachersActive = activeTeachersResult.count || 0
    const teachersInactive = totalTeachers - teachersActive

    // Get recent results (last 5)
    const recentResultsQuery = await supabase
      .from('results')
      .select(`
        *,
        students:student_id(name, student_id),
        subjects:subject_id(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    const recentResults = recentResultsQuery.data || []

    // Get pending notifications count
    const pendingNotificationsResult = await supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('status', 'Scheduled')

    const pendingNotifications = pendingNotificationsResult.count || 0

    // Mock chart data for now (in production, you'd calculate these from real data)
    const charts = {
      studentTrend: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => ({
        month: m,
        students: Math.round(50 + Math.random() * 100)
      })),
      subjectDistribution: [
        { subject: "Mathematics", average: Math.round(60 + Math.random() * 30) },
        { subject: "English", average: Math.round(65 + Math.random() * 25) },
        { subject: "Science", average: Math.round(55 + Math.random() * 35) }
      ],
      classComparison: [
        { class: "JSS 1A", math: Math.round(50 + Math.random() * 50), eng: Math.round(50 + Math.random() * 50), sci: Math.round(50 + Math.random() * 50) },
        { class: "JSS 1B", math: Math.round(50 + Math.random() * 50), eng: Math.round(50 + Math.random() * 50), sci: Math.round(50 + Math.random() * 50) }
      ],
      monthlySubmissions: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => ({
        month: m,
        submissions: Math.round(30 + Math.random() * 80)
      })),
      notificationStats: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => ({
        month: m,
        delivered: Math.round(100 + Math.random() * 200),
        failed: Math.round(Math.random() * 20)
      }))
    }

    const recentActivities = [
      { id: '1', type: 'student', message: 'New student registration', at: new Date().toISOString() },
      { id: '2', type: 'result', message: 'Score submission completed', at: new Date().toISOString() },
      { id: '3', type: 'teacher', message: 'Teacher login activity', at: new Date().toISOString() }
    ]

    return {
      totals: { students: totalStudents, teachers: totalTeachers, classes: totalClasses },
      growthPercent: 6.4,
      teachersActive,
      teachersInactive,
      byGrade: [
        { grade: 'JSS 1', count: Math.round(totalStudents * 0.3) },
        { grade: 'JSS 2', count: Math.round(totalStudents * 0.35) },
        { grade: 'JSS 3', count: Math.round(totalStudents * 0.35) }
      ],
      recentResults: recentResults.slice(0, 5),
      pendingNotifications,
      systemHealth: 'Healthy' as const,
      charts,
      recentActivities
    }
  }
}
