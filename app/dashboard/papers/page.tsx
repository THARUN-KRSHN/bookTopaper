"use client";

import { useState } from "react";
import { 
  FileText, 
  Plus, 
  Download, 
  Play, 
  RotateCcw, 
  Edit3,
  Search,
  ChevronDown,
  ChevronUp,
  Settings2
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";
import { dummyPapers } from "@/lib/dummy/papers";
import { dummyMaterials } from "@/lib/dummy/materials";
import { cn } from "@/lib/utils";

export default function PapersPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenPanel, setShowGenPanel] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<any>(dummyPapers[0]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-styrene font-semibold mb-2">Question Papers</h1>
          <p className="text-text-secondary">Generate and manage your mock exam papers.</p>
        </div>
        <Button 
          onClick={() => setShowGenPanel(!showGenPanel)}
          className="h-11 shadow-lg flex items-center gap-2"
        >
          {showGenPanel ? <ChevronUp size={18} /> : <Plus size={18} />}
          {showGenPanel ? "Close Generator" : "New Paper"}
        </Button>
      </div>

      {/* Generation Panel */}
      {showGenPanel && (
        <Card className="p-8 bg-white border-2 border-accent-primary/20 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <div className="grid lg:grid-cols-2 gap-12">
             <div className="space-y-6">
               <h3 className="font-styrene font-bold text-xl mb-4">Paper Configuration</h3>
               
               <div className="space-y-2">
                 <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Select Material</label>
                 <select className="w-full bg-bg-raised border border-border rounded-xl px-4 py-3 text-sm focus:border-accent-primary outline-none">
                    {dummyMaterials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Exam Pattern</label>
                 <div className="flex gap-3">
                    {["KTU", "CBSE", "Custom"].map(p => (
                      <button key={p} className="flex-1 py-2.5 rounded-xl border border-border bg-bg-surface hover:border-accent-primary transition-all text-sm font-medium">
                        {p}
                      </button>
                    ))}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Total Marks</label>
                    <input type="number" defaultValue={100} className="w-full bg-bg-raised border border-border rounded-xl px-4 py-3 text-sm" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Duration (min)</label>
                    <input type="number" defaultValue={180} className="w-full bg-bg-raised border border-border rounded-xl px-4 py-3 text-sm" />
                 </div>
               </div>
             </div>

             <div className="space-y-6">
                <h3 className="font-styrene font-bold text-xl mb-4">Difficulty Distribution</h3>
                <div className="space-y-8 py-4">
                   <Slider label="Easy" value={40} color="bg-green-500" />
                   <Slider label="Medium" value={40} color="bg-accent-primary" />
                   <Slider label="Hard" value={20} color="bg-accent-warm" />
                </div>
                <div className="p-4 bg-accent-primary/5 rounded-xl border border-accent-primary/10">
                   <p className="text-xs text-accent-primary font-medium leading-relaxed">
                     Tip: For university exams, a 40/40/20 split is recommended for a balanced assessment.
                   </p>
                </div>
                <Button onClick={handleGenerate} className="w-full h-12 text-lg shadow-xl" disabled={isGenerating}>
                  {isGenerating ? "Processing..." : "Generate Paper →"}
                </Button>
             </div>
          </div>
        </Card>
      )}

      <div className="grid xl:grid-cols-5 gap-10">
        {/* Papers List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-styrene font-semibold">Your Papers</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-3.5 h-3.5" />
              <input type="text" placeholder="Search..." className="bg-bg-raised border-none rounded-lg py-1.5 pl-9 pr-3 text-xs outline-none" />
            </div>
          </div>
          
          <div className="space-y-4">
            {dummyPapers.map((paper) => (
              <Card 
                key={paper.id} 
                onClick={() => setSelectedPaper(paper)}
                className={cn(
                  "p-5 cursor-pointer transition-all hover:shadow-md",
                  selectedPaper.id === paper.id ? "border-accent-primary ring-1 ring-accent-primary shadow-lg" : "border-border shadow-sm"
                )}
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm truncate">{paper.name}</h4>
                      <Badge variant="accent" className="text-[10px]">{paper.format}</Badge>
                    </div>
                    <p className="text-xs text-text-secondary mb-3">Material: {dummyMaterials.find(m => m.id === paper.materialId)?.name}</p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">
                       <span>{paper.totalMarks} Marks</span>
                       <span>{paper.duration} Min</span>
                       <span>{paper.createdAt}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Paper Preview */}
        <div className="xl:col-span-3 space-y-6">
           <div className="flex items-center justify-between">
             <h2 className="text-xl font-styrene font-semibold">Preview</h2>
             <div className="flex items-center gap-2">
                <Button variant="ghost" className="h-9 px-3 text-xs gap-1.5 border-border shadow-sm"><Download size={14}/> PDF</Button>
                <Button variant="ghost" className="h-9 px-3 text-xs gap-1.5 border-border shadow-sm"><Edit3 size={14}/> Edit</Button>
                <Button className="h-9 px-4 text-xs gap-1.5 shadow-md"><Play size={14}/> Start Exam</Button>
             </div>
           </div>

           {isGenerating ? (
             <Card className="min-h-[600px] flex flex-col items-center justify-center gap-6 p-12">
               <div className="w-20 h-20 rounded-2xl bg-bg-raised flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-accent-primary/20 animate-pulse" />
                 <Settings2 size={32} className="text-accent-primary animate-spin-slow" />
               </div>
               <div className="text-center space-y-2">
                 <p className="font-styrene font-bold text-lg">Drafting your questions...</p>
                 <p className="text-sm text-text-secondary">AI is mapping topics from "{dummyMaterials[0].name}"</p>
               </div>
             </Card>
           ) : (
             <Card className="min-h-[800px] bg-white border-border shadow-2xl p-0 overflow-hidden relative group">
                {/* Print watermark/grid */}
                <div className="absolute inset-0 dot-grid opacity-[0.03] pointer-events-none" />
                
                <div className="p-12 space-y-12 relative z-10">
                   {/* Paper Header */}
                   <div className="text-center space-y-4 border-b-2 border-text-primary pb-8">
                      <h3 className="text-2xl font-styrene font-bold uppercase tracking-wider">{selectedPaper.name}</h3>
                      <div className="flex justify-between text-xs font-berkeley font-bold uppercase tracking-widest">
                        <span>Course: Computer Networks</span>
                        <span>Marks: {selectedPaper.totalMarks}</span>
                        <span>Time: {selectedPaper.duration}m</span>
                      </div>
                   </div>

                   {/* Rules */}
                   <div className="text-xs font-medium italic border-b border-border pb-4">
                      {selectedPaper.sections[0].rules}
                   </div>

                   {/* Sections */}
                   {selectedPaper.sections.map((section: any, sIdx: number) => (
                     <div key={sIdx} className="space-y-8">
                       <div className="flex items-center gap-4">
                         <Badge variant="default" className="text-lg px-4 py-1 rounded-none border-l-4 border-accent-primary">{section.name}</Badge>
                         <div className="flex-1 h-px bg-border" />
                       </div>

                       <div className="space-y-8">
                         {section.questions.map((q: any) => (
                           <div key={q.id} className="flex gap-6 items-start">
                             <span className="font-berkeley font-bold text-sm pt-0.5">{q.number}.</span>
                             <div className="flex-1 space-y-3">
                               <p className="text-base font-sohne leading-relaxed">{q.text}</p>
                               <div className="flex justify-end">
                                 <span className="text-[11px] font-berkeley font-bold bg-bg-raised px-2 py-0.5 rounded italic opacity-60">({q.marks} Marks)</span>
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   ))}
                </div>
             </Card>
           )}
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, color }: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] font-bold text-text-secondary uppercase tracking-widest">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-bg-raised rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
