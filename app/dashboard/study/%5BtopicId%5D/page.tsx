"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronLeft,
  Zap,
  Brain,
  MessageSquare
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";
import { dummyTopics } from "@/lib/dummy/materials";
import { dummyFlashcards } from "@/lib/dummy/study";
import { cn } from "@/lib/utils";

export default function StudySessionPage({ params }: { params: { topicId: string } }) {
  const [phase, setPhase] = useState<"learn" | "recall" | "test">("learn");
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const topic = dummyTopics[0];
  const cards = dummyFlashcards;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Phase Navbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-styrene font-semibold mb-2">{topic.name}</h1>
          <p className="text-text-secondary">Phase {phase === 'learn' ? '1' : phase === 'recall' ? '2' : '3'} of 3</p>
        </div>
        
        <div className="flex bg-bg-raised p-1 rounded-2xl shadow-sm border border-border/50">
           <PhaseTab phase="learn" active={phase} onClick={setPhase} icon={BookOpen} label="Learn" />
           <PhaseTab phase="recall" active={phase} onClick={setPhase} icon={RotateCcw} label="Recall" />
           <PhaseTab phase="test" active={phase} onClick={setPhase} icon={Zap} label="Test" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "learn" && (
          <motion.div 
            key="learn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-3 gap-10"
          >
             <div className="lg:col-span-2 space-y-8">
                <Card className="p-8 space-y-6">
                   <h2 className="text-2xl font-styrene font-bold">Topic Overview</h2>
                   <div className="prose prose-slate max-w-none text-text-secondary leading-relaxed space-y-4 font-sohne">
                      <p>The Data Link Layer is the second layer in the OSI model, responsible for node-to-node communication. It ensures that data is transferred error-free across the physical layer.</p>
                      <p>Key responsibilities include <strong>Framing</strong>, <strong>Error Control</strong>, and <strong>Flow Control</strong>. Framing involves packaging raw bits from the physical layer into data units called frames.</p>
                   </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                   <Card className="p-6 border-l-4 border-accent-primary space-y-3">
                      <h3 className="font-bold text-sm">Key Term: Framing</h3>
                      <p className="text-sm text-text-secondary">The process of dividing a stream of bits into manageable blocks of data.</p>
                   </Card>
                   <Card className="p-6 border-l-4 border-accent-warm space-y-3">
                      <h3 className="font-bold text-sm">Error Detection</h3>
                      <p className="text-sm text-text-secondary">Using techniques like CRC and Checksums to identify transmission errors.</p>
                   </Card>
                </div>
             </div>
             
             <div className="space-y-6">
                <Card className="p-8 bg-accent-primary/5 border-none">
                   <h3 className="font-styrene font-bold text-lg mb-4">Study Progress</h3>
                   <div className="space-y-4">
                      <div className="h-2 bg-bg-raised rounded-full overflow-hidden">
                        <div className="h-full bg-accent-primary w-1/3" />
                      </div>
                      <p className="text-xs text-text-secondary">You've covered <span className="font-bold text-text-primary">4 of 12</span> concepts suggested for this topic.</p>
                      <Button onClick={() => setPhase("recall")} className="w-full h-11 shadow-lg mt-4">Move to Recall →</Button>
                   </div>
                </Card>
             </div>
          </motion.div>
        )}

        {phase === "recall" && (
          <motion.div 
            key="recall"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center gap-12 py-12"
          >
             <div className="w-full max-w-2xl text-center space-y-2">
                <h2 className="text-2xl font-styrene font-bold">Active Recall</h2>
                <p className="text-text-secondary">Test your knowledge with flashcards. Click to flip.</p>
             </div>

             <div className="w-full max-w-lg aspect-[4/3] perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                <motion.div 
                  className={cn(
                    "relative w-full h-full transition-all duration-500 transform-style-3d",
                    isFlipped && "rotate-y-180"
                  )}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* Front */}
                  <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center p-12 border-2 border-border shadow-2xl">
                    <span className="absolute top-6 left-6 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Question</span>
                    <h3 className="text-2xl font-medium leading-relaxed">{cards[currentCardIdx].question}</h3>
                    <div className="absolute bottom-8 text-xs text-text-secondary/50 font-medium">Click to reveal answer</div>
                  </Card>
                  
                  {/* Back */}
                  <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center p-12 border-2 border-accent-primary shadow-2xl rotate-y-180 bg-bg-surface">
                    <span className="absolute top-6 left-6 text-[10px] font-bold text-accent-primary uppercase tracking-widest">Answer</span>
                    <p className="text-xl leading-relaxed text-text-primary">{cards[currentCardIdx].answer}</p>
                    <div className="absolute bottom-8 flex gap-4">
                       <Button variant="ghost" className="h-9 px-4 text-xs border-red-500/20 text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); setPhase("recall"); }}>Missed ✗</Button>
                       <Button className="h-9 px-4 text-xs bg-green-500 hover:bg-green-600 border-none shadow-md" onClick={(e) => { e.stopPropagation(); setPhase("recall"); }}>Got it ✓</Button>
                    </div>
                  </Card>
                </motion.div>
             </div>

             <div className="flex items-center gap-8">
                <Button variant="ghost" className="p-3 rounded-full h-12 w-12 border-border shadow-sm">
                   <ChevronLeft size={24} />
                </Button>
                <div className="text-sm font-berkeley font-bold text-text-secondary tabular-nums">
                   Card {currentCardIdx + 1} of {cards.length}
                </div>
                <Button variant="ghost" className="p-3 rounded-full h-12 w-12 border-border shadow-sm">
                   <ChevronRight size={24} />
                </Button>
             </div>
          </motion.div>
        )}

        {phase === "test" && (
           <motion.div 
             key="test"
             initial={{ opacity: 0, x: 40 }}
             animate={{ opacity: 1, x: 0 }}
             className="max-w-4xl mx-auto w-full space-y-12"
           >
              <div className="text-center space-y-4">
                 <div className="w-16 h-16 rounded-2xl bg-accent-warm/10 flex items-center justify-center text-accent-warm mx-auto mb-4">
                   <Zap size={32} />
                 </div>
                 <h2 className="text-3xl font-styrene font-bold">Quick Assessment</h2>
                 <p className="text-text-secondary">5 short questions to verify your learning.</p>
              </div>

              <div className="space-y-6">
                 {[1, 2, 3].map((q) => (
                   <Card key={q} className="p-8 space-y-6 hover:border-accent-primary/20 transition-colors">
                      <div className="flex items-center gap-3">
                         <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Question {q}</span>
                         <Badge variant="default">Multiple Choice</Badge>
                      </div>
                      <p className="text-lg font-medium">Which sublayer of DLL handles media access control?</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                         {["MAC sublayer", "LLC sublayer", "Physical sublayer", "Data sublayer"].map((opt) => (
                           <button key={opt} className="p-4 rounded-xl border border-border text-left text-sm hover:border-accent-primary hover:bg-bg-raised transition-all font-medium">
                             {opt}
                           </button>
                         ))}
                      </div>
                   </Card>
                 ))}
              </div>

              <div className="flex justify-center pt-8">
                 <Button className="h-14 px-12 text-lg shadow-xl">Complete Session</Button>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PhaseTab({ phase, active, onClick, icon: Icon, label }: any) {
  const isActive = active === phase;
  return (
    <button 
      onClick={() => onClick(phase)}
      className={cn(
        "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition-all",
        isActive ? "bg-white shadow-md text-accent-primary" : "text-text-secondary hover:text-text-primary"
      )}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}
