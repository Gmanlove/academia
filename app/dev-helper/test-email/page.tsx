"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export default function EmailTestPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const addResult = (type: string, success: boolean, message: string) => {
    setResults(prev => [...prev, {
      id: Date.now(),
      type,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const testSignUp = async () => {
    if (!email || !password || !name) {
      addResult('Sign Up', false, 'Please fill all fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/register-new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          userData: {
            name,
            role: 'admin',
            permissions: ['read', 'write', 'manage_users']
          }
        })
      })

      const data = await response.json()

      if (response.ok) {
        addResult('Sign Up', true, `✅ ${data.message}`)
      } else {
        addResult('Sign Up', false, `❌ ${data.message || 'Sign up failed'}`)
      }
    } catch (error) {
      addResult('Sign Up', false, `❌ Network error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testPasswordReset = async () => {
    if (!email) {
      addResult('Password Reset', false, 'Please enter email')
      return
    }

    setLoading(true)
    try {
      // This would be a password reset API call
      addResult('Password Reset', false, '⚠️ Password reset API not implemented yet')
    } catch (error) {
      addResult('Password Reset', false, `❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => setResults([])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>📧 Email Flow Testing</CardTitle>
            <p className="text-sm text-muted-foreground">
              Test Supabase email functionality and monitor the flow
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={testSignUp} 
                disabled={loading}
              >
                {loading ? 'Testing...' : 'Test Sign Up'}
              </Button>
              <Button 
                onClick={testPasswordReset} 
                disabled={loading}
                variant="outline"
              >
                Test Password Reset
              </Button>
              <Button 
                onClick={clearResults}
                variant="outline"
              >
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No tests run yet. Try the buttons above to test email functionality.
              </p>
            ) : (
              <div className="space-y-3">
                {results.map((result) => (
                  <div 
                    key={result.id}
                    className="flex items-center justify-between border rounded p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.type}
                      </Badge>
                      <span className="text-sm">{result.message}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {result.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📋 Email Testing Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="check1" />
                <label htmlFor="check1">Supabase Auth settings configured</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="check2" />
                <label htmlFor="check2">Email confirmations enabled</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="check3" />
                <label htmlFor="check3">Site URL and redirect URLs set</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="check4" />
                <label htmlFor="check4">Email templates customized</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="check5" />
                <label htmlFor="check5">Auth callback handler implemented</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="check6" />
                <label htmlFor="check6">Test with real email address</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="check7" />
                <label htmlFor="check7">Check spam/junk folders</label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
