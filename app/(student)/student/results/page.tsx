import { db } from "@/lib/mock-db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  const s = db.listStudents()[0]
  const res = db.listResults({ studentId: s.id }).slice(0, 20)
  const subjectMap = new Map(db.listSubjects().map((x) => [x.id, x.name]))
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>My Results</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left">Subject</th>
                <th className="p-2 text-left">CA</th>
                <th className="p-2 text-left">Exam</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Term</th>
                <th className="p-2 text-left">Session</th>
              </tr>
            </thead>
            <tbody>
              {res.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="p-2">{subjectMap.get(r.subjectId)}</td>
                  <td className="p-2">{r.ca}</td>
                  <td className="p-2">{r.exam}</td>
                  <td className="p-2">{r.total}</td>
                  <td className="p-2">{r.term}</td>
                  <td className="p-2">{r.session}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
