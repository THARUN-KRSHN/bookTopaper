"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, Search, Timer, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const states = [
  {
    id: "upload",
    title: "Upload",
    label: "Smart Ingestion",
    description: "PDF card sliding in → processing spinner",
    icon: Upload,
  },
  {
    id: "generate",
    title: "Generate",
    label: "AI Question Generation",
    description: "Rendered mock question paper fading in",
    icon: FileText,
  },
  {
    id: "evaluate",
    title: "Evaluate",
    label: "Automated Evaluation",
    description: "Answer typed char-by-char, score badge counting up",
    icon: BadgeCheck,
  },
];

export function DemoFrame() {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentState((prev) => (prev + 1) % states.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 md:py-24 px-6 bg-bg-base">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-styrene font-semibold mb-4 md:mb-6 text-text-primary">Experience the magic.</h2>
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {states.map((state, idx) => (
              <button
                key={state.id}
                onClick={() => setCurrentState(idx)}
                className={cn(
                  "px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                  currentState === idx 
                    ? "bg-accent-primary text-white shadow-lg shadow-accent-primary/20 scale-105" 
                    : "bg-bg-raised text-text-secondary hover:bg-bg-surface border border-border"
                )}
              >
                <state.icon size={16} />
                <span className="hidden sm:inline">{state.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Browser Frame */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-b from-border/50 to-transparent rounded-[32px] blur-2xl group-hover:opacity-100 opacity-50 transition-opacity" />
          <div className="relative rounded-[28px] border border-border bg-bg-surface shadow-2xl overflow-hidden min-h-[560px] flex flex-col">
            {/* Header / Chrome */}
            <div className="h-12 border-b border-border bg-bg-raised/50 flex items-center px-4 gap-4">
              <div className="flex gap-1.5 pt-0.5">
                <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-500/30" />
                <div className="w-3 h-3 rounded-full bg-amber-400/20 border border-amber-500/30" />
                <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-500/30" />
              </div>
              <div className="flex-1 max-w-sm mx-auto">
                <div className="h-7 bg-bg-surface border border-border rounded-lg flex items-center justify-center text-[11px] font-medium text-text-secondary">
                  <Search size={10} className="mr-2 opacity-50" />
                  booktopaper.app
                </div>
              </div>
              <div className="w-20" /> {/* Spacer */}
            </div>

            {/* Inner Content with Grid Background */}
            <div className="flex-1 relative overflow-hidden bg-[--bg-surface]">
              <div className="absolute inset-0 dot-grid opacity-[0.05]" />
              
              <AnimatePresence mode="wait">
                  <motion.div
                    key={states[currentState].id}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02, y: -10 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 p-4 md:p-8 flex flex-col items-center justify-center"
                  >
                    {currentState === 0 && <UploadState />}
                    {currentState === 1 && <GenerateState />}
                    {currentState === 2 && <EvaluateState />}
                  </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UploadState() {
  return (
    <div className="w-full max-w-lg space-y-6">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", damping: 15 }}
        className="card flex items-center gap-4 border-2 border-accent-primary p-4 shadow-xl"
      >
        <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
          <FileText size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">notes_data_structures.pdf</span>
            <span className="text-xs text-text-secondary">4.2MB</span>
          </div>
          <motion.div className="h-2 bg-bg-raised rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-accent-primary"
            />
          </motion.div>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2 }}
          className="text-green-500"
        >
          <CheckCircle2 size={24} />
        </motion.div>
      </motion.div>
      
      <div className="flex items-center justify-center gap-3">
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            className="w-2.4 h-2.4 rounded-full bg-accent-primary"
          />
        ))}
        <span className="text-sm font-medium text-text-secondary ml-2">Analysing topics...</span>
      </div>
    </div>
  );
}

function GenerateState() {
  return (
    <div className="w-full max-w-2xl bg-white border border-border rounded-xl shadow-2xl p-4 md:p-8 relative overflow-hidden">
      <div className="h-[320px] md:h-[400px] overflow-hidden">
        <div className="space-y-8 animate-in fade-in duration-1000">
          <div className="text-center border-b border-border pb-6">
            <h3 className="text-xl font-styrene font-bold mb-2">Internal Assessment Exam - March 2024</h3>
            <p className="text-xs font-berkeley text-text-secondary uppercase">Computer Science · Data Structures · Part A</p>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((q) => (
              <motion.div 
                key={q}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: q * 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Question {q}</span>
                  <span className="text-xs font-berkeley bg-bg-raised px-2 py-0.5 rounded">2 Marks</span>
                </div>
                <div className="h-4 bg-bg-raised rounded w-full" />
                <div className="h-4 bg-bg-raised rounded w-3/4" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}

function EvaluateState() {
  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 w-full max-w-xl">
      <div className="card w-full p-4 md:p-8 shadow-xl bg-bg-base flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Timer className="text-text-secondary w-5 h-5" />
            <span className="text-sm font-berkeley font-medium">01:23:45</span>
          </div>
          <div className="text-xs text-text-secondary">Section B · Question 4</div>
        </div>
        
        <div className="space-y-4">
          <p className="font-medium text-lg leading-relaxed">Explain the concept of self-balancing trees with examples.</p>
          <div className="p-4 bg-white border border-border rounded-xl min-h-[140px] relative text-text-secondary text-sm italic">
            Self-balancing binary search trees (BSTs) automatically keep their height small...
            <motion.span 
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-1 h-4 bg-accent-primary ml-1 align-middle"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.5, type: "spring" }}
            className="flex flex-col items-center"
          >
            <div className="text-[48px] font-styrene font-bold text-accent-primary tabular-nums">
              <motion.span>84</motion.span>
              <span className="text-xl text-text-secondary font-normal ml-1">/100</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Grade: A-</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3 }}
            className="flex-1 ml-12 bg-green-500/5 border border-green-500/10 p-3 rounded-xl text-xs text-green-700 leading-relaxed"
          >
            <strong>AI Feedback:</strong> Excellent grasp of AVL and Red-Black trees. Mentioning the rotation operations would have secured full marks in this section.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
