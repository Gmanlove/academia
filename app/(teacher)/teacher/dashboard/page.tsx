import { db } from "@/lib/mock-db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  const t = db.listTeachers()[0]
  const myClasses = db.listClasses().filter((c) => c.teacherId === t.id)
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader><CardTitle>My Classes</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{myClasses.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>Total Students</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{myClasses.reduce((a, c) => a + c.studentCount, 0)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Pending Results</CardTitle></CardHeader><CardContent>2 pending</CardContent></Card>
        <Card><CardHeader><CardTitle>Recent Submissions</CardTitle></CardHeader><CardContent>5 this week</CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">Enter scores, notify class, generate report</CardContent>
      </Card>
    </div>
  )
}
