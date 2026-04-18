"use client";

import { motion } from "framer-motion";
import { Check, FileText, MousePointer2, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const deepDives = [
  {
    id: "smart-ingestion",
    title: "Smart Ingestion",
    description: "Our proprietary AI handles everything from polished PDFs to messy, handwritten chalkboard photos.",
    bullets: ["Text & Math symbol recognition", "Diagram preservation", "Implicit topic extraction"],
    reverse: false,
    component: <SmartIngestionMock />,
  },
  {
    id: "exam-simulator",
    title: "Exam Mode Simulator",
    description: "Simulate the pressure of a real exam with our distraction-free interface and precise timers.",
    bullets: ["Official syllabus mapping", "Timed sessions", "Sectional breakdown"],
    reverse: true,
    component: <ExamSimulatorMock />,
  },
];

export function FeatureDeepDive() {
  const scrollToHow = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="features" className="py-24 bg-bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-32">
          {deepDives.map((dive, idx) => (
            <div 
              key={idx} 
              className={cn(
                "flex flex-col lg:flex-row lg:items-center gap-16 lg:gap-24",
                dive.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
              )}
            >
              {/* Text Side */}
              <motion.div 
                initial={{ opacity: 0, x: dive.reverse ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 space-y-8"
              >
                <h3 className="text-3xl md:text-5xl font-styrene font-semibold leading-tight">
                  {dive.title}
                </h3>
                <p className="text-lg text-text-secondary leading-relaxed max-w-lg">
                  {dive.description}
                </p>
                <div className="space-y-4">
                  {dive.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium text-text-primary">{bullet}</span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="mt-4" onClick={scrollToHow}>
                  Learn more →
                </Button>
              </motion.div>

              {/* Image Side - Mock UI */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 relative"
              >
                <div className="aspect-[4/3] rounded-[24px] border border-border bg-bg-raised overflow-hidden shadow-2xl relative p-4 md:p-8">
                   <div className="absolute inset-0 dot-grid opacity-[0.1]" />
                   <div className="w-full h-full rounded-xl border border-border/50 bg-white dark:bg-bg-base shadow-lg overflow-hidden relative">
                     {dive.component}
                   </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SmartIngestionMock() {
  return (
    <div className="w-full h-full p-6 flex flex-col gap-6 font-sohne animate-in fade-in duration-1000">
      <div className="flex items-center justify-between border-b pb-4 border-border">
        <div className="flex items-center gap-2">
          <FileText className="text-accent-primary" size={20} />
          <span className="text-sm font-bold opacity-70">Capture_712.pdf</span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-border" />
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="space-y-4 filter blur-[0.5px]">
          <div className="h-4 bg-bg-raised rounded w-3/4" />
          <div className="h-4 bg-bg-raised rounded w-full" />
          <div className="h-4 bg-bg-raised rounded w-5/6" />
          <div className="h-20 bg-bg-raised/50 rounded-xl w-full border border-dashed border-border flex items-center justify-center">
            <span className="text-xs italic opacity-30 italic">Calculating math symbols...</span>
          </div>
          <div className="h-4 bg-bg-raised rounded w-full" />
        </div>

        {/* AI Overlay Layer */}
        <div className="absolute inset-0 flex flex-col gap-4">
          <div className="h-4 rounded border border-accent-primary/50 bg-accent-primary/5 relative translate-y-[20px] w-3/4">
            <div className="absolute -top-6 -left-2 bg-accent-primary text-[10px] text-white px-2 py-0.5 rounded font-bold uppercase tracking-widest">
              Equation Detected
            </div>
          </div>
          <div className="h-20 rounded-xl border border-accent-warm/50 bg-accent-warm/5 relative translate-y-[32px] w-full">
            <div className="absolute -top-6 -right-2 bg-accent-warm text-[10px] text-white px-2 py-0.5 rounded font-bold uppercase tracking-widest">
              Preserving Diagram
            </div>
          </div>
        </div>

        {/* Floating Mouse Cursor */}
        <motion.div 
          animate={{ x: [0, 100, 50], y: [150, 50, 100] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
          className="absolute z-10"
        >
          <MousePointer2 className="text-accent-primary fill-accent-primary/20" />
        </motion.div>
      </div>
    </div>
  );
}

function ExamSimulatorMock() {
  return (
    <div className="w-full h-full flex flex-col gap-0 font-styrene">
      {/* Top Bar */}
      <div className="bg-text-primary text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-white/10 rounded text-xs font-bold uppercase tracking-widest">Part B</div>
          <span className="text-sm font-medium opacity-80">Question 4/12</span>
        </div>
        <div className="flex items-center gap-2 font-berkeley text-accent-warm">
          <Clock size={16} />
          <span className="text-base font-bold tabular-nums tracking-wider text-xl">45:12</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <h4 className="text-lg font-bold leading-snug">Explain the working principle of a Three-Phase Induction Motor.</h4>
          <p className="text-xs text-text-secondary font-bold uppercase tracking-widest opacity-40 italic">10 Marks • Theory Section</p>
        </div>

        <div className="relative">
          <div className="space-y-4">
            <div className="h-4 bg-bg-raised rounded w-full" />
            <div className="h-4 bg-bg-raised rounded w-full" />
            <div className="h-4 bg-bg-raised rounded w-3/4" />
          </div>
          <div className="absolute -bottom-10 right-0">
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 text-accent-primary font-bold text-sm"
            >
              <CheckCircle2 size={16} />
              Saving Answer...
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="mt-auto border-t border-border p-4 flex justify-between items-center bg-bg-surface">
         <div className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">Simulating KTU V.2024 Pattern</div>
         <div className="flex gap-2">
            <div className="w-8 h-8 rounded border border-border flex items-center justify-center text-xs opacity-50">←</div>
            <div className="px-4 h-8 rounded bg-text-primary text-white flex items-center justify-center text-xs font-bold">Next Question</div>
         </div>
      </div>
    </div>
  );
}

