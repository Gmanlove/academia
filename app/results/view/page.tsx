import { db } from "@/lib/mock-db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page({ searchParams }: { searchParams: { studentId?: string } }) {
  const pubId = searchParams.studentId
  const stu = db.listStudents().find((s) => s.studentId === pubId)
  if (!stu) {
    return <div className="text-center text-muted-foreground">Student not found.</div>
  }
  const res = db.listResults({ studentId: stu.id })
  const subjectMap = new Map(db.listSubjects().map((x) => [x.id, x.name]))
  const totalAvg = Math.round((res.reduce((a, r) => a + r.total, 0) / Math.max(1, res.length)) * 100) / 100

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Student Information</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <div><div className="text-sm text-muted-foreground">Name</div><div className="font-medium">{stu.name}</div></div>
            <div><div className="text-sm text-muted-foreground">Student ID</div><div className="font-medium">{stu.studentId}</div></div>
            <div><div className="text-sm text-muted-foreground">Overall Avg</div><div className="font-medium">{totalAvg}</div></div>
            <div><div className="text-sm text-muted-foreground">GPA</div><div className="font-medium">{stu.performance.gpa.toFixed(2)}</div></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Scores</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left">Subject</th>
                <th className="p-2 text-left">CA</th>
                <th className="p-2 text-left">Exam</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Remark</th>
              </tr>
            </thead>
            <tbody>
              {res.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="p-2">{subjectMap.get(r.subjectId)}</td>
                  <td className="p-2">{r.ca}</td>
                  <td className="p-2">{r.exam}</td>
                  <td className="p-2">{r.total}</td>
                  <td className="p-2">{r.teacherRemark ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
