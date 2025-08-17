"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Menu,
  X,
  GraduationCap,
  Users,
  BookOpen,
  BarChart3,
  Shield,
  Smartphone,
  Globe,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Mail,
  Phone,
  MapPin,
  Clock,
  Award,
  Heart,
  TrendingUp,
  Headphones,
  FileText,
  Calendar,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Banknote,
} from "lucide-react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activePortal, setActivePortal] = useState("admin")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById("header")
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add("backdrop-blur-md", "bg-white/80", "border-b")
        } else {
          header.classList.remove("backdrop-blur-md", "bg-white/80", "border-b")
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const portalFeatures = {
    admin: {
      title: "Admin Portal",
      description: "Complete school management with powerful analytics and control",
      features: [
        "Student & Teacher Management",
        "Academic Performance Analytics",
        "Financial Management & Reporting",
        "Communication & Notifications",
        "System Configuration & Settings",
        "Multi-School Management",
      ],
      color: "bg-blue-500",
    },
    teacher: {
      title: "Teacher Portal",
      description: "Streamlined teaching tools for modern educators",
      features: [
        "Grade & Assessment Management",
        "Class Performance Analytics",
        "Student Progress Tracking",
        "Assignment & Homework Tools",
        "Parent Communication",
        "Lesson Planning & Resources",
      ],
      color: "bg-green-500",
    },
    student: {
      title: "Student Portal",
      description: "Engaging learning experience with comprehensive tools",
      features: [
        "Academic Results & Transcripts",
        "Assignment Submissions",
        "Class Schedule & Timetable",
        "Communication with Teachers",
        "Learning Resources & Materials",
        "Progress Tracking & Goals",
      ],
      color: "bg-purple-500",
    },
    public: {
      title: "Public Portal",
      description: "Transparent access to academic information for everyone",
      features: [
        "Result Verification System",
        "School Information & News",
        "Admission Requirements",
        "Contact Information",
        "Academic Calendar",
        "Public Announcements",
      ],
      color: "bg-orange-500",
    },
  }

  const testimonials = [
    {
      name: "Mrs. Adunni Olatunji",
      role: "Principal, Lagos State Model College",
      content:
        "Academia has transformed how we manage our school. The comprehensive analytics help us make data-driven decisions, and our teachers love the intuitive interface.",
      rating: 5,
      image: "/placeholder-user.jpg",
    },
    {
      name: "Mr. Chukwuma Nwosu",
      role: "Mathematics Teacher, Federal Government College",
      content:
        "The grade management system is incredibly efficient. I can track student progress in real-time and communicate with parents seamlessly.",
      rating: 5,
      image: "/placeholder-user.jpg",
    },
    {
      name: "Fatima Al-Hassan",
      role: "Student, Government Secondary School",
      content:
        "I love being able to check my results instantly and communicate with my teachers. The mobile app makes everything so convenient!",
      rating: 5,
      image: "/placeholder-user.jpg",
    },
  ]

  const faqs = [
    {
      question: "How secure is Academia's data management?",
      answer:
        "Academia employs enterprise-grade security with end-to-end encryption, regular security audits, and compliance with international data protection standards. All data is stored securely with multiple backup systems.",
    },
    {
      question: "Can Academia handle multiple schools?",
      answer:
        "Yes! Academia is designed for scalability. Our Enterprise plan supports unlimited schools with centralized management, while maintaining individual school autonomy and customization.",
    },
    {
      question: "What payment methods do you accept in Nigeria?",
      answer:
        "We accept all major Nigerian payment methods including bank transfers, Paystack, Flutterwave, USSD payments, and mobile money. We also offer flexible payment plans for schools.",
    },
    {
      question: "Do you provide training and support?",
      answer:
        "We provide comprehensive onboarding, training sessions for staff, 24/7 technical support, and ongoing educational resources to ensure successful implementation.",
    },
    {
      question: "Can parents access their children's information?",
      answer:
        "Yes, parents receive secure login credentials to access their children's academic records, communicate with teachers, receive notifications, and track progress through our parent portal.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Yes! Academia offers native mobile apps for iOS and Android, providing full functionality for students, teachers, parents, and administrators on the go.",
    },
    {
      question: "How does the result verification system work?",
      answer:
        "Our public result verification system allows anyone to verify academic results using unique verification codes, ensuring transparency and preventing certificate fraud.",
    },
    {
      question: "What happens to our data if we cancel?",
      answer:
        "You maintain full ownership of your data. We provide complete data export in standard formats and ensure secure data deletion according to your preferences and legal requirements.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header id="header" className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Academia
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                Pricing
              </a>
              <a href="#demo" className="text-gray-700 hover:text-blue-600 transition-colors">
                Demo
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                Contact
              </a>
              <Link href="/auth">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 p-4 bg-white rounded-lg shadow-lg border">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Pricing
                </a>
                <a href="#demo" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Demo
                </a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Contact
                </a>
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link href="/auth">
                    <Button variant="outline" className="w-full bg-transparent">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
              🚀 Trusted by 500+ Nigerian Schools
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              The Complete School Management Solution for Nigeria
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Streamline academic operations, enhance student performance, and empower educational excellence with our
              comprehensive, Nigerian-focused school management platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600">Schools</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">50K+</div>
                <div className="text-gray-600">Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">2K+</div>
                <div className="text-gray-600">Teachers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Showcase */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Four Powerful Portals, One Complete Solution</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Academia provides specialized interfaces for every stakeholder in your educational ecosystem
            </p>
          </div>

          <Tabs value={activePortal} onValueChange={setActivePortal} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="admin" className="text-sm">
                Admin
              </TabsTrigger>
              <TabsTrigger value="teacher" className="text-sm">
                Teacher
              </TabsTrigger>
              <TabsTrigger value="student" className="text-sm">
                Student
              </TabsTrigger>
              <TabsTrigger value="public" className="text-sm">
                Public
              </TabsTrigger>
            </TabsList>

            {Object.entries(portalFeatures).map(([key, portal]) => (
              <TabsContent key={key} value={key}>
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="text-center pb-8">
                    <div
                      className={`w-16 h-16 ${portal.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      {key === "admin" && <Settings className="h-8 w-8 text-white" />}
                      {key === "teacher" && <Users className="h-8 w-8 text-white" />}
                      {key === "student" && <GraduationCap className="h-8 w-8 text-white" />}
                      {key === "public" && <Globe className="h-8 w-8 text-white" />}
                    </div>
                    <CardTitle className="text-3xl mb-2">{portal.title}</CardTitle>
                    <CardDescription className="text-lg">{portal.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h4 className="text-xl font-semibold mb-4">Key Features:</h4>
                        <ul className="space-y-3">
                          {portal.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-8 text-center">
                        <div className="text-6xl mb-4">
                          {key === "admin" && "📊"}
                          {key === "teacher" && "👩‍🏫"}
                          {key === "student" && "🎓"}
                          {key === "public" && "🌐"}
                        </div>
                        <p className="text-gray-600">Interactive portal preview coming soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Comprehensive School Management Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run a modern educational institution efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-8 w-8" />,
                title: "Student Management",
                description:
                  "Complete student lifecycle management from admission to graduation with detailed profiles, academic tracking, and parent communication.",
                color: "bg-blue-500",
              },
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: "Academic Analytics",
                description:
                  "Powerful analytics and reporting tools to track performance, identify trends, and make data-driven educational decisions.",
                color: "bg-green-500",
              },
              {
                icon: <BookOpen className="h-8 w-8" />,
                title: "Curriculum Management",
                description:
                  "Organize subjects, create lesson plans, manage assessments, and track curriculum delivery across all classes.",
                color: "bg-purple-500",
              },
              {
                icon: <Bell className="h-8 w-8" />,
                title: "Communication Hub",
                description:
                  "Multi-channel communication system for announcements, notifications, parent-teacher interactions, and emergency alerts.",
                color: "bg-orange-500",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Security & Privacy",
                description:
                  "Enterprise-grade security with role-based access control, data encryption, and compliance with educational privacy standards.",
                color: "bg-red-500",
              },
              {
                icon: <Smartphone className="h-8 w-8" />,
                title: "Mobile Access",
                description:
                  "Native mobile apps for iOS and Android ensuring full functionality for all users on any device, anywhere.",
                color: "bg-indigo-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Schools Choose Academia</h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <TrendingUp className="h-6 w-6 text-green-500" />,
                    title: "Improve Academic Performance by 35%",
                    description:
                      "Data-driven insights help identify struggling students early and implement targeted interventions.",
                  },
                  {
                    icon: <Clock className="h-6 w-6 text-blue-500" />,
                    title: "Save 20+ Hours Weekly",
                    description:
                      "Automated administrative tasks free up valuable time for teaching and student interaction.",
                  },
                  {
                    icon: <Heart className="h-6 w-6 text-red-500" />,
                    title: "Increase Parent Satisfaction by 90%",
                    description: "Real-time communication and transparency build stronger school-parent relationships.",
                  },
                  {
                    icon: <Award className="h-6 w-6 text-purple-500" />,
                    title: "Achieve 99.9% Data Accuracy",
                    description:
                      "Eliminate manual errors with automated data validation and real-time synchronization.",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-6xl mb-6">📈</div>
                <h3 className="text-2xl font-bold mb-4">Proven Results</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">35%</div>
                    <div className="text-sm text-gray-600">Performance Boost</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">20hrs</div>
                    <div className="text-sm text-gray-600">Time Saved Weekly</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">90%</div>
                    <div className="text-sm text-gray-600">Parent Satisfaction</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">99.9%</div>
                    <div className="text-sm text-gray-600">Data Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your school. All plans include core features with no hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Starter",
                price: "Free",
                period: "Forever",
                description: "Perfect for small schools getting started",
                features: [
                  "Up to 50 students",
                  "Basic result management",
                  "Parent communication",
                  "Mobile app access",
                  "Email support",
                ],
                cta: "Start Free",
                popular: false,
                color: "border-gray-200",
              },
              {
                name: "School",
                price: "₦25,000",
                period: "per month",
                description: "Ideal for growing educational institutions",
                features: [
                  "Up to 500 students",
                  "Advanced analytics",
                  "Multi-class management",
                  "Custom reports",
                  "Priority support",
                  "Teacher training",
                ],
                cta: "Start Trial",
                popular: true,
                color: "border-blue-500",
              },
              {
                name: "Professional",
                price: "₦50,000",
                period: "per month",
                description: "For established schools with advanced needs",
                features: [
                  "Up to 2,000 students",
                  "Financial management",
                  "Advanced security",
                  "API access",
                  "Custom integrations",
                  "24/7 phone support",
                  "On-site training",
                ],
                cta: "Contact Sales",
                popular: false,
                color: "border-purple-500",
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "pricing",
                description: "For large institutions and school districts",
                features: [
                  "Unlimited students",
                  "Multi-school management",
                  "White-label solution",
                  "Dedicated support team",
                  "Custom development",
                  "SLA guarantee",
                  "Advanced compliance",
                ],
                cta: "Contact Us",
                popular: false,
                color: "border-green-500",
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 ${plan.color} ${plan.popular ? "shadow-xl scale-105" : "shadow-lg"} hover:shadow-xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period !== "pricing" && <span className="text-gray-600">/{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? "bg-blue-500 hover:bg-blue-600" : ""}`}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">All plans include:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="outline" className="flex items-center">
                <Banknote className="h-4 w-4 mr-1" />
                Nigerian Payment Methods
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <CreditCard className="h-4 w-4 mr-1" />
                Flexible Payment Plans
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Headphones className="h-4 w-4 mr-1" />
                Local Support Team
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Data Security Guarantee
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Experience Academia Live</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Try our demo portals and see how Academia can transform your school management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                name: "Admin Demo",
                href: "/admin/dashboard",
                icon: <Settings className="h-6 w-6" />,
                color: "bg-blue-500",
              },
              {
                name: "Teacher Demo",
                href: "/teacher/dashboard",
                icon: <Users className="h-6 w-6" />,
                color: "bg-green-500",
              },
              {
                name: "Student Demo",
                href: "/student/dashboard",
                icon: <GraduationCap className="h-6 w-6" />,
                color: "bg-purple-500",
              },
              {
                name: "Result Checker",
                href: "/results",
                icon: <FileText className="h-6 w-6" />,
                color: "bg-orange-500",
              },
            ].map((demo, index) => (
              <Link key={index} href={demo.href}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 ${demo.color} rounded-lg flex items-center justify-center text-white mx-auto mb-4`}
                    >
                      {demo.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{demo.name}</h3>
                    <Button variant="outline" size="sm">
                      Try Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Result Checker Preview */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <FileText className="h-6 w-6 mr-2" />
                Quick Result Verification
              </CardTitle>
              <CardDescription>
                Verify any academic result instantly with our public verification system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input placeholder="Enter verification code (e.g., ACA/2024/001)" className="flex-1" />
                <Button>
                  Verify Result
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">Try: ACA/2024/001 for a sample result</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Join hundreds of satisfied schools across Nigeria</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Get answers to common questions about Academia</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-semibold">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your School?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join over 500 Nigerian schools already using Academia to improve their educational outcomes
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-3xl font-bold">30-Day</div>
              <div className="opacity-90">Free Trial</div>
            </div>
            <div>
              <div className="text-3xl font-bold">24/7</div>
              <div className="opacity-90">Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold">99.9%</div>
              <div className="opacity-90">Uptime SLA</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 bg-transparent"
            >
              Schedule Demo
              <Calendar className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Academia</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering Nigerian schools with comprehensive management solutions for the digital age.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#demo" className="text-gray-400 hover:text-white transition-colors">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Training Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    System Status
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Community Forum
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="text-gray-400">info@academia.edu.ng</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="text-gray-400">+234-701-ACADEMIA</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="text-gray-400">Lagos, Nigeria</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Newsletter</h4>
                <div className="flex">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                  <Button className="ml-2 bg-blue-600 hover:bg-blue-700">Subscribe</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">© 2024 Academia. All rights reserved.</div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
