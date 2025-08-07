import { db } from "@/lib/mock-db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  const list = db.listResults().slice(0, 50)
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Results Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left">Student</th>
                <th className="p-2 text-left">Subject</th>
                <th className="p-2 text-left">CA</th>
                <th className="p-2 text-left">Exam</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Term</th>
                <th className="p-2 text-left">Session</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => {
                const stu = db.getStudent(r.studentId)!
                const subj = db.listSubjects().find((s) => s.id === r.subjectId)
                return (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="p-2">{stu.studentId}</td>
                    <td className="p-2">{subj?.name}</td>
                    <td className="p-2">{r.ca}</td>
                    <td className="p-2">{r.exam}</td>
                    <td className="p-2">{r.total}</td>
                    <td className="p-2">{r.term}</td>
                    <td className="p-2">{r.session}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
