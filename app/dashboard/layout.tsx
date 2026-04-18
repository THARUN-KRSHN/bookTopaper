"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { AppTopBar } from "@/components/shared/AppTopBar";
import { MobileNav } from "@/components/shared/MobileNav";
import { useUIStore, useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Auth guard — redirect to landing if not authenticated
  useEffect(() => {
    // Wait a tick for initAuth() to hydrate from localStorage
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace("/");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  // Render nothing while redirecting
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-bg-base flex overflow-x-hidden">
      <div className="hidden md:flex flex-col shrink-0">
        <AppSidebar />
      </div>
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 w-full min-w-0",
          sidebarOpen ? "md:pl-[264px]" : "md:pl-16"
        )}
      >
        <AppTopBar />
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full pb-32 md:pb-10">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
