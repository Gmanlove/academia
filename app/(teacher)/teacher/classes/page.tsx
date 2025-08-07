import { db } from "@/lib/mock-db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  const t = db.listTeachers()[0]
  const list = db.listClasses().filter((c) => c.teacherId === t.id)
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>My Classes</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {list.map((c) => (
            <div key={c.id} className="rounded-md border p-3">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">Students: {c.studentCount}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
