"use client";
// app/student/components/Sidebar.tsx
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, BookOpen, Bell, Settings, HeartPulse, Megaphone } from "lucide-react";
import { useNotices } from "../context/NoticeContext";
import { useProfile } from "../context/ProfileContext";
import { getAvatar } from "../constants/avatars";
import Image from 'next/image';

const NAV_LINKS = [
  { href: "/student/dashboard",   label: "Home",           Icon: Home       },
  { href: "/student/mycourses",   label: "My Courses",     Icon: BookOpen   },
  { href: "/student/noticeboard", label: "Notice Board",   Icon: Megaphone  },
  { href: "/student/wellbeing",   label: "Wellbeing/Help", Icon: HeartPulse },
  { href: "/student/profile",    label: "Profile",       Icon: Settings   },
];

export default function StudentSidebar() {
  const pathname      = usePathname();
  const router        = useRouter();
  const { unreadCount } = useNotices();
  const { avatarId }    = useProfile();
  const av              = getAvatar(avatarId);
  const hasUnread       = unreadCount > 0;

  return (
    <aside className="sidebar">

     <div className="sidebar-logo">
  <div className="logo-icon">
    <Image 
      src="/logo.png"  // Ensure logo.png is in the /public folder
      alt="BWF Logo" 
      width={42} 
      height={42}
      priority
      className="rounded-full" // If you're using Tailwind, otherwise use CSS
    />
  </div>
  <h2 className="text-xl font-bold ml-2">BWF</h2>
</div> 

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_LINKS.map(({ href, label, Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          const isNotice = href.includes("noticeboard");
          return (
            <Link key={href} href={href} className={`nav-item${isActive ? " active" : ""}`}>
              <span className="nav-icon-wrap">
                <Icon size={19} />
                {isNotice && hasUnread && (
                  <span className="nav-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
                )}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: bell + avatar */}
      <div className="sidebar-bottom">
        <button
          className={`sb-bell${hasUnread ? " sb-bell--on" : ""}`}
          onClick={() => router.push("/student/noticeboard")}
          title={hasUnread ? `${unreadCount} unread notices` : "All caught up!"}
        >
          <Bell size={17} />
          {hasUnread && (
            <span className="sb-bell-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
          )}
        </button>

        <button
          className="sb-avatar"
          style={{ background: av.bg }}
          onClick={() => router.push("/student/profile")}
          title="My Profile"
        >
          <span>{av.emoji}</span>
        </button>
      </div>

      <div className="sb-foot-blob" />
    </aside>
  );
}
