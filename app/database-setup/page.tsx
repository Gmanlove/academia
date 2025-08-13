"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, AlertTriangle, Database, Mail, User } from 'lucide-react'

export default function DatabaseSetupPage() {
  const [checks, setChecks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [testEmail, setTestEmail] = useState('emma.test@gmail.com')
  const [testPassword, setTestPassword] = useState('TestPassword123!')

  const runDatabaseChecks = async () => {
    setLoading(true)
    const results = []

    try {
      const supabase = createClient()

      // Test 1: Check if user_profiles table exists
      try {
        const { data, error } = await supabase.from('user_profiles').select('count').limit(1)
        results.push({
          name: 'user_profiles Table',
          status: error ? 'fail' : 'pass',
          details: error ? `Table missing: ${error.message}` : 'Table exists and accessible'
        })
      } catch (err) {
        results.push({
          name: 'user_profiles Table',
          status: 'fail',
          details: `Database error: ${err}`
        })
      }

      // Test 2: Check if schools table exists
      try {
        const { data, error } = await supabase.from('schools').select('count').limit(1)
        results.push({
          name: 'schools Table',
          status: error ? 'fail' : 'pass',
          details: error ? `Table missing: ${error.message}` : 'Table exists and accessible'
        })
      } catch (err) {
        results.push({
          name: 'schools Table',
          status: 'fail',
          details: `Database error: ${err}`
        })
      }

      // Test 3: Test auth signup (this should work even if tables don't exist)
      try {
        const { data, error } = await supabase.auth.signUp({
          email: testEmail,
          password: testPassword,
        })
        
        if (error) {
          if (error.message.includes('already registered')) {
            results.push({
              name: 'Auth System',
              status: 'pass',
              details: 'Auth working (user already exists)'
            })
          } else {
            results.push({
              name: 'Auth System',
              status: 'fail',
              details: `Auth error: ${error.message}`
            })
          }
        } else {
          results.push({
            name: 'Auth System',
            status: 'pass',
            details: 'Auth signup successful! Check your email.'
          })
        }
      } catch (authErr) {
        results.push({
          name: 'Auth System',
          status: 'fail',
          details: `Auth error: ${authErr}`
        })
      }

    } catch (generalErr) {
      results.push({
        name: 'Supabase Connection',
        status: 'fail',
        details: `Connection failed: ${generalErr}`
      })
    }

    setChecks(results)
    setLoading(false)
  }

  const testRegistrationAPI = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/register-new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          userData: {
            name: 'Test User',
            role: 'admin'
          }
        }),
      })

      const responseText = await response.text()
      
      setChecks(prev => [...prev, {
        name: 'Registration API',
        status: response.ok ? 'pass' : 'fail',
        details: `Status: ${response.status}\nResponse: ${responseText || 'Empty response'}`
      }])
    } catch (err) {
      setChecks(prev => [...prev, {
        name: 'Registration API',
        status: 'fail',
        details: `API Error: ${err}`
      }])
    }
    
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database & Registration Diagnostics
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Check if your database schema is set up and registration is working
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Test Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Test Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="TestPassword123!"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button onClick={runDatabaseChecks} disabled={loading}>
                <Database className="h-4 w-4 mr-2" />
                Check Database
              </Button>
              <Button onClick={testRegistrationAPI} disabled={loading} variant="outline">
                <User className="h-4 w-4 mr-2" />
                Test Registration API
              </Button>
            </div>

            {checks.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Test Results:</h3>
                {checks.map((check, index) => (
                  <div key={index} className="border rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(check.status)}
                        <span className="font-medium">{check.name}</span>
                      </div>
                      <Badge variant={check.status === 'pass' ? 'default' : 'destructive'}>
                        {check.status === 'pass' ? '✅ Pass' : '❌ Fail'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                      <pre className="whitespace-pre-wrap">{check.details}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Common Issues:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Tables don't exist:</strong> Run the schema.sql file in your Supabase SQL editor</li>
              <li><strong>Empty API response:</strong> Database schema might be missing</li>
              <li><strong>No email received:</strong> Check Supabase Auth settings for email confirmations</li>
              <li><strong>Users not in dashboard:</strong> Email confirmation might be enabled but failing</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>📋 Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <strong>Step 1: Set up Database Schema</strong>
              <ol className="list-decimal list-inside mt-2 text-sm">
                <li>Go to <a href="https://supabase.com/dashboard/project/smwsbstzfgkkmsvnexsk/sql" target="_blank" className="text-blue-600 underline">Supabase SQL Editor</a></li>
                <li>Copy contents from <code>supabase/schema.sql</code></li>
                <li>Paste and run the SQL</li>
              </ol>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <strong>Step 2: Configure Email Settings</strong>
              <ol className="list-decimal list-inside mt-2 text-sm">
                <li>Go to <a href="https://supabase.com/dashboard/project/smwsbstzfgkkmsvnexsk/auth/settings" target="_blank" className="text-blue-600 underline">Supabase Auth Settings</a></li>
                <li>Temporarily disable "Enable email confirmations"</li>
                <li>Set Site URL to <code>http://localhost:3000</code></li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
