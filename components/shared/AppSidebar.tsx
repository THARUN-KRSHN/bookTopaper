"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Files,
  FileText,
  Clock,
  BadgeCheck,
  Brain,
  Target,
  Calendar,
  Settings,
  HelpCircle,
  Plus,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore, useAuthStore } from "@/lib/store";
import { auth } from "@/lib/api";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const navigation = {
  main: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Materials", href: "/dashboard/materials", icon: Files },
    { name: "Question Papers", href: "/dashboard/papers", icon: FileText },
    { name: "Exam Mode", href: "/dashboard/exam", icon: Clock },
    { name: "Evaluations", href: "/dashboard/evaluations", icon: BadgeCheck },
  ],
  study: [
    { name: "Study Sessions", href: "/dashboard/study", icon: Brain },
    { name: "Weak Areas", href: "/dashboard/weak-areas", icon: Target },
    { name: "Revision Planner", href: "/dashboard/planner", icon: Calendar },
  ],
  utility: [
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
  ],
};

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try { await auth.logout(); } catch {}
    clearAuth();
    toast.success("Logged out successfully.");
    router.push("/");
  };

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || "?";

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-bg-raised border-r border-border transition-all duration-300 z-50 flex flex-col",
        sidebarOpen ? "w-[264px]" : "w-16"
      )}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center text-white">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-5 h-5 object-contain"
            />
          </div>

          {sidebarOpen && (
            <span className="font-styrene font-semibold text-lg text-accent-primary">
              BookToPaper
            </span>
          )}
        </Link>
      </div>

      {/* New Paper CTA */}
      <div className="px-3 py-4">
        <Link href="/dashboard/papers">
          <Button
            className={cn(
              "w-full h-11 flex items-center justify-center gap-2 transition-all",
              !sidebarOpen && "px-0"
            )}
          >
            <Plus size={20} />
            {sidebarOpen && <span>New Paper</span>}
          </Button>
        </Link>
      </div>

      {/* Nav Sections */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6">
        <NavSection title="Main" items={navigation.main} pathname={pathname} expanded={sidebarOpen} />
        <NavSection title="Study" items={navigation.study} pathname={pathname} expanded={sidebarOpen} />
        <NavSection title="Utility" items={navigation.utility} pathname={pathname} expanded={sidebarOpen} />
      </div>

      {/* Footer / User */}
      <div className="p-3 border-t border-border mt-auto">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-xl transition-all",
          sidebarOpen ? "bg-accent-primary/5" : "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-accent-warm/20 flex items-center justify-center text-accent-warm font-semibold text-sm">
            {initials}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name || "User"}</p>
              <p className="text-xs text-text-secondary truncate">{user?.email || ""}</p>
            </div>
          )}
          {sidebarOpen && (
            <button onClick={handleLogout}>
              <LogOut size={16} className="text-text-secondary hover:text-accent-primary cursor-pointer" />
            </button>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center text-text-secondary shadow-sm hover:text-accent-primary transition-colors"
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </div>
  );
}

function NavSection({ title, items, pathname, expanded }: any) {
  return (
    <div className="space-y-1">
      {expanded && (
        <p className="px-3 text-[11px] font-semibold text-text-secondary/50 uppercase tracking-wider">
          {title}
        </p>
      )}
      <div className="space-y-0.5">
        {items.map((item: any) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-item",
                isActive && "sidebar-active",
                !expanded && "justify-center px-0"
              )}
            >
              <item.icon size={20} />
              {expanded && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
