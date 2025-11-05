'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function EmergencyLogout() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const performEmergencyLogout = async () => {
    setIsLoggingOut(true)
    addLog('🚨 EMERGENCY LOGOUT STARTED')

    try {
      // Step 1: Clear ALL storage IMMEDIATELY
      addLog('🧹 Clearing localStorage...')
      localStorage.clear()
      addLog('✅ localStorage cleared')
      
      addLog('🧹 Clearing sessionStorage...')
      sessionStorage.clear()
      addLog('✅ sessionStorage cleared')

      // Step 2: Clear ALL cookies
      addLog('🍪 Clearing ALL cookies...')
      const cookies = document.cookie.split(';')
      let cookieCount = 0
      for (let cookie of cookies) {
        const [name] = cookie.split('=')
        const cookieName = name.trim()
        if (cookieName) {
          // Clear with all path and domain variants
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`
          cookieCount++
        }
      }
      addLog(`✅ Cleared ${cookieCount} cookies`)

      // Step 3: Sign out from Supabase
      addLog('📤 Calling Supabase signOut...')
      const supabase = createClient()
      const { error } = await supabase.auth.signOut({ scope: 'global' })
      if (error) {
        addLog(`⚠️ Supabase error: ${error.message}`)
      } else {
        addLog('✅ Supabase signOut successful')
      }

      // Step 4: Call API logout
      addLog('📤 Calling API /api/auth/logout...')
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
          addLog('✅ API logout successful')
        } else {
          addLog(`⚠️ API logout failed: ${response.status}`)
        }
      } catch (apiError: any) {
        addLog(`⚠️ API error: ${apiError.message}`)
      }

      // Step 5: Clear IndexedDB
      addLog('🗄️ Clearing IndexedDB...')
      if (window.indexedDB && window.indexedDB.databases) {
        const databases = await window.indexedDB.databases()
        for (const db of databases) {
          if (db.name) {
            window.indexedDB.deleteDatabase(db.name)
            addLog(`✅ Deleted database: ${db.name}`)
          }
        }
      }

      addLog('✅ EMERGENCY LOGOUT COMPLETE')
      addLog('🚀 Redirecting to /auth in 2 seconds...')

      // Wait 2 seconds so user can see logs
      setTimeout(() => {
        addLog('🔄 FORCING REDIRECT NOW...')
        // Use location.replace for hard redirect
        window.location.replace('/auth')
      }, 2000)

    } catch (error: any) {
      addLog(`❌ ERROR: ${error.message}`)
      setIsLoggingOut(false)
    }
  }

  const checkSession = async () => {
    addLog('🔍 Checking current session...')
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      addLog(`✅ Session exists: ${session.user?.email}`)
      addLog(`📧 User ID: ${session.user?.id}`)
    } else {
      addLog('❌ No active session found')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-red-600 mb-2">
              🚨 Emergency Logout Tool
            </h1>
            <p className="text-gray-600">
              Use this tool if normal logout is not working. This will forcefully clear everything.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={checkSession}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              disabled={isLoggingOut}
            >
              🔍 Check Current Session
            </button>

            <button
              onClick={performEmergencyLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? '⏳ Logging Out...' : '🚨 EMERGENCY LOGOUT NOW'}
            </button>
          </div>

          <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            <div className="mb-2 text-gray-400">--- Console Logs ---</div>
            {logs.length === 0 ? (
              <div className="text-gray-500">Click a button to see logs...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="mb-1">{log}</div>
              ))
            )}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ What This Does:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>✓ Clears ALL localStorage and sessionStorage</li>
              <li>✓ Deletes ALL cookies (client-side and server-side)</li>
              <li>✓ Signs out from Supabase with global scope</li>
              <li>✓ Calls server API to clear server-side cookies</li>
              <li>✓ Deletes ALL IndexedDB databases</li>
              <li>✓ Forces hard redirect to login page</li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/auth'}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go to Login Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
