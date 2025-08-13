'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AuthFlowChecker() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('password123')

  const addResult = (step: string, result: any, success: boolean) => {
    setResults(prev => [...prev, {
      timestamp: new Date().toISOString(),
      step,
      result,
      success
    }])
  }

  const checkEnvironmentVariables = async () => {
    try {
      const response = await fetch('/api/debug/env-check')
      const data = await response.json()
      addResult('Environment Variables', data, response.ok)
      return response.ok && data.valid
    } catch (error) {
      addResult('Environment Variables', { error: error.message }, false)
      return false
    }
  }

  const checkSupabaseConnection = async () => {
    try {
      const response = await fetch('/api/debug/connection-test')
      const data = await response.json()
      addResult('Supabase Connection', data, response.ok)
      return response.ok && data.connected
    } catch (error) {
      addResult('Supabase Connection', { error: error.message }, false)
      return false
    }
  }

  const checkDatabaseSchema = async () => {
    try {
      const response = await fetch('/api/debug/schema-check')
      const data = await response.json()
      addResult('Database Schema', data, data.connection === 'connected')
      return data.connection === 'connected'
    } catch (error) {
      addResult('Database Schema', { error: error.message }, false)
      return false
    }
  }

  const testUserRegistration = async () => {
    if (!email) {
      addResult('Registration Test', { error: 'Email required' }, false)
      return false
    }

    try {
      const response = await fetch('/api/debug/register-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      addResult('User Registration', data, response.ok)
      return response.ok
    } catch (error) {
      addResult('User Registration', { error: error.message }, false)
      return false
    }
  }

  const testEmailConfiguration = async () => {
    try {
      const response = await fetch('/api/debug/email-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      addResult('Email Configuration', data, response.ok)
      return response.ok
    } catch (error) {
      addResult('Email Configuration', { error: error.message }, false)
      return false
    }
  }

  const runFullAuthFlowCheck = async () => {
    if (!email) {
      alert('Please enter an email address')
      return
    }

    setLoading(true)
    setResults([])

    // Step 1: Check environment variables
    addResult('Starting', 'Checking authentication flow...', true)
    const envOk = await checkEnvironmentVariables()
    
    if (!envOk) {
      setLoading(false)
      return
    }

    // Step 2: Check Supabase connection
    const connectionOk = await checkSupabaseConnection()
    
    if (!connectionOk) {
      setLoading(false)
      return
    }

    // Step 3: Check database schema
    const schemaOk = await checkDatabaseSchema()
    
    if (!schemaOk) {
      setLoading(false)
      return
    }

    // Step 4: Test user registration
    const registrationOk = await testUserRegistration()
    
    // Step 5: Test email configuration (regardless of registration result)
    await testEmailConfiguration()

    if (registrationOk) {
      addResult('Success', 'Auth flow is working! Check your Supabase dashboard for the new user.', true)
    } else {
      addResult('Issues Found', 'Registration failed. Check the errors above.', false)
    }

    setLoading(false)
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🔐 Authentication Flow Checker</CardTitle>
          <CardDescription>
            Comprehensive test of your Supabase authentication integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address (use your real email for testing)
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Password (for testing)
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={runFullAuthFlowCheck} 
                disabled={loading || !email}
                className="flex-1"
              >
                {loading ? '🔄 Testing Auth Flow...' : '🔍 Check Full Auth Flow'}
              </Button>
              <Button 
                onClick={clearResults} 
                variant="outline"
              >
                🗑️ Clear Results
              </Button>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results:</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <Card key={index} className={`${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={result.success ? 'default' : 'destructive'}>
                            {result.success ? '✅' : '❌'} {result.step}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                        {JSON.stringify(result.result, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">🔍 What this test checks:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Environment Variables:</strong> Supabase URL and API keys</li>
                <li><strong>Supabase Connection:</strong> Basic connectivity to your database</li>
                <li><strong>Database Schema:</strong> Required tables and structure</li>
                <li><strong>User Registration:</strong> Creating users via API</li>
                <li><strong>Email Configuration:</strong> SMTP and email delivery setup</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
