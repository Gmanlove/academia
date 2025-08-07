import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Send Message</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <Input placeholder="Recipient(s): class or student" />
          <Input placeholder="Subject" />
          <Input placeholder="Message" />
          <Button>Send</Button>
        </CardContent>
      </Card>
    </div>
  )
}
