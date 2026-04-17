"use client";

import { AppSidebar } from "@/components/shared/AppSidebar";
import { AppTopBar } from "@/components/shared/AppTopBar";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useUIStore();

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
