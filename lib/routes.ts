// Centralized routing configuration for the school management system
export const ROUTES = {
  // Public routes
  HOME: '/',
  AUTH: '/auth',
  VERIFY_EMAIL: '/auth/verify-email',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Super Admin routes
  SUPER_ADMIN: {
    DASHBOARD: '/super-admin/dashboard',
    SCHOOLS: '/super-admin/schools',
    SETTINGS: '/super-admin/settings',
    ANALYTICS: '/super-admin/analytics',
  },
  
  // School Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    SCHOOLS: '/admin/schools',
    TEACHERS: '/admin/teachers',
    STUDENTS: '/admin/students',
    CLASSES: '/admin/classes',
    SUBJECTS: '/admin/subjects',
    RESULTS: '/admin/results',
    ATTENDANCE: '/admin/attendance',
    EVENTS: '/admin/events',
    ASSIGNMENTS: '/admin/assignments',
    CBT: '/admin/cbt',
    ANALYTICS: '/admin/analytics',
    NOTIFICATIONS: '/admin/notifications',
    SETTINGS: '/admin/settings',
  },
  
  // Teacher routes
  TEACHER: {
    DASHBOARD: '/teacher/dashboard',
    CLASSES: '/teacher/classes',
    STUDENTS: '/teacher/students',
    ATTENDANCE: '/teacher/attendance',
    RESULTS: '/teacher/results',
    CBT: '/teacher/cbt',
    ASSIGNMENTS: '/teacher/assignments',
    SCHEDULE: '/teacher/schedule',
    ANALYTICS: '/teacher/analytics',
    COMMUNICATION: '/teacher/communication',
  },
  
  // Student routes
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    CBT: '/student/cbt',
    ASSIGNMENTS: '/student/assignments',
    RESULTS: '/student/results',
    ATTENDANCE: '/student/attendance',
    SCHEDULE: '/student/schedule',
    NOTIFICATIONS: '/student/notifications',
    PROFILE: '/student/profile',
  },
  
  // Parent routes (future)
  PARENT: {
    DASHBOARD: '/parent/dashboard',
    CHILDREN: '/parent/children',
    RESULTS: '/parent/results',
    ATTENDANCE: '/parent/attendance',
    COMMUNICATION: '/parent/communication',
  },
} as const

// Role-based dashboard mapping
export const DASHBOARD_ROUTES: Record<string, string> = {
  super_admin: ROUTES.SUPER_ADMIN.DASHBOARD,
  school_admin: ROUTES.ADMIN.DASHBOARD,
  admin: ROUTES.ADMIN.DASHBOARD,
  teacher: ROUTES.TEACHER.DASHBOARD,
  student: ROUTES.STUDENT.DASHBOARD,
  parent: ROUTES.PARENT.DASHBOARD,
}

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.AUTH,
  ROUTES.VERIFY_EMAIL,
  ROUTES.RESET_PASSWORD,
  '/results', // Public result checking
]

// Get default route for a role
export function getDefaultRoute(role: string): string {
  return DASHBOARD_ROUTES[role] || ROUTES.HOME
}

// Check if route is public
export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some(route => path.startsWith(route))
}

// Get role from path
export function getRoleFromPath(path: string): string | null {
  if (path.startsWith('/super-admin')) return 'super_admin'
  if (path.startsWith('/admin')) return 'admin'
  if (path.startsWith('/teacher')) return 'teacher'
  if (path.startsWith('/student')) return 'student'
  if (path.startsWith('/parent')) return 'parent'
  return null
}

// Check if user has access to route
export function canAccessRoute(userRole: string, path: string): boolean {
  const routeRole = getRoleFromPath(path)
  
  if (!routeRole) return true // Public route
  
  // Super admin can access everything
  if (userRole === 'super_admin') return true
  
  // School admin can ONLY access admin routes (not teacher or student routes)
  if (userRole === 'school_admin' && routeRole === 'admin') {
    return true
  }
  
  // Teachers can ONLY access teacher routes
  if (userRole === 'teacher' && routeRole === 'teacher') {
    return true
  }
  
  // Students can ONLY access student routes
  if (userRole === 'student' && routeRole === 'student') {
    return true
  }
  
  // Parents can ONLY access parent routes
  if (userRole === 'parent' && routeRole === 'parent') {
    return true
  }
  
  // No access by default
  return false
}
