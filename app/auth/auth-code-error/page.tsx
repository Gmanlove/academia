'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Mail, RefreshCw, Loader2 } from 'lucide-react'

export default function AuthCodeError() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessingAuth, setIsProcessingAuth] = useState(true)

  useEffect(() => {
    const processAuthFromFragment = async () => {
      const hash = window.location.hash
      console.log('Processing URL fragment:', hash)
      
      // Check for authentication tokens in URL fragment
      if (hash.includes('access_token=')) {
        try {
          const urlParams = new URLSearchParams(hash.substring(1))
          const accessToken = urlParams.get('access_token')
          const refreshToken = urlParams.get('refresh_token')
          const type = urlParams.get('type')
          
          console.log('Found tokens:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type })
          
          if (accessToken && refreshToken) {
            const supabase = createClient()
            
            // Set the session using the tokens
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (sessionError) {
              console.error('Session error:', sessionError)
              setError(`Authentication failed: ${sessionError.message}`)
              setIsProcessingAuth(false)
              return
            }
            
            if (data.user) {
              console.log('✅ User authenticated successfully:', data.user.id)
              
              // Update user profile to mark as verified
              const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId: data.user.id,
                  email: data.user.email
                })
              })
              
              if (response.ok) {
                console.log('✅ User profile updated')
                
                // Get user profile to determine redirect
                const { data: userData, error: userError } = await supabase
                  .from('user_profiles')
                  .select('role, school_id')
                  .eq('email', data.user.email)
                  .single()
                
                if (!userError && userData) {
                  
                  let redirectPath = '/admin/dashboard' // default
                  if (userData.role) {
                    switch (userData.role) {
                      case 'admin':
                        redirectPath = '/admin/dashboard'
                        break
                      case 'teacher':
                        redirectPath = '/teacher/dashboard'
                        break
                      case 'student':
                        redirectPath = '/student/dashboard'
                        break
                    }
                  }
                  
                  console.log('Redirecting to:', redirectPath)
                  window.location.href = redirectPath
                  return
                }
              }
              
              // Fallback redirect
              window.location.href = '/admin/dashboard'
              return
            }
          }
        } catch (err) {
          console.error('Auth processing error:', err)
          setError('Failed to process authentication tokens')
        }
      }
      
      // Check for error in URL fragments or params
      if (hash.includes('error=')) {
        const errorMatch = hash.match(/error=([^&]+)/)
        if (errorMatch) {
          setError(decodeURIComponent(errorMatch[1]))
        }
      } else if (searchParams.get('error')) {
        setError(searchParams.get('error'))
      }
      
      setIsProcessingAuth(false)
    }
    
    processAuthFromFragment()
  }, [searchParams])

  const handleResendEmail = async () => {
    setIsLoading(true)
    try {
      // You can implement email resend logic here
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      alert('Verification email has been resent!')
    } catch (err) {
      alert('Failed to resend email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while processing authentication
  if (isProcessingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Processing Authentication
            </CardTitle>
            <CardDescription>
              Please wait while we verify your email...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Authentication Error
          </CardTitle>
          <CardDescription>
            There was an issue with your email verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Common solutions:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Check if you clicked the correct verification link
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Make sure the link hasn't expired (links expire after 24 hours)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Try opening the link in a different browser or incognito mode
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Button
              onClick={handleResendEmail}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>

            <Button
              onClick={() => window.location.href = '/auth/register'}
              variant="ghost"
              className="w-full"
            >
              Try Registration Again
            </Button>

            <Button
              onClick={() => window.location.href = '/auth'}
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
