"use client"

import { useAuth } from "@/components/auth-provider"
import { UserMenu } from "@/components/user-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { LogIn, User, Shield } from "lucide-react"

export function AuthStatus() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-3">
        {/* User Role Badge */}
        <Badge variant="outline" className={`
          ${user.role === 'admin' ? 'border-blue-200 text-blue-700 bg-blue-50' : ''}
          ${user.role === 'teacher' ? 'border-purple-200 text-purple-700 bg-purple-50' : ''}
          ${user.role === 'student' ? 'border-green-200 text-green-700 bg-green-50' : ''}
        `}>
          {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
          {user.role === 'teacher' && <User className="w-3 h-3 mr-1" />}
          {user.role === 'student' && <User className="w-3 h-3 mr-1" />}
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
        
        {/* User Menu */}
        <UserMenu />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" asChild>
        <Link href="/auth">
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/results">
          Check Results
        </Link>
      </Button>
    </div>
  )
}

// Hook for checking authentication status
export function useAuthGuard(requiredRole?: string) {
  const { user, isAuthenticated, isLoading } = useAuth()
  
  const isAuthorized = () => {
    if (!isAuthenticated || !user) return false
    if (requiredRole && user.role !== requiredRole) return false
    return true
  }

  return {
    user,
    isAuthenticated,
    isAuthorized: isAuthorized(),
    isLoading,
    hasRole: (role: string) => user?.role === role,
    hasPermission: (permission: string) => user?.permissions.includes(permission) || false
  }
}
