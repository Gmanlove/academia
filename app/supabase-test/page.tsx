"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, XCircle, AlertTriangle, Database, Mail, User, Eye, Send } from 'lucide-react'

export default function SupabaseTestPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testPassword, setTestPassword] = useState('TestPassword123!')
  const [testName, setTestName] = useState('Test User')

  const addResult = (name: string, status: 'pass' | 'fail' | 'info', details: string) => {
    setResults(prev => [...prev, {
      id: Date.now(),
      name,
      status,
      details,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const clearResults = () => setResults([])

  // Test 1: Database Schema Check
  const testDatabaseSchema = async () => {
    setLoading(true)
    addResult('Starting Database Tests', 'info', 'Checking database schema...')

    try {
      const supabase = createClient()

      // Test user_profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1)

      if (profilesError) {
        addResult('user_profiles Table', 'fail', `Error: ${profilesError.message}`)
      } else {
        addResult('user_profiles Table', 'pass', 'Table exists and accessible')
      }

      // Test schools table
      const { data: schools, error: schoolsError } = await supabase
        .from('schools')
        .select('*')
        .limit(5)

      if (schoolsError) {
        addResult('schools Table', 'fail', `Error: ${schoolsError.message}`)
      } else {
        addResult('schools Table', 'pass', `Found ${schools?.length || 0} schools`)
      }

    } catch (error) {
      addResult('Database Connection', 'fail', `Connection failed: ${error}`)
    }

    setLoading(false)
  }

  // Test 2: User Registration
  const testUserRegistration = async () => {
    if (!testEmail || !testPassword || !testName) {
      addResult('Registration Test', 'fail', 'Please fill all fields')
      return
    }

    setLoading(true)
    addResult('Starting Registration Test', 'info', `Testing with email: ${testEmail}`)

    try {
      const response = await fetch('/api/auth/register-new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          userData: {
            name: testName,
            role: 'admin',
            permissions: ['read', 'write']
          }
        })
      })

      const responseText = await response.text()
      
      if (response.ok) {
        let data
        try {
          data = JSON.parse(responseText)
          addResult('Registration API', 'pass', `✅ Success: ${data.message || 'User registered successfully'}`)
        } catch {
          addResult('Registration API', 'pass', `✅ Success: ${responseText}`)
        }
      } else {
        addResult('Registration API', 'fail', `❌ Failed (${response.status}): ${responseText}`)
      }

    } catch (error) {
      addResult('Registration API', 'fail', `❌ Network error: ${error}`)
    }

    setLoading(false)
  }

  // Test 3: Direct Supabase Auth Test
  const testSupabaseAuth = async () => {
    if (!testEmail || !testPassword) {
      addResult('Supabase Auth Test', 'fail', 'Please fill email and password')
      return
    }

    setLoading(true)
    addResult('Starting Supabase Auth Test', 'info', 'Testing direct Supabase signup...')

    try {
      const supabase = createClient()

      // Test signup
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            name: testName,
            role: 'admin'
          }
        }
      })

      if (signupError) {
        if (signupError.message.includes('already registered')) {
          addResult('Supabase Auth', 'pass', '✅ User already exists (auth working)')
        } else {
          addResult('Supabase Auth', 'fail', `❌ Signup error: ${signupError.message}`)
        }
      } else {
        addResult('Supabase Auth', 'pass', `✅ Signup successful! User ID: ${signupData.user?.id}`)
      }

    } catch (error) {
      addResult('Supabase Auth', 'fail', `❌ Auth error: ${error}`)
    }

    setLoading(false)
  }

  // Test 4: Check Users in Dashboard
  const checkUsersInDashboard = async () => {
    setLoading(true)
    addResult('Checking Users', 'info', 'Looking for users in authentication...')

    try {
      const supabase = createClient()

      // Try to get current user
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        addResult('Current User Check', 'info', 'No current user session')
      } else if (user) {
        addResult('Current User Check', 'pass', `✅ Found user: ${user.email}`)
      }

      // Check user_profiles table for registered users
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('email, name, role, created_at')
        .limit(10)

      if (profileError) {
        addResult('User Profiles Check', 'fail', `❌ Cannot read profiles: ${profileError.message}`)
      } else {
        addResult('User Profiles Check', 'pass', `✅ Found ${profiles?.length || 0} user profiles`)
        if (profiles && profiles.length > 0) {
          profiles.forEach((profile, index) => {
            addResult(`User ${index + 1}`, 'info', `📧 ${profile.email} (${profile.role}) - ${profile.name}`)
          })
        }
      }

    } catch (error) {
      addResult('User Check', 'fail', `❌ Error: ${error}`)
    }

    setLoading(false)
  }

  // Test 5: Email Configuration Check
  const testEmailConfiguration = async () => {
    setLoading(true)
    addResult('Email Configuration', 'info', 'Checking email settings...')

    // Check environment variables
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    addResult('Site URL', siteUrl ? 'pass' : 'fail', `Site URL: ${siteUrl || 'Not set'}`)

    // Test email resend API
    if (testEmail) {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: testEmail })
        })

        const data = await response.json()
        
        if (response.ok) {
          addResult('Email Resend API', 'pass', `✅ Email API working: ${data.message}`)
        } else {
          addResult('Email Resend API', 'fail', `❌ API error: ${data.error}`)
        }
      } catch (error) {
        addResult('Email Resend API', 'fail', `❌ Network error: ${error}`)
      }
    }

    setLoading(false)
  }

  const runAllTests = async () => {
    clearResults()
    await testDatabaseSchema()
    await testSupabaseAuth()
    await testUserRegistration()
    await checkUsersInDashboard()
    await testEmailConfiguration()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertTriangle className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧪 Complete Supabase Test Suite
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Test database connection, user registration, and email functionality
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="email">Your Real Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use your real email to test email delivery
                </p>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="TestPassword123!"
                />
              </div>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button onClick={runAllTests} disabled={loading} size="lg">
                <Database className="h-4 w-4 mr-2" />
                Run All Tests
              </Button>
              <Button onClick={testDatabaseSchema} disabled={loading} variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Test Database
              </Button>
              <Button onClick={testUserRegistration} disabled={loading} variant="outline">
                <User className="h-4 w-4 mr-2" />
                Test Registration
              </Button>
              <Button onClick={checkUsersInDashboard} disabled={loading} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Check Users
              </Button>
              <Button onClick={testEmailConfiguration} disabled={loading} variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Test Email
              </Button>
              <Button onClick={clearResults} variant="outline">
                Clear Results
              </Button>
            </div>

            {results.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {results.map((result) => (
                      <div key={result.id} className="flex items-start gap-3 p-3 border rounded">
                        {getStatusIcon(result.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{result.name}</span>
                            <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            <pre className="whitespace-pre-wrap">{result.details}</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Instructions:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>First, run the safe-migration.sql in your Supabase SQL editor</li>
              <li>Enter your real email address above</li>
              <li>Click "Run All Tests" to test everything</li>
              <li>Check your email inbox and Supabase dashboard</li>
              <li>Users should appear in: <a href="https://supabase.com/dashboard/project/smwsbstzfgkkmsvnexsk/auth/users" target="_blank" className="text-blue-600 underline">Supabase Users Dashboard</a></li>
            </ol>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>📋 Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a 
                href="https://supabase.com/dashboard/project/smwsbstzfgkkmsvnexsk/sql" 
                target="_blank" 
                className="flex items-center gap-2 p-3 border rounded hover:bg-gray-50"
              >
                <Database className="h-4 w-4" />
                Open SQL Editor
              </a>
              <a 
                href="https://supabase.com/dashboard/project/smwsbstzfgkkmsvnexsk/auth/users" 
                target="_blank" 
                className="flex items-center gap-2 p-3 border rounded hover:bg-gray-50"
              >
                <User className="h-4 w-4" />
                View Users Dashboard
              </a>
              <a 
                href="https://supabase.com/dashboard/project/smwsbstzfgkkmsvnexsk/auth/settings" 
                target="_blank" 
                className="flex items-center gap-2 p-3 border rounded hover:bg-gray-50"
              >
                <Mail className="h-4 w-4" />
                Auth Settings
              </a>
              <a 
                href="https://supabase.com/dashboard/project/smwsbstzfgkkmsvnexsk/auth/templates" 
                target="_blank" 
                className="flex items-center gap-2 p-3 border rounded hover:bg-gray-50"
              >
                <Send className="h-4 w-4" />
                Email Templates
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
