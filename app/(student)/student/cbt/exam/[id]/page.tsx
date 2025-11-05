"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Send,
  AlertTriangle
} from 'lucide-react'

export default function StudentExamPage() {
  const params = useParams()
  const router = useRouter()
  const [exam, setExam] = useState<any>(null)
  const [attempt, setAttempt] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, any>>(new Map())
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const questionStartTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    startExam()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (timeLeft <= 0 && attempt) {
      handleAutoSubmit()
    }
  }, [timeLeft])

  const startExam = async () => {
    try {
      const response = await fetch('/api/cbt/exam-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam_id: params.id })
      })

      const result = await response.json()
      if (!response.ok) {
        setError(result.error || 'Failed to start exam')
        setLoading(false)
        return
      }

      setAttempt(result.data.attempt)
      setExam(result.data.exam)
      setQuestions(result.data.questions)
      setTimeLeft(result.data.exam.duration_minutes * 60)
      setLoading(false)

      // Start timer
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      questionStartTimeRef.current = Date.now()
    } catch (err) {
      console.error('Error starting exam:', err)
      setError('Failed to start exam')
      setLoading(false)
    }
  }

  const saveAnswer = async (questionId: string, answer: any) => {
    try {
      const timeSpent = Math.floor((Date.now() - questionStartTimeRef.current) / 1000)
      
      await fetch('/api/cbt/exam-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_attempt_id: attempt.id,
          exam_question_id: questionId,
          answer_text: answer.text,
          selected_option: answer.selectedOption,
          time_spent_seconds: timeSpent
        })
      })

      setAnswers(new Map(answers.set(questionId, answer)))
    } catch (err) {
      console.error('Error saving answer:', err)
    }
  }

  const handleAnswerChange = (value: any) => {
    const currentQuestion = questions[currentQuestionIndex]
    const answer = {
      text: value,
      selectedOption: typeof value === 'number' ? value : null
    }
    saveAnswer(currentQuestion.id, answer)
  }

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index)
      questionStartTimeRef.current = Date.now()
    }
  }

  const handleAutoSubmit = async () => {
    if (submitting) return
    await submitExam()
  }

  const submitExam = async () => {
    if (submitting) return
    
    setSubmitting(true)
    try {
      const totalTimeSpent = (exam.duration_minutes * 60) - timeLeft

      const response = await fetch('/api/cbt/exam-answers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_attempt_id: attempt.id,
          time_spent_seconds: totalTimeSpent
        })
      })

      const result = await response.json()
      if (result.success) {
        if (timerRef.current) clearInterval(timerRef.current)
        router.push(`/student/cbt/results/${attempt.id}`)
      } else {
        setError('Failed to submit exam')
        setSubmitting(false)
      }
    } catch (err) {
      console.error('Error submitting exam:', err)
      setError('Failed to submit exam')
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading exam...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button className="mt-4" onClick={() => router.push('/student/cbt')}>
              Back to Exams
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This exam has no questions.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const answeredCount = answers.size

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{exam.title}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-primary'}`}>
                <Clock className="inline-block mr-2 h-6 w-6" />
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-muted-foreground">
                {answeredCount} / {questions.length} answered
              </p>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>
      </div>

      {/* Question Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {timeLeft < 300 && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Less than 5 minutes remaining! Your exam will auto-submit when time runs out.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  Question {currentQuestionIndex + 1}
                </CardTitle>
                <Badge>{currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-lg">{currentQuestion.question.question_text}</p>
              </div>

              {/* Answer Input */}
              {currentQuestion.question.question_type === 'multiple_choice' && (
                <RadioGroup
                  value={answers.get(currentQuestion.id)?.selectedOption?.toString()}
                  onValueChange={(value: string) => handleAnswerChange(parseInt(value))}
                >
                  <div className="space-y-3">
                    {currentQuestion.question.options?.map((option: any) => (
                      <div
                        key={option.index}
                        className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      >
                        <RadioGroupItem value={option.index.toString()} id={`option-${option.index}`} />
                        <Label htmlFor={`option-${option.index}`} className="flex-1 cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}

              {(currentQuestion.question.question_type === 'short_answer' || 
                currentQuestion.question.question_type === 'essay') && (
                <Textarea
                  value={answers.get(currentQuestion.id)?.text || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={currentQuestion.question.question_type === 'essay' ? 10 : 3}
                  className="w-full"
                />
              )}

              {currentQuestion.question.question_type === 'true_false' && (
                <RadioGroup
                  value={answers.get(currentQuestion.id)?.text}
                  onValueChange={handleAnswerChange}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="True" id="true" />
                      <Label htmlFor="true" className="flex-1 cursor-pointer">True</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="False" id="false" />
                      <Label htmlFor="false" className="flex-1 cursor-pointer">False</Label>
                    </div>
                  </div>
                </RadioGroup>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={() => goToQuestion(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={submitExam}
                disabled={submitting}
                size="lg"
              >
                <Send className="mr-2 h-4 w-4" />
                {submitting ? 'Submitting...' : 'Submit Exam'}
              </Button>
            ) : (
              <Button
                onClick={() => goToQuestion(currentQuestionIndex + 1)}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Question Navigator */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-2">
                {questions.map((q: any, index: number) => (
                  <Button
                    key={q.id}
                    variant={index === currentQuestionIndex ? 'default' : answers.has(q.id) ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => goToQuestion(index)}
                    className="relative"
                  >
                    {index + 1}
                    {answers.has(q.id) && (
                      <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600" />
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
