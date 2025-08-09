"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  HelpCircle,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Download,
  Shield,
  Key,
  User,
  School,
  Search,
  RefreshCw,
  MessageSquare,
  FileText,
  ArrowLeft,
  Send,
  BookOpen,
  Video,
  Headphones,
  Globe,
  Calendar,
  MapPin,
  Star,
  ThumbsUp,
  Zap
} from "lucide-react"
import { useRouter } from "next/navigation"

interface FAQ {
  id: string
  question: string
  answer: string
  category: "authentication" | "token" | "results" | "technical" | "general"
}

interface ContactMethod {
  type: "email" | "phone" | "chat" | "ticket"
  label: string
  value: string
  availability: string
  responseTime: string
  icon: React.ReactNode
}

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketMessage, setTicketMessage] = useState("")
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackRating, setFeedbackRating] = useState(0)
  
  const router = useRouter()

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I get an access token?",
      answer: "Access tokens are provided by your school administration. Contact your class teacher, academic office, or school registrar to request a token. You'll need to provide your Student ID and class information.",
      category: "token"
    },
    {
      id: "2", 
      question: "What is my Student ID format?",
      answer: "Student IDs typically follow the format 'STU-YYYY-XXX' where YYYY is your enrollment year and XXX is your unique number. Check your student card, enrollment documents, or contact your school if unsure.",
      category: "authentication"
    },
    {
      id: "3",
      question: "Why is my token not working?",
      answer: "Tokens may not work for several reasons: (1) Expired token (valid for 7 days), (2) Incorrect Student ID format, (3) Token already used maximum times, (4) Case-sensitive entry. Verify all details and request a new token if needed.",
      category: "token"
    },
    {
      id: "4",
      question: "How many times can I use my token?",
      answer: "Each token allows 3 authentication attempts. After 3 failed attempts, you'll need to request a new token. Successful authentication resets the counter.",
      category: "token"
    },
    {
      id: "5",
      question: "What results can I view?",
      answer: "You can view your latest term results, including subject scores, grades, class position, teacher comments, and overall performance analytics. Historical results may also be available depending on your school's policy.",
      category: "results"
    },
    {
      id: "6",
      question: "Can I download or print my results?",
      answer: "Yes, once authenticated, you can download your results as a PDF or print them directly from the results page. The downloaded copy includes your photo and official school seal.",
      category: "results"
    },
    {
      id: "7",
      question: "Is my information secure?",
      answer: "Yes, we use SSL encryption for all data transmission. Your information is never stored locally on your device, and sessions expire automatically for security. All access is logged for audit purposes.",
      category: "technical"
    },
    {
      id: "8",
      question: "System is not loading or showing errors",
      answer: "Try refreshing the page, clearing your browser cache, or using a different browser. Ensure you have a stable internet connection. If problems persist, contact technical support.",
      category: "technical"
    },
    {
      id: "9",
      question: "Can parents access student results?",
      answer: "Parents can access results using the same Student ID and token system. Schools may provide separate parent tokens or allow shared access. Contact your school for their specific parent access policy.",
      category: "general"
    },
    {
      id: "10",
      question: "What browsers are supported?",
      answer: "The system works on all modern browsers including Chrome, Firefox, Safari, and Edge. For best experience, use the latest browser version with JavaScript enabled.",
      category: "technical"
    }
  ]

  const contactMethods: ContactMethod[] = [
    {
      type: "email",
      label: "Email Support",
      value: "support@academia.edu",
      availability: "24/7",
      responseTime: "Within 4 hours",
      icon: <Mail className="h-5 w-5" />
    },
    {
      type: "phone",
      label: "Phone Support", 
      value: "+234-800-RESULTS",
      availability: "Mon-Fri 8AM-6PM",
      responseTime: "Immediate",
      icon: <Phone className="h-5 w-5" />
    },
    {
      type: "chat",
      label: "Live Chat",
      value: "Start Chat",
      availability: "Mon-Fri 9AM-5PM",
      responseTime: "Under 2 minutes",
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      type: "ticket",
      label: "Support Ticket",
      value: "Create Ticket",
      availability: "24/7",
      responseTime: "Within 8 hours",
      icon: <FileText className="h-5 w-5" />
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleContactSubmit = () => {
    // Simulate ticket creation
    console.log("Creating support ticket:", { ticketSubject, ticketMessage })
    setContactDialogOpen(false)
    setTicketSubject("")
    setTicketMessage("")
  }

  const handleFeedbackSubmit = () => {
    // Simulate feedback submission
    console.log("Submitting feedback:", { feedbackRating, feedbackMessage })
    setFeedbackDialogOpen(false)
    setFeedbackMessage("")
    setFeedbackRating(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Results
            </Button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Help & Support Center</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions, get technical support, and learn how to use the Result Checker system
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {contactMethods.map((method) => (
            <Card key={method.type} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {method.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-sm mb-1">{method.label}</h3>
                <p className="text-xs text-gray-600 mb-2">{method.responseTime}</p>
                <Badge variant="outline" className="text-xs">{method.availability}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Find quick answers to common questions about the Result Checker system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search FAQs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Category Filter */}
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                      <TabsTrigger value="authentication" className="text-xs">Auth</TabsTrigger>
                      <TabsTrigger value="token" className="text-xs">Token</TabsTrigger>
                      <TabsTrigger value="results" className="text-xs">Results</TabsTrigger>
                      <TabsTrigger value="technical" className="text-xs">Tech</TabsTrigger>
                      <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* FAQ List */}
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-sm font-medium hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                          <span className="text-left">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No FAQs found matching your search criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Authentication Service</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Result Database</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">PDF Generation</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">Operational</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-blue-600" />
                  Quick Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    For urgent issues, call our 24/7 support hotline
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline" size="sm">
                    <Phone className="mr-2 h-4 w-4" />
                    +234-800-RESULTS
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline" size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    support@academia.edu
                  </Button>
                  
                  <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full justify-start" variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Create Support Ticket
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Support Ticket</DialogTitle>
                        <DialogDescription>
                          Describe your issue and we'll get back to you within 8 hours
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            placeholder="Brief description of your issue"
                            value={ticketSubject}
                            onChange={(e) => setTicketSubject(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Detailed Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Please provide as much detail as possible..."
                            value={ticketMessage}
                            onChange={(e) => setTicketMessage(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleContactSubmit} disabled={!ticketSubject || !ticketMessage}>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Ticket
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Helpful Resources */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Helpful Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <Video className="mr-2 h-4 w-4" />
                  Video Tutorial
                </Button>
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  User Guide (PDF)
                </Button>
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  School Portal
                </Button>
                
                <div className="pt-3 border-t">
                  <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="sm">
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Give Feedback
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Help Us Improve</DialogTitle>
                        <DialogDescription>
                          Your feedback helps us make the Result Checker better for everyone
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>How would you rate your experience?</Label>
                          <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Button
                                key={star}
                                variant={feedbackRating >= star ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFeedbackRating(star)}
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="feedback">Additional Comments (Optional)</Label>
                          <Textarea
                            id="feedback"
                            placeholder="Tell us what we can improve..."
                            value={feedbackMessage}
                            onChange={(e) => setFeedbackMessage(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleFeedbackSubmit} disabled={feedbackRating === 0}>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Feedback
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
