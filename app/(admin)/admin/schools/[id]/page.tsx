import { db } from "@/lib/mock-db"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Page({ params }: { params: { id: string } }) {
  const school = db.getSchool(params.id)
  if (!school) return notFound()
  const students = db.listStudents({ schoolId: school.id })
  const teachers = db.listTeachers()
  const classes = db.listClasses({ schoolId: school.id })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{school.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div>
            <div className="text-sm text-muted-foreground">Brand</div>
            <div className="font-medium">{school.brand}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Admin</div>
            <div className="font-medium">{school.adminAssigned ?? "—"}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Contact</div>
            <div className="font-medium">{school.contactEmail}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="font-medium">{school.active ? "Active" : "Inactive"}</div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-3xl font-semibold">{school.stats.students}</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div>
                <div className="text-3xl font-semibold">{school.stats.teachers}</div>
                <div className="text-sm text-muted-foreground">Teachers</div>
              </div>
              <div>
                <div className="text-3xl font-semibold">{school.stats.classes}</div>
                <div className="text-sm text-muted-foreground">Classes</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {students.map((s) => (
                <div key={s.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.studentId}</div>
                  </div>
                  <a href={`/admin/students/${s.id}`} className="text-sm text-primary underline">
                    View
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {teachers.map((t) => (
                <div key={t.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.email}</div>
                  </div>
                  <a href={`/admin/teachers/${t.id}`} className="text-sm text-primary underline">
                    View
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Classes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {classes.map((c) => (
                <div key={c.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Level: {c.level} • Students: {c.studentCount}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>School Settings</CardTitle>
            </CardHeader>
            <CardContent>Per-school configuration coming soon.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
