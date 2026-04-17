"use client";

import { useState } from "react";
import { 
  Upload, 
  Files, 
  Grid2X2, 
  List, 
  Search, 
  MoreVertical,
  ChevronRight,
  FileText,
  X
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";
import { dummyMaterials } from "@/lib/dummy/materials";
import { cn } from "@/lib/utils";

export default function MaterialsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-styrene font-semibold mb-2">My Materials</h1>
          <p className="text-text-secondary">Manage your study documents and extract topics.</p>
        </div>
      </div>

      {/* Upload Area */}
      <section>
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-1 bg-accent-primary/5 rounded-[24px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative border-2 border-dashed border-border rounded-3xl p-12 bg-bg-surface hover:bg-bg-raised transition-all flex flex-col items-center text-center gap-4 group-hover:border-accent-primary/50">
            <div className="w-16 h-16 rounded-2xl bg-accent-primary/5 flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <div>
              <p className="text-lg font-bold mb-1">Drop PDFs, images, or handwritten notes here</p>
              <p className="text-sm text-text-secondary">Max 50MB per file · PDF, PNG, JPG supported</p>
            </div>
            <Button className="mt-2 px-8 h-11 shadow-md">Browse files</Button>
          </div>
        </div>
      </section>

      {/* Actions & Filters */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
          <input 
            type="text" 
            placeholder="Filter materials..."
            className="w-full bg-bg-surface border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent-primary transition-all"
          />
        </div>
        <div className="flex bg-bg-raised p-1 rounded-xl">
           <button 
             onClick={() => setView("grid")}
             className={cn("p-2 rounded-lg transition-all", view === "grid" ? "bg-white shadow-sm text-accent-primary" : "text-text-secondary")}
           >
             <Grid2X2 size={18} />
           </button>
           <button 
             onClick={() => setView("list")}
             className={cn("p-2 rounded-lg transition-all", view === "list" ? "bg-white shadow-sm text-accent-primary" : "text-text-secondary")}
           >
             <List size={18} />
           </button>
        </div>
      </section>

      {/* Materials Grid */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyMaterials.map((mat) => (
            <Card key={mat.id} className="p-0 overflow-hidden group hover:shadow-xl transition-all border-none shadow-sm ring-1 ring-border/50">
              {/* Thumbnail Placeholder */}
              <div className="aspect-[4/3] bg-bg-raised relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 dot-grid opacity-[0.2]" />
                 <FileText size={48} className="text-text-secondary/20 group-hover:scale-110 transition-transform duration-500" />
                 <Badge variant="default" className="absolute top-4 right-4 capitalize">
                   {mat.type}
                 </Badge>
              </div>
              <div className="p-5 space-y-4 bg-white">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-sm truncate flex-1">{mat.name}</h3>
                  <button className="text-text-secondary hover:text-accent-primary"><MoreVertical size={16} /></button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="accent">{mat.topicCount} topics found</Badge>
                  <Badge variant="default">{mat.papersGenerated} papers</Badge>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">{mat.uploadDate}</span>
                  <button 
                    onClick={() => setSelectedMaterial(mat)}
                    className="flex items-center gap-1.5 text-xs font-bold text-accent-primary hover:gap-2 transition-all"
                  >
                    View Topics <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden divide-y divide-border">
          {dummyMaterials.map((mat) => (
            <div key={mat.id} className="p-4 flex items-center justify-between hover:bg-bg-raised transition-colors group">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-bg-raised flex items-center justify-center text-text-secondary/50 group-hover:bg-white group-hover:text-accent-primary transition-colors">
                  <FileText size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{mat.name}</p>
                  <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">{mat.uploadDate} · {mat.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <Badge variant="accent" className="hidden sm:inline-flex">{mat.topicCount} topics</Badge>
                 <button 
                   onClick={() => setSelectedMaterial(mat)}
                   className="p-2 text-text-secondary hover:text-accent-primary"
                 >
                   <ChevronRight size={20} />
                 </button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Topics Drawer Overlay */}
      <div className={cn(
        "fixed inset-0 z-[100] flex justify-end transition-opacity duration-300",
        selectedMaterial ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div onClick={() => setSelectedMaterial(null)} className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <div className={cn(
          "relative w-full max-w-md bg-white h-full shadow-2xl transition-transform duration-500 flex flex-col",
          selectedMaterial ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-styrene font-bold text-xl mb-1">Detected Topics</h3>
              <p className="text-xs text-text-secondary truncate max-w-xs">{selectedMaterial?.name}</p>
            </div>
            <button onClick={() => setSelectedMaterial(null)} className="p-2 hover:bg-bg-raised rounded-full"><X size={20}/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {selectedMaterial?.topics?.map((topic: any, idx: number) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">{topic.name}</h4>
                  <Badge variant={topic.difficulty === 'Hard' ? 'warm' : 'accent'} className="text-[10px]">
                    {topic.difficulty}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topic.subtopics.map((sub: string, sIdx: number) => (
                    <span key={sIdx} className="px-2 py-1 bg-bg-raised rounded-md text-xs text-text-secondary">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-border shrink-0">
            <Button className="w-full h-12 text-lg">Generate paper from this material</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
