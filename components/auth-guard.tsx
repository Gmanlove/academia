'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSupabaseAuth } from '@/components/supabase-auth-provider'
import { canAccessRoute, getDefaultRoute, isPublicRoute } from '@/lib/routes'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, userProfile, isLoading } = useSupabaseAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (isLoading) return

    // If no user and not a public route, redirect to auth
    if (!user && !isPublicRoute(pathname)) {
      router.push(`/auth?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    // If user exists but no profile, might be setting up
    if (user && !userProfile && !pathname.startsWith('/auth') && !isPublicRoute(pathname)) {
      // Wait for profile to load or redirect to setup
      setTimeout(() => {
        if (!userProfile) {
          router.push('/auth')
        }
      }, 2000)
      return
    }

    // Check role-based access
    if (userProfile) {
      // If user is on auth page and logged in, redirect to dashboard
      if (pathname.startsWith('/auth')) {
        const defaultRoute = getDefaultRoute(userProfile.role)
        console.log(`✅ User logged in as ${userProfile.role}, redirecting to ${defaultRoute}`)
        router.replace(defaultRoute) // Use replace to prevent back button issues
        return
      }

      // Check if user can access current route
      if (!canAccessRoute(userProfile.role, pathname)) {
        const defaultRoute = getDefaultRoute(userProfile.role)
        console.log(`🚫 Access denied: ${userProfile.role} cannot access ${pathname}`)
        console.log(`↪️ Redirecting to ${defaultRoute}`)
        router.replace(defaultRoute) // Use replace to prevent back button issues
        return
      }

      // Check specific role requirement
      if (requiredRole && userProfile.role !== requiredRole) {
        const defaultRoute = getDefaultRoute(userProfile.role)
        console.log(`🚫 Role mismatch: Required ${requiredRole}, user is ${userProfile.role}`)
        console.log(`↪️ Redirecting to ${defaultRoute}`)
        router.replace(defaultRoute) // Use replace to prevent back button issues
        return
      }
    }

    setIsAuthorized(true)
  }, [user, userProfile, isLoading, pathname, router, requiredRole])

  // Show loading state
  if (isLoading || (!isAuthorized && !isPublicRoute(pathname))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
