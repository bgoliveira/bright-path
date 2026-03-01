"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  FileText,
  Settings,
  Users,
  LogOut,
  Sparkles,
  UserPlus,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface UserInfo {
  fullName: string;
  email: string;
  avatarUrl?: string | null;
}

interface SidebarProps {
  role: "student" | "parent";
  user?: UserInfo;
}

const studentNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/student/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Assignments",
    href: "/student/assignments",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    label: "Progress",
    href: "/student/progress",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: "Report Cards",
    href: "/student/report-cards",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Link Requests",
    href: "/student/link-requests",
    icon: <UserPlus className="w-5 h-5" />,
  },
  {
    label: "Settings",
    href: "/student/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

const parentNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/parent/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Children",
    href: "/parent/children",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Settings",
    href: "/parent/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export function Sidebar({ role, user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navItems = role === "student" ? studentNavItems : parentNavItems;

  const displayName = user?.fullName || "User";
  const displayEmail = user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-secondary-100 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-secondary-900">
            BrightPath
          </span>
        </Link>
      </div>

      {/* Role Badge */}
      <div className="px-6 mb-4">
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
          role === "student"
            ? "bg-primary-50 text-primary-700"
            : "bg-violet-50 text-violet-700"
        )}>
          {role === "student" ? (
            <>
              <BookOpen className="w-3.5 h-3.5" />
              Student View
            </>
          ) : (
            <>
              <Users className="w-3.5 h-3.5" />
              Parent View
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                      : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                  )}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-secondary-100">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-full flex items-center justify-center">
              <span className="text-secondary-600 font-semibold">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-secondary-900 truncate">{displayName}</p>
            <p className="text-xs text-secondary-500 truncate">{displayEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-secondary-500 hover:bg-red-50 hover:text-red-600 w-full transition-all duration-200 disabled:opacity-50"
        >
          <LogOut className={cn("w-4 h-4", isLoggingOut && "animate-spin")} />
          <span className="text-sm font-medium">
            {isLoggingOut ? "Logging out..." : "Log out"}
          </span>
        </button>
      </div>
    </aside>
  );
}
