"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  email: string
  role: 'admin' | 'teacher' | 'student' | 'parent'
  school_id?: string
  teacher_id?: string
  student_id?: string
  name: string
  permissions: string[]
  last_login?: string
  email_verified: boolean
  status: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  isAuthOperationLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<boolean>
  hasPermission: (permission: string) => boolean
  isRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true) // For initial auth state
  const [isAuthOperationLoading, setIsAuthOperationLoading] = useState(false) // For sign-in/out operations
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUserProfile(null)
          // Redirect to auth if on protected route
          if (isProtectedRoute(pathname)) {
            router.push(`/auth?returnUrl=${encodeURIComponent(pathname)}`)
          }
        }
        
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [pathname, router, supabase.auth])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId)
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('Profile fetch result:', { data: !!data, error: error?.message })

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error)
        return
      }

      setUserProfile(data)
      console.log('User profile set successfully')
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting sign in for:', email)
      setIsAuthOperationLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Sign in error:', error)
        return false
      }

      if (!data.user) {
        console.error('No user data returned')
        return false
      }

      console.log('Sign in successful, user ID:', data.user?.id)
      
      // Fetch user profile immediately
      await fetchUserProfile(data.user.id)
      
      return true
    } catch (error) {
      console.error('Sign in error:', error)
      return false
    } finally {
      setIsAuthOperationLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setUser(null)
      setUserProfile(null)
      router.push('/auth')
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>): Promise<boolean> => {
    try {
      // Use our API endpoint instead of direct Supabase auth
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userData: {
            name: userData.name || '',
            role: userData.role || 'student',
            schoolId: userData.school_id,
            permissions: userData.permissions || [],
          }
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        console.error('Registration error:', result.error)
        return false
      }

      // Registration successful, user can now sign in immediately
      console.log('Registration successful:', result.message)
      return true
    } catch (error) {
      console.error('Sign up error:', error)
      return false
    }
  }

  const hasPermission = (permission: string): boolean => {
    return userProfile?.permissions.includes(permission) || false
  }

  const isRole = (role: string): boolean => {
    return userProfile?.role === role
  }

  const isProtectedRoute = (path: string): boolean => {
    const protectedPaths = ['/admin', '/teacher', '/student']
    return protectedPaths.some(protectedPath => path.startsWith(protectedPath))
  }

  const value: AuthContextType = {
    user,
    userProfile,
    isAuthenticated: !!user,
    isLoading,
    isAuthOperationLoading,
    signIn,
    signOut,
    signUp,
    hasPermission,
    isRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useSupabaseAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}

// Higher-order component for protecting routes
export function withSupabaseAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string
) {
  return function AuthenticatedComponent(props: P) {
    const { user, userProfile, isLoading } = useSupabaseAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.push('/auth')
          return
        }
        
        if (requiredRole && userProfile?.role !== requiredRole) {
          router.push('/auth')
          return
        }
      }
    }, [user, userProfile, isLoading, router])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!user || (requiredRole && userProfile?.role !== requiredRole)) {
      return null
    }

    return <Component {...props} />
  }
}
