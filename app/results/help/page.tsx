import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader><CardTitle>Help & Support</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>How to get access token: Request from your school admin.</p>
          <p>Troubleshooting: Ensure Student ID and token are correct and not expired.</p>
          <p>Contact: support@schoolapp.io</p>
          <p>System Status: All systems operational</p>
        </CardContent>
      </Card>
    </div>
  )
}
