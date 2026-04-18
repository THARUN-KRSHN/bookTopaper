"use client";

import { Bell, Search, Sun, Moon, Menu, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useUIStore, useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { NotificationPanel } from "./NotificationPanel";

export function AppTopBar() {
  const { toggleSidebar, theme, setTheme, notifications } = useUIStore();
  const { user } = useAuthStore();
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const avatarUrl = user?.avatar_url || null;
  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || "?";

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
  };

  return (
    <header className="h-16 border-b border-border bg-bg-surface flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 text-text-secondary hover:text-accent-primary transition-colors active:scale-90"
        >
          <Menu size={22} />
        </button>
        <div className="hidden md:flex items-center gap-2 text-sm text-text-secondary font-medium">
          <Link href="/dashboard" className="hover:text-text-primary cursor-pointer transition-colors">
            Dashboard
          </Link>
        </div>
      </div>

      <div className="flex-1 max-w-xl px-4 md:px-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4 group-focus-within:text-accent-primary transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-bg-raised border border-border rounded-xl py-2 pl-10 pr-4 text-xs md:text-sm outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <Button 
          variant="ghost" 
          className="p-2 h-10 w-10 px-0 rounded-full text-text-secondary relative hover:bg-bg-raised"
          onClick={() => setNotifOpen(true)}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-primary rounded-full border-2 border-bg-surface" />
          )}
        </Button>
        <Button 
          variant="ghost" 
          className="hidden sm:flex p-2 h-10 w-10 px-0 rounded-full text-text-secondary hover:bg-bg-raised"
          onClick={toggleTheme}
          title={`Theme: ${theme}`}
        >
          {theme === "light" ? <Sun size={20} /> : 
           theme === "dark" ? <Moon size={20} /> : 
           <div className="relative">
             <Sun size={20} className="opacity-50" />
             <Moon size={12} className="absolute -bottom-1 -right-1" />
           </div>}
        </Button>
        
        <Link href="/dashboard/settings">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-accent-primary/10 border border-accent-primary/20 overflow-hidden ml-1 md:ml-2 cursor-pointer shadow-sm flex items-center justify-center text-accent-primary text-[10px] md:text-xs font-bold ring-2 ring-transparent hover:ring-accent-primary/30 transition-all active:scale-95">
            {avatarUrl ? (
              <img src={avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
        </Link>
      </div>

      <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </header>
  );
}
