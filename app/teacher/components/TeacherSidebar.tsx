"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Users, User, FileCheck, BookOpen, Menu, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/teacher/Template/components/ui/sidebar";
import { Button } from "@/app/teacher/Template/components/ui/button";

const items = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/students", label: "Students", icon: Users },
  { href: "/teacher/submissions", label: "Submissions", icon: FileCheck },
  { href: "/teacher/resources", label: "Resources", icon: BookOpen },
  { href: "/teacher/profile", label: "Profile", icon: User },
];

export function TeacherSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-border hover:bg-secondary"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {isMobileOpen ? (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileOpen(false)} />
      ) : null}

      <Sidebar
        className={`border-r border-border bg-sidebar animate-slide-in-left ${
          isMobileOpen ? "fixed left-0 top-0 h-screen z-40 w-64" : "hidden md:flex"
        }`}
      >
        <SidebarHeader className="border-b border-border py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-glow">
              <span className="text-primary font-bold text-lg">T</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base text-sidebar-foreground truncate tracking-tight">Teacher</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-6">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {items.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem
                      key={item.href}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`transition-all duration-300 rounded-xl px-4 py-6 ${
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold shadow-sm overflow-hidden relative after:content-[""] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-primary'
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <Icon
                            className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                              isActive ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
