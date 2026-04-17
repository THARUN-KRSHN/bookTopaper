"use client";

import { 
  Files, 
  FileText, 
  Activity, 
  Target, 
  Plus, 
  Zap, 
  Brain, 
  Clock 
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { dummyMaterials } from "@/lib/dummy/materials";
import { dummyPapers } from "@/lib/dummy/papers";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardHome() {
  const stats = [
    { label: "Materials uploaded", value: dummyMaterials.length, icon: Files, color: "text-blue-500" },
    { label: "Papers generated", value: dummyPapers.length, icon: FileText, color: "text-accent-primary" },
    { label: "Exams taken", value: 4, icon: Clock, color: "text-amber-500" },
    { label: "Average score", value: "68%", icon: Target, color: "text-green-500" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-styrene font-semibold mb-2">Welcome back, Alexander</h1>
          <p className="text-text-secondary">Track your progress and pick up where you left off.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-11 shadow-sm px-5">View Analytics</Button>
          <Button className="h-11 shadow-lg px-5 flex items-center gap-2">
            <Plus size={18} />
            New Session
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6 flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className={cn("p-2.5 rounded-xl bg-bg-raised group-hover:bg-white transition-colors", stat.color)}>
                <stat.icon size={20} />
              </div>
              <Activity size={16} className="text-text-secondary/30" />
            </div>
            <div>
              <p className="text-[32px] font-styrene font-bold tabular-nums">{stat.value}</p>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-widest">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions & Activity */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-styrene font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/dashboard/materials">
                <ActionCard 
                  icon={Plus} 
                  title="Upload Material" 
                  desc="Add PDFs, images or typed notes"
                  variant="primary"
                />
              </Link>
              <Link href="/dashboard/papers">
                <ActionCard 
                  icon={Zap} 
                  title="Generate Paper" 
                  desc="AI creates a custom exam paper"
                />
              </Link>
              <Link href="/dashboard/exam">
                <ActionCard 
                  icon={Clock} 
                  title="Start Exam" 
                  desc="Simulate a real-world test"
                />
              </Link>
              <Link href="/dashboard/study">
                <ActionCard 
                  icon={Brain} 
                  title="Study Session" 
                  desc="Flashcards and active recall"
                />
              </Link>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-styrene font-semibold">Recent Activity</h2>
              <Button variant="ghost" className="text-xs px-3 h-8">View All</Button>
            </div>
            <Card className="divide-y divide-border p-0 overflow-hidden">
              <ActivityItem 
                title="Generated a KTU paper" 
                detail="From Module 3 notes · Computer Networks"
                time="2 hours ago"
              />
              <ActivityItem 
                title="Scored 72/100 on Exam" 
                detail="Network Security Midterm Practice"
                time="Yesterday"
              />
              <ActivityItem 
                title="Completed Study Session" 
                detail="Data Link Layer · 12 cards reviewed"
                time="2 days ago"
              />
            </Card>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-styrene font-semibold mb-6">Study Streak</h2>
            <Card className="p-6 bg-gradient-to-br from-accent-primary to-accent-primary/80 text-white relative overflow-hidden">
               <div className="relative z-10 flex flex-col items-center text-center">
                 <div className="text-6xl font-berkeley font-bold mb-2">5</div>
                 <p className="text-sm font-medium opacity-90 mb-4 uppercase tracking-widest">Day Streak</p>
                 <div className="flex gap-1">
                   {[1, 1, 1, 1, 1, 0, 0].map((v, i) => (
                     <div key={i} className={cn("w-6 h-6 rounded-md", v ? "bg-white/30" : "bg-white/10")} />
                   ))}
                 </div>
               </div>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-styrene font-semibold mb-6">Revision Planner</h2>
            <Card className="p-0 overflow-hidden">
              <div className="bg-bg-raised p-4 border-b border-border">
                <p className="text-sm font-semibold">Today's Focus</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-warm/10 flex items-center justify-center text-accent-warm shrink-0">
                    <Brain size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">Data Structures — Trees</p>
                    <p className="text-xs text-text-secondary mb-3">12 subtopics · 45 mins</p>
                    <div className="h-1.5 bg-bg-raised rounded-full overflow-hidden">
                      <div className="h-full bg-accent-warm w-2/3" />
                    </div>
                  </div>
                </div>
                <Link href="/dashboard/study">
                  <Button className="w-full bg-accent-warm hover:bg-accent-warm/90 border-none shadow-md">
                    Start Session
                  </Button>
                </Link>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, desc, variant = "default" }: any) {
  return (
    <button className={cn(
      "p-5 rounded-2xl border flex items-start gap-4 text-left transition-all hover:shadow-lg active:scale-98 group",
      variant === "primary" ? "bg-accent-primary/5 border-accent-primary/20" : "bg-bg-surface border-border hover:border-accent-primary/30"
    )}>
       <div className={cn(
         "p-2.5 rounded-xl transition-colors",
         variant === "primary" ? "bg-accent-primary text-white" : "bg-bg-raised group-hover:bg-accent-primary group-hover:text-white"
       )}>
         <Icon size={20} />
       </div>
       <div>
         <p className="font-bold text-sm mb-1">{title}</p>
         <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
       </div>
    </button>
  );
}

function ActivityItem({ title, detail, time }: any) {
  return (
    <div className="p-4 flex items-center justify-between gap-4">
      <div className="flex gap-3 min-w-0">
        <div className="w-2 h-2 rounded-full bg-accent-primary mt-1.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{title}</p>
          <p className="text-xs text-text-secondary truncate">{detail}</p>
        </div>
      </div>
      <span className="text-[10px] font-bold text-text-secondary/50 uppercase whitespace-nowrap">{time}</span>
    </div>
  );
}

