'use client';

import Link from "next/link"
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  CheckCircle, 
  Star, 
  Users, 
  Award, 
  BarChart3, 
  Shield, 
  Smartphone,
  BookOpen,
  Clock,
  TrendingUp,
  Zap,
  Target,
  Heart,
  Phone,
  Mail,
  ArrowRight,
  Play,
  Download,
  Globe,
  Layers,
  FileText,
  Settings,
  PieChart,
  MessageSquare,
  Lock,
  Calendar,
  UserCheck,
  GraduationCap,
  Building2,
  School,
  Lightbulb,
  Rocket,
  Quote,
  Search
} from 'lucide-react';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Target, title: "Admin Dashboard", desc: "Complete oversight with analytics", color: "text-blue-600 bg-blue-50" },
    { icon: GraduationCap, title: "Teacher Portal", desc: "Streamlined score entry & management", color: "text-purple-600 bg-purple-50" },
    { icon: Users, title: "Student/Parent Portal", desc: "Real-time access to academic progress", color: "text-green-600 bg-green-50" },
    { icon: Shield, title: "Public Result Checker", desc: "Secure, token-based result access", color: "text-amber-600 bg-amber-50" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-100' : 'bg-white shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Academia
                </h1>
              </div>
              <div className="hidden lg:block ml-10">
                <div className="flex space-x-8">
                  <a href="#features" className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium">Features</a>
                  <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium">Pricing</a>
                  <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium">Reviews</a>
                  <a href="#faq" className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium">FAQ</a>
                  <a href="#contact" className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium">Contact</a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold">
                <Link href="/results" className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Check Results</span>
                </Link>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg font-semibold">
                <Link href="/auth" className="flex items-center space-x-2">
                  <Rocket className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {/* Trust Badge */}
              <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm font-semibold">
                <CheckCircle className="w-4 h-4 mr-2" />
                Trusted by 500+ Schools Nationwide
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Transform Your School
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Operations Today
                </span>
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
                The most comprehensive school management platform designed specifically for Nigerian schools. 
                Streamline operations, boost academic performance, and engage parents like never before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition duration-300 transform hover:scale-105">
                  <Link href="#demo">🚀 Try Demo</Link>
                </Button>
                <Button variant="outline" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-700 transition duration-300">
                  <a href="/results">� Check Results</a>
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">✓</span>
                  <span>Free up to 20 students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">✓</span>
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">✓</span>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">👨‍🎓</span>
                        </div>
                        <div>
                          <div className="text-white font-semibold">Total Students</div>
                          <div className="text-green-300">+12% this term</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white">1,247</div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">👨‍🏫</span>
                        </div>
                        <div>
                          <div className="text-white font-semibold">Active Teachers</div>
                          <div className="text-blue-300">All online</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white">47</div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">📊</span>
                        </div>
                        <div>
                          <div className="text-white font-semibold">Results Posted</div>
                          <div className="text-purple-300">This week</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white">892</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Trust & Stats Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust Indicators */}
          <div className="text-center mb-16">
            <p className="text-gray-600 mb-8">Trusted by leading educational institutions across Nigeria</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="text-center">
                <div className="h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <Building2 className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Premium Schools</p>
              </div>
              <div className="text-center">
                <div className="h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <School className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Public Schools</p>
              </div>
              <div className="text-center">
                <div className="h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <GraduationCap className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Universities</p>
              </div>
              <div className="text-center">
                <div className="h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <BookOpen className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Academies</p>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <p className="text-gray-600 font-medium">Students Managed</p>
                <p className="text-sm text-gray-500 mt-1">Across 500+ schools</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">20+</div>
                <p className="text-gray-600 font-medium">Hours Saved Weekly</p>
                <p className="text-sm text-gray-500 mt-1">Per school administrator</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">15%</div>
                <p className="text-gray-600 font-medium">Performance Boost</p>
                <p className="text-sm text-gray-500 mt-1">Average improvement</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-amber-600" />
                </div>
                <div className="text-3xl font-bold text-amber-600 mb-2">95%</div>
                <p className="text-gray-600 font-medium">Parent Satisfaction</p>
                <p className="text-sm text-gray-500 mt-1">Real-time engagement</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete School Management Ecosystem</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four powerful portals designed for every stakeholder in your school community
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
            {/* Admin Dashboard */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="text-4xl mb-4">🎯</div>
                <CardTitle className="text-xl">Admin Dashboard</CardTitle>
                <CardDescription>
                  Complete oversight with analytics, student management, and system controls.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>School & Multi-school Management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Student & Teacher Management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Advanced Analytics & Reports</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Bulk Operations & CSV Import</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Notification Management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>System Health Monitoring</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/admin/dashboard">Access Admin Portal</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Portal */}
            <Card className="bg-gradient-to-br from-purple-50 to-violet-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="text-4xl mb-4">👨‍🏫</div>
                <CardTitle className="text-xl">Teacher Portal</CardTitle>
                <CardDescription>
                  Streamlined score entry, class management, and communication tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Quick Score Entry & Auto-calculation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Class Performance Analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Student Progress Tracking</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Parent Communication Tools</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Automated Grade Calculations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Report Generation</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Link href="/teacher/dashboard">Access Teacher Portal</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Student/Parent Portal */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="text-4xl mb-4">🎓</div>
                <CardTitle className="text-xl">Student/Parent Portal</CardTitle>
                <CardDescription>
                  Real-time access to academic progress and performance insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Real-time Results Access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Performance Analytics & Trends</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Downloadable Transcripts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Notification Center</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Academic History & Goals</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Parent Engagement Tools</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Link href="/student/dashboard">Access Student Portal</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Public Result Checker */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="text-4xl mb-4">🔍</div>
                <CardTitle className="text-xl">Public Result Checker</CardTitle>
                <CardDescription>
                  Secure, token-based result checking for external access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Token-based Security</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Limited Trial Access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>PDF Download & Print</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Watermarked Results</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Session Management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Help & Support</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    <Link href="/results">Check Results</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Features Grid */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Core Platform Features</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">📊</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Advanced Analytics</h4>
                  <p className="text-sm text-gray-600">Performance trends, comparative analysis, and predictive insights</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">📱</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Multi-channel Notifications</h4>
                  <p className="text-sm text-gray-600">Email, SMS, and in-app notifications with automation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">📁</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Bulk Operations</h4>
                  <p className="text-sm text-gray-600">Import/export students, bulk score entry, mass communications</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">🔒</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Role-based Security</h4>
                  <p className="text-sm text-gray-600">Granular permissions and secure data access controls</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">🏫</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Multi-school Support</h4>
                  <p className="text-sm text-gray-600">Manage multiple schools under one centralized system</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">📝</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Custom Grading</h4>
                  <p className="text-sm text-gray-600">Flexible grading systems and automated calculations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Schools Choose Academia</h2>
            <p className="text-xl text-gray-600">Join hundreds of schools already transforming their operations across Nigeria</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Save 20+ Hours Weekly</h3>
              <p className="text-gray-600">Automate result compilation, grade calculations, notifications, and administrative tasks that used to take hours.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Boost Academic Performance</h3>
              <p className="text-gray-600">Data-driven insights help identify struggling students early, track improvement trends, and optimize teaching strategies.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Improve Parent Engagement</h3>
              <p className="text-gray-600">Real-time result access, automated notifications, and transparent communication keep parents actively involved in their child's education.</p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">💰</div>
                <h4 className="font-semibold text-gray-900 mb-2">Cost Effective</h4>
                <p className="text-sm text-gray-600">Starts at just ₦300 per student per term</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">🔒</div>
                <h4 className="font-semibold text-gray-900 mb-2">Bank-level Security</h4>
                <p className="text-sm text-gray-600">SSL encryption and secure data storage</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">📱</div>
                <h4 className="font-semibold text-gray-900 mb-2">Mobile Responsive</h4>
                <p className="text-sm text-gray-600">Works perfectly on all devices</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">🇳🇬</div>
                <h4 className="font-semibold text-gray-900 mb-2">Built for Nigeria</h4>
                <p className="text-sm text-gray-600">Nigerian payment methods & curriculum</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Start free, scale as you grow. No hidden fees, no surprises.</p>
            <div className="mt-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                💳 Nigerian Payment Methods Supported
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Free Plan */}
            <Card className="relative border-2 border-gray-200 hover:border-gray-300 transition duration-300">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">Free</CardTitle>
                <div className="text-4xl font-bold text-gray-900 my-4">₦0</div>
                <CardDescription>Perfect for small schools & trials</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Up to 20 students</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">1 teacher account</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Basic result management</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Student/parent portal</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <span className="text-gray-500">Analytics & notifications</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <span className="text-gray-500">Bulk import/export</span>
                  </li>
                </ul>
                <Button className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Basic Plan */}
            <Card className="relative border-2 border-blue-200 hover:border-blue-300 transition duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">Basic</CardTitle>
                <div className="text-4xl font-bold text-blue-600 my-4">₦300</div>
                <CardDescription>per student/term</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Unlimited students</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Up to 5 teachers</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Full result management</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Email notifications</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Import/export tools</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Basic analytics</span>
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Basic Plan
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-2 border-purple-200 hover:border-purple-300 transition duration-300">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">Pro</CardTitle>
                <div className="text-4xl font-bold text-purple-600 my-4">₦600</div>
                <CardDescription>per student/term</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Everything in Basic</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Up to 20 teachers</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">SMS + Email notifications</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Performance predictions</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Start Pro Plan
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative border-2 border-amber-200 hover:border-amber-300 transition duration-300">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-amber-600 my-4">Custom</div>
                <CardDescription>For school networks</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Everything in Pro</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Multi-school management</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">API access & integrations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Custom branding</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Dedicated support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-gray-700">Training & onboarding</span>
                  </li>
                </ul>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Information */}
          <div className="text-center mt-12">
            <Card className="max-w-4xl mx-auto bg-gray-50">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">💳 Payment Options</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Cards • Bank Transfer • USSD • Mobile Wallets
                    </p>
                    <p className="text-xs text-gray-500">
                      Powered by Paystack & Flutterwave
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">📊 Billing Options</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Pay per term or annually (with discounts)
                    </p>
                    <p className="text-xs text-gray-500">
                      Free setup • No cancellation fees • 24/7 support
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Example:</strong> A school with 150 students on Basic Plan = ₦300 × 150 = ₦45,000/term
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Access Portal Section */}
      <section id="access" className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get Started with Academia</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Access your academic portal or check results with your institution's credentials.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Live Demo Access */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">🚀 Access Your Portal</CardTitle>
                <CardDescription className="text-indigo-100">
                  Login to your institution's portal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white justify-start h-12">
                    <Link href="/auth" className="flex items-center w-full">
                      <span className="text-2xl mr-3">👨‍💼</span>
                      <div className="text-left">
                        <div className="font-semibold">Admin Login</div>
                        <div className="text-xs opacity-80">System administration</div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white justify-start h-12">
                    <Link href="/auth" className="flex items-center w-full">
                      <span className="text-2xl mr-3">👨‍🏫</span>
                      <div className="text-left">
                        <div className="font-semibold">Teacher Login</div>
                        <div className="text-xs opacity-80">Grade management & analytics</div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button className="bg-green-600 hover:bg-green-700 text-white justify-start h-12">
                    <Link href="/auth" className="flex items-center w-full">
                      <span className="text-2xl mr-3">🎓</span>
                      <div className="text-left">
                        <div className="font-semibold">Student Login</div>
                        <div className="text-xs opacity-80">View progress & results</div>
                      </div>
                    </Link>
                  </Button>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg mt-6">
                  <h4 className="font-semibold mb-2">Portal Features:</h4>
                  <ul className="text-sm text-indigo-100 space-y-1">
                    <li>• Secure authentication system</li>
                    <li>• Role-based access control</li>
                    <li>• Real-time data synchronization</li>
                    <li>• Comprehensive reporting tools</li>
                    <li>• Mobile-responsive interface</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Quick Result Access */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">� Check Your Results</CardTitle>
                <CardDescription className="text-indigo-100">
                  Instant access to academic results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full h-16 text-lg">
                  <Link href="/results" className="flex items-center justify-center w-full">
                    <span className="text-3xl mr-3">📊</span>
                    <div>
                      <div className="font-semibold">Access Results Portal</div>
                      <div className="text-sm opacity-80">Enter your token to view results</div>
                    </div>
                  </Link>
                </Button>
                
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">How to Check Results:</h4>
                  <div className="space-y-2 text-sm text-indigo-100">
                    <div className="flex items-center">
                      <span className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs font-bold">1</span>
                      Get your result token from your school
                    </div>
                    <div className="flex items-center">
                      <span className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs font-bold">2</span>
                      Enter your student ID and token
                    </div>
                    <div className="flex items-center">
                      <span className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs font-bold">3</span>
                      View and download your results
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-500/20 border border-amber-400/30 p-3 rounded-lg">
                  <p className="text-sm text-amber-100">
                    <strong>Need Help?</strong> Contact your school administrator for login credentials and result tokens.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-indigo-200 mb-4">Ready to get started or need assistance?</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="border-2 border-white text-white px-6 py-3 hover:bg-white hover:text-indigo-600 transition duration-300">
                � Contact Sales
              </Button>
              <Button variant="outline" className="border-2 border-white text-white px-6 py-3 hover:bg-white hover:text-indigo-600 transition duration-300">
                � View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Feature Showcase */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything Your School Needs
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                In One Platform
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From student management to parent engagement, Academia provides all the tools you need to run a modern, efficient school.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="relative group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Analytics</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Get deep insights into student performance, class trends, and school-wide analytics with automated reporting and predictive insights.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Real-time performance tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Automated report generation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Predictive performance insights
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="relative group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Parent Engagement</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Keep parents informed and engaged with automated notifications, real-time result access, and direct communication channels.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    SMS & Email notifications
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Instant result delivery
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Two-way communication
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="relative group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Reliable</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Bank-level security with SSL encryption, automated backups, and 99.9% uptime guarantee. Your data is always safe and accessible.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    SSL encryption & secure storage
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Daily automated backups
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    99.9% uptime guarantee
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Schools Are Saying</h2>
            <p className="text-xl text-gray-600">Join hundreds of satisfied schools across Nigeria</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="p-8">
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Academia transformed our school operations completely. What used to take our admin team 2 days now takes 30 minutes. Parents love the instant result access!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">MO</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Mrs. Olumide Adebayo</div>
                    <div className="text-gray-600 text-sm">Principal, Greenfield Academy Lagos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "The analytics features helped us identify students who needed extra support early. Our overall performance improved by 15% this term!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">AK</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Mr. Adebayo Kola</div>
                    <div className="text-gray-600 text-sm">Academic Director, Excellence Schools Abuja</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "As a teacher, I love how simple score entry has become. The automatic calculations and parent notifications save me hours every week."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">FN</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Miss Funmi Nkem</div>
                    <div className="text-gray-600 text-sm">Mathematics Teacher, Royal Heights School</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Real results from real schools using Academia</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-blue-50">
              <CardContent>
                <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Students Managed</div>
                <p className="text-gray-600">Across 500+ schools nationwide</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-green-50">
              <CardContent>
                <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Parent Satisfaction</div>
                <p className="text-gray-600">Real-time access increases engagement</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-purple-50">
              <CardContent>
                <div className="text-4xl font-bold text-purple-600 mb-2">20+</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Hours Saved Weekly</div>
                <p className="text-gray-600">Administrative time reduction</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your School?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of schools already using Academia to streamline operations and boost academic performance.
          </p>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">10,000+</div>
                  <p className="text-blue-100">Students Managed</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <p className="text-blue-100">Schools Using Academia</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">99.9%</div>
                  <p className="text-blue-100">Uptime Guarantee</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition duration-300 transform hover:scale-105">
              🚀 Start Free Trial Now
            </Button>
            <Button variant="outline" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition duration-300">
              📞 Contact Sales Team
            </Button>
          </div>
          
          <p className="text-sm text-blue-200">
            No credit card required • Free for up to 20 students • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4">🎓 Academia</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                The complete school management system designed specifically for Nigerian schools. Streamline operations, boost performance, and engage parents like never before.
              </p>
              <div className="flex space-x-4">
                <Button className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300">
                  📘
                </Button>
                <Button className="bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition duration-300">
                  🐦
                </Button>
                <Button className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-300">
                  💬
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#features" className="hover:text-white transition duration-300">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition duration-300">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Mobile Apps</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition duration-300">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Training Videos</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">System Status</a></li>
                <li>
                  <div className="flex items-center space-x-2">
                    <span>📞</span>
                    <span>+234 (0) 812-345-6789</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center space-x-2">
                    <span>✉️</span>
                    <span>support@academia.com</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Academia. All rights reserved. Made with ❤️ for Nigerian schools.
              </p>
              <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition duration-300">Privacy Policy</a>
                <a href="#" className="hover:text-white transition duration-300">Terms of Service</a>
                <a href="#" className="hover:text-white transition duration-300">Data Security</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
