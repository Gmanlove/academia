import { db } from "@/lib/mock-db"
import { StudentTrendChart } from "@/components/charts/student-trend"
import { SubjectDistributionChart } from "@/components/charts/subject-distribution"
import { ClassRadarChart } from "@/components/charts/class-radar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  const d = db.getAdminDashboard().charts
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <StudentTrendChart data={d.studentTrend} />
      <SubjectDistributionChart data={d.subjectDistribution} />
      <ClassRadarChart data={d.classComparison} />
      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle>Monthly Submission & Notification Stats</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This section can include combined or drill-down charts. Export as PDF/Excel coming soon.
        </CardContent>
      </Card>
    </div>
  )
}
