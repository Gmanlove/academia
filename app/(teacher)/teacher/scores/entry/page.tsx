import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Score Entry</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">Select class and subject, then enter CA/Exam. Auto-save coming soon.</CardContent>
      </Card>
    </div>
  )
}
