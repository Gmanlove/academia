"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Bell,
  BellRing,
  Check,
  X,
  Archive,
  Star,
  Clock,
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  MessageSquare,
  Settings,
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Volume2,
  VolumeX
} from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "result" | "announcement" | "system" | "assignment" | "event" | "reminder"
  priority: "low" | "medium" | "high"
  isRead: boolean
  isStarred: boolean
  isArchived: boolean
  timestamp: string
  sender?: string
  actionUrl?: string
  metadata?: {
    subjectId?: string
    resultId?: string
    eventId?: string
  }
}

interface NotificationPreferences {
  email: boolean
  sms: boolean
  push: boolean
  inApp: boolean
  sound: boolean
  types: {
    results: boolean
    announcements: boolean
    assignments: boolean
    events: boolean
    reminders: boolean
    system: boolean
  }
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    sms: false,
    push: true,
    inApp: true,
    sound: true,
    types: {
      results: true,
      announcements: true,
      assignments: true,
      events: true,
      reminders: true,
      system: false
    },
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "07:00"
    }
  })
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [preferencesDialogOpen, setPreferencesDialogOpen] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch notifications
    setTimeout(() => {
      const mockNotifications = generateMockNotifications()
      setNotifications(mockNotifications)
      setFilteredNotifications(mockNotifications.filter(n => !n.isArchived))
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Filter notifications based on selected criteria
    let filtered = notifications.filter(n => {
      if (selectedFilter === "archived" && !n.isArchived) return false
      if (selectedFilter !== "archived" && n.isArchived) return false
      if (selectedFilter === "unread" && n.isRead) return false
      if (selectedFilter === "starred" && !n.isStarred) return false
      return true
    })

    if (selectedType !== "all") {
      filtered = filtered.filter(n => n.type === selectedType)
    }

    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.sender?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredNotifications(filtered)
  }, [notifications, selectedFilter, selectedType, searchQuery])

  const generateMockNotifications = (): Notification[] => {
    const now = new Date()
    return [
      {
        id: "1",
        title: "Mathematics Test Result Available",
        message: "Your mid-term mathematics test result has been published. Score: 95%",
        type: "result",
        priority: "high",
        isRead: false,
        isStarred: false,
        isArchived: false,
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        sender: "Mr. Johnson",
        actionUrl: "/student/results",
        metadata: { subjectId: "math", resultId: "test_001" }
      },
      {
        id: "2",
        title: "School Assembly Tomorrow",
        message: "Special assembly scheduled for tomorrow at 9:00 AM in the main hall. Attendance is mandatory.",
        type: "announcement",
        priority: "medium",
        isRead: false,
        isStarred: true,
        isArchived: false,
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        sender: "Principal Office"
      },
      {
        id: "3",
        title: "Physics Assignment Due Soon",
        message: "Reminder: Your physics lab report is due in 2 days. Don't forget to submit it on time.",
        type: "assignment",
        priority: "medium",
        isRead: true,
        isStarred: false,
        isArchived: false,
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        sender: "Dr. Smith"
      },
      {
        id: "4",
        title: "System Maintenance Notice",
        message: "The student portal will be temporarily unavailable tonight from 11 PM to 1 AM for maintenance.",
        type: "system",
        priority: "low",
        isRead: true,
        isStarred: false,
        isArchived: false,
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        sender: "IT Department"
      },
      {
        id: "5",
        title: "Parent-Teacher Meeting Scheduled",
        message: "A parent-teacher meeting has been scheduled for next Friday at 3:00 PM. Please inform your parents.",
        type: "event",
        priority: "high",
        isRead: false,
        isStarred: true,
        isArchived: false,
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        sender: "Class Teacher"
      },
      {
        id: "6",
        title: "Chemistry Test Results",
        message: "Your chemistry test results are now available. Great improvement this term!",
        type: "result",
        priority: "medium",
        isRead: true,
        isStarred: false,
        isArchived: true,
        timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        sender: "Ms. Williams"
      }
    ]
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ))
  }

  const handleMarkAsUnread = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: false } : n
    ))
  }

  const handleToggleStar = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isStarred: !n.isStarred } : n
    ))
  }

  const handleArchive = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isArchived: true } : n
    ))
  }

  const handleUnarchive = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isArchived: false } : n
    ))
  }

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "result": return Award
      case "announcement": return MessageSquare
      case "assignment": return BookOpen
      case "event": return Calendar
      case "reminder": return Clock
      case "system": return AlertCircle
      default: return Bell
    }
  }

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === "high") return "border-l-red-500"
    if (priority === "medium") return "border-l-yellow-500"
    return "border-l-blue-500"
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return <Badge variant="destructive">High</Badge>
      case "medium": return <Badge variant="secondary">Medium</Badge>
      case "low": return <Badge variant="outline">Low</Badge>
      default: return null
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length
  const starredCount = notifications.filter(n => n.isStarred && !n.isArchived).length
  const archivedCount = notifications.filter(n => n.isArchived).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🔔 Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with important messages and announcements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={preferencesDialogOpen} onOpenChange={setPreferencesDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Notification Preferences</DialogTitle>
                <DialogDescription>
                  Customize how you receive notifications
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Delivery Methods */}
                <div>
                  <h4 className="font-semibold mb-3">Delivery Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <Label>Email Notifications</Label>
                      </div>
                      <Switch 
                        checked={preferences.email}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, email: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <Label>SMS Notifications</Label>
                      </div>
                      <Switch 
                        checked={preferences.sms}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, sms: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <Label>Push Notifications</Label>
                      </div>
                      <Switch 
                        checked={preferences.push}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, push: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        <Label>Sound Alerts</Label>
                      </div>
                      <Switch 
                        checked={preferences.sound}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, sound: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Notification Types */}
                <div>
                  <h4 className="font-semibold mb-3">Notification Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Test Results</Label>
                      <Switch 
                        checked={preferences.types.results}
                        onCheckedChange={(checked) => setPreferences(prev => ({ 
                          ...prev, 
                          types: { ...prev.types, results: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>School Announcements</Label>
                      <Switch 
                        checked={preferences.types.announcements}
                        onCheckedChange={(checked) => setPreferences(prev => ({ 
                          ...prev, 
                          types: { ...prev.types, announcements: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Assignment Reminders</Label>
                      <Switch 
                        checked={preferences.types.assignments}
                        onCheckedChange={(checked) => setPreferences(prev => ({ 
                          ...prev, 
                          types: { ...prev.types, assignments: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Events & Meetings</Label>
                      <Switch 
                        checked={preferences.types.events}
                        onCheckedChange={(checked) => setPreferences(prev => ({ 
                          ...prev, 
                          types: { ...prev.types, events: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>System Messages</Label>
                      <Switch 
                        checked={preferences.types.system}
                        onCheckedChange={(checked) => setPreferences(prev => ({ 
                          ...prev, 
                          types: { ...prev.types, system: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Quiet Hours */}
                <div>
                  <h4 className="font-semibold mb-3">Quiet Hours</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Enable Quiet Hours</Label>
                      <Switch 
                        checked={preferences.quietHours.enabled}
                        onCheckedChange={(checked) => setPreferences(prev => ({ 
                          ...prev, 
                          quietHours: { ...prev.quietHours, enabled: checked }
                        }))}
                      />
                    </div>
                    {preferences.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="start-time">Start Time</Label>
                          <Input
                            id="start-time"
                            type="time"
                            value={preferences.quietHours.start}
                            onChange={(e) => setPreferences(prev => ({ 
                              ...prev, 
                              quietHours: { ...prev.quietHours, start: e.target.value }
                            }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="end-time">End Time</Label>
                          <Input
                            id="end-time"
                            type="time"
                            value={preferences.quietHours.end}
                            onChange={(e) => setPreferences(prev => ({ 
                              ...prev, 
                              quietHours: { ...prev.quietHours, end: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPreferencesDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setPreferencesDialogOpen(false)}>
                  Save Preferences
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <BellRing className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">New notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Starred</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{starredCount}</div>
            <p className="text-xs text-muted-foreground">Important items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">All notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <Archive className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{archivedCount}</div>
            <p className="text-xs text-muted-foreground">Archived items</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="filter-status">Status</Label>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All notifications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notifications</SelectItem>
                  <SelectItem value="unread">Unread Only</SelectItem>
                  <SelectItem value="starred">Starred</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-type">Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="result">Test Results</SelectItem>
                  <SelectItem value="announcement">Announcements</SelectItem>
                  <SelectItem value="assignment">Assignments</SelectItem>
                  <SelectItem value="event">Events</SelectItem>
                  <SelectItem value="reminder">Reminders</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedFilter("all")
                  setSelectedType("all")
                  setSearchQuery("")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Feed ({filteredNotifications.length})
          </CardTitle>
          <CardDescription>
            {selectedFilter === "all" && "All your notifications"}
            {selectedFilter === "unread" && "Unread notifications"}
            {selectedFilter === "starred" && "Starred notifications"}
            {selectedFilter === "archived" && "Archived notifications"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No notifications found</p>
                <p className="text-sm">Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type)
                const colorClass = getNotificationColor(notification.type, notification.priority)
                
                return (
                  <div 
                    key={notification.id} 
                    className={`border rounded-lg p-4 transition-all hover:shadow-md border-l-4 ${colorClass} ${
                      !notification.isRead ? 'bg-blue-50/50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-full ${
                          !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`h-4 w-4 ${
                            !notification.isRead ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-semibold ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            {getPriorityBadge(notification.priority)}
                            {notification.isStarred && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                            {notification.sender && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {notification.sender}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {!notification.isRead ? (
                            <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Mark as Read
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleMarkAsUnread(notification.id)}>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Mark as Unread
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleToggleStar(notification.id)}>
                            <Star className="mr-2 h-4 w-4" />
                            {notification.isStarred ? "Remove Star" : "Add Star"}
                          </DropdownMenuItem>
                          {!notification.isArchived ? (
                            <DropdownMenuItem onClick={() => handleArchive(notification.id)}>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleUnarchive(notification.id)}>
                              <Archive className="mr-2 h-4 w-4" />
                              Unarchive
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(notification.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {/* Action Button */}
                    {notification.actionUrl && (
                      <div className="mt-3 pt-3 border-t">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
