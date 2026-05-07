"use client";

import { SidebarProvider } from "@/app/teacher/Template/components/ui/sidebar";
import { TopNav } from "@/app/teacher/Template/components/top-nav";
import AuthGuard from "./components/AuthGuard";
import { TeacherSidebar } from "./components/TeacherSidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <TeacherSidebar />
        <div className="flex flex-1 flex-col w-full">
          <TopNav />
          <main className="flex-1 bg-background">{children}</main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
