"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export default function CreateExamPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [questionBanks, setQuestionBanks] = useState<any[]>([])
  const [selectedBank, setSelectedBank] = useState("")
  const [availableQuestions, setAvailableQuestions] = useState<any[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject_id: "",
    class_id: "",
    duration_minutes: 60,
    passing_score: 50,
    start_time: "",
    end_time: "",
    shuffle_questions: false,
    shuffle_options: false,
    show_results_immediately: true,
    allow_review: true,
    max_attempts: 1
  })

  useEffect(() => {
    fetchQuestionBanks()
  }, [])

  useEffect(() => {
    if (selectedBank) {
      fetchQuestions(selectedBank)
    }
  }, [selectedBank])

  const fetchQuestionBanks = async () => {
    try {
      const response = await fetch('/api/cbt/question-banks')
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setQuestionBanks(data.banks || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const fetchQuestions = async (bankId: string) => {
    try {
      const response = await fetch(`/api/cbt/questions?question_bank_id=${bankId}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setAvailableQuestions(data.questions || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  const calculateTotalPoints = () => {
    return availableQuestions
      .filter(q => selectedQuestions.includes(q.id))
      .reduce((sum, q) => sum + (q.points || 1), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedQuestions.length === 0) {
      setError("Please select at least one question")
      return
    }

    setLoading(true)
    setError("")

    try {
      const payload = {
        ...formData,
        question_bank_id: selectedBank,
        total_points: calculateTotalPoints(),
        question_ids: selectedQuestions
      }

      const response = await fetch('/api/cbt/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      router.push('/teacher/cbt')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Create New Exam</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Exam Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Mathematics Mid-Term Exam"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the exam..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  value={formData.subject_id}
                  onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Select
                  value={formData.class_id}
                  onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class1">Class 1A</SelectItem>
                    <SelectItem value="class2">Class 2B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Select Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Select Questions</CardTitle>
            <CardDescription>Choose questions from your question banks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Question Bank *</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a question bank" />
                </SelectTrigger>
                <SelectContent>
                  {questionBanks.map(bank => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.title} ({bank.question_count || 0} questions)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBank && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Questions ({selectedQuestions.length} selected)</Label>
                  {selectedQuestions.length > 0 && (
                    <Badge>Total: {calculateTotalPoints()} points</Badge>
                  )}
                </div>
                
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto space-y-2">
                  {availableQuestions.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No questions in this bank</p>
                  ) : (
                    availableQuestions.map((question) => (
                      <div key={question.id} className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50">
                        <Checkbox
                          checked={selectedQuestions.includes(question.id)}
                          onCheckedChange={() => toggleQuestion(question.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary">{question.question_type.replace('_', ' ')}</Badge>
                            <Badge variant="outline">{question.points} pts</Badge>
                            <Badge variant="outline">{question.difficulty}</Badge>
                          </div>
                          <p className="text-sm">{question.question_text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exam Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passing">Passing Score (%) *</Label>
                <Input
                  id="passing"
                  type="number"
                  value={formData.passing_score}
                  onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Start Time</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end">End Time</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attempts">Maximum Attempts</Label>
              <Input
                id="attempts"
                type="number"
                value={formData.max_attempts}
                onChange={(e) => setFormData({ ...formData, max_attempts: parseInt(e.target.value) })}
                min="1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Exam Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="shuffle-q">Shuffle Questions</Label>
              <Switch
                id="shuffle-q"
                checked={formData.shuffle_questions}
                onCheckedChange={(checked) => setFormData({ ...formData, shuffle_questions: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="shuffle-o">Shuffle Options</Label>
              <Switch
                id="shuffle-o"
                checked={formData.shuffle_options}
                onCheckedChange={(checked) => setFormData({ ...formData, shuffle_options: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-results">Show Results Immediately</Label>
              <Switch
                id="show-results"
                checked={formData.show_results_immediately}
                onCheckedChange={(checked) => setFormData({ ...formData, show_results_immediately: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allow-review">Allow Review After Submission</Label>
              <Switch
                id="allow-review"
                checked={formData.allow_review}
                onCheckedChange={(checked) => setFormData({ ...formData, allow_review: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading || selectedQuestions.length === 0}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Creating..." : "Create Exam"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
