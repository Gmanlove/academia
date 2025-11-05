"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  BookOpen, 
  Clock, 
  Users, 
  FileText,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2
} from 'lucide-react'

export default function TeacherCBTPage() {
  const [activeTab, setActiveTab] = useState('exams')
  const [exams, setExams] = useState([])
  const [questionBanks, setQuestionBanks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchExams()
    fetchQuestionBanks()
  }, [])

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/cbt/exams')
      const result = await response.json()
      if (result.success) {
        setExams(result.data)
      }
    } catch (err) {
      console.error('Error fetching exams:', err)
    }
  }

  const fetchQuestionBanks = async () => {
    try {
      const response = await fetch('/api/cbt/question-banks')
      const result = await response.json()
      if (result.success) {
        setQuestionBanks(result.data)
      }
    } catch (err) {
      console.error('Error fetching question banks:', err)
    }
  }

  const publishExam = async (examId: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/cbt/exams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: examId, status: 'published' })
      })
      
      const result = await response.json()
      if (result.success) {
        fetchExams()
      }
    } catch (err) {
      console.error('Error publishing exam:', err)
      setError('Failed to publish exam')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CBT Management</h1>
          <p className="text-muted-foreground">Create and manage computer-based tests</p>
        </div>
        <div className="space-x-2">
          <Button onClick={() => router.push('/teacher/cbt/question-banks/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Question Bank
          </Button>
          <Button onClick={() => router.push('/teacher/cbt/exams/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Exam
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="question-banks">Question Banks</TabsTrigger>
        </TabsList>

        <TabsContent value="exams" className="space-y-4">
          {exams.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No exams created yet</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => router.push('/teacher/cbt/exams/new')}
                  >
                    Create Your First Exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam: any) => (
                <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{exam.title}</CardTitle>
                        <CardDescription>{exam.subject?.name}</CardDescription>
                      </div>
                      <Badge variant={
                        exam.status === 'published' ? 'default' :
                        exam.status === 'draft' ? 'secondary' : 'outline'
                      }>
                        {exam.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {exam.duration_minutes} minutes
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {exam.class?.name}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <FileText className="h-4 w-4 mr-2" />
                        {exam.exam_questions?.[0]?.count || 0} questions
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/teacher/cbt/exams/${exam.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {exam.status === 'draft' && (
                        <Button 
                          size="sm"
                          className="flex-1"
                          onClick={() => publishExam(exam.id)}
                          disabled={loading}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Publish
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="question-banks" className="space-y-4">
          {questionBanks.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No question banks created yet</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => router.push('/teacher/cbt/question-banks/new')}
                  >
                    Create Your First Question Bank
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {questionBanks.map((bank: any) => (
                <Card key={bank.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{bank.title}</CardTitle>
                    <CardDescription>{bank.subject?.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bank.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {bank.description}
                      </p>
                    )}
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 mr-2" />
                      {bank.questions?.[0]?.count || 0} questions
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/teacher/cbt/question-banks/${bank.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Manage Questions
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
