"use client";

import { Bell, Search, Sun, Moon, Menu } from "lucide-react";
import { useUIStore, useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { NotificationPanel } from "./NotificationPanel";
import { cn } from "@/lib/utils";

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
          className="lg:hidden p-2 text-text-secondary hover:text-accent-primary"
        >
          <Menu size={20} />
        </button>
        <div className="hidden md:flex items-center gap-2 text-sm text-text-secondary font-medium">
          <span className="hover:text-text-primary cursor-pointer transition-colors">
            Dashboard
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-xl px-8 hidden sm:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4 group-focus-within:text-accent-primary transition-colors" />
          <input
            type="text"
            placeholder="Search papers, materials or topics… (⌘K)"
            className="w-full bg-bg-raised border border-border rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          className="p-2 h-10 w-10 px-0 rounded-full text-text-secondary relative"
          onClick={() => setNotifOpen(true)}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent-primary rounded-full border-2 border-bg-surface" />
          )}
        </Button>
        <Button 
          variant="ghost" 
          className="p-2 h-10 w-10 px-0 rounded-full text-text-secondary"
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
        <div className="w-8 h-8 rounded-full bg-accent-primary overflow-hidden ml-2 cursor-pointer shadow-sm flex items-center justify-center text-white text-xs font-bold ring-2 ring-bg-surface">
          {avatarUrl ? (
            <img src={avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
      </div>

      <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </header>
  );
}
