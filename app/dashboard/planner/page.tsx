"use client";

import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Brain, Clock, Flame } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function PlannerPage() {
  const days = Array.from({ length: 35 }, (_, i) => i - 4); // Dummy calendar grid
  const today = 17;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-styrene font-semibold mb-2">Revision Planner</h1>
          <p className="text-text-secondary">Smart schedule built around your upcoming exams.</p>
        </div>
        <Button className="h-11 shadow-lg gap-2">
          <Plus size={18} />
          Add Upcoming Exam
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
           {/* Calendar Header */}
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                 <h2 className="text-xl font-styrene font-bold">April 2026</h2>
                 <div className="flex bg-bg-raised p-1 rounded-lg">
                    <button className="p-1 text-text-secondary hover:text-text-primary"><ChevronLeft size={16} /></button>
                    <button className="p-1 text-text-secondary hover:text-text-primary"><ChevronRight size={16} /></button>
                 </div>
              </div>
              <div className="flex items-center gap-6">
                <LegendItem color="bg-accent-primary" label="Exams" />
                <LegendItem color="bg-accent-warm" label="Study" />
              </div>
           </div>

           {/* Calendar Grid */}
           <Card className="p-0 overflow-hidden shadow-xl border-none ring-1 ring-border">
              <div className="grid grid-cols-7 border-b border-border bg-bg-raised/50">
                 {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                   <div key={d} className="py-3 text-center text-[10px] font-bold text-text-secondary uppercase tracking-widest">{d}</div>
                 ))}
              </div>
              <div className="grid grid-cols-7">
                 {days.map((d, idx) => (
                   <div 
                     key={idx} 
                     className={cn(
                       "min-h-[120px] p-2 border-r border-b border-border transition-colors hover:bg-bg-raised/30 relative group",
                       d === today && "bg-accent-primary/5",
                       (idx + 1) % 7 === 0 && "border-r-0"
                     )}
                   >
                      <span className={cn(
                        "text-xs font-berkeley font-bold",
                        d === today ? "text-accent-primary bg-accent-primary/10 w-6 h-6 rounded-full flex items-center justify-center -ml-1 -mt-1" : "text-text-secondary/50",
                        d < 1 && "opacity-20"
                      )}>
                        {d > 0 ? d : d + 31}
                      </span>
                      
                      {d === 18 && (
                        <div className="mt-2 space-y-1">
                          <div className="bg-accent-primary/10 border-l-2 border-accent-primary px-1.5 py-1 rounded text-[10px] font-bold text-accent-primary truncate">CN Exam</div>
                        </div>
                      )}

                      {d === 17 && (
                        <div className="mt-2 space-y-1">
                          <div className="bg-accent-warm/10 border-l-2 border-accent-warm px-1.5 py-1 rounded text-[10px] font-bold text-accent-warm truncate">Trees • 2h</div>
                        </div>
                      )}

                      <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-md bg-white border border-border text-text-secondary transition-opacity">
                        <Plus size={12} />
                      </button>
                   </div>
                 ))}
              </div>
           </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
           <section>
              <h2 className="text-lg font-styrene font-semibold mb-4">Today's Goals</h2>
              <Card className="p-6 space-y-6">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent-warm/10 flex items-center justify-center text-accent-warm shrink-0 italic">B</div>
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold truncate">Binary Search Trees</p>
                       <p className="text-xs text-text-secondary">Theory + 5 Practice Qs</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 italic">F</div>
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold truncate">Framing Methods</p>
                       <p className="text-xs text-text-secondary">Flashcards (12 cards)</p>
                    </div>
                 </div>
                 <Button className="w-full h-11 bg-accent-warm hover:bg-accent-warm/90 border-none shadow-md">Start Session</Button>
              </Card>
           </section>

           <section>
              <h2 className="text-lg font-styrene font-semibold mb-4">Study Streak</h2>
              <Card className="p-6 flex flex-col items-center gap-4">
                 <div className="flex items-center gap-2 text-accent-primary">
                    <Flame size={32} className="fill-current" />
                    <span className="text-4xl font-styrene font-bold">5</span>
                 </div>
                 <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest text-center">Your longest streak yet!</p>
                 <div className="grid grid-cols-7 gap-1 w-full">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div key={i} className={cn("aspect-square rounded-[2px]", i < 18 ? "bg-accent-primary" : "bg-bg-raised")} />
                    ))}
                 </div>
              </Card>
           </section>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
       <div className={cn("w-2 h-2 rounded-full", color)} />
       {label}
    </div>
  );
}
