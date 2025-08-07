import { db } from "@/lib/mock-db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StudentTrendChart } from "@/components/charts/student-trend"
import { SubjectDistributionChart } from "@/components/charts/subject-distribution"
import { ClassRadarChart } from "@/components/charts/class-radar"
import Link from "next/link"

export default async function Page() {
  const data = db.getAdminDashboard()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Students</CardDescription>
            <CardTitle className="text-3xl">{data.totals.students}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-green-600 border-green-600">
              {"+"}
              {data.growthPercent}% this term
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Teachers</CardDescription>
            <CardTitle className="text-3xl">{data.totals.teachers}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Active {data.teachersActive} • Inactive {data.teachersInactive}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Classes</CardDescription>
            <CardTitle className="text-3xl">{data.totals.classes}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {data.byGrade.slice(0, 3).map((g) => (
              <span key={g.grade} className="mr-3">
                {g.grade}: {g.count}
              </span>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>System Health</CardDescription>
            <CardTitle className="text-3xl">{data.systemHealth}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Pending Notifications: {data.pendingNotifications}</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StudentTrendChart data={data.charts.studentTrend} />
        <SubjectDistributionChart data={data.charts.subjectDistribution} />
        <ClassRadarChart data={data.charts.classComparison} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system and user events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentActivities.map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium">{a.message}</div>
                  <div className="text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</div>
                </div>
                <Badge variant="outline">{a.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Do more in fewer clicks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/admin/students?quick=add">Add New Student</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin/notifications">Create Bulk Notification</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/analytics">Generate Reports</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/students/import">Import Student Data</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
