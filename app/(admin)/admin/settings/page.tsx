import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label>School Year</Label>
            <Input defaultValue="2024/2025" />
          </div>
          <div className="space-y-1">
            <Label>Grading Scale</Label>
            <Input defaultValue="A-F (0-100)" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Enable Email Notifications</div>
              <div className="text-xs text-muted-foreground">Send emails to parents and teachers</div>
            </div>
            <Switch defaultChecked />
          </div>
          <Button>Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Use Role-based Access Control</div>
              <div className="text-xs text-muted-foreground">Fine-grained permissions per role</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-1">
            <Label>Default Admin Email</Label>
            <Input placeholder="admin@example.com" />
          </div>
          <Button>Save</Button>
        </CardContent>
      </Card>
    </div>
  )
}
