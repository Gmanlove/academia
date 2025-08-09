"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle,
  AlertTriangle,
  Mail,
  ArrowLeft,
  RefreshCw,
  Clock,
  GraduationCap
} from "lucide-react"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resend'>('loading')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [resending, setResending] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const emailParam = searchParams.get('email')
    
    if (emailParam) {
      setEmail(emailParam)
    }

    if (token) {
      verifyEmail(token)
    } else if (emailParam) {
      setStatus('resend')
      setMessage('Please check your email for the verification link.')
    } else {
      setStatus('error')
      setMessage('Invalid verification link.')
    }
  }, [searchParams])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`/api/auth/verify?token=${token}`)
      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth?verified=true')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Verification failed')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  const resendVerification = async () => {
    if (!email) return

    setResending(true)
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Verification email resent! Please check your inbox.')
        setTimeout(() => {
          setMessage('Please check your email for the verification link.')
        }, 3000)
      } else {
        setMessage(data.error || 'Failed to resend verification email.')
      }
    } catch (error) {
      setMessage('Failed to resend verification email. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Academia
              </h1>
            </div>
            <CardTitle className="flex items-center justify-center space-x-2">
              <Mail className="h-6 w-6 text-blue-600" />
              <span>Email Verification</span>
            </CardTitle>
            <CardDescription>
              Verify your email address to complete registration
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Loading State */}
            {status === 'loading' && (
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600">Verifying your email address...</p>
              </div>
            )}

            {/* Success State */}
            {status === 'success' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Verified!</h3>
                  <p className="text-gray-600 mb-4">{message}</p>
                  <Alert className="border-green-200 bg-green-50">
                    <Clock className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Redirecting to login page in 3 seconds...
                    </AlertDescription>
                  </Alert>
                </div>
                <Button 
                  onClick={() => router.push('/auth?verified=true')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Continue to Login
                </Button>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-10 w-10 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification Failed</h3>
                  <Alert className="border-red-200 bg-red-50 mb-4">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{message}</AlertDescription>
                  </Alert>
                </div>
                <div className="space-y-3">
                  {email && (
                    <Button 
                      onClick={resendVerification}
                      disabled={resending}
                      variant="outline"
                      className="w-full"
                    >
                      {resending ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Resend Verification Email
                        </>
                      )}
                    </Button>
                  )}
                  <Button 
                    onClick={() => router.push('/auth/register')}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Registration
                  </Button>
                </div>
              </div>
            )}

            {/* Resend State */}
            {status === 'resend' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-gray-600 mb-4">{message}</p>
                  {email && (
                    <p className="text-sm text-gray-500 mb-4">
                      We sent a verification link to <strong>{email}</strong>
                    </p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Alert className="border-blue-200 bg-blue-50">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      <strong>Can't find the email?</strong> Check your spam folder or click resend below.
                    </AlertDescription>
                  </Alert>
                  
                  {email && (
                    <Button 
                      onClick={resendVerification}
                      disabled={resending}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {resending ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Resend Verification Email
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Back to Auth Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <Link href="/auth" className="flex items-center justify-center text-gray-600 hover:text-blue-600 transition duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="text-center mt-6 space-y-4">
          <div className="text-sm text-gray-600">
            <p className="mb-2">Need help with verification?</p>
            <div className="flex justify-center space-x-4">
              <Link href="/results/help" className="text-blue-600 hover:text-blue-800">Help Center</Link>
              <span className="text-gray-400">•</span>
              <Link href="mailto:support@academia.edu.ng" className="text-blue-600 hover:text-blue-800">Contact Support</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
