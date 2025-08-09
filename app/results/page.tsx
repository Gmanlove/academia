"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { 
  Search,
  Shield,
  Clock,
  Key,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  Info,
  Eye,
  EyeOff,
  RefreshCw,
  FileText,
  School,
  User,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  Download,
  Share2,
  Lock,
  Unlock,
  Timer,
  Zap,
  Star,
  Award,
  TrendingUp
} from "lucide-react"
import { db } from "@/lib/mock-db"

interface TokenInfo {
  id: string
  studentId: string
  studentName: string
  className: string
  expiresAt: string
  trialsLeft: number
  maxTrials: number
  status: "active" | "expired" | "exhausted"
  generatedAt: string
  lastUsed?: string
}

interface ClassInfo {
  id: string
  name: string
  level: string
  studentsCount: number
}

export default function ResultCheckerPage() {
  const [currentTab, setCurrentTab] = useState("login")
  const [studentId, setStudentId] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [token, setToken] = useState("")
  const [showToken, setShowToken] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [classes, setClasses] = useState<ClassInfo[]>([])
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)
  const [trialCount, setTrialCount] = useState(0)
  const [maxTrials] = useState(3)
  
  const router = useRouter()

  useEffect(() => {
    // Load classes data
    const classesData = db.listClasses()
    const classInfo = classesData.map(c => ({
      id: c.id,
      name: c.name,
      level: c.level.toString(),
      studentsCount: Math.floor(Math.random() * 30) + 20 // Mock student count
    }))
    setClasses(classInfo)

    // Check for existing session or trial count
    const storedTrials = localStorage.getItem('result-checker-trials')
    if (storedTrials) {
      setTrialCount(parseInt(storedTrials))
    }
  }, [])

  const mockTokenGeneration = (studentId: string, className: string): TokenInfo => {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    
    return {
      id: `token_${Date.now()}`,
      studentId,
      studentName: `Student ${studentId.slice(-4)}`,
      className,
      expiresAt: expiresAt.toISOString(),
      trialsLeft: maxTrials,
      maxTrials,
      status: "active",
      generatedAt: now.toISOString(),
    }
  }

  const validateToken = async (studentId: string, token: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock validation - in real app this would be an API call
        const isValid = token.length >= 8 && studentId.includes("STU")
        resolve(isValid)
      }, 1000)
    })
  }

  const handleLogin = async () => {
    if (!studentId || !token) {
      setError("Please enter both Student ID and Token")
      return
    }

    if (trialCount >= maxTrials) {
      setError("Maximum trial attempts reached. Please request a new token.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const isValid = await validateToken(studentId, token)
      
      if (isValid) {
        // Reset trial count on successful login
        localStorage.removeItem('result-checker-trials')
        setTrialCount(0)
        setSuccess("Authentication successful! Redirecting to results...")
        setTimeout(() => {
          router.push(`/results/view?studentId=${encodeURIComponent(studentId)}`)
        }, 1500)
      } else {
        const newTrialCount = trialCount + 1
        setTrialCount(newTrialCount)
        localStorage.setItem('result-checker-trials', newTrialCount.toString())
        setError(`Invalid credentials. ${maxTrials - newTrialCount} attempts remaining.`)
      }
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleTokenRequest = () => {
    if (!studentId || !selectedClass) {
      setError("Please enter Student ID and select a class")
      return
    }

    const selectedClassInfo = classes.find(c => c.id === selectedClass)
    if (!selectedClassInfo) {
      setError("Please select a valid class")
      return
    }

    // Generate mock token
    const newTokenInfo = mockTokenGeneration(studentId, selectedClassInfo.name)
    setTokenInfo(newTokenInfo)
    setSuccess("Token request submitted successfully! Please check your email or contact your school.")
    setRequestDialogOpen(false)
    setError(null)
  }

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffInHours = Math.max(0, Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60)))
    
    if (diffInHours < 24) {
      return `${diffInHours} hours remaining`
    }
    const days = Math.floor(diffInHours / 24)
    return `${days} days remaining`
  }

  const getTrialProgressColor = () => {
    const percentage = (trialCount / maxTrials) * 100
    if (percentage < 50) return "bg-green-500"
    if (percentage < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">🔍 Result Checker</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access your academic results securely with your Student ID and authentication token
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Authentication Panel */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  🔐 Secure Authentication
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Enter your credentials to access your academic results
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="request" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Request Token
                    </TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentId" className="text-sm font-medium">
                          Student ID
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="studentId"
                            type="text"
                            placeholder="e.g., STU-2024-001"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="pl-10"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="token" className="text-sm font-medium">
                          Authentication Token
                        </Label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="token"
                            type={showToken ? "text" : "password"}
                            placeholder="Enter your access token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="pl-10 pr-10"
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowToken(!showToken)}
                          >
                            {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      {/* Trial Counter */}
                      {trialCount > 0 && (
                        <Alert className="border-yellow-200 bg-yellow-50">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-800">
                            <div className="flex justify-between items-center">
                              <span>Attempts: {trialCount}/{maxTrials}</span>
                              <div className="w-20">
                                <Progress 
                                  value={(trialCount / maxTrials) * 100} 
                                  className="h-2"
                                />
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button 
                        onClick={handleLogin} 
                        disabled={!studentId || !token || loading || trialCount >= maxTrials}
                        className="w-full"
                        size="lg"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Authenticating...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            View My Results
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Request Token Tab */}
                  <TabsContent value="request" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="requestStudentId" className="text-sm font-medium">
                          Student ID
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="requestStudentId"
                            type="text"
                            placeholder="e.g., STU-2024-001"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="class" className="text-sm font-medium">
                          Select Your Class
                        </Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose your class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((classInfo) => (
                              <SelectItem key={classInfo.id} value={classInfo.id}>
                                <div className="flex items-center gap-2">
                                  <School className="h-4 w-4" />
                                  {classInfo.name} - Level {classInfo.level}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Alert className="border-blue-200 bg-blue-50">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          Token requests are processed within 24-48 hours. You'll receive your token via email or through your school administration.
                        </AlertDescription>
                      </Alert>

                      <Button 
                        onClick={handleTokenRequest}
                        disabled={!studentId || !selectedClass}
                        className="w-full"
                        variant="outline"
                        size="lg"
                      >
                        <Key className="mr-2 h-4 w-4" />
                        Request Access Token
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Status Messages */}
                {error && (
                  <Alert className="mt-4 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mt-4 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Token Information */}
            {tokenInfo && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Token Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Student:</span>
                      <span className="font-medium text-green-900">{tokenInfo.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Class:</span>
                      <span className="font-medium text-green-900">{tokenInfo.className}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Status:</span>
                      <Badge className="bg-green-600 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Trials Left:</span>
                      <span className="font-medium text-green-900">{tokenInfo.trialsLeft}/{tokenInfo.maxTrials}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Expires:</span>
                      <span className="font-medium text-green-900">{formatTimeRemaining(tokenInfo.expiresAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Help */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use your official Student ID as provided by your school</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Tokens are valid for 7 days from generation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Maximum 3 login attempts per session</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Contact your school if you need assistance</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => router.push('/results/help')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Detailed Help & Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Information */}
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Lock className="h-3 w-3" />
                    <span>SSL encrypted connection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-3 w-3" />
                    <span>Session expires after inactivity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    <span>Your data is never stored locally</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3" />
                    <span>Real-time authentication</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
