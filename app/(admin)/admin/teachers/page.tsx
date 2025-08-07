import { db } from "@/lib/mock-db"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  const list = db.listTeachers()
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Teachers</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-md border p-3">
              <Image
                src={t.photoUrl || "/placeholder.svg?height=80&width=80&query=teacher%20portrait"}
                width={56}
                height={56}
                alt="Teacher photo"
                className="rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2">
                  {t.name}
                  <Badge variant={t.active ? "default" : "secondary"}>{t.active ? "Active" : "Inactive"}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">{t.email}</div>
                <div className="text-xs text-muted-foreground">Subjects: {t.subjects.join(", ")}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
