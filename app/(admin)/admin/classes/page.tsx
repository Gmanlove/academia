import { db } from "@/lib/mock-db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  const list = db.listClasses()
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Classes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <div key={c.id} className="rounded-md border p-3">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">Level: {c.level}</div>
              <div className="text-xs text-muted-foreground">Students: {c.studentCount}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
