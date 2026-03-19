/**
 * Warden dashboard layout — wraps all warden pages with
 * AuthGuard (redirects to /login if not authenticated) and Sidebar navigation.
 */
import AuthGuard from "@/modules/warden/components/AuthGuard";
import Sidebar from "@/modules/warden/components/Sidebar";

export default function WardenLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </AuthGuard>
  );
}
