"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ApiTestPage() {
  const [email, setEmail] = useState('test@example.com')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testVerifyAPI = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      setResult(`
Status: ${response.status}
Response: ${JSON.stringify(data, null, 2)}
      `)
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>API Test - Verify Endpoint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={testVerifyAPI} disabled={loading}>
            Test /api/auth/verify
          </Button>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
            <pre>{result}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
