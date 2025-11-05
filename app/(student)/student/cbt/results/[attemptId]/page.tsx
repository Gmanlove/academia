"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle2, XCircle, Clock, Award } from "lucide-react"

export default function ExamResultsPage() {
  const params = useParams()
  const router = useRouter()
  const attemptId = params.attemptId as string

  const [attempt, setAttempt] = useState<any>(null)
  const [answers, setAnswers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchResults()
  }, [attemptId])

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/cbt/exam-attempts?attempt_id=${attemptId}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setAttempt(data.attempt)
      setAnswers(data.answers || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <p>Loading results...</p>
      </div>
    )
  }

  if (error || !attempt) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-red-600">{error || "Results not found"}</p>
          <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </div>
      </div>
    )
  }

  const exam = attempt.exam
  const passed = attempt.passed
  const percentage = attempt.percentage || 0

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push('/student/cbt')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Exam Results</h1>
      </div>

      {/* Score Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {passed ? (
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              </div>
            )}

            <div>
              <h2 className="text-4xl font-bold mb-2">
                {percentage.toFixed(1)}%
              </h2>
              <p className="text-xl text-muted-foreground">
                {attempt.total_score} / {exam.total_points} points
              </p>
              <Badge
                variant={passed ? "default" : "destructive"}
                className="mt-2"
              >
                {passed ? "PASSED" : "FAILED"}
              </Badge>
            </div>

            <Progress value={percentage} className="h-3" />

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="text-2xl font-bold">{answers.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Time Spent</p>
                <p className="text-2xl font-bold">
                  {Math.floor(attempt.time_spent_seconds / 60)}m
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Passing Score</p>
                <p className="text-2xl font-bold">{exam.passing_score}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exam Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{exam.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Subject</p>
              <p className="font-medium">{exam.subject?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Submitted</p>
              <p className="font-medium">
                {new Date(attempt.submitted_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Attempt</p>
              <p className="font-medium">#{attempt.attempt_number}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant={attempt.status === 'graded' ? 'default' : 'secondary'}>
                {attempt.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer Review */}
      {exam.allow_review && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Answer Review</h3>

          {answers.map((answer, index) => {
            const question = answer.exam_question?.question
            if (!question) return null

            return (
              <Card key={answer.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Q{index + 1}</Badge>
                      {answer.is_correct ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <Badge variant="outline">
                      {answer.points_earned} / {answer.exam_question.points} pts
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">
                    {question.question_text}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Multiple Choice */}
                  {question.question_type === 'multiple_choice' && (
                    <div className="space-y-2">
                      {question.options?.map((option: any, i: number) => {
                        const isSelected = answer.selected_option === i
                        const isCorrect = option.isCorrect

                        return (
                          <div
                            key={i}
                            className={`p-3 rounded border ${
                              isSelected && isCorrect
                                ? 'bg-green-50 border-green-300'
                                : isSelected && !isCorrect
                                ? 'bg-red-50 border-red-300'
                                : isCorrect
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option.text}</span>
                              {isSelected && (
                                <Badge variant={isCorrect ? "default" : "destructive"}>
                                  Your Answer
                                </Badge>
                              )}
                              {isCorrect && !isSelected && (
                                <Badge variant="outline">Correct Answer</Badge>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Other Question Types */}
                  {question.question_type !== 'multiple_choice' && (
                    <div className="space-y-2">
                      <div className="p-3 rounded bg-gray-50 border">
                        <p className="text-sm text-muted-foreground mb-1">Your Answer:</p>
                        <p className="font-medium">{answer.answer_text || "(No answer)"}</p>
                      </div>

                      {question.correct_answer && (
                        <div className="p-3 rounded bg-green-50 border border-green-200">
                          <p className="text-sm text-muted-foreground mb-1">Correct Answer:</p>
                          <p className="font-medium">{question.correct_answer}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="p-3 rounded bg-blue-50 border border-blue-200">
                      <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                      <p className="text-sm text-blue-800">{question.explanation}</p>
                    </div>
                  )}

                  {/* Teacher Feedback */}
                  {answer.teacher_feedback && (
                    <div className="p-3 rounded bg-yellow-50 border border-yellow-200">
                      <p className="text-sm font-medium text-yellow-900 mb-1">Teacher Feedback:</p>
                      <p className="text-sm text-yellow-800">{answer.teacher_feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {!exam.allow_review && (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Review is not available for this exam.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex justify-center">
        <Button onClick={() => router.push('/student/cbt')}>
          Back to Exams
        </Button>
      </div>
    </div>
  )
}
