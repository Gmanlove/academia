import StudentShell from "@/components/student-shell"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentShell trail={[{ href: "/student/dashboard", label: "Student" }]}>{children}</StudentShell>
}
