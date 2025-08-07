import AdminShell from "@/components/admin-shell"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell trail={[{ href: "/admin/dashboard", label: "Admin" }]}>{children}</AdminShell>
}
