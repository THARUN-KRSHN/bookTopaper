"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  RotateCcw, 
  Zap, 
  FileText,
  TrendingUp,
  Brain
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";
import { dummyEvaluations } from "@/lib/dummy/evaluations";
import { cn } from "@/lib/utils";

export default function EvaluationDetailPage({ params }: { params: { evalId: string } }) {
  const evaluation = dummyEvaluations[0]; // Logic for fetching
  const percentage = (evaluation.scoredMarks / evaluation.totalMarks) * 100;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card */}
      <Card className="p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-br from-accent-primary to-accent-primary/80 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-6 text-center md:text-left">
              <div>
                <Badge variant="default" className="bg-white/20 text-white border-none mb-4 px-4 py-1">Exam Completed</Badge>
                <h1 className="text-3xl md:text-5xl font-styrene font-bold leading-tight">
                  {evaluation.paperName}
                </h1>
                <p className="text-white/70 mt-2 font-medium">Evaluated on {evaluation.date}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                 <Button className="bg-white text-accent-primary hover:bg-white/90 shadow-xl gap-2 font-bold px-8">
                   <Zap size={18} /> Practice Weak Areas
                 </Button>
                 <Button variant="ghost" className="border-white/30 text-white hover:bg-white/10 gap-2 font-bold px-8">
                   <RotateCcw size={18} /> Retake Exam
                 </Button>
              </div>
           </div>

           <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Doughnut Chart (Pure CSS/SVG) */}
              <svg className="w-full h-full -rotate-90">
                <circle 
                  cx="96" cy="96" r="80" 
                  fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="16" 
                />
                <motion.circle 
                  initial={{ strokeDasharray: "0 502" }}
                  animate={{ strokeDasharray: `${(4.5 * percentage)} 4.5 502` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="96" cy="96" r="80" 
                  fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round"
                  className="text-white"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-styrene font-bold">{Math.round(percentage)}%</span>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Grade {evaluation.grade}</span>
              </div>
           </div>
        </div>
        
        <div className="bg-white grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
           <MetricItem label="Scored Marks" value={`${evaluation.scoredMarks} / ${evaluation.totalMarks}`} icon={CheckCircle2} color="text-green-500" />
           <MetricItem label="Total Questions" value={evaluation.questions.length} icon={FileText} color="text-accent-primary" />
           <MetricItem label="Avg Response Time" value="2m 14s" icon={TrendingUp} color="text-amber-500" />
           <MetricItem label="Improvement Area" value="Weak" icon={AlertCircle} color="text-red-500" />
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* Questions Breakdown */}
         <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-styrene font-semibold">Per-Question Breakdown</h2>
            <div className="space-y-6">
              {evaluation.questions.map((q, idx) => (
                <Card key={idx} className="p-0 overflow-hidden group border-border/50 hover:border-accent-primary/20 transition-all">
                  <div className="p-6 bg-white space-y-6">
                    <div className="flex items-start justify-between">
                       <div className="flex items-center gap-3">
                         <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Question {idx + 1}</span>
                         <Badge variant={q.marksAwarded / q.maxMarks > 0.7 ? "accent" : "warm"}>
                           {q.marksAwarded} / {q.maxMarks} Marks
                         </Badge>
                       </div>
                       <ChevronDown size={20} className="text-text-secondary/30" />
                    </div>
                    <p className="font-medium text-lg text-text-primary leading-relaxed">{q.questionText}</p>
                    
                    <div className="p-6 bg-bg-raised/50 rounded-2xl border border-border/50 relative">
                       <div className="absolute -top-3 left-4 px-3 bg-bg-raised text-[10px] font-bold uppercase tracking-widest text-text-secondary">Your Answer</div>
                       <p className="text-sm text-text-secondary italic leading-relaxed">{q.userAnswer}</p>
                    </div>

                    <div className="flex gap-4 p-6 bg-accent-primary/5 rounded-2xl border border-accent-primary/10">
                       <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0">
                          <Brain size={20} />
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-accent-primary">AI Feedback</h4>
                          <p className="text-sm leading-relaxed text-text-primary">{q.aiFeedback}</p>
                       </div>
                    </div>
                  </div>
                  <div className="p-4 bg-bg-raised/30 border-t border-border flex items-center justify-between">
                     <button className="text-[11px] font-bold uppercase tracking-widest text-text-secondary hover:text-accent-primary transition-colors">Show Correct Hint</button>
                     <Button variant="ghost" className="h-8 px-4 text-[10px] gap-1.5 uppercase tracking-widest font-bold">Similar Question</Button>
                  </div>
                </Card>
              ))}
            </div>
         </div>

         {/* Topic Performance */}
         <div className="space-y-8">
            <h2 className="text-2xl font-styrene font-semibold">Topic Performance</h2>
            <Card className="p-6 space-y-8">
               {evaluation.topicPerformance.map((topic, idx) => (
                 <div key={idx} className="space-y-3">
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-bold text-text-primary">{topic.topic}</span>
                       <span className="text-xs font-berkeley font-bold text-text-secondary">{topic.score}/{topic.max}</span>
                    </div>
                    <div className="h-2 bg-bg-raised rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: `${(topic.score / topic.max) * 100}%` }}
                         viewport={{ once: true }}
                         transition={{ duration: 1, ease: "easeOut" }}
                         className={cn(
                           "h-full rounded-full",
                           (topic.score / topic.max) > 0.7 ? "bg-green-500" : (topic.score / topic.max) > 0.4 ? "bg-accent-primary" : "bg-red-500"
                         )}
                       />
                    </div>
                 </div>
               ))}
               <div className="pt-6 border-t border-border">
                  <p className="text-xs text-text-secondary leading-relaxed mb-4">
                    Your performance in <span className="font-bold text-text-primary">Physical Layer</span> is currently below target. We recommend a targeted study session.
                  </p>
                  <Button className="w-full shadow-lg">Generate Study session</Button>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}

function MetricItem({ label, value, icon: Icon, color }: any) {
  return (
    <div className="p-6 flex flex-col gap-2">
       <div className="flex items-center gap-2 text-text-secondary">
          <Icon size={14} className={color} />
          <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
       </div>
       <p className="text-xl font-styrene font-bold text-text-primary">{value}</p>
    </div>
  );
}
