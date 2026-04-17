"use client";

import { motion } from "framer-motion";
import { Target, TrendingDown, Clock, ChevronRight, Zap, RefreshCw, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";
import { dummyWeakAreas } from "@/lib/dummy/study";
import { cn } from "@/lib/utils";

export default function WeakAreasPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-styrene font-semibold mb-2">Weak Areas</h1>
          <p className="text-text-secondary">Based on your last 4 exams, these topics need attention.</p>
        </div>
        <Button className="h-11 shadow-lg gap-2">
          <Zap size={18} />
          Generate Practice Exam
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="p-8 flex flex-col items-center justify-center text-center space-y-4 col-span-1 bg-accent-primary/5 border-none relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
           <div className="text-5xl font-styrene font-bold text-accent-primary">42%</div>
           <div className="space-y-1">
             <p className="font-bold text-sm">Overall Confidence</p>
             <p className="text-xs text-text-secondary">Down 4% from last week</p>
           </div>
           <div className="flex gap-1">
             {[1, 1, 0, 0, 0].map((v, i) => (
               <div key={i} className={cn("w-6 h-1 rounded-full", v ? "bg-accent-primary" : "bg-bg-raised")} />
             ))}
           </div>
        </Card>

        <Card className="lg:col-span-2 p-8 flex items-center justify-between">
           <div className="space-y-4">
              <h3 className="font-styrene font-bold text-lg">Knowledge Gaps</h3>
              <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
                We've identified <span className="text-text-primary font-bold">3 critical topics</span> where your score distribution is uneven. Focusing 2 hours here could improve your overall grade by a full letter.
              </p>
              <Button variant="ghost" className="text-xs h-9 px-4">View Analysis Detail</Button>
           </div>
           <div className="hidden sm:block">
              <TrendingDown size={64} className="text-accent-primary/20" />
           </div>
        </Card>
      </div>

      <section className="space-y-6">
        <h2 className="text-xl font-styrene font-semibold">Prioritized Practice</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyWeakAreas.map((area, idx) => (
            <Card key={idx} className="p-0 overflow-hidden group hover:shadow-xl transition-all">
               <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="warm" className="bg-red-500/10 text-red-600 border-none">{area.averageScore}% Accuracy</Badge>
                     <Target className="text-text-secondary/50 group-hover:text-accent-primary transition-colors" size={20} />
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{area.topicName}</h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest pt-2">
                     <span className="flex items-center gap-1"><Clock size={12} /> {area.lastAttempted}</span>
                     <span>5 Questions Pending</span>
                  </div>
               </div>
               <div className="p-3 bg-bg-raised/50 border-t border-border flex gap-2">
                  <Button className="flex-1 h-9 text-xs shadow-sm">Practice Now</Button>
                  <Button variant="ghost" className="flex-1 h-9 text-xs border-border bg-white shadow-sm">Study Topic</Button>
               </div>
            </Card>
          ))}
          
          {/* Practice Mode Inline Widget */}
          <Card className="lg:col-span-2 p-8 bg-white border-2 border-accent-primary/20 flex flex-col md:flex-row gap-8 items-center border-dashed">
             <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0">
                <RefreshCw size={32} className="animate-spin-slow" />
             </div>
             <div className="flex-1 text-center md:text-left space-y-2">
                <h4 className="font-styrene font-bold text-lg">Next Targeted Question</h4>
                <p className="text-sm text-text-secondary italic">"Explain the difference between Go-Back-N and Selective Repeat ARQ protocols."</p>
             </div>
             <Button className="h-12 px-8 flex items-center gap-2 group shadow-xl">
               Start Practice
               <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
