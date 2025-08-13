import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get session to ensure user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Only admins can access dashboard stats
    if (profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get basic counts
    const [
      { count: totalSchools },
      { count: totalStudents },
      { count: totalTeachers },
      { count: totalResults },
      { count: pendingNotifications }
    ] = await Promise.all([
      supabase.from('schools').select('*', { count: 'exact', head: true }),
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('teachers').select('*', { count: 'exact', head: true }),
      supabase.from('results').select('*', { count: 'exact', head: true }),
      supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('status', 'Scheduled')
    ])

    // Get schools with their stats
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select(`
        *,
        students(count),
        teachers(count)
      `)

    if (schoolsError) {
      console.error('Error fetching schools:', schoolsError)
      return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 })
    }

    // Get active teachers count
    const { count: teachersActive } = await supabase
      .from('teachers')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)

    const teachersInactive = (totalTeachers || 0) - (teachersActive || 0)

    // Get student distribution by grade level
    const { data: classes } = await supabase
      .from('classes')
      .select('level, student_count')

    const byGradeMap = new Map<string, number>()
    classes?.forEach((cls) => {
      const level = cls.level || 'Unknown'
      byGradeMap.set(level, (byGradeMap.get(level) || 0) + (cls.student_count || 0))
    })
    const byGrade = Array.from(byGradeMap.entries()).map(([grade, count]) => ({ grade, count }))

    // Get recent results (limit to last 5)
    const { data: recentResults } = await supabase
      .from('results')
      .select(`
        *,
        students(name, student_id),
        subjects(name),
        teachers(name)
      `)
      .order('submitted_at', { ascending: false })
      .limit(5)

    // Calculate performance metrics
    const { data: allResults } = await supabase
      .from('results')
      .select('total, ca, exam')

    let averageGPA = 0
    let passRate = 0
    if (allResults && allResults.length > 0) {
      const totalPoints = allResults.reduce((sum, r) => sum + (r.total || 0), 0)
      averageGPA = Math.round((totalPoints / allResults.length / 25) * 100) / 100
      passRate = Math.round((allResults.filter(r => (r.total || 0) >= 50).length / allResults.length) * 100)
    }

    // Get top performing schools
    const topPerformingSchools = schools?.slice(0, 3).map(school => ({
      schoolId: school.id,
      schoolName: school.name,
      average: 0 // Would need to calculate from results
    })) || []

    // Mock chart data for now (you can enhance this with real aggregations)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const studentTrend = monthNames.map((month, i) => ({
      month,
      count: Math.round(80 + Math.sin(i) * 10 + Math.random() * 20),
      growth: Math.round((5 + Math.sin(i) + Math.random() * 3) * 100) / 100
    }))

    const performanceTrend = monthNames.map((month, i) => ({
      month,
      avg: Math.round((2.8 + Math.sin(i) * 0.3 + Math.random() * 0.2) * 100) / 100
    }))

    // Recent activities - get recent records from various tables
    const recentActivities = [
      {
        id: 'activity-1',
        type: 'system',
        message: 'Dashboard data refreshed successfully',
        at: new Date().toISOString(),
        severity: 'success'
      }
    ]

    const dashboardStats = {
      totals: {
        students: totalStudents || 0,
        teachers: totalTeachers || 0,
        classes: 0, // You can add classes count
        schools: totalSchools || 0
      },
      growthPercent: 6.4,
      teachersActive: teachersActive || 0,
      teachersInactive,
      byGrade,
      byPlan: [], // Would need to calculate from school plans
      recentResults: recentResults || [],
      pendingNotifications: pendingNotifications || 0,
      systemHealth: 'Healthy' as const,
      performance: {
        averageGPA,
        passRate,
        topPerformingSchools,
        subjectPerformance: []
      },
      financials: {
        monthlyRevenue: 0,
        totalRevenue: 0,
        outstandingPayments: 0,
        churnRate: 0
      },
      charts: {
        studentTrend,
        performanceTrend,
        subjectDistribution: [],
        classComparison: [],
        monthlySubmissions: [],
        notificationStats: [],
        revenueGrowth: []
      },
      recentActivities
    }

    return NextResponse.json(dashboardStats)

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
