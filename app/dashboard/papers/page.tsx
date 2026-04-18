"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText, Plus, Download, Play, RotateCcw, Search,
  ChevronUp, Settings2, Trash2, Loader2
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";
import { cn, formatDate } from "@/lib/utils";
import { useUIStore } from "@/lib/store";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { materials as materialsApi, papers as papersApi, exams as examsApi, type Material, type Paper } from "@/lib/api";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export default function PapersPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenPanel, setShowGenPanel] = useState(false);
  const [paperList, setPaperList] = useState<Paper[]>([]);
  const [materialList, setMaterialList] = useState<Material[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; paper: Paper | null }>({
    isOpen: false,
    paper: null,
  });
  
  const { addNotification } = useUIStore();

  // Generation form state
  const [config, setConfig] = useState({
    material_ids: [] as string[],
    format: "ktu",
    title: "Question Paper",
    total_marks: 100,
    duration_mins: 180,
    difficulty: { easy: 30, medium: 50, hard: 20 },
  });

  const fetchData = useCallback(async () => {
    try {
      const [p, m] = await Promise.all([papersApi.list(), materialsApi.list()]);
      setPaperList(p);
      setMaterialList(m.filter((m) => m.status === "ready"));
      if (p.length > 0 && !selectedPaper) setSelectedPaper(p[0]);
    } catch {
      toast.error("Failed to load papers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleGenerate = async () => {
    if (!config.material_ids.length) {
      toast.error("Select at least one material.");
      return;
    }
    setIsGenerating(true);
    const id = toast.loading("AI is generating your paper…");
    try {
      const paper = await papersApi.generate(config);
      toast.dismiss(id);
      toast.success("Paper generated!");
      addNotification({
        title: "Paper Drafted",
        message: `Your new paper "${config.title}" is ready and saved to your library.`,
        type: "success",
      });
      setPaperList((prev) => [paper, ...prev]);
      setSelectedPaper(paper);
      setShowGenPanel(false);
    } catch (err: any) {
      toast.dismiss(id);
      toast.error(err.message || "Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (paper: Paper) => {
    const id = toast.loading("Preparing PDF…");
    try {
      const blob = await papersApi.downloadBlob(paper.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${paper.title}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.dismiss(id);
      toast.success("PDF downloaded!");
    } catch {
      toast.dismiss(id);
      toast.error("Download failed.");
    }
  };

  const handleDelete = async (paper: Paper) => {
    try {
      await papersApi.delete(paper.id);
      const updated = paperList.filter((p) => p.id !== paper.id);
      setPaperList(updated);
      setSelectedPaper(updated[0] || null);
      toast.success("Paper deleted.");
      addNotification({
        title: "Paper Deleted",
        message: `"${paper.title}" has been permanently removed.`,
        type: "info",
      });
    } catch {
      toast.error("Delete failed.");
    }
  };

  const handleStartExam = async (paper: Paper) => {
    const id = toast.loading("Creating exam session…");
    try {
      const exam = await examsApi.create(paper.id);
      toast.dismiss(id);
      toast.success("Exam session started!");
      router.push(`/dashboard/exam/${exam.id}`);
    } catch (err: any) {
      toast.dismiss(id);
      toast.error(err.message || "Failed to start exam.");
    }
  };

  const setDifficulty = (key: "easy" | "medium" | "hard", val: number) => {
    setConfig((c) => ({ ...c, difficulty: { ...c.difficulty, [key]: val } }));
  };

  const filtered = paperList.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-styrene font-semibold mb-2">Question Papers</h1>
          <p className="text-text-secondary">Generate and manage your mock exam papers.</p>
        </div>
        <Button onClick={() => setShowGenPanel(!showGenPanel)} className="h-11 shadow-lg flex items-center gap-2">
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
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Paper Title</label>
                <input
                  value={config.title}
                  onChange={(e) => setConfig((c) => ({ ...c, title: e.target.value }))}
                  className="w-full bg-bg-raised border border-border rounded-xl px-4 py-3 text-sm focus:border-accent-primary outline-none"
                  placeholder="e.g. Computer Networks Midterm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Select Material(s)</label>
                {materialList.length === 0 ? (
                  <p className="text-sm text-text-secondary py-3">No processed materials found. Upload materials first.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {materialList.map((m) => (
                      <label key={m.id} className="flex items-center gap-3 p-3 bg-bg-raised rounded-xl cursor-pointer hover:bg-bg-raised/80 transition-colors">
                        <input
                          type="checkbox"
                          checked={config.material_ids.includes(m.id)}
                          onChange={(e) => {
                            setConfig((c) => ({
                              ...c,
                              material_ids: e.target.checked
                                ? [...c.material_ids, m.id]
                                : c.material_ids.filter((id) => id !== m.id),
                            }));
                          }}
                          className="accent-accent-primary"
                        />
                        <span className="text-sm font-medium truncate">{m.filename}</span>
                        <span className="text-xs text-text-secondary ml-auto">{m.topic_count} topics</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Exam Pattern</label>
                <div className="flex gap-3">
                  {["ktu", "cbse", "custom"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setConfig((c) => ({ ...c, format: p }))}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl border transition-all text-sm font-medium uppercase",
                        config.format === p
                          ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                          : "border-border bg-bg-surface hover:border-accent-primary"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Total Marks</label>
                  <input
                    type="number"
                    value={config.total_marks}
                    onChange={(e) => setConfig((c) => ({ ...c, total_marks: +e.target.value }))}
                    className="w-full bg-bg-raised border border-border rounded-xl px-4 py-3 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">Duration (min)</label>
                  <input
                    type="number"
                    value={config.duration_mins}
                    onChange={(e) => setConfig((c) => ({ ...c, duration_mins: +e.target.value }))}
                    className="w-full bg-bg-raised border border-border rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-styrene font-bold text-xl mb-4">Difficulty Distribution</h3>
              <div className="space-y-8 py-4">
                <DifficultySlider label="Easy" value={config.difficulty.easy} color="bg-green-500"
                  onChange={(v) => setDifficulty("easy", v)} />
                <DifficultySlider label="Medium" value={config.difficulty.medium} color="bg-accent-primary"
                  onChange={(v) => setDifficulty("medium", v)} />
                <DifficultySlider label="Hard" value={config.difficulty.hard} color="bg-accent-warm"
                  onChange={(v) => setDifficulty("hard", v)} />
              </div>
              <div className="p-4 bg-accent-primary/5 rounded-xl border border-accent-primary/10">
                <p className="text-xs text-accent-primary font-medium leading-relaxed">
                  Tip: A 30/50/20 split is recommended for a balanced university-style assessment.
                </p>
              </div>
              <Button onClick={handleGenerate} className="w-full h-12 text-lg shadow-xl" disabled={isGenerating || !config.material_ids.length}>
                {isGenerating ? (
                  <span className="flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> Generating…</span>
                ) : "Generate Paper →"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Papers List */}
        <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-styrene font-semibold">Your Papers</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-3.5 h-3.5" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-bg-raised border-none rounded-lg py-1.5 pl-9 pr-3 text-xs outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={28} className="animate-spin text-accent-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <FileText size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">{search ? "No papers match." : "No papers yet. Generate one above."}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((paper) => (
                <Card
                  key={paper.id}
                  onClick={() => setSelectedPaper(paper)}
                  className={cn(
                    "p-5 cursor-pointer transition-all hover:shadow-md",
                    selectedPaper?.id === paper.id
                      ? "border-accent-primary ring-1 ring-accent-primary shadow-lg"
                      : "border-border shadow-sm"
                  )}
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm truncate">{paper.title}</h4>
                        <Badge variant="accent" className="text-[10px]">{paper.format?.toUpperCase()}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">
                        <span>{paper.total_marks} Marks</span>
                        <span>{paper.duration_mins} Min</span>
                        <span>{formatDate(paper.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Paper Preview */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-styrene font-semibold">Preview</h2>
            {selectedPaper && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="h-9 px-3 text-xs gap-1.5 border-border shadow-sm"
                  onClick={() => handleDownload(selectedPaper)}>
                  <Download size={14} /> PDF
                </Button>
                <Button variant="ghost" className="h-9 px-3 text-xs gap-1.5 border-border shadow-sm"
                  onClick={() => setDeleteModal({ isOpen: true, paper: selectedPaper })}>
                  <Trash2 size={14} /> Delete
                </Button>
                <Button className="h-9 px-4 text-xs gap-1.5 shadow-md"
                  onClick={() => handleStartExam(selectedPaper)}>
                  <Play size={14} /> Start Exam
                </Button>
              </div>
            )}
          </div>

          {isGenerating ? (
            <Card className="min-h-[500px] flex flex-col items-center justify-center gap-6 p-12">
              <div className="w-20 h-20 rounded-2xl bg-bg-raised flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-accent-primary/20 animate-pulse" />
                <Settings2 size={32} className="text-accent-primary animate-spin-slow" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-styrene font-bold text-lg">AI is drafting your questions…</p>
                <p className="text-sm text-text-secondary">This takes 15–30 seconds. Please wait.</p>
              </div>
            </Card>
          ) : selectedPaper ? (
            <Card className="min-h-[600px] bg-white border-border shadow-2xl p-4 md:p-8 lg:p-10 overflow-hidden">
              <div className="space-y-10">
                <div className="text-center space-y-3 border-b-2 border-text-primary pb-8">
                  <h3 className="text-xl md:text-2xl font-styrene font-bold uppercase tracking-wider">{selectedPaper.title}</h3>
                  <p className="text-[10px] md:text-xs font-medium text-text-secondary">{selectedPaper.general_instructions}</p>
                  <div className="flex justify-between text-[10px] md:text-xs font-berkeley font-bold uppercase tracking-widest pt-2">
                    <span>Format: {selectedPaper.format?.toUpperCase()}</span>
                    <span>Marks: {selectedPaper.total_marks}</span>
                    <span>Time: {selectedPaper.duration_mins}m</span>
                  </div>
                </div>

                {(selectedPaper.sections || []).map((section, sIdx) => (
                  <div key={sIdx} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-1 border-l-4 border-accent-primary bg-accent-primary/5 font-bold text-accent-primary text-xs md:text-sm">
                        {section.name}
                      </div>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    {section.rules && (
                      <p className="text-[10px] md:text-xs italic text-text-secondary border-b border-border pb-3">{section.rules}</p>
                    )}
                    <div className="space-y-6">
                      {section.questions.map((q) => (
                        <div key={q.id} className="flex gap-4 items-start">
                          <span className="font-berkeley font-bold text-xs md:text-sm pt-0.5 shrink-0">{q.number}.</span>
                          <div className="flex-1 space-y-2">
                            <p className="text-sm md:text-base font-sohne leading-relaxed">{q.text || q.question}</p>
                            {q.options && (
                              <div className="space-y-1 pl-2">
                                {q.options.map((opt, i) => (
                                  <p key={i} className="text-xs md:text-sm text-text-secondary">({["A","B","C","D"][i]}) {opt}</p>
                                ))}
                              </div>
                            )}
                            <div className="flex justify-end">
                              <span className="text-[11px] font-berkeley font-bold bg-bg-raised px-2 py-0.5 rounded italic opacity-60">
                                ({q.marks} Marks)
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-text-secondary">
              <FileText size={48} className="opacity-20" />
              <p>Select a paper to preview or generate a new one.</p>
            </Card>
          )}
        </div>
      </div>
      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        title="Delete Paper"
        message={`Are you sure you want to delete "${deleteModal.paper?.title}"? This will remove the paper and its stored PDF. This action is irreversible.`}
        variant="danger"
        confirmText="Delete Paper"
        onClose={() => setDeleteModal({ isOpen: false, paper: null })}
        onConfirm={() => deleteModal.paper && handleDelete(deleteModal.paper)}
      />
    </div>
  );
}

function DifficultySlider({ label, value, color, onChange }: {
  label: string; value: number; color: string; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] font-bold text-text-secondary uppercase tracking-widest">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <input
        type="range" min={0} max={100} value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full accent-accent-primary"
      />
      <div className="h-2 bg-bg-raised rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
