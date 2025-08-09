"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
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
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  UserPlus,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Zap,
  Clock,
  Star,
  Check
} from "lucide-react"

interface RegistrationFormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  
  // Account Information
  username: string
  password: string
  confirmPassword: string
  role: string
  
  // School Information
  schoolId?: string
  schoolName?: string
  schoolAddress?: string
  schoolType?: string
  
  // Additional Info
  studentId?: string
  employeeId?: string
  department?: string
  
  // Terms
  acceptTerms: boolean
  acceptPrivacy: boolean
  subscribeNewsletter: boolean
}

interface SchoolRegistrationData {
  schoolName: string
  schoolType: string
  address: string
  city: string
  state: string
  phone: string
  email: string
  website: string
  principalName: string
  principalEmail: string
  studentCount: string
  planType: string
}

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState("individual")
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    schoolId: "",
    schoolName: "",
    schoolAddress: "",
    schoolType: "",
    studentId: "",
    employeeId: "",
    department: "",
    acceptTerms: false,
    acceptPrivacy: false,
    subscribeNewsletter: false
  })
  
  const [schoolData, setSchoolData] = useState<SchoolRegistrationData>({
    schoolName: "",
    schoolType: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    website: "",
    principalName: "",
    principalEmail: "",
    studentCount: "",
    planType: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  const router = useRouter()

  // Nigerian states for dropdown
  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", 
    "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", 
    "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", 
    "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", 
    "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ]

  // Check password strength
  useEffect(() => {
    const password = formData.password
    let strength = 0
    
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    setPasswordStrength(strength)
  }, [formData.password])

  const handleInputChange = (field: keyof RegistrationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSchoolDataChange = (field: keyof SchoolRegistrationData, value: string) => {
    setSchoolData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError("Please fill in all personal information fields")
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number")
      return false
    }
    
    return true
  }

  const validateStep2 = () => {
    if (!formData.username || !formData.password || !formData.confirmPassword || !formData.role) {
      setError("Please fill in all account information fields")
      return false
    }
    
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long")
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    
    if (passwordStrength < 3) {
      setError("Password is too weak. Use 8+ characters with uppercase, lowercase, and numbers")
      return false
    }
    
    return true
  }

  const validateStep3 = () => {
    if (formData.role !== 'admin' && !formData.schoolId) {
      setError("Please select or enter a school")
      return false
    }
    
    if (formData.role === 'student' && !formData.studentId) {
      setError("Student ID is required for student registration")
      return false
    }
    
    if (formData.role === 'teacher' && !formData.department) {
      setError("Department is required for teacher registration")
      return false
    }
    
    return true
  }

  const validateStep4 = () => {
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      setError("You must accept the Terms of Service and Privacy Policy")
      return false
    }
    
    return true
  }

  const nextStep = () => {
    let isValid = false
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1()
        break
      case 2:
        isValid = validateStep2()
        break
      case 3:
        isValid = validateStep3()
        break
      default:
        isValid = true
    }
    
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep4()) return
    
    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'individual',
          ...formData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Registration successful! Please check your email to verify your account.")
        
        // Redirect to verification page
        setTimeout(() => {
          router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email))
        }, 2000)
      } else {
        setError(data.error || "Registration failed. Please try again.")
      }
      
    } catch (err) {
      setError("Registration failed. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSchoolRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)
    setError("")

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const schoolRegistrationData = {
        ...schoolData,
        createdAt: new Date().toISOString(),
        status: 'pending_approval'
      }
      
      console.log('School registration data:', schoolRegistrationData)
      
      setSuccess("School registration submitted! We'll contact you within 24 hours to complete setup.")
      
      setTimeout(() => {
        router.push('/auth/registration-success')
      }, 2000)
      
    } catch (err) {
      setError("School registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-red-500"
      case 2:
        return "bg-orange-500"
      case 3:
        return "bg-yellow-500"
      case 4:
        return "bg-blue-500"
      case 5:
        return "bg-green-500"
      default:
        return "bg-gray-300"
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Weak"
      case 2:
        return "Fair"
      case 3:
        return "Good"
      case 4:
        return "Strong"
      case 5:
        return "Very Strong"
      default:
        return "Enter password"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative min-h-screen p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Join Academia
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create your account to access Nigeria's leading school management platform
            </p>
          </div>

          {/* Back to Auth */}
          <div className="mb-6">
            <Link href="/auth" className="flex items-center text-gray-600 hover:text-blue-600 transition duration-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </div>

          {/* Registration Type Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
              <TabsTrigger value="individual" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Individual Registration</span>
              </TabsTrigger>
              <TabsTrigger value="school" className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>School Registration</span>
              </TabsTrigger>
            </TabsList>

            {/* Individual Registration */}
            <TabsContent value="individual">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <UserPlus className="h-6 w-6 text-blue-600" />
                        <span>Create Your Account</span>
                      </CardTitle>
                      <CardDescription>
                        Step {currentStep} of 4 - Let's get you started
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {Math.round((currentStep / 4) * 100)}% Complete
                    </Badge>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / 4) * 100}%` }}
                    ></div>
                  </div>
                </CardHeader>

                <CardContent>
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

                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
                          <p className="text-gray-600">Tell us about yourself</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              type="text"
                              placeholder="Enter your first name"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              type="text"
                              placeholder="Enter your last name"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your email address"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="+234 800 000 0000"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Account Information */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Setup</h3>
                          <p className="text-gray-600">Choose your login credentials and role</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="role">Account Type *</Label>
                          <Select onValueChange={(value) => handleInputChange('role', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">
                                <div className="flex items-center space-x-2">
                                  <Shield className="h-4 w-4 text-blue-600" />
                                  <div>
                                    <div className="font-medium">School Administrator</div>
                                    <div className="text-sm text-gray-500">Full school management access</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="teacher">
                                <div className="flex items-center space-x-2">
                                  <BookOpen className="h-4 w-4 text-purple-600" />
                                  <div>
                                    <div className="font-medium">Teacher</div>
                                    <div className="text-sm text-gray-500">Classroom and student management</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="student">
                                <div className="flex items-center space-x-2">
                                  <GraduationCap className="h-4 w-4 text-green-600" />
                                  <div>
                                    <div className="font-medium">Student</div>
                                    <div className="text-sm text-gray-500">Access academic records and results</div>
                                  </div>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="username">Username *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="username"
                              type="text"
                              placeholder="Choose a username"
                              value={formData.username}
                              onChange={(e) => handleInputChange('username', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <p className="text-sm text-gray-500">Username must be at least 3 characters long</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">Password *</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className="pl-10 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                          
                          {/* Password Strength Indicator */}
                          {formData.password && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Password strength:</span>
                                <span className={`font-medium ${
                                  passwordStrength >= 4 ? 'text-green-600' : 
                                  passwordStrength >= 3 ? 'text-blue-600' :
                                  passwordStrength >= 2 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {getPasswordStrengthText()}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password *</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              className="pl-10 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                          {formData.password && formData.confirmPassword && (
                            <div className="flex items-center space-x-2">
                              {formData.password === formData.confirmPassword ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm text-green-600">Passwords match</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                  <span className="text-sm text-red-600">Passwords do not match</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 3: School & Role Information */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">School Information</h3>
                          <p className="text-gray-600">Connect with your educational institution</p>
                        </div>

                        {formData.role !== 'admin' && (
                          <div className="space-y-2">
                            <Label htmlFor="schoolId">School Code / ID *</Label>
                            <div className="relative">
                              <School className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="schoolId"
                                type="text"
                                placeholder="Enter your school ID (e.g., SCH-001)"
                                value={formData.schoolId}
                                onChange={(e) => handleInputChange('schoolId', e.target.value)}
                                className="pl-10"
                              />
                            </div>
                            <p className="text-sm text-gray-500">Contact your school administration for your school code</p>
                          </div>
                        )}

                        {formData.role === 'admin' && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="schoolName">School Name *</Label>
                              <Input
                                id="schoolName"
                                type="text"
                                placeholder="Enter your school name"
                                value={formData.schoolName}
                                onChange={(e) => handleInputChange('schoolName', e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="schoolType">School Type</Label>
                              <Select onValueChange={(value) => handleInputChange('schoolType', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select school type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="primary">Primary School</SelectItem>
                                  <SelectItem value="secondary">Secondary School</SelectItem>
                                  <SelectItem value="tertiary">Tertiary Institution</SelectItem>
                                  <SelectItem value="private">Private School</SelectItem>
                                  <SelectItem value="public">Public School</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="schoolAddress">School Address</Label>
                              <Textarea
                                id="schoolAddress"
                                placeholder="Enter complete school address"
                                value={formData.schoolAddress}
                                onChange={(e) => handleInputChange('schoolAddress', e.target.value)}
                                rows={3}
                              />
                            </div>
                          </>
                        )}

                        {formData.role === 'student' && (
                          <div className="space-y-2">
                            <Label htmlFor="studentId">Student ID *</Label>
                            <div className="relative">
                              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="studentId"
                                type="text"
                                placeholder="Enter your student ID"
                                value={formData.studentId}
                                onChange={(e) => handleInputChange('studentId', e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>
                        )}

                        {formData.role === 'teacher' && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="employeeId">Employee ID</Label>
                              <div className="relative">
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  id="employeeId"
                                  type="text"
                                  placeholder="Enter your employee ID"
                                  value={formData.employeeId}
                                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="department">Department *</Label>
                              <Input
                                id="department"
                                type="text"
                                placeholder="e.g., Mathematics, English, Science"
                                value={formData.department}
                                onChange={(e) => handleInputChange('department', e.target.value)}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Step 4: Terms & Completion */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Almost Done!</h3>
                          <p className="text-gray-600">Review and accept our terms</p>
                        </div>

                        {/* Registration Summary */}
                        <Card className="bg-gray-50 border-gray-200">
                          <CardContent className="p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Registration Summary</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Name:</span>
                                <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium">{formData.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Role:</span>
                                <Badge variant="outline" className="text-xs">
                                  {formData.role}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Username:</span>
                                <span className="font-medium">{formData.username}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Terms and Conditions */}
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              id="acceptTerms"
                              checked={formData.acceptTerms}
                              onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                              className="mt-1 rounded border-gray-300"
                            />
                            <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
                              I agree to the{" "}
                              <Link href="/legal/terms" className="text-blue-600 hover:underline">
                                Terms of Service
                              </Link>{" "}
                              and acknowledge that my account will be subject to verification. *
                            </Label>
                          </div>

                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              id="acceptPrivacy"
                              checked={formData.acceptPrivacy}
                              onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
                              className="mt-1 rounded border-gray-300"
                            />
                            <Label htmlFor="acceptPrivacy" className="text-sm leading-relaxed">
                              I acknowledge that I have read and understood the{" "}
                              <Link href="/legal/privacy" className="text-blue-600 hover:underline">
                                Privacy Policy
                              </Link>. *
                            </Label>
                          </div>

                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              id="subscribeNewsletter"
                              checked={formData.subscribeNewsletter}
                              onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
                              className="mt-1 rounded border-gray-300"
                            />
                            <Label htmlFor="subscribeNewsletter" className="text-sm leading-relaxed">
                              I would like to receive updates about new features and educational content.
                            </Label>
                          </div>
                        </div>

                        {/* Security Notice */}
                        <Alert className="border-blue-200 bg-blue-50">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-700">
                            Your account will be verified within 24 hours. You'll receive an email confirmation once approved.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center space-x-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </Button>

                      {currentStep < 4 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2"
                        >
                          <span>Next</span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={loading || !formData.acceptTerms || !formData.acceptPrivacy}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center space-x-2"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Creating Account...
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4" />
                              <span>Create Account</span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* School Registration */}
            <TabsContent value="school">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <span>Register Your School</span>
                  </CardTitle>
                  <CardDescription>
                    Join the Academia platform and transform your school's operations
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* School Registration Benefits */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-2" />
                      What's Included
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Complete school management system</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Multi-user access (admin, teachers, students)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Parent portal and notifications</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Analytics and reporting tools</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Free setup and training</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>24/7 customer support</span>
                      </div>
                    </div>
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

                  <form onSubmit={handleSchoolRegistration} className="space-y-6">
                    {/* School Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">School Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="schoolName">School Name *</Label>
                          <Input
                            id="schoolName"
                            type="text"
                            placeholder="Enter full school name"
                            value={schoolData.schoolName}
                            onChange={(e) => handleSchoolDataChange('schoolName', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="schoolType">School Type *</Label>
                          <Select onValueChange={(value) => handleSchoolDataChange('schoolType', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select school type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nursery">Nursery School</SelectItem>
                              <SelectItem value="primary">Primary School</SelectItem>
                              <SelectItem value="secondary">Secondary School</SelectItem>
                              <SelectItem value="tertiary">Tertiary Institution</SelectItem>
                              <SelectItem value="private">Private Academy</SelectItem>
                              <SelectItem value="vocational">Vocational School</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">School Address *</Label>
                        <Textarea
                          id="address"
                          placeholder="Enter complete school address"
                          value={schoolData.address}
                          onChange={(e) => handleSchoolDataChange('address', e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            type="text"
                            placeholder="Enter city"
                            value={schoolData.city}
                            onChange={(e) => handleSchoolDataChange('city', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <Select onValueChange={(value) => handleSchoolDataChange('state', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {nigerianStates.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">School Phone *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+234 800 000 0000"
                              value={schoolData.phone}
                              onChange={(e) => handleSchoolDataChange('phone', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">School Email *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="info@yourschool.edu.ng"
                              value={schoolData.email}
                              onChange={(e) => handleSchoolDataChange('email', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">School Website</Label>
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://www.yourschool.edu.ng"
                          value={schoolData.website}
                          onChange={(e) => handleSchoolDataChange('website', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Principal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Principal/Administrator Details</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="principalName">Principal's Name *</Label>
                          <Input
                            id="principalName"
                            type="text"
                            placeholder="Enter principal's full name"
                            value={schoolData.principalName}
                            onChange={(e) => handleSchoolDataChange('principalName', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="principalEmail">Principal's Email *</Label>
                          <Input
                            id="principalEmail"
                            type="email"
                            placeholder="principal@yourschool.edu.ng"
                            value={schoolData.principalEmail}
                            onChange={(e) => handleSchoolDataChange('principalEmail', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* School Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">School Details</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="studentCount">Number of Students *</Label>
                          <Select onValueChange={(value) => handleSchoolDataChange('studentCount', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select student count range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-50">1 - 50 students</SelectItem>
                              <SelectItem value="51-200">51 - 200 students</SelectItem>
                              <SelectItem value="201-500">201 - 500 students</SelectItem>
                              <SelectItem value="501-1000">501 - 1,000 students</SelectItem>
                              <SelectItem value="1000+">1,000+ students</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="planType">Preferred Plan *</Label>
                          <Select onValueChange={(value) => handleSchoolDataChange('planType', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select plan type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free Plan (up to 20 students)</SelectItem>
                              <SelectItem value="basic">Basic Plan (₦300/student/term)</SelectItem>
                              <SelectItem value="pro">Pro Plan (₦600/student/term)</SelectItem>
                              <SelectItem value="enterprise">Enterprise Plan (Custom pricing)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-gray-200">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 text-lg"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Submitting Registration...
                          </>
                        ) : (
                          <>
                            <Building2 className="w-5 h-5 mr-3" />
                            Register School
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Registration Process Info */}
                    <Alert className="border-blue-200 bg-blue-50">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-700">
                        <strong>What happens next?</strong> Our team will review your registration within 24 hours. 
                        You'll receive a welcome email with setup instructions and your custom school portal access.
                      </AlertDescription>
                    </Alert>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer Links */}
          <div className="text-center mt-8 space-y-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in here
              </Link>
            </p>
            
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <Link href="/legal/terms" className="hover:text-gray-700">Terms of Service</Link>
              <Link href="/legal/privacy" className="hover:text-gray-700">Privacy Policy</Link>
              <Link href="/results/help" className="hover:text-gray-700">Help & Support</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
