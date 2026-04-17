"use client";

import { SidebarProvider } from "@/app/warden/Template/components/ui/sidebar";
import { WardenSidebar } from "./components/WardenSidebar";
import { TopNav } from "@/app/warden/Template/components/top-nav";
import AuthGuard from "./components/AuthGuard";

export default function WardenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <WardenSidebar />
        <div className="flex flex-1 flex-col w-full">
          <TopNav />
          <main className="flex-1 bg-background">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
