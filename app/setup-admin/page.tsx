'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SetupAdminPage() {
  const [email, setEmail] = useState('admin@test.com')
  const [password, setPassword] = useState('admin123')
  const [name, setName] = useState('Test Admin')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const createAdmin = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/auth/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userData: {
            role: 'admin',
            name,
            permissions: ['read', 'write', 'admin']
          }
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`Admin user created successfully! Email: ${email}, Password: ${password}`)
      } else {
        setError(data.message || 'Failed to create admin user')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: 'admin'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Login successful! Redirecting to dashboard...')
        setTimeout(() => {
          window.location.href = '/admin/dashboard'
        }, 1000)
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🛠️ Admin Setup & Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@test.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Test Admin"
              />
            </div>

            <div className="space-y-2">
              <Button
                onClick={createAdmin}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating...' : '1. Create Admin User'}
              </Button>

              <Button
                onClick={testLogin}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Testing...' : '2. Test Login'}
              </Button>
            </div>

            {message && (
              <Alert>
                <AlertDescription className="text-green-600">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-gray-600 mt-4">
              <p><strong>Instructions:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click "Create Admin User" to create a test admin</li>
                <li>Click "Test Login" to verify the login works</li>
                <li>If successful, go to <a href="/auth" className="text-blue-600 underline">/auth</a> to login normally</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
