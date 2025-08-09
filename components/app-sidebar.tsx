"use client"

import { BarChart2, Bell, BookOpen, Building2, FileText, Gauge, LayoutDashboard, Settings, Users, UsersRound, Home, Calculator, MessageSquare, TrendingUp, History } from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  role?: "admin" | "teacher" | "student"
}

export function AdminSidebar({ role = "admin" }: AppSidebarProps) {
  const adminMenuItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/schools", icon: Building2, label: "Schools" },
    { href: "/admin/students", icon: Users, label: "Students" },
    { href: "/admin/teachers", icon: UsersRound, label: "Teachers" },
    { href: "/admin/classes", icon: BookOpen, label: "Classes" },
    { href: "/admin/subjects", icon: FileText, label: "Subjects" },
    { href: "/admin/results", icon: BarChart2, label: "Results" },
    { href: "/admin/analytics", icon: Gauge, label: "Analytics" },
    { href: "/admin/notifications", icon: Bell, label: "Notifications" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ]

  const teacherMenuItems = [
    { href: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/teacher/classes", icon: BookOpen, label: "My Classes" },
    { href: "/teacher/scores/entry", icon: Calculator, label: "Score Entry" },
    { href: "/teacher/analytics", icon: Gauge, label: "Analytics" },
    { href: "/teacher/communication", icon: MessageSquare, label: "Communication" },
  ]

  const studentMenuItems = [
    { href: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/student/results", icon: BarChart2, label: "My Results" },
    { href: "/student/history", icon: History, label: "Academic History" },
    { href: "/student/notifications", icon: Bell, label: "Notifications" },
    { href: "/results", icon: TrendingUp, label: "Check Results" },
  ]

  const getMenuItems = () => {
    switch (role) {
      case "teacher":
        return teacherMenuItems
      case "student":
        return studentMenuItems
      default:
        return adminMenuItems
    }
  }

  const getRoleLabel = () => {
    switch (role) {
      case "teacher":
        return "Teacher"
      case "student":
        return "Student"
      default:
        return "Admin"
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Academia</span>
            <span className="text-xs text-muted-foreground">{getRoleLabel()} Portal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{getRoleLabel()}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {getMenuItems().map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  )
}
