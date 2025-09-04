"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Bell,
  Plus,
  Send,
  Clock,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Mail,
  MessageSquare,
  Smartphone,
  Users,
  School,
  GraduationCap,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Filter,
  Search,
  Calendar as CalendarIcon,
  FileText,
  Copy,
  Download,
  Upload,
  Settings,
  TrendingUp,
  Activity,
  Zap,
  TestTube,
  Layout,
  Globe
} from "lucide-react"
import { NotificationItem, NotificationTemplate, NotificationChannel, NotificationStatus } from "@/lib/types"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<NotificationItem["status"] | "all">("all")
  const [deliveryFilter, setDeliveryFilter] = useState<NotificationItem["delivery"] | "all">("all")
  
  // Create notification states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    audience: "School" as NotificationItem["audience"],
    delivery: "Email" as NotificationItem["delivery"],
    priority: "Medium" as NotificationItem["priority"],
    scheduledFor: "",
    recipientIds: [] as string[],
    enableMultiChannel: false,
    channels: [] as NotificationItem["delivery"][],
    abTestEnabled: false,
    abTestPercentage: 50
  })

  // Template management states
  const [templateData, setTemplateData] = useState({
    name: "",
    category: "Academic" as NotificationTemplate["category"],
    subject: "",
    message: "",
    variables: [] as string[]
  })

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState({
    totalSent: 0,
    deliveryRate: 0,
    openRate: 0,
    clickRate: 0,
    failedDeliveries: 0,
    scheduledCount: 0,
    monthlyTrend: [] as { month: string; sent: number; delivered: number; opened: number }[]
  })

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch notifications and templates from API
        const [notificationsRes, templatesRes, analyticsRes] = await Promise.all([
          fetch('/api/notifications'),
          fetch('/api/notifications/templates'),
          fetch('/api/notifications/analytics')
        ]);

        if (notificationsRes.ok) {
          const notificationData = await notificationsRes.json();
          setNotifications(notificationData);
        }

        if (templatesRes.ok) {
          const templateData = await templatesRes.json();
          setTemplates(templateData);
        }

        if (analyticsRes.ok) {
          const analytics = await analyticsRes.json();
          setAnalyticsData(analytics);
        }
      } catch (error) {
        console.error('Error fetching notification data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter
    const matchesDelivery = deliveryFilter === "all" || notification.delivery === deliveryFilter
    
    return matchesSearch && matchesStatus && matchesDelivery
  })

  const handleCreateNotification = () => {
    const newNotification: NotificationItem = {
      id: (notifications.length + 1).toString(),
      ...notificationData,
      createdAt: new Date().toISOString(),
      status: notificationData.scheduledFor ? "Scheduled" : "Sent",
      metadata: {
        emailsSent: 0,
        smssSent: 0,
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0
      }
    }
    
    setNotifications([newNotification, ...notifications])
    setIsCreateDialogOpen(false)
    
    // Reset form
    setNotificationData({
      title: "",
      message: "",
      audience: "School",
      delivery: "Email",
      priority: "Medium",
      scheduledFor: "",
      recipientIds: [],
      enableMultiChannel: false,
      channels: [],
      abTestEnabled: false,
      abTestPercentage: 50
    })
  }

  const handleCreateTemplate = () => {
    const newTemplate: NotificationTemplate = {
      id: (templates.length + 1).toString(),
      ...templateData,
      isSystem: false,
      createdBy: "admin_1",
      createdAt: new Date().toISOString()
    }
    
    setTemplates([newTemplate, ...templates])
    setIsTemplateDialogOpen(false)
    
    // Reset form
    setTemplateData({
      name: "",
      category: "Academic",
      subject: "",
      message: "",
      variables: []
    })
  }

  const handleUseTemplate = (template: NotificationTemplate) => {
    setNotificationData(prev => ({
      ...prev,
      title: template.subject,
      message: template.message
    }))
    setSelectedTemplate(template.id)
  }

  const duplicateNotification = (notification: NotificationItem) => {
    const duplicated: NotificationItem = {
      ...notification,
      id: (notifications.length + 1).toString(),
      title: `Copy of ${notification.title}`,
      createdAt: new Date().toISOString(),
      status: "Draft",
      metadata: {
        emailsSent: 0,
        smssSent: 0,
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0
      }
    }
    
    setNotifications([duplicated, ...notifications])
  }

  const getStatusIcon = (status: NotificationItem["status"]) => {
    switch (status) {
      case "Sent":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "Scheduled":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-orange-600" />
    }
  }

  const getDeliveryIcon = (delivery: NotificationItem["delivery"]) => {
    switch (delivery) {
      case "Email":
        return <Mail className="h-4 w-4" />
      case "SMS":
        return <Smartphone className="h-4 w-4" />
      case "App":
        return <Bell className="h-4 w-4" />
      case "Push":
        return <Bell className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🔔 Notification Management</h1>
          <p className="text-muted-foreground">
            Comprehensive notification center with analytics and template management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export History
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>🚀 Bulk Notification Creator</DialogTitle>
                <DialogDescription>
                  Create and send notifications with advanced targeting and multi-channel delivery
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="targeting">Targeting</TabsTrigger>
                  <TabsTrigger value="delivery">Delivery</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title/Subject</Label>
                      <Input
                        id="title"
                        value={notificationData.title}
                        onChange={(e) => setNotificationData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter notification title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={notificationData.priority} 
                        onValueChange={(value) => setNotificationData(prev => ({ ...prev, priority: value as NotificationItem["priority"] }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">🟢 Low</SelectItem>
                          <SelectItem value="Medium">🟡 Medium</SelectItem>
                          <SelectItem value="High">🟠 High</SelectItem>
                          <SelectItem value="Urgent">🔴 Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message Content</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={notificationData.message}
                      onChange={(e) => setNotificationData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Enter your message here... You can use variables like {{studentName}}, {{className}}, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Use Template</Label>
                    <Select onValueChange={(value) => {
                      const template = templates.find(t => t.id === value)
                      if (template) handleUseTemplate(template)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} ({template.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="targeting" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <Select 
                      value={notificationData.audience} 
                      onValueChange={(value) => setNotificationData(prev => ({ ...prev, audience: value as NotificationItem["audience"] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="School">
                          <div className="flex items-center">
                            <School className="mr-2 h-4 w-4" />
                            Entire School
                          </div>
                        </SelectItem>
                        <SelectItem value="Class">
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            Specific Class
                          </div>
                        </SelectItem>
                        <SelectItem value="Student">
                          <div className="flex items-center">
                            <GraduationCap className="mr-2 h-4 w-4" />
                            Individual Student
                          </div>
                        </SelectItem>
                        <SelectItem value="Teacher">
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            Teachers
                          </div>
                        </SelectItem>
                        <SelectItem value="Parent">
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            Parents
                          </div>
                        </SelectItem>
                        <SelectItem value="Custom">
                          <div className="flex items-center">
                            <Target className="mr-2 h-4 w-4" />
                            Custom Selection
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {notificationData.audience === "Custom" && (
                    <div className="space-y-2">
                      <Label>Custom Recipients</Label>
                      <div className="grid gap-2">
                        <Input placeholder="Search and select recipients..." />
                        <div className="text-sm text-muted-foreground">
                          Selected: {notificationData.recipientIds.length} recipients
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Estimated Recipients</Label>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">
                        {notificationData.audience === "School" ? "520" :
                         notificationData.audience === "Class" ? "35" :
                         notificationData.audience === "Custom" ? notificationData.recipientIds.length :
                         "78"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {notificationData.audience} recipients
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="delivery" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="multiChannel"
                        checked={notificationData.enableMultiChannel}
                        onCheckedChange={(checked) => setNotificationData(prev => ({ 
                          ...prev, 
                          enableMultiChannel: !!checked,
                          channels: checked ? ["Email"] : []
                        }))}
                      />
                      <Label htmlFor="multiChannel">Enable Multi-Channel Delivery</Label>
                    </div>

                    {!notificationData.enableMultiChannel ? (
                      <div className="space-y-2">
                        <Label>Primary Delivery Method</Label>
                        <Select 
                          value={notificationData.delivery} 
                          onValueChange={(value) => setNotificationData(prev => ({ ...prev, delivery: value as NotificationItem["delivery"] }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Email">
                              <div className="flex items-center">
                                <Mail className="mr-2 h-4 w-4" />
                                Email
                              </div>
                            </SelectItem>
                            <SelectItem value="SMS">
                              <div className="flex items-center">
                                <Smartphone className="mr-2 h-4 w-4" />
                                SMS
                              </div>
                            </SelectItem>
                            <SelectItem value="App">
                              <div className="flex items-center">
                                <Bell className="mr-2 h-4 w-4" />
                                App Notification
                              </div>
                            </SelectItem>
                            <SelectItem value="Push">
                              <div className="flex items-center">
                                <Zap className="mr-2 h-4 w-4" />
                                Push Notification
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Select Delivery Channels</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {(["Email", "SMS", "App", "Push"] as const).map(channel => (
                            <div key={channel} className="flex items-center space-x-2">
                              <Checkbox 
                                id={channel}
                                checked={notificationData.channels.includes(channel)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNotificationData(prev => ({ 
                                      ...prev, 
                                      channels: [...prev.channels, channel]
                                    }))
                                  } else {
                                    setNotificationData(prev => ({ 
                                      ...prev, 
                                      channels: prev.channels.filter(c => c !== channel)
                                    }))
                                  }
                                }}
                              />
                              <Label htmlFor={channel} className="flex items-center">
                                {channel === "Email" && <Mail className="mr-1 h-4 w-4" />}
                                {channel === "SMS" && <Smartphone className="mr-1 h-4 w-4" />}
                                {channel === "App" && <Bell className="mr-1 h-4 w-4" />}
                                {channel === "Push" && <Zap className="mr-1 h-4 w-4" />}
                                {channel}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Schedule Delivery (Optional)</Label>
                      <Input
                        type="datetime-local"
                        value={notificationData.scheduledFor ? new Date(notificationData.scheduledFor).toISOString().slice(0, 16) : ""}
                        onChange={(e) => setNotificationData(prev => ({ 
                          ...prev, 
                          scheduledFor: e.target.value ? new Date(e.target.value).toISOString() : "" 
                        }))}
                        placeholder="Send immediately"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="abTest"
                        checked={notificationData.abTestEnabled}
                        onCheckedChange={(checked) => setNotificationData(prev => ({ 
                          ...prev, 
                          abTestEnabled: !!checked
                        }))}
                      />
                      <Label htmlFor="abTest">Enable A/B Testing</Label>
                    </div>

                    {notificationData.abTestEnabled && (
                      <div className="space-y-2 p-4 border rounded-lg">
                        <Label>A/B Test Configuration</Label>
                        <div className="space-y-2">
                          <Label>Test Group Size: {notificationData.abTestPercentage}%</Label>
                          <Input
                            type="range"
                            min="10"
                            max="90"
                            step="10"
                            value={notificationData.abTestPercentage}
                            onChange={(e) => setNotificationData(prev => ({ 
                              ...prev, 
                              abTestPercentage: parseInt(e.target.value)
                            }))}
                          />
                          <div className="text-sm text-muted-foreground">
                            {notificationData.abTestPercentage}% will receive version A, {100 - notificationData.abTestPercentage}% will receive version B
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Delivery Options</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="unsubscribeLink" defaultChecked />
                          <Label htmlFor="unsubscribeLink">Include unsubscribe link</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="trackOpens" defaultChecked />
                          <Label htmlFor="trackOpens">Track opens and clicks</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="fallbackSMS" />
                          <Label htmlFor="fallbackSMS">SMS fallback for failed emails</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Save as Draft
                </Button>
                <Button onClick={handleCreateNotification}>
                  {notificationData.scheduledFor ? (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Schedule Notification
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Now
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
          <TabsTrigger value="history">📜 History</TabsTrigger>
          <TabsTrigger value="templates">📝 Templates</TabsTrigger>
          <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalSent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.deliveryRate}%</div>
                <p className="text-xs text-muted-foreground">Average delivery</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.openRate}%</div>
                <p className="text-xs text-muted-foreground">Recipients opened</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.scheduledCount}</div>
                <p className="text-xs text-muted-foreground">Pending delivery</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common notification tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Bell className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Emergency Alert</div>
                    <div className="text-xs text-muted-foreground">Send urgent notifications</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <FileText className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Result Announcement</div>
                    <div className="text-xs text-muted-foreground">Notify about exam results</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <CalendarIcon className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Event Reminder</div>
                    <div className="text-xs text-muted-foreground">Schedule event notifications</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest notification activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(notification.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {notification.audience} • {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {notification.metadata?.deliveryRate?.toFixed(1)}% delivered
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Notification History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification History
              </CardTitle>
              <CardDescription>Track and manage all sent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as NotificationItem["status"] | "all")}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Sent">Sent</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={deliveryFilter} onValueChange={(value) => setDeliveryFilter(value as NotificationItem["delivery"] | "all")}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Delivery" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Delivery</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="App">App</SelectItem>
                    <SelectItem value="Push">Push</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Sent/Scheduled</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {notification.message}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{notification.audience}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDeliveryIcon(notification.delivery)}
                          <span>{notification.delivery}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(notification.status)}
                          <Badge variant={
                            notification.status === "Sent" ? "default" :
                            notification.status === "Failed" ? "destructive" :
                            notification.status === "Scheduled" ? "secondary" :
                            "outline"
                          }>
                            {notification.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          notification.priority === "Urgent" || notification.priority === "High" ? "destructive" :
                          notification.priority === "Medium" ? "default" :
                          "secondary"
                        }>
                          {notification.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {notification.scheduledFor ? 
                            new Date(notification.scheduledFor).toLocaleDateString() :
                            new Date(notification.createdAt).toLocaleDateString()
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        {notification.metadata && (
                          <div className="text-sm">
                            <div>{notification.metadata.deliveryRate?.toFixed(1)}% delivered</div>
                            <div className="text-muted-foreground">
                              {notification.metadata.openRate?.toFixed(1)}% opened
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => duplicateNotification(notification)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Template
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Template Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    Template Management
                  </CardTitle>
                  <CardDescription>Create and manage notification templates</CardDescription>
                </div>
                <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Notification Template</DialogTitle>
                      <DialogDescription>
                        Build reusable notification templates with variables
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="templateName">Template Name</Label>
                          <Input
                            id="templateName"
                            value={templateData.name}
                            onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter template name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="templateCategory">Category</Label>
                          <Select 
                            value={templateData.category} 
                            onValueChange={(value) => setTemplateData(prev => ({ ...prev, category: value as NotificationTemplate["category"] }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Academic">📚 Academic</SelectItem>
                              <SelectItem value="Administrative">📋 Administrative</SelectItem>
                              <SelectItem value="Event">🎉 Event</SelectItem>
                              <SelectItem value="Reminder">⏰ Reminder</SelectItem>
                              <SelectItem value="Alert">🚨 Alert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="templateSubject">Subject Line</Label>
                        <Input
                          id="templateSubject"
                          value={templateData.subject}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="e.g., {{termName}} Results for {{studentName}}"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="templateMessage">Message Template</Label>
                        <Textarea
                          id="templateMessage"
                          rows={6}
                          value={templateData.message}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Dear {{parentName}}, this is to inform you that..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Available Variables</Label>
                        <div className="text-sm text-muted-foreground">
                          Common variables: {`{{studentName}}, {{parentName}}, {{className}}, {{termName}}, {{date}}, {{time}}, {{schoolName}}`}
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTemplate}>
                        <Layout className="mr-2 h-4 w-4" />
                        Create Template
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <Card key={template.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{template.category}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUseTemplate(template)}>
                              <Send className="mr-2 h-4 w-4" />
                              Use Template
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <div className="text-sm font-medium">Subject:</div>
                          <div className="text-sm text-muted-foreground">{template.subject}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Message:</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{template.message}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Variables:</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {template.variables.map(variable => (
                              <Badge key={variable} variant="secondary" className="text-xs">
                                {`{{${variable}}}`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Dashboard */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.clickRate}%</div>
                <p className="text-xs text-muted-foreground">Average click-through</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Deliveries</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.failedDeliveries}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">84.2%</div>
                <p className="text-xs text-muted-foreground">User engagement</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Templates Used</CardTitle>
                <Layout className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{templates.length}</div>
                <p className="text-xs text-muted-foreground">Active templates</p>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Performance by Channel</CardTitle>
              <CardDescription>Success rates across different notification channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={96.8} className="w-32" />
                    <span className="text-sm font-medium">96.8%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span>SMS</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={94.2} className="w-32" />
                    <span className="text-sm font-medium">94.2%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>App Notification</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={89.5} className="w-32" />
                    <span className="text-sm font-medium">89.5%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Push Notification</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={92.1} className="w-32" />
                    <span className="text-sm font-medium">92.1%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* A/B Testing Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                A/B Testing Results
              </CardTitle>
              <CardDescription>Performance comparison of different message variants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Test: Parent Meeting Reminder</div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Version A (Formal)</div>
                      <div className="text-sm">Open Rate: 72.4%</div>
                      <div className="text-sm">Click Rate: 34.1%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Version B (Casual)</div>
                      <div className="text-sm font-medium text-green-600">Open Rate: 84.6% ↑</div>
                      <div className="text-sm font-medium text-green-600">Click Rate: 41.2% ↑</div>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Test: Fee Payment Reminder</div>
                    <Badge variant="secondary">Running</Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Version A (Direct)</div>
                      <div className="text-sm">Open Rate: 68.3%</div>
                      <div className="text-sm">Click Rate: 22.7%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Version B (Friendly)</div>
                      <div className="text-sm">Open Rate: 71.2%</div>
                      <div className="text-sm">Click Rate: 25.1%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
