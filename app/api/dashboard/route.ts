import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user and check if they're an admin
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role, school_id')
      .eq('id', user.id)
      .single()

    if (!userProfile || userProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const schoolId = userProfile.school_id

    // For demo purposes, return mock data if no school_id is set
    if (!schoolId) {
      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalStudents: 0,
            totalTeachers: 0,
            totalClasses: 0,
            totalSubjects: 0,
            activeStudents: 0,
            averagePerformance: 0
          },
          charts: {
            enrollmentTrends: Array.from({ length: 6 }, (_, i) => ({
              month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
              enrollments: Math.floor(Math.random() * 20) + 5
            })),
            performanceDistribution: [
              { name: 'Excellent', value: 0, color: '#22c55e' },
              { name: 'Good', value: 0, color: '#3b82f6' },
              { name: 'Average', value: 0, color: '#f59e0b' },
              { name: 'Poor', value: 0, color: '#ef4444' },
              { name: 'Critical', value: 0, color: '#dc2626' }
            ],
            termAverages: []
          },
          recentResults: [],
          recentActivities: [
            {
              id: 1,
              type: 'system',
              description: 'System initialized successfully',
              time: new Date().toISOString(),
              icon: 'check-circle'
            }
          ],
          systemAlerts: [
            {
              id: 1,
              type: 'info',
              title: 'Welcome to Academia',
              message: 'Start by setting up your school profile',
              priority: 'low'
            }
          ],
          notifications: [
            {
              id: 1,
              title: 'Getting Started',
              message: 'Welcome to Academia! Start by adding students and teachers.',
              type: 'info',
              date: new Date().toISOString()
            }
          ]
        }
      })
    }

    // Fetch all stats in parallel
    const [
      { count: totalStudents },
      { count: totalTeachers },
      { count: totalClasses },
      { count: totalSubjects },
      studentsData,
      recentResultsData,
      performanceData
    ] = await Promise.all([
      supabase.from('students').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
      supabase.from('teachers').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
      supabase.from('classes').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
      supabase.from('subjects').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
      supabase
        .from('students')
        .select('enrollment_date, performance_level')
        .eq('school_id', schoolId)
        .eq('active', true),
      supabase
        .from('results')
        .select('total_score, created_at, student:students(name), subject:subjects(name)')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('results')
        .select('total_score, term, session')
        .eq('school_id', schoolId)
    ])

    // Calculate enrollment trends (last 6 months)
    const enrollmentTrends = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      const monthYear = date.toISOString().slice(0, 7)
      
      const enrollments = studentsData?.data?.filter((student: any) => 
        student.enrollment_date?.startsWith(monthYear)
      ).length || 0

      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        enrollments
      }
    })

    // Calculate performance distribution
    const performanceDistribution = {
      excellent: studentsData?.data?.filter((s: any) => s.performance_level === 'Excellent').length || 0,
      good: studentsData?.data?.filter((s: any) => s.performance_level === 'Good').length || 0,
      average: studentsData?.data?.filter((s: any) => s.performance_level === 'Average').length || 0,
      poor: studentsData?.data?.filter((s: any) => s.performance_level === 'Poor').length || 0,
      critical: studentsData?.data?.filter((s: any) => s.performance_level === 'Critical').length || 0,
    }

    // Recent activities
    const recentActivities = [
      {
        id: 1,
        type: 'enrollment',
        description: `${enrollmentTrends[enrollmentTrends.length - 1]?.enrollments || 0} new students enrolled this month`,
        time: new Date().toISOString(),
        icon: 'user-plus'
      },
      {
        id: 2,
        type: 'results',
        description: `${recentResultsData?.data?.length || 0} new results uploaded`,
        time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        icon: 'file-text'
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalStudents: totalStudents || 0,
          totalTeachers: totalTeachers || 0,
          totalClasses: totalClasses || 0,
          totalSubjects: totalSubjects || 0,
          activeStudents: studentsData?.data?.filter((s: any) => s.active).length || 0,
          averagePerformance: Math.round(
            (performanceData?.data?.reduce((sum: number, r: any) => sum + r.total_score, 0) || 0) / 
            (performanceData?.data?.length || 1)
          )
        },
        charts: {
          enrollmentTrends,
          performanceDistribution: [
            { name: 'Excellent', value: performanceDistribution.excellent, color: '#22c55e' },
            { name: 'Good', value: performanceDistribution.good, color: '#3b82f6' },
            { name: 'Average', value: performanceDistribution.average, color: '#f59e0b' },
            { name: 'Poor', value: performanceDistribution.poor, color: '#ef4444' },
            { name: 'Critical', value: performanceDistribution.critical, color: '#dc2626' }
          ],
          termAverages: []
        },
        recentResults: recentResultsData?.data?.map((result: any) => ({
          studentName: result.student?.name || 'Unknown',
          subject: result.subject?.name || 'Unknown',
          score: result.total_score,
          date: result.created_at
        })) || [],
        recentActivities,
        systemAlerts: [],
        notifications: [
          {
            id: 1,
            title: 'System Update',
            message: 'New features have been added to the platform',
            type: 'info',
            date: new Date().toISOString()
          }
        ]
      }
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
