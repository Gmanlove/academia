"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  username: string
  role: string
  schoolId: string
  name: string
  email: string
  permissions: string[]
  lastLogin?: string
}

interface AuthData {
  user: User
  token: string
  sessionId: string
  expiresAt: number
  loginTime: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => Promise<void>
  refreshSession: () => Promise<boolean>
  hasPermission: (permission: string) => boolean
  isRole: (role: string) => boolean
}

interface LoginCredentials {
  username: string
  password: string
  role: string
  schoolId?: string
  rememberMe: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication status on mount and route changes
  useEffect(() => {
    checkAuthStatus()
  }, [pathname])

  // Session timeout timer
  useEffect(() => {
    if (user) {
      const authData = getStoredAuthData()
      if (authData) {
        const timeUntilExpiry = authData.expiresAt - Date.now()
        
        if (timeUntilExpiry > 0) {
          // Set timer to logout when session expires
          const timer = setTimeout(() => {
            logout()
          }, timeUntilExpiry)
          
          return () => clearTimeout(timer)
        } else {
          // Session already expired
          logout()
        }
      }
    }
  }, [user])

  const checkAuthStatus = async () => {
    setIsLoading(true)
    
    try {
      const authData = getStoredAuthData()
      
      if (authData && Date.now() < authData.expiresAt) {
        // Valid session exists
        setUser(authData.user)
      } else {
        // No valid session
        clearAuthData()
        setUser(null)
        
        // Redirect to auth if on protected route
        if (isProtectedRoute(pathname)) {
          router.push(`/auth?returnUrl=${encodeURIComponent(pathname)}`)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      clearAuthData()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        const result = await response.json()
        const authData: AuthData = result.data
        
        // Store auth data
        localStorage.setItem('auth-data', JSON.stringify(authData))
        localStorage.setItem('auth-timestamp', Date.now().toString())
        
        setUser(authData.user)
        return true
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      // Call logout API to invalidate server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear local auth data regardless of API success
      clearAuthData()
      setUser(null)
      router.push('/auth')
    }
  }

  const refreshSession = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        
        // Update expiry time in stored auth data
        const authData = getStoredAuthData()
        if (authData) {
          authData.expiresAt = result.data.expiresAt
          localStorage.setItem('auth-data', JSON.stringify(authData))
        }
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Session refresh error:', error)
      return false
    }
  }

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false
  }

  const isRole = (role: string): boolean => {
    return user?.role === role
  }

  const getStoredAuthData = (): AuthData | null => {
    try {
      const authDataStr = localStorage.getItem('auth-data')
      return authDataStr ? JSON.parse(authDataStr) : null
    } catch (error) {
      console.error('Error parsing auth data:', error)
      return null
    }
  }

  const clearAuthData = () => {
    localStorage.removeItem('auth-data')
    localStorage.removeItem('auth-timestamp')
    localStorage.removeItem('login-attempts')
    localStorage.removeItem('auth-lock-time')
  }

  const isProtectedRoute = (path: string): boolean => {
    const protectedPaths = ['/admin', '/teacher', '/student']
    return protectedPaths.some(protectedPath => path.startsWith(protectedPath))
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshSession,
    hasPermission,
    isRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.push('/auth')
          return
        }
        
        if (requiredRole && user.role !== requiredRole) {
          router.push('/auth')
          return
        }
      }
    }, [user, isLoading, router])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!user || (requiredRole && user.role !== requiredRole)) {
      return null
    }

    return <Component {...props} />
  }
}
