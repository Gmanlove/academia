import { db } from "@/lib/mock-db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  const list = db.listSubjects()
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {list.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-muted-foreground">Code: {s.code}</div>
              </div>
              <div className="text-xs text-muted-foreground">Teachers: {s.teacherIds.length}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
