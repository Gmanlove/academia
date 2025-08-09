"use client"

import { ReactNode } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "./app-sidebar"

export default function StudentShell({ children, trail = [] }: { children: ReactNode; trail?: { href?: string; label: string }[] }) {
  return (
    <SidebarProvider>
      <AdminSidebar role="student" />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {trail.map((t, i) => (
                <BreadcrumbItem key={i}>
                  {t.href ? <BreadcrumbLink href={t.href}>{t.label}</BreadcrumbLink> : t.label}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="p-4">{children as ReactNode}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
