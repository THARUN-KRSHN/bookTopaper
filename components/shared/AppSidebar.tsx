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
import { HelpModal } from "./HelpModal";

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
    { name: "Help", icon: HelpCircle, isAction: true },
  ],
};

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, toggleSidebar, setHelpModalOpen } = useUIStore();
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
    <>
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-bg-raised border-r border-border transition-all duration-300 z-50 flex flex-col",
          sidebarOpen 
            ? "translate-x-0 w-[264px]" 
            : "-translate-x-full md:translate-x-0 md:w-16"
        )}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-4 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}>
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
          <Link href="/dashboard/papers" onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}>
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
          <Link href="/dashboard/settings" onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}>
            <div className={cn(
              "flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-bg-surface",
              sidebarOpen ? "bg-accent-primary/5" : "justify-center"
            )}>
              <div className="w-8 h-8 rounded-full bg-accent-warm/20 flex items-center justify-center text-accent-warm font-semibold text-sm shrink-0">
                {initials}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.full_name || "User"}</p>
                  <p className="text-xs text-text-secondary truncate">{user?.email || ""}</p>
                </div>
              )}
            </div>
          </Link>
          {sidebarOpen && (
            <button 
              onClick={handleLogout}
              className="w-full mt-2 flex items-center gap-2 p-2 px-3 text-xs md:text-sm text-text-secondary hover:text-red-500 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>

        {/* Toggle Button - Only visible on Desktop */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-border rounded-full items-center justify-center text-text-secondary shadow-sm hover:text-accent-primary transition-colors z-[60]"
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        <HelpModal />
      </div>
    </>
  );
}

function NavSection({ title, items, pathname, expanded }: any) {
  const { toggleSidebar } = useUIStore();
  
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
          const { setHelpModalOpen } = useUIStore();

          const handleClick = () => {
            if (window.innerWidth < 768) toggleSidebar();
            if (item.isAction && item.name === "Help") setHelpModalOpen(true);
          };

          if (item.isAction) {
            return (
              <button
                key={item.name}
                onClick={handleClick}
                className={cn(
                  "sidebar-item w-full text-left",
                  !expanded && "justify-center px-0"
                )}
              >
                <item.icon size={20} />
                {expanded && <span>{item.name}</span>}
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleClick}
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
