"use client";

import { Bell, Search, Sun, Moon, Menu } from "lucide-react";
import { useUIStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";

export function AppTopBar() {
  const { toggleSidebar } = useUIStore();

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
          <span className="hover:text-text-primary cursor-pointer transition-colors">Dashboard</span>
          <span className="text-border">/</span>
          <span className="text-text-primary">Overview</span>
        </div>
      </div>

      <div className="flex-1 max-w-xl px-8 hidden sm:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4 group-focus-within:text-accent-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search papers, materials or topics... (⌘K)"
            className="w-full bg-bg-raised border border-border rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" className="p-2 h-10 w-10 px-0 rounded-full text-text-secondary">
          <Bell size={20} />
        </Button>
        <Button variant="ghost" className="p-2 h-10 w-10 px-0 rounded-full text-text-secondary">
          <Sun size={20} className="hidden dark:block" />
          <Moon size={20} className="block dark:hidden" />
        </Button>
        <div className="w-8 h-8 rounded-full bg-accent-primary overflow-hidden ml-2 cursor-pointer shadow-sm">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander" 
            alt="User avatar"
          />
        </div>
      </div>
    </header>
  );
}
