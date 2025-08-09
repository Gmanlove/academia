import TeacherShell from "@/components/teacher-shell"

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <TeacherShell trail={[{ href: "/teacher/dashboard", label: "Teacher" }]}>{children}</TeacherShell>
}
