import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClassRadarChart } from "@/components/charts/class-radar"
import { db } from "@/lib/mock-db"

export default function Page() {
  const s = db.listStudents()[0]
  const chart = db.getAdminDashboard().charts.classComparison
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader><CardTitle>Current GPA</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{s.performance.gpa.toFixed(2)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Latest Results</CardTitle></CardHeader><CardContent className="text-muted-foreground">See My Results</CardContent></Card>
        <Card><CardHeader><CardTitle>Upcoming Assessments</CardTitle></CardHeader><CardContent className="text-muted-foreground">2 upcoming</CardContent></Card>
        <Card><CardHeader><CardTitle>Notifications</CardTitle></CardHeader><CardContent className="text-muted-foreground">3 unread</CardContent></Card>
      </div>
      <ClassRadarChart data={chart} />
    </div>
  )
}
