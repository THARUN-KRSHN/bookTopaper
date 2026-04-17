"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { AppTopBar } from "@/components/shared/AppTopBar";
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
    <div className="min-h-screen bg-bg-base flex">
      <AppSidebar />
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarOpen ? "pl-[264px]" : "pl-16"
        )}
      >
        <AppTopBar />
        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
