import { db } from "@/lib/mock-db"
import { SubjectDistributionChart } from "@/components/charts/subject-distribution"

export default function Page() {
  const d = db.getAdminDashboard().charts.subjectDistribution
  return <SubjectDistributionChart data={d} />
}
