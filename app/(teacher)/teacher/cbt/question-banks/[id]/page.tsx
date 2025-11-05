"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Plus, Trash2, Save, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Question {
  id: string
  question_text: string
  question_type: string
  options: any
  correct_answer: string
  points: number
  explanation: string
  difficulty: string
}

export default function ManageQuestionBankPage() {
  const params = useParams()
  const router = useRouter()
  const bankId = params.id as string
  
  const [bank, setBank] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    question_text: "",
    question_type: "multiple_choice",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false }
    ],
    correct_answer: "",
    points: 1,
    explanation: "",
    difficulty: "medium"
  })

  useEffect(() => {
    fetchBankAndQuestions()
  }, [bankId])

  const fetchBankAndQuestions = async () => {
    try {
      const response = await fetch(`/api/cbt/question-banks?id=${bankId}`)
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      
      setBank(data.bank)
      setQuestions(data.questions || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const payload = {
        ...formData,
        question_bank_id: bankId,
        options: formData.question_type === 'multiple_choice' ? formData.options : null
      }

      const url = editingId 
        ? `/api/cbt/questions?id=${editingId}`
        : '/api/cbt/questions'
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setShowForm(false)
      setEditingId(null)
      resetForm()
      fetchBankAndQuestions()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return
    
    try {
      const response = await fetch(`/api/cbt/questions?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error("Failed to delete")
      fetchBankAndQuestions()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEdit = (question: Question) => {
    setFormData({
      question_text: question.question_text,
      question_type: question.question_type,
      options: question.options || [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
      ],
      correct_answer: question.correct_answer || "",
      points: question.points,
      explanation: question.explanation || "",
      difficulty: question.difficulty
    })
    setEditingId(question.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      question_text: "",
      question_type: "multiple_choice",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
      ],
      correct_answer: "",
      points: 1,
      explanation: "",
      difficulty: "medium"
    })
  }

  const updateOption = (index: number, field: string, value: any) => {
    const newOptions = [...formData.options]
    if (field === 'isCorrect') {
      // Only one correct answer for multiple choice
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index
      })
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value }
    }
    setFormData({ ...formData, options: newOptions })
  }

  if (loading && !bank) {
    return (
      <div className="container py-8">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{bank?.title}</h1>
          <p className="text-muted-foreground">{bank?.description}</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); resetForm() }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Question' : 'New Question'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Question Type</Label>
                <Select
                  value={formData.question_type}
                  onValueChange={(value) => setFormData({ ...formData, question_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="true_false">True/False</SelectItem>
                    <SelectItem value="short_answer">Short Answer</SelectItem>
                    <SelectItem value="essay">Essay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Question Text *</Label>
                <Textarea
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  placeholder="Enter your question..."
                  rows={3}
                  required
                />
              </div>

              {formData.question_type === 'multiple_choice' && (
                <div className="space-y-3">
                  <Label>Options (select the correct answer)</Label>
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <RadioGroupItem
                        value={index.toString()}
                        checked={option.isCorrect}
                        onClick={() => updateOption(index, 'isCorrect', true)}
                      />
                      <Input
                        value={option.text}
                        onChange={(e) => updateOption(index, 'text', e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              {formData.question_type === 'true_false' && (
                <div className="space-y-2">
                  <Label>Correct Answer</Label>
                  <RadioGroup
                    value={formData.correct_answer}
                    onValueChange={(value) => setFormData({ ...formData, correct_answer: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="true" />
                      <Label htmlFor="true">True</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="false" />
                      <Label htmlFor="false">False</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {formData.question_type === 'short_answer' && (
                <div className="space-y-2">
                  <Label>Correct Answer *</Label>
                  <Input
                    value={formData.correct_answer}
                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                    placeholder="Enter the correct answer (case-insensitive)"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Explanation (Optional)</Label>
                <Textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explain the correct answer..."
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? 'Update' : 'Add'} Question
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null) }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Questions ({questions.length})</h2>
        
        {questions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No questions yet. Add your first question above.</p>
            </CardContent>
          </Card>
        ) : (
          questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">Q{index + 1}</Badge>
                      <Badge>{question.question_type.replace('_', ' ')}</Badge>
                      <Badge variant="outline">{question.difficulty}</Badge>
                      <Badge variant="outline">{question.points} pts</Badge>
                    </div>
                    <CardTitle className="text-lg">{question.question_text}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(question)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(question.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {question.question_type === 'multiple_choice' && question.options && (
                <CardContent>
                  <div className="space-y-2">
                    {question.options.map((opt: any, i: number) => (
                      <div key={i} className={`p-2 rounded ${opt.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                        {opt.isCorrect && <span className="text-green-600 font-semibold mr-2">✓</span>}
                        {opt.text}
                      </div>
                    ))}
                  </div>
                  {question.explanation && (
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <p className="text-sm"><strong>Explanation:</strong> {question.explanation}</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
