"use client"

import { ReactNode } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "./app-sidebar"
import { UserMenu } from "./user-menu"

interface TeacherShellProps {
  children: ReactNode
  trail?: { href?: string; label: string }[]
}

export default function TeacherShell({ children, trail = [] }: TeacherShellProps) {
  return (
    <SidebarProvider>
      <AdminSidebar role="teacher" />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-2 sm:px-4 justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 hidden sm:block" />
            <Breadcrumb className="hidden sm:block">
              <BreadcrumbList>
                {trail.map((t, i) => (
                  <BreadcrumbItem key={i}>
                    {t.href ? <BreadcrumbLink href={t.href}>{t.label}</BreadcrumbLink> : t.label}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <UserMenu />
        </header>
        <main className="p-2 sm:p-4 lg:p-6">{children as ReactNode}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
