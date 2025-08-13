'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugRegistration() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('password123')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (step: string, result: any, success: boolean) => {
    setResults(prev => [...prev, {
      timestamp: new Date().toISOString(),
      step,
      result,
      success
    }])
  }

  const testSupabaseConnection = async () => {
    try {
      const response = await fetch('/api/supabase-status')
      const data = await response.json()
      addResult('Supabase Connection', data, response.ok)
      return response.ok
    } catch (error) {
      addResult('Supabase Connection', { error: error.message }, false)
      return false
    }
  }

  const testUserRegistration = async () => {
    if (!email) {
      alert('Please enter an email address')
      return
    }

    setLoading(true)
    setResults([])

    try {
      // Test 1: Check Supabase connection
      addResult('Starting Tests', 'Testing Supabase connection...', true)
      const connectionOk = await testSupabaseConnection()
      
      if (!connectionOk) {
        setLoading(false)
        return
      }

      // Test 2: Check if user already exists
      addResult('Checking Existing User', 'Checking if user already exists...', true)
      const existingUserResponse = await fetch(`/api/debug/check-user?email=${encodeURIComponent(email)}`)
      const existingUserData = await existingUserResponse.json()
      addResult('User Check Result', existingUserData, true)

      // Test 3: Attempt registration
      addResult('Registration Attempt', 'Attempting to register user...', true)
      const registerResponse = await fetch('/api/debug/register-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const registerData = await registerResponse.json()
      addResult('Registration Response', registerData, registerResponse.ok)

      // Test 4: Check Supabase auth users
      if (registerResponse.ok) {
        addResult('Post-Registration Check', 'Checking if user appears in Supabase...', true)
        setTimeout(async () => {
          const checkResponse = await fetch(`/api/debug/check-user?email=${encodeURIComponent(email)}`)
          const checkData = await checkResponse.json()
          addResult('Post-Registration User Check', checkData, true)
        }, 2000)
      }

    } catch (error) {
      addResult('Registration Error', { error: error.message }, false)
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Registration Debug Tool</CardTitle>
          <CardDescription>
            Test user registration and check why users aren't appearing in Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address (use your real email to test)
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
                Password (pre-filled)
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
                onClick={testUserRegistration} 
                disabled={loading || !email}
                className="flex-1"
              >
                {loading ? '🔄 Testing...' : '🧪 Test Registration'}
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
                        <span className="font-medium">
                          {result.success ? '✅' : '❌'} {result.step}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
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
              <h4 className="font-semibold mb-2">📋 What this test does:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Tests Supabase connection</li>
                <li>Checks if user already exists</li>
                <li>Attempts registration</li>
                <li>Verifies user creation in database</li>
                <li>Shows detailed error messages</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
