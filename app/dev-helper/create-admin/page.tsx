"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DevHelperPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("admin")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleCreateUser = async () => {
    if (!email || !password || !name) {
      setMessage("Please fill in all fields")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/auth/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          userData: {
            role,
            name,
            permissions: role === "admin" 
              ? ["read", "write", "delete", "manage_users", "manage_schools", "view_analytics"]
              : ["read", "write"]
          }
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ User created successfully! You can now login with ${email}`)
        setEmail("")
        setPassword("")
        setName("")
      } else {
        setMessage(`❌ Error: ${data.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error:", error)
      setMessage("❌ Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🔧 Dev Helper - Create Admin User</CardTitle>
          <p className="text-sm text-muted-foreground">
            This bypasses email verification for development
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
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
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Admin User"
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleCreateUser} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create User"}
          </Button>

          {message && (
            <div className={`p-3 rounded text-sm ${
              message.includes("✅") 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {message}
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-2">
            <p><strong>Steps:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Get your service role key from Supabase dashboard</li>
              <li>Add it to your .env.local file</li>
              <li>Run the database schema in Supabase SQL editor</li>
              <li>Create your admin user here</li>
              <li>Login at /auth</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
