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
        console.log('🔄 Initializing authentication...')
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('✅ Found existing session for:', session.user.email)
          
          // Fetch real profile immediately, don't use default
          const profileLoaded = await fetchUserProfile(session.user.id)
          
          if (!profileLoaded) {
            console.warn('⚠️ Profile not found in database - user may need to complete registration')
            // Set minimal default only if profile doesn't exist
            const defaultProfile = {
              id: session.user.id,
              email: session.user.email || '',
              role: 'student' as const, // Default to student, not admin
              name: session.user.email?.split('@')[0] || 'User',
              permissions: [],
              email_verified: !!session.user.email_confirmed_at,
              status: 'active'
            }
            setUserProfile(defaultProfile)
          }
        } else {
          console.log('ℹ️ No existing session found')
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error)
      } finally {
        console.log('✅ Auth initialization complete')
        setIsLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Fetch real profile - don't set a default that might be wrong
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

  const fetchUserProfile = async (userId: string): Promise<boolean> => {
    try {
      console.log('📝 Fetching user profile for user ID:', userId)
      const startTime = Date.now()
      
      // Add timeout to prevent hanging
      const fetchPromise = supabase
        .from('user_profiles')
        .select('id, email, role, name, permissions, email_verified, status, school_id, teacher_id, student_id')
        .eq('id', userId)
        .maybeSingle()

      const timeoutPromise = new Promise<{ data: null, error: any }>((_, reject) => {
        setTimeout(() => reject(new Error('TIMEOUT')), 5000) // 5 second timeout
      })

      const result = await Promise.race([fetchPromise, timeoutPromise])
        .catch((err) => {
          console.warn('⚠️ Profile fetch timeout or error:', err)
          return { data: null, error: { message: 'Timeout or error', code: 'TIMEOUT' } }
        })

      const { data, error } = result as any
      const elapsed = Date.now() - startTime
      console.log(`⏱️ Profile fetch completed in ${elapsed}ms`)

      if (error) {
        console.warn('⚠️ Could not fetch profile:', error.message)
        return false
      }

      if (data) {
        setUserProfile(data)
        console.log('✅ User profile loaded:', { role: data.role, email: data.email })
        return true
      }

      console.warn('⚠️ No profile found for user ID:', userId)
      return false
    } catch (error) {
      console.warn('⚠️ Profile fetch exception:', error)
      return false
    }
  }

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Attempting sign in for:', email)
      setIsAuthOperationLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.warn('❌ Sign in error:', error?.message || 'Unknown error')
        setIsAuthOperationLoading(false)
        return false
      }

      if (!data?.user) {
        console.warn('❌ No user data returned from Supabase')
        setIsAuthOperationLoading(false)
        return false
      }

      console.log('✅ Sign in successful! User ID:', data.user.id, 'Email:', data.user.email)
      
      // Set user immediately
      setUser(data.user)
      
      // IMPORTANT: Fetch real profile BEFORE redirecting
      console.log('📝 Fetching user profile from database...')
      const profileLoaded = await fetchUserProfile(data.user.id)
      
      if (!profileLoaded) {
        console.warn('⚠️ Could not load user profile from database - creating default')
        // Set a minimal default profile if profile doesn't exist
        const defaultProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email || '',
          role: 'student',
          name: data.user.email?.split('@')[0] || 'User',
          permissions: [],
          email_verified: !!data.user.email_confirmed_at,
          status: 'active'
        }
        setUserProfile(defaultProfile)
        console.log('✅ Using default student profile (profile not found in database)')
      } else {
        console.log('✅ Real profile loaded from database successfully')
      }
      
      setIsAuthOperationLoading(false)
      return true
    } catch (error) {
      console.warn('❌ Sign in exception:', error instanceof Error ? error.message : String(error))
      setIsAuthOperationLoading(false)
      return false
    }
  }

  const signOut = async (): Promise<void> => {
    console.log('🔓 LOGOUT: Starting SUPER AGGRESSIVE logout...')
    
    // IMMEDIATE: Clear state first
    setUser(null)
    setUserProfile(null)
    console.log('✅ LOGOUT: Cleared React state')
    
    // IMMEDIATE: Clear all storage synchronously
    if (typeof window !== 'undefined') {
      try {
        // Clear storage
        localStorage.clear()
        sessionStorage.clear()
        console.log('✅ LOGOUT: Cleared localStorage and sessionStorage')
        
        // Clear all client-accessible cookies
        const cookies = document.cookie.split(';')
        for (let cookie of cookies) {
          const [name] = cookie.split('=')
          const cookieName = name.trim()
          if (cookieName) {
            // Clear with multiple path variants
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`
            console.log(`✅ LOGOUT: Cleared cookie: ${cookieName}`)
          }
        }
      } catch (err) {
        console.error('⚠️ LOGOUT: Error clearing storage:', err)
      }
    }
    
    // Background: Sign out from Supabase (don't wait)
    supabase.auth.signOut({ scope: 'global' })
      .then(() => console.log('✅ LOGOUT: Supabase signOut successful'))
      .catch(err => console.error('⚠️ LOGOUT: Supabase error:', err))
    
    // Background: Call API (don't wait)
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => console.log('✅ LOGOUT: API logout successful'))
      .catch(err => console.error('⚠️ LOGOUT: API error:', err))
    
    // Background: Clear IndexedDB (don't wait)
    if (typeof window !== 'undefined' && window.indexedDB && window.indexedDB.databases) {
      window.indexedDB.databases()
        .then(databases => {
          databases.forEach(db => {
            if (db.name) {
              window.indexedDB.deleteDatabase(db.name)
              console.log(`✅ LOGOUT: Deleted IndexedDB: ${db.name}`)
            }
          })
        })
        .catch(e => console.log('⚠️ LOGOUT: IndexedDB error:', e))
    }
    
    // IMMEDIATE: Force redirect WITHOUT waiting
    console.log('🚀 LOGOUT: IMMEDIATE REDIRECT to /auth...')
    
    if (typeof window !== 'undefined') {
      // Use location.replace for harder redirect that doesn't add to history
      window.location.replace('/auth')
    } else {
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
