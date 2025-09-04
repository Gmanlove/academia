"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  GraduationCap,
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  School,
  Users,
  BookOpen,
  CheckCircle,
  Mail,
  LogIn
} from "lucide-react"
import { useSupabaseAuth } from "@/components/supabase-auth-provider"

interface AuthFormData {
  email: string
  password: string
  role: string
  name?: string
  schoolId?: string
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [loginData, setLoginData] = useState<AuthFormData>({
    email: "",
    password: "",
    role: ""
  })
  const [registerData, setRegisterData] = useState<AuthFormData>({
    email: "",
    password: "",
    role: "",
    name: "",
    schoolId: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signUp } = useSupabaseAuth()

  // Handle verification success parameter
  useEffect(() => {
    const verified = searchParams.get('verified')
    if (verified === 'true') {
      setSuccess("Email verified successfully! You can now log in to your account.")
      setActiveTab("login")
      
      setTimeout(() => {
        setSuccess("")
      }, 5000)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!loginData.email || !loginData.password || !loginData.role) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const success = await signIn(loginData.email, loginData.password)
      
      if (success) {
        setSuccess("Login successful! Redirecting...")
        
        // Redirect based on role
        setTimeout(() => {
          switch (loginData.role) {
            case 'admin':
              router.push('/admin/dashboard')
              break
            case 'teacher':
              router.push('/teacher/dashboard')
              break
            case 'student':
              router.push('/student/dashboard')
              break
            default:
              router.push('/')
          }
        }, 1000)
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!registerData.email || !registerData.password || !registerData.role || !registerData.name) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const success = await signUp(registerData.email, registerData.password, {
        role: registerData.role as 'admin' | 'teacher' | 'student' | 'parent',
        name: registerData.name,
        school_id: registerData.schoolId
      })
      
      if (success) {
        setSuccess("Registration successful! Please check your email to verify your account.")
        setActiveTab("login")
      } else {
        setError("Registration failed. Please try again.")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Successful login
        const authData = data.data

  // Store authentication data
  localStorage.setItem('auth-data', JSON.stringify(authData))
  localStorage.setItem('auth-timestamp', Date.now().toString())
  // Removed lockout localStorage cleanup

        setSuccess("Login successful! Redirecting...")
        
        // Redirect based on role
        setTimeout(() => {
          switch (formData.role) {
            case 'admin':
              router.push('/admin/dashboard')
              break
            case 'teacher':
              router.push('/teacher/dashboard')
              break
            case 'student':
              router.push('/student/dashboard')
              break
            default:
              router.push('/')
          }
        }, 1000)
      } else {
        // Handle specific error cases
        if (data.requiresVerification) {
          setError(`Email verification required. Please check your email (${data.email}) and click the verification link.`)
          // Optionally redirect to verification page
          setTimeout(() => {
            router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`)
          }, 3000)
          return
        }

  // Failed login
  setError(data.error || `Invalid credentials.`)
      }
    } catch (err) {
      setError("Authentication failed. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'admin':
        return ['read', 'write', 'delete', 'manage_users', 'manage_schools', 'view_analytics']
      case 'teacher':
        return ['read', 'write', 'manage_scores', 'view_students', 'send_notifications']
      case 'student':
        return ['read', 'view_results', 'download_transcripts']
      default:
        return ['read']
    }
  }

  const generateToken = () => {
    return 'AUTH_' + Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  const generateSessionId = () => {
    return 'SES_' + Math.random().toString(36).substr(2, 12).toUpperCase()
  }

  const formatTime = (seconds: number) => {
  // Removed formatTime (no longer needed)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative flex min-h-screen">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 flex-col justify-center">
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Academia</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Secure Access to Your
              <br />
              <span className="text-blue-200">Educational Platform</span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Connect with your school community through our comprehensive management system designed for Nigerian educational institutions.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4" />
                </div>
                <span>Bank-level security with encrypted data</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
                <span>Role-based access for all stakeholders</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <span>24/7 access to your academic data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-12">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Academia
                </h1>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access your portal</p>
            </div>

            {/* Back to Home */}
            <div className="mb-6">
              <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </div>

            {/* Alerts */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            {/* Removed lockout alert */}

            {/* Demo credentials removed */}

            {/* Login Form */}
            <Card className="shadow-xl border-0">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-center space-x-2">
                  <LogIn className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-xl">Sign In</CardTitle>
                </div>
                <CardDescription className="text-center">
                  Enter your credentials to access your portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span>Administrator</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="teacher">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4 text-purple-600" />
                            <span>Teacher</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="student">
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4 text-green-600" />
                            <span>Student</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* School ID (for non-admin roles) */}
                  {formData.role && formData.role !== 'admin' && (
                    <div className="space-y-2">
                      <Label htmlFor="schoolId">School ID</Label>
                      <div className="relative">
                        <School className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="schoolId"
                          type="text"
                          placeholder="Enter your school ID"
                          value={formData.schoolId}
                          onChange={(e) => handleInputChange('schoolId', e.target.value)}
                          className="pl-10"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={formData.rememberMe}
                        onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                        className="rounded border-gray-300"
                        disabled={loading}
                      />
                      <Label htmlFor="rememberMe" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Link 
                      href="/auth/reset-password" 
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      Need help accessing your account?
                    </p>
                    <div className="flex justify-center space-x-4 text-sm">
                      <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800">
                        Forgot Password
                      </Link>
                      <span className="text-gray-300">|</span>
                      <Link href="/results/help" className="text-blue-600 hover:text-blue-800">
                        Contact Support
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Security Info */}
                {/* Security info removed: lockout and attempts no longer shown */}
              </CardContent>
            </Card>

            {/* Registration Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Create one here
                </Link>
              </p>
            </div>

            {/* Public Access Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Looking for public result access?
              </p>
              <Link 
                href="/results" 
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <Key className="h-4 w-4" />
                <span>Check Results with Token</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
