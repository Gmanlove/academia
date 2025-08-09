"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle,
  GraduationCap,
  Building2,
  Clock,
  Mail,
  Phone,
  Users,
  ArrowRight,
  Star,
  Shield,
  Zap,
  BookOpen,
  BarChart3
} from "lucide-react"

export default function RegistrationSuccessPage() {
  const [countdown, setCountdown] = useState(10)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/auth')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Academia
              </h1>
            </div>
          </div>

          {/* Success Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Registration Successful!</CardTitle>
              <CardDescription className="text-lg">
                Welcome to Academia - Nigeria's leading school management platform
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* What Happens Next */}
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600 mr-2" />
                  What Happens Next?
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Email Verification</h4>
                      <p className="text-sm text-gray-600">Check your inbox for a verification email</p>
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                      <Phone className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Account Review</h4>
                      <p className="text-sm text-gray-600">Our team will review within 24 hours</p>
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Get Started</h4>
                      <p className="text-sm text-gray-600">Access your dashboard and start exploring</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Preview */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  What You'll Get Access To
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700">Secure school management system</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-700">Student academic tracking</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">Advanced analytics & reports</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <Zap className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="text-sm text-gray-700">Real-time notifications</span>
                  </div>
                </div>
              </div>

              {/* School Registration Success */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">School Registration Submitted</h3>
                    <p className="text-gray-700 mb-3">
                      Thank you for choosing Academia for your school management needs. Our setup team will contact you within 24 hours to:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Complete your school profile setup</li>
                      <li>• Configure your admin dashboard</li>
                      <li>• Provide training for your team</li>
                      <li>• Set up your custom school portal</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Ready to Get Started?</h3>
                <p className="text-gray-600">
                  While you wait for verification, explore our resources and get familiar with the platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => router.push('/auth')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Go to Login
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/results/help')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Help Center
                  </Button>
                </div>
              </div>

              {/* Auto-redirect Notice */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Automatically redirecting to login page in{" "}
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {countdown} seconds
                  </Badge>
                </p>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => router.push('/auth')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Go now <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support Information */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
                <p className="text-gray-600">
                  Our support team is here to help you get the most out of Academia.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/results/help"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Help Center
                  </Link>
                  
                  <Link 
                    href="mailto:support@academia.edu.ng"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Link>
                  
                  <Link 
                    href="tel:+2348000000000"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
