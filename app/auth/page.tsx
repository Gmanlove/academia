"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  GraduationCap,
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Users,
  BookOpen,
  CheckCircle,
  LogIn,
  UserPlus
} from "lucide-react"
import { useSupabaseAuth } from "@/components/supabase-auth-provider"

interface LoginFormData {
  email: string
  password: string
  role: string
}

interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  name: string
  role: string
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
    role: ""
  })
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signUp } = useSupabaseAuth()

  useEffect(() => {
    const verified = searchParams.get('verified')
    if (verified === 'true') {
      setSuccess("Email verified successfully! You can now log in to your account.")
      setActiveTab("login")
      setTimeout(() => setSuccess(""), 5000)
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
    
    if (!registerData.email || !registerData.password || !registerData.confirmPassword || !registerData.role || !registerData.name) {
      setError("Please fill in all required fields")
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (registerData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)
    setError("")

    try {
      const success = await signUp(registerData.email, registerData.password, {
        role: registerData.role as 'admin' | 'teacher' | 'student' | 'parent',
        name: registerData.name
      })
      
      if (success) {
        setSuccess("Registration successful! You can now sign in to your account.")
        setActiveTab("login")
        // Pre-fill the login form with the registered email
        setLoginData({
          email: registerData.email,
          password: "",
          role: registerData.role
        })
        setRegisterData({
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
          role: ""
        })
      } else {
        setError("Registration failed. Please try again.")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative flex min-h-screen">
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
              Connect with your school community through our comprehensive management system.
            </p>

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
                  <BookOpen className="h-4 w-4" />
                </div>
                <span>24/7 access to your academic data</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center p-8 lg:p-12">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Academia</h1>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access your account</p>
            </div>

            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@school.edu"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={loginData.role} onValueChange={(value) => setLoginData(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              <div className="flex items-center space-x-2">
                                <Shield className="h-4 w-4" />
                                <span>Administrator</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="teacher">
                              <div className="flex items-center space-x-2">
                                <BookOpen className="h-4 w-4" />
                                <span>Teacher</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="student">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>Student</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>
                      Sign up for a new account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-name">Full Name</Label>
                        <Input
                          id="reg-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={registerData.name}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-email">Email</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="your.email@school.edu"
                          value={registerData.email}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="Create a strong password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                        <Input
                          id="reg-confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-role">Role</Label>
                        <Select value={registerData.role} onValueChange={(value) => setRegisterData(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              <div className="flex items-center space-x-2">
                                <Shield className="h-4 w-4" />
                                <span>Administrator</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="teacher">
                              <div className="flex items-center space-x-2">
                                <BookOpen className="h-4 w-4" />
                                <span>Teacher</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="student">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>Student</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
