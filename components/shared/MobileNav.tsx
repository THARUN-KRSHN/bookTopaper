"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Files, 
  FileText, 
  Clock, 
  BadgeCheck, 
  Plus 
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
  { name: "Dash", href: "/dashboard", icon: LayoutDashboard },
  { name: "Mats", href: "/dashboard/materials", icon: Files },
  { name: "New", href: "/dashboard/papers", icon: Plus, isCenter: true },
  { name: "Exam", href: "/dashboard/exam", icon: Clock },
  { name: "Evals", href: "/dashboard/evaluations", icon: BadgeCheck },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-[400px]">
      <div className="bg-bg-surface/80 dark:bg-bg-base/80 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[28px] p-2 flex items-center justify-between ring-1 ring-black/5">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="w-12 h-12 rounded-2xl bg-accent-primary flex items-center justify-center text-white shadow-lg shadow-accent-primary/30 active:scale-90 transition-all border border-white/20"
              >
                <item.icon size={22} strokeWidth={2.5} />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all active:scale-95",
                isActive ? "text-accent-primary bg-accent-primary/5" : "text-text-secondary opacity-60"
              )}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
