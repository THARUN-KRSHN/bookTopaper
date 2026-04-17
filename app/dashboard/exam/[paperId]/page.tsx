"use client";

import { useState, useEffect } from "react";
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  CheckCircle2, 
  AlertCircle,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Card";
import { dummyPapers } from "@/lib/dummy/papers";
import { cn } from "@/lib/utils";

export default function ExamPage({ params }: { params: { paperId: string } }) {
  const paper = dummyPapers[0]; // Logic for fetching by param
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(paper.duration * 60);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const questions = paper.sections.flatMap(s => s.questions);
  const currentQ = questions[currentQIdx];

  return (
    <div className="fixed inset-0 bg-bg-base z-[100] flex flex-col font-sohne">
      {/* Header Strip */}
      <header className="h-[64px] border-b border-border bg-white flex items-center justify-between px-6 shrink-0 relative z-10">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center text-white">
             <Clock size={20} />
           </div>
           <div>
             <h2 className="text-sm font-bold text-text-primary truncate max-w-[200px]">{paper.name}</h2>
             <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">In Progress</p>
           </div>
        </div>

        <div className={cn(
          "flex items-center gap-2 px-6 py-2 rounded-2xl border transition-all duration-500",
          timeLeft < 300 ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-bg-raised border-border text-text-primary"
        )}>
          <span className="font-berkeley text-xl font-bold tabular-nums">{formatTime(timeLeft)}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-4">
             <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Progress</span>
             <span className="text-sm font-bold font-berkeley">{Math.round((Object.keys(answers).length / questions.length) * 100)}%</span>
          </div>
          <Button variant="ghost" className="h-10 px-6 border-red-500/20 text-red-500 hover:bg-red-500/5">Submit & Exit</Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigator Sidebar */}
        <aside className={cn(
          "bg-bg-raised border-r border-border transition-all duration-300 flex flex-col pt-6 overflow-hidden",
          sidebarOpen ? "w-[280px]" : "w-0 border-none"
        )}>
          <div className="px-6 mb-8 flex items-center justify-between">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Navigate</h3>
            <Badge variant="default">{questions.length} Questions</Badge>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => (
                <button 
                  key={q.id}
                  onClick={() => setCurrentQIdx(idx)}
                  className={cn(
                    "w-full aspect-square rounded-lg flex items-center justify-center text-xs font-berkeley font-bold transition-all border",
                    currentQIdx === idx ? "bg-accent-primary text-white border-accent-primary shadow-lg shadow-accent-primary/20 scale-105" : 
                    answers[q.id] ? "bg-green-500/10 text-green-600 border-green-500/30" :
                    flagged[q.id] ? "bg-amber-500/10 text-amber-600 border-amber-500/30" :
                    "bg-white border-border text-text-secondary hover:border-accent-primary/50"
                  )}
                >
                  {q.number}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-border space-y-3">
             <LegendItem color="bg-green-500" label="Answered" />
             <LegendItem color="bg-amber-500" label="Marked for Review" />
             <LegendItem color="bg-white border-border" label="Unattempted" />
          </div>
        </aside>

        {/* Floating Sidebar Toggle */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-1 bg-white border border-border rounded-r-lg shadow-md text-text-secondary hover:text-accent-primary"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white flex justify-center py-12 px-6 relative">
          <div className="w-full max-w-3xl space-y-12">
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <span className="w-12 h-12 rounded-2xl bg-bg-raised flex items-center justify-center font-berkeley font-bold text-lg border border-border">
                       {currentQ.number}
                     </span>
                     <Badge variant="default" className="text-[10px] font-bold py-1 px-3">
                       {currentQ.marks} Marks
                     </Badge>
                   </div>
                   <button 
                    onClick={() => setFlagged(f => ({ ...f, [currentQ.id]: !f[currentQ.id] }))}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all",
                      flagged[currentQ.id] ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-bg-raised border-border text-text-secondary hover:bg-white hover:border-accent-primary/50"
                    )}
                   >
                     <Flag size={14} className={flagged[currentQ.id] ? "fill-current" : ""} />
                     {flagged[currentQ.id] ? "Flagged for Review" : "Flag for Review"}
                   </button>
                </div>
                
                <p className="text-xl md:text-2xl font-medium leading-relaxed text-text-primary">
                  {currentQ.text}
                </p>
             </div>

             <div className="space-y-4">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Your Answer</label>
                <textarea 
                   value={answers[currentQ.id] || ""}
                   onChange={(e) => setAnswers(a => ({ ...a, [currentQ.id]: e.target.value }))}
                   placeholder="Type your answer here..."
                   className="w-full min-h-[300px] bg-bg-raised/30 border-2 border-border/50 rounded-2xl p-6 text-lg outline-none focus:border-accent-primary focus:bg-white transition-all resize-y"
                />
             </div>

             <div className="flex items-center justify-between pt-8 border-t border-border">
                <Button 
                   variant="ghost" 
                   disabled={currentQIdx === 0}
                   onClick={() => setCurrentQIdx(prev => prev - 1)}
                   className="h-12 px-6 gap-2"
                >
                  <ChevronLeft size={20} /> Previous
                </Button>
                <Button 
                   onClick={() => currentQIdx < questions.length - 1 ? setCurrentQIdx(prev => prev + 1) : null}
                   className="h-12 px-10 gap-2 text-lg shadow-xl"
                >
                  {currentQIdx === questions.length - 1 ? "Finish Exam" : "Next Question"}
                  {currentQIdx < questions.length - 1 && <ChevronRight size={20} />}
                </Button>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-3 h-3 rounded-md", color)} />
      <span className="text-[11px] font-medium text-text-secondary">{label}</span>
    </div>
  );
}
