"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard, MetricGrid } from "@/components/ui/stats-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { db } from "@/lib/mock-db"
import Link from "next/link"
import {
  Users,
  GraduationCap,
  School,
  BookOpen,
  TrendingUp,
  Bell,
  FileText,
  UserPlus,
  MessageSquare,
  Download,
  Upload,
  Activity,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Shield,
  AlertCircle,
  Plus,
  FileSpreadsheet,
  Settings,
  Calendar,
  Mail,
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart
} from "recharts"

export default function AdminDashboard() {
  const stats = db.getAdminDashboard()

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  const overviewMetrics = [
    {
      title: "Total Students",
      value: stats.totals.students.toLocaleString(),
      description: "Active enrollments across all schools",
      icon: Users,
      trend: {
        value: stats.growthPercent,
        label: "from last term",
        isPositive: true,
      },
      badge: {
        text: "Growing",
        variant: "default" as const,
      },
    },
    {
      title: "Total Teachers",
      value: stats.totals.teachers.toString(),
      description: `${stats.teachersActive} active, ${stats.teachersInactive} inactive`,
      icon: GraduationCap,
      trend: {
        value: 2.1,
        label: "from last month",
        isPositive: true,
      },
      badge: {
        text: `${Math.round((stats.teachersActive/stats.totals.teachers)*100)}% Active`,
        variant: "secondary" as const,
      },
    },
    {
      title: "Total Schools",
      value: stats.totals.schools.toString(),
      description: "Active school partnerships",
      icon: School,
      trend: {
        value: 8.3,
        label: "new partnerships",
        isPositive: true,
      },
      badge: {
        text: "Multi-brand",
        variant: "outline" as const,
      },
    },
    {
      title: "Total Classes",
      value: stats.totals.classes.toString(),
      description: "Active class sessions",
      icon: BookOpen,
      badge: {
        text: stats.systemHealth,
        variant: stats.systemHealth === "Healthy" ? "default" as const : "destructive" as const,
      },
    },
    {
      title: "Recent Results Posted",
      value: stats.recentResults.length.toString(),
      description: "Latest submissions from teachers",
      icon: FileText,
      trend: {
        value: 12.5,
        label: "this week",
        isPositive: true,
      },
      badge: {
        text: "Updated",
        variant: "secondary" as const,
      },
    },
    {
      title: "Pending Notifications",
      value: stats.pendingNotifications.toString(),
      description: "Awaiting delivery to parents",
      icon: Bell,
      badge: {
        text: stats.pendingNotifications > 10 ? "High Priority" : "Normal",
        variant: stats.pendingNotifications > 10 ? "destructive" as const : "secondary" as const,
      },
    },
    {
      title: "System Health",
      value: stats.systemHealth,
      description: "Overall platform status",
      icon: Shield,
      badge: {
        text: stats.systemHealth,
        variant: stats.systemHealth === "Healthy" ? "default" as const : "destructive" as const,
      },
    },
    {
      title: "Average Performance",
      value: `${stats.performance.averageGPA}/4.0`,
      description: `${stats.performance.passRate}% pass rate`,
      icon: Target,
      trend: {
        value: 4.2,
        label: "improvement",
        isPositive: true,
      },
      badge: {
        text: "Above Target",
        variant: "default" as const,
      },
    },
  ]

  const quickActionButtons = [
    {
      title: "Add New Student",
      description: "Register a new student",
      icon: UserPlus,
      href: "/admin/students/new",
      color: "text-blue-600",
    },
    {
      title: "Create Bulk Notification",
      description: "Send notification to parents",
      icon: MessageSquare,
      href: "/admin/notifications/new",
      color: "text-green-600",
    },
    {
      title: "Generate Reports",
      description: "Export system reports",
      icon: Download,
      href: "/admin/reports",
      color: "text-purple-600",
    },
    {
      title: "Import Student Data",
      description: "Bulk import student data",
      icon: Upload,
      href: "/admin/students/import",
      color: "text-orange-600",
    },
  ]

  const planMetrics = stats.byPlan.map(plan => ({
    title: `${plan.plan} Plan`,
    value: plan.count.toString(),
    description: `₦${plan.revenue.toLocaleString()} revenue`,
    badge: {
      text: plan.plan,
      variant: plan.plan === "Enterprise" ? "default" : "secondary" as const,
    },
  }))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your schools today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>System {stats.systemHealth}</span>
          </Badge>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Today, {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Button>
          <Button>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            View Full Report
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <MetricGrid metrics={overviewMetrics} columns={4} />

      {/* Quick Actions Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Quick Actions Panel</span>
          </CardTitle>
          <CardDescription>
            Frequently used administrative tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActionButtons.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <action.icon className={`h-8 w-8 ${action.color}`} />
                      <div>
                        <h3 className="font-semibold text-sm">{action.title}</h3>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="submissions">Result Submissions</TabsTrigger>
          <TabsTrigger value="notifications">Notification Stats</TabsTrigger>
          <TabsTrigger value="financial">Financial Overview</TabsTrigger>
          <TabsTrigger value="system">System Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5" />
                  <span>Student Performance Trends</span>
                </CardTitle>
                <CardDescription>Monthly average GPA across all schools</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={stats.charts.performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 4]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="avg" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subject-wise Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Subject Performance Distribution</span>
                </CardTitle>
                <CardDescription>Average scores and student count by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.charts.subjectDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avg" fill="#82ca9d" name="Average Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Class Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Class Performance Comparison</span>
                </CardTitle>
                <CardDescription>Multi-subject performance radar chart</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={stats.charts.classComparison}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="className" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Math" dataKey="math" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Radar name="English" dataKey="eng" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                    <Radar name="Science" dataKey="sci" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Students by Grade Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Students by Grade Level</span>
                </CardTitle>
                <CardDescription>Distribution across grade levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={stats.byGrade}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ grade, count }) => `${grade}: ${count}`}
                    >
                      {stats.byGrade.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Result Submission Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Monthly Result Submission Rates</span>
                </CardTitle>
                <CardDescription>Teacher submission activity and timeliness</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stats.charts.monthlySubmissions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="submissions" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                      name="Total Submissions"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="onTime" 
                      stackId="2"
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6}
                      name="On-Time Submissions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Submission Timeliness Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Timeliness</CardTitle>
                <CardDescription>On-time vs late submissions breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">On Time</span>
                    </div>
                    <span className="text-sm text-muted-foreground">78%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm font-medium">Late</span>
                    </div>
                    <span className="text-sm text-muted-foreground">15%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm font-medium">Missing</span>
                    </div>
                    <span className="text-sm text-muted-foreground">7%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: "7%" }}></div>
                  </div>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Recent Submissions</h4>
                    <div className="space-y-2">
                      {stats.recentResults.slice(0, 3).map((result, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span>Result #{result.id.slice(-6)}</span>
                          <Badge variant="outline">
                            {new Date(result.submittedAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notification Delivery Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Notification Delivery Statistics</span>
                </CardTitle>
                <CardDescription>Email and SMS delivery performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.charts.notificationStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="delivered" fill="#82ca9d" name="Delivered" />
                    <Bar dataKey="failed" fill="#ff7c7c" name="Failed" />
                    <Bar dataKey="opened" fill="#8884d8" name="Opened" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Notification Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Summary</CardTitle>
                <CardDescription>Current month delivery statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">1,247</div>
                      <div className="text-sm text-green-600">Delivered</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">23</div>
                      <div className="text-sm text-red-600">Failed</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">892</div>
                      <div className="text-sm text-blue-600">Opened</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{stats.pendingNotifications}</div>
                      <div className="text-sm text-yellow-600">Pending</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Delivery Rate</span>
                      <span className="font-medium">98.2%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "98.2%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Open Rate</span>
                      <span className="font-medium">71.6%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "71.6%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="space-y-6">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                      <p className="text-2xl font-bold">₦{stats.financials?.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="default">+12.5% from last month</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">₦{stats.financials?.totalRevenue.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="secondary">All time</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Outstanding</p>
                      <p className="text-2xl font-bold">₦{stats.financials?.outstandingPayments.toLocaleString()}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="destructive">Needs attention</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Churn Rate</p>
                      <p className="text-2xl font-bold">{stats.financials?.churnRate}%</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline">Monthly average</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Plan Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution & Revenue</CardTitle>
                <CardDescription>Subscription plans and their revenue contribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {stats.byPlan.map((plan, index) => (
                    <div key={plan.plan} className="text-center p-4 border rounded-lg">
                      <div className="text-lg font-bold">{plan.count}</div>
                      <div className="text-sm text-muted-foreground">{plan.plan} Plan</div>
                      <div className="text-xs text-green-600">₦{plan.revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Revenue Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>Monthly revenue and new subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stats.charts.revenueGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                      name="Revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>System Health Overview</span>
                </CardTitle>
                <CardDescription>Platform performance and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Performance</span>
                    <Badge variant="default">Optimal</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "94%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Response Time</span>
                    <Badge variant="default">Fast</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "89%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Usage</span>
                    <Badge variant="secondary">67%</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "67%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <Badge variant="default">99.9%</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "99.9%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Schools */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Schools</CardTitle>
                <CardDescription>Schools with highest average performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.performance.topPerformingSchools.map((school, index) => (
                    <div key={school.schoolId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{school.schoolName}</p>
                          <p className="text-xs text-muted-foreground">School Performance</p>
                        </div>
                      </div>
                      <Badge variant="outline">{school.average}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Activities Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activities Feed</span>
          </CardTitle>
          <CardDescription>
            Latest system activities, alerts, and important updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => {
                const getActivityIcon = (type: string) => {
                  switch (type) {
                    case "student": return <UserPlus className="h-4 w-4" />
                    case "teacher": return <GraduationCap className="h-4 w-4" />
                    case "result": return <FileText className="h-4 w-4" />
                    case "system": return <Settings className="h-4 w-4" />
                    case "notification": return <Bell className="h-4 w-4" />
                    case "billing": return <DollarSign className="h-4 w-4" />
                    default: return <Activity className="h-4 w-4" />
                  }
                }

                const getSeverityColor = (severity: string) => {
                  switch (severity) {
                    case "error": return "bg-red-500"
                    case "warning": return "bg-yellow-500"
                    case "success": return "bg-green-500"
                    case "info": return "bg-blue-500"
                    default: return "bg-gray-500"
                  }
                }

                const getTimeAgo = (dateString: string) => {
                  const now = new Date()
                  const activityTime = new Date(dateString)
                  const diffMs = now.getTime() - activityTime.getTime()
                  const diffMins = Math.floor(diffMs / (1000 * 60))
                  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
                  
                  if (diffMins < 60) {
                    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
                  } else if (diffHours < 24) {
                    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
                  } else {
                    return activityTime.toLocaleDateString()
                  }
                }

                return (
                  <div key={activity.id} className="flex items-start space-x-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${getSeverityColor(activity.severity)}`} />
                      <div className="p-2 rounded-full bg-muted">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-relaxed">{activity.message}</p>
                      <div className="flex items-center space-x-3">
                        <p className="text-xs text-muted-foreground">
                          {getTimeAgo(activity.at)}
                        </p>
                        <Badge variant="outline" className="capitalize">
                          {activity.type}
                        </Badge>
                        <Badge 
                          variant={activity.severity === "error" ? "destructive" : 
                                  activity.severity === "warning" ? "secondary" : "default"} 
                          className="capitalize"
                        >
                          {activity.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              <Activity className="h-4 w-4 mr-2" />
              View All Activities
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
