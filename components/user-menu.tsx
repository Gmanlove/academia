"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useSupabaseAuth } from "@/components/supabase-auth-provider"
import { 
  LogOut, 
  User, 
  Settings, 
  Shield, 
  Clock,
  ChevronDown 
} from "lucide-react"

export function UserMenu() {
  const { userProfile: user, signOut: logout, isLoading } = useSupabaseAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (!user) return null

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'teacher':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'student':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never'
    
    const date = new Date(lastLogin)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    
    return date.toLocaleDateString()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 h-10 px-3">
          <Avatar className="h-7 w-7">
            <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
            <AvatarFallback className="text-xs font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium leading-none">{user.name}</span>
            <span className="text-xs text-gray-500 leading-none mt-0.5">{user.role}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
        {/* User Info Header */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
              <AvatarFallback className="text-lg font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-gray-900 truncate">{user.name}</h4>
                <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 truncate">{user.email}</p>
              <p className="text-xs text-gray-500">ID: {user.id}</p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Session Info */}
        <div className="p-3 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Last login: {formatLastLogin(user.lastLogin)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>School: {user.schoolId}</span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <div className="p-1">
          <DropdownMenuItem className="cursor-pointer focus:bg-gray-50">
            <User className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer focus:bg-gray-50">
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem 
            className="cursor-pointer focus:bg-red-50 text-red-600 focus:text-red-700"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </DropdownMenuItem>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t">
          <p className="text-xs text-gray-500 text-center">
            Secure session • Auto-logout in 24h
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Simplified logout button for mobile or simple layouts
export function LogoutButton() {
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="text-red-600 border-red-200 hover:bg-red-50"
    >
      <LogOut className="w-4 h-4 mr-2" />
      {isLoggingOut ? 'Signing out...' : 'Sign Out'}
    </Button>
  )
}
