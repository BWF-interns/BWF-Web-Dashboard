"use client";

import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  User,
  HeartPulse,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const studentMenu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
  { name: "My Courses", icon: BookOpen, path: "/student/courses" },
  { name: "Notice Board", icon: MessageSquare, path: "/student/notice" },
  { name: "Well Being", icon: HeartPulse, path: "/student/wellbeing" },
  { name: "Profile", icon: User, path: "/student/profile" },
];

export default function StudentSidebar({
  closeSidebar,
}: {
  closeSidebar?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="h-full w-full flex flex-col border-r border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Student Portal
          </h1>
          <p className="text-xs text-gray-500">Borderless World Foundation</p>
        </div>

        {/* Close button (mobile only) */}
        <button className="md:hidden" onClick={closeSidebar}>
          <X className="text-black" />
        </button>
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {studentMenu.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
