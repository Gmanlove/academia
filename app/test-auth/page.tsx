'use client'

import { useState } from 'react'

export default function TestAuth() {
  const [result, setResult] = useState<string>('')

  const updateUserProfile = async () => {
    try {
      setResult('Updating user profile to verified...\n')
      
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: '0ee54108-4ae3-433d-9788-f03879f6d0a5',
          email: 'emmagmanc@gmail.com'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setResult(prev => prev + `✅ Profile updated: ${JSON.stringify(data, null, 2)}\n`)
      } else {
        const error = await response.text()
        setResult(prev => prev + `❌ Profile update failed: ${error}\n`)
      }
    } catch (err) {
      setResult(prev => prev + `❌ Error: ${err}\n`)
    }
  }

  const testLogin = async () => {
    try {
      setResult(prev => prev + 'Testing login...\n')
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'emmagmanc@gmail.com',
          password: 'Obimlove1@'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setResult(prev => prev + `✅ Login successful: ${JSON.stringify(data, null, 2)}\n`)
      } else {
        const error = await response.text()
        setResult(prev => prev + `❌ Login failed: ${error}\n`)
      }
    } catch (err) {
      setResult(prev => prev + `❌ Error: ${err}\n`)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <div className="space-y-4">
        <button 
          onClick={updateUserProfile}
          className="bg-green-500 text-white px-4 py-2 rounded mr-4"
        >
          Update Profile to Verified
        </button>
        
        <button 
          onClick={testLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Login
        </button>
      </div>
      
      <div className="mt-6 bg-gray-100 p-4 rounded">
        <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
      </div>
    </div>
  )
}
