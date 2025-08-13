"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  GraduationCap,
  Mail,
  User,
  Key,
  CheckCircle,
  Clock,
  AlertTriangle,
  Copy,
  RefreshCw,
  TestTube,
  Send
} from "lucide-react"
import Link from "next/link"

export default function DevHelperPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [testEmail, setTestEmail] = useState("")

  // Get users from the API 
  const refreshUsers = async () => {
    try {
      // In development, we'll create a simple endpoint to get users
      // For now, we'll check if there are any users in localStorage from recent registrations
      const authData = localStorage.getItem('auth-data')
      if (authData) {
        const parsed = JSON.parse(authData)
        if (parsed.user) {
          setUsers([{
            id: parsed.user.id,
            firstName: parsed.user.name?.split(' ')[0] || 'Unknown',
            lastName: parsed.user.name?.split(' ')[1] || 'User',
            email: parsed.user.email,
            username: parsed.user.username,
            role: parsed.user.role,
            status: parsed.user.emailVerified ? 'active' : 'pending_verification',
            emailVerified: parsed.user.emailVerified || false,
            verificationToken: parsed.user.emailVerified ? null : "verify_demo_token",
            createdAt: new Date().toISOString()
          }])
          return
        }
      }
      
      // If no auth data, show demo user
      const mockUsers = [
        {
          id: "user_demo",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          username: "testuser",
          role: "student",
          status: "pending_verification",
          emailVerified: false,
          verificationToken: "verify_abc123def456",
          createdAt: new Date().toISOString()
        }
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.error('Error refreshing users:', error)
      setUsers([])
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessage("Copied to clipboard!")
    setTimeout(() => setMessage(""), 3000)
  }

  const testVerification = async (token: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/auth/verify?token=${token}`)
      const data = await response.json()
      
      if (response.ok) {
        setMessage("✅ Verification successful!")
        refreshUsers()
      } else {
        setMessage(`❌ Verification failed: ${data.error}`)
      }
    } catch (error) {
      setMessage("❌ Network error during verification")
    } finally {
      setLoading(false)
    }
  }

  const testResendEmail = async () => {
    if (!testEmail) {
      setMessage("Please enter an email address")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessage("✅ Verification email resent! Check the browser console for the verification link.")
      } else {
        setMessage(`❌ Resend failed: ${data.error}`)
      }
    } catch (error) {
      setMessage("❌ Network error during resend")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Development Helper
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Email verification testing and debugging tools
          </p>
          <Badge variant="secondary" className="mt-2">
            Development Mode Only
          </Badge>
        </div>

        {message && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Test email verification functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="test-email">Test Email Resend</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="test-email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                  <Button 
                    onClick={testResendEmail}
                    disabled={loading}
                    size="sm"
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                    Resend
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Testing Tools</Label>
                <div className="flex gap-2">
                  <Link href="/dev-helper/test-email">
                    <Button variant="outline" size="sm">
                      <TestTube className="h-4 w-4 mr-1" />
                      Email Flow Test
                    </Button>
                  </Link>
                  <Link href="/dev-helper/create-admin">
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-1" />
                      Create Admin
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Demo Verification Links</Label>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard("http://localhost:3001/auth/verify-email?token=verify_abc123def456")}
                      className="mr-2"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Demo Link
                    </Button>
                    <span className="text-xs">Test verification link</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Console Monitor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Console Monitor</span>
              </CardTitle>
              <CardDescription>
                Check browser console for verification tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div className="mb-2 text-gray-400"># Browser Console Output:</div>
                <div>[DEMO] Verification email sent to user@example.com</div>
                <div>[DEMO] Verification link: /auth/verify-email?token=verify_xyz789</div>
                <div className="mt-2 text-yellow-400">
                  💡 Open browser DevTools (F12) → Console tab to see real tokens
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Status Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>User Verification Status</span>
                </div>
                <Button variant="outline" size="sm" onClick={refreshUsers}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>
                View and test user email verification status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        No registered users found. Register a new user to test verification.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === 'active' ? 'default' : 'secondary'}
                            className={user.status === 'pending_verification' ? 'bg-yellow-100 text-yellow-800' : ''}
                          >
                            {user.status === 'pending_verification' ? (
                              <Clock className="h-3 w-3 mr-1" />
                            ) : (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.emailVerified ? "default" : "destructive"}>
                            {user.emailVerified ? "✓ Verified" : "✗ Unverified"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.verificationToken && (
                            <div className="space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => testVerification(user.verificationToken)}
                                disabled={loading}
                              >
                                Test Verify
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(`http://localhost:3001/auth/verify-email?token=${user.verificationToken}`)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>🧪 Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <ol className="space-y-2">
              <li><strong>Register a new account:</strong> Go to <code>/auth/register</code> and create a new user account</li>
              <li><strong>Check console:</strong> Open browser DevTools (F12) → Console tab to see the verification token</li>
              <li><strong>Copy verification link:</strong> Look for the log message with the verification URL</li>
              <li><strong>Test verification:</strong> Visit the verification link or use the "Test Verify" button above</li>
              <li><strong>Try login:</strong> After verification, attempt to login with your new credentials</li>
              <li><strong>Test without verification:</strong> Try logging in before verification to see the error message</li>
            </ol>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Demo Credentials (Pre-verified):</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li><strong>Admin:</strong> username: <code>admin</code>, password: <code>admin123</code></li>
                <li><strong>Teacher:</strong> username: <code>teacher</code>, password: <code>teach123</code></li>
                <li><strong>Student:</strong> username: <code>student</code>, password: <code>stud123</code></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
