"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  GraduationCap,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  Lock
} from "lucide-react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError("Please enter your email address")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Simulate password reset API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In production, this would call a real password reset API
      console.log(`[DEMO] Password reset email sent to: ${email}`)
      
      setSuccess(true)
    } catch (err) {
      setError("Failed to send reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
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
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span>Reset Email Sent</span>
              </CardTitle>
              <CardDescription>
                Check your email for password reset instructions
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-gray-600 mb-4">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    The link will expire in 1 hour for security reasons.
                  </p>
                </div>
                
                <Alert className="border-blue-200 bg-blue-50">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    <strong>Can't find the email?</strong> Check your spam folder or try requesting a new reset link.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => router.push('/auth')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setSuccess(false)
                      setEmail("")
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Send Another Reset Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Support Information */}
          <div className="text-center mt-6 space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">Need help with password reset?</p>
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
              <Lock className="h-6 w-6 text-blue-600" />
              <span>Reset Your Password</span>
            </CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a reset link
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  We'll send a password reset link to this email address
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link href="/auth" className="flex items-center justify-center text-gray-600 hover:text-blue-600 transition duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>

            {/* Security Notice */}
            <Alert className="mt-6 border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                <strong>Security Notice:</strong> Reset links expire after 1 hour. If you don't receive an email, check your spam folder or contact support.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Registration Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
