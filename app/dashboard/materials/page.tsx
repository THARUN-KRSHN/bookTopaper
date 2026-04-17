"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload, Files, Grid2X2, List, Search, MoreVertical, ChevronRight,
  FileText, X, RefreshCw, Trash2, Tag, Loader2
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { materials as materialsApi, type Material, type Topic } from "@/lib/api";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";

export default function MaterialsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [materialList, setMaterialList] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [draggingOver, setDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMaterials = useCallback(async () => {
    try {
      const data = await materialsApi.list();
      setMaterialList(data);
    } catch (err: any) {
      toast.error("Failed to load materials.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMaterials(); }, [fetchMaterials]);

  const handleFileUpload = async (file: File) => {
    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowed.includes(file.type)) {
      toast.error("Only PDF, PNG, and JPG files are supported.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be under 50 MB.");
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    const loadingId = toast.loading(`Uploading ${file.name}…`);

    // Simulate progress during upload + AI processing
    const progressInterval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + 8, 88));
    }, 800);

    try {
      await materialsApi.upload(file);
      toast.dismiss(loadingId);
      toast.success("Material uploaded and processed!");
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 800);
      await fetchMaterials();
    } catch (err: any) {
      toast.dismiss(loadingId);
      toast.error(err.message || "Upload failed.");
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await materialsApi.delete(id);
      toast.success("Material deleted.");
      setMaterialList((prev) => prev.filter((m) => m.id !== id));
      if (selectedMaterial?.id === id) setSelectedMaterial(null);
    } catch {
      toast.error("Failed to delete material.");
    }
  };

  const handleReprocess = async (id: string) => {
    toast.loading("Reprocessing…");
    try {
      const updated = await materialsApi.reprocess(id);
      toast.success("Reprocessing complete.");
      setMaterialList((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch {
      toast.error("Reprocessing failed.");
    }
  };

  const openTopics = async (material: Material) => {
    try {
      const topics = await materialsApi.getTopics(material.id);
      setSelectedMaterial({ ...material, topics });
    } catch {
      toast.error("Failed to load topics.");
    }
  };

  const filtered = materialList.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-styrene font-semibold mb-2">My Materials</h1>
          <p className="text-text-secondary">
            {materialList.length} document{materialList.length !== 1 ? "s" : ""} · AI-processed
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search materials…"
              className="pl-10 pr-4 py-2 bg-bg-raised border border-border rounded-xl text-sm focus:outline-none focus:border-accent-primary transition-colors"
            />
          </div>
          <div className="flex bg-bg-raised border border-border rounded-xl p-1">
            <button onClick={() => setView("grid")} className={cn("p-2 rounded-lg transition-colors", view === "grid" ? "bg-white shadow-sm text-accent-primary" : "text-text-secondary")}>
              <Grid2X2 size={16} />
            </button>
            <button onClick={() => setView("list")} className={cn("p-2 rounded-lg transition-colors", view === "list" ? "bg-white shadow-sm text-accent-primary" : "text-text-secondary")}>
              <List size={16} />
            </button>
          </div>
          <Button className="h-10 gap-2" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload size={16} />
            Upload
          </Button>
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
        </div>
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary font-medium">Processing with AI…</span>
            <span className="font-berkeley text-accent-primary">{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-bg-raised rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-primary to-accent-warm rounded-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
        onDragLeave={() => setDraggingOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDraggingOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFileUpload(file);
        }}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer",
          draggingOver ? "border-accent-primary bg-accent-primary/5" : "border-border hover:border-accent-primary/50 hover:bg-bg-raised/50"
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
            <Upload size={28} />
          </div>
          <div>
            <p className="font-semibold text-text-primary mb-1">Drop your files here or click to browse</p>
            <p className="text-sm text-text-secondary">Supports PDF, PNG, JPG · Max 50 MB · AI-powered text extraction</p>
          </div>
        </div>
      </div>

      {/* Materials list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-accent-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">
          <Files size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">{search ? "No materials match your search." : "No materials yet. Upload your first file above."}</p>
        </div>
      ) : (
        <div className={cn(view === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4")}>
          {filtered.map((mat) => (
            <MaterialCard
              key={mat.id}
              material={mat}
              view={view}
              onView={() => openTopics(mat)}
              onDelete={() => handleDelete(mat.id, mat.filename)}
              onReprocess={() => handleReprocess(mat.id)}
            />
          ))}
        </div>
      )}

      {/* Topics Drawer */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedMaterial(null)} />
          <div className="relative ml-auto w-full max-w-md bg-bg-surface h-full shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-styrene font-bold text-lg">{selectedMaterial.filename}</h3>
                <p className="text-sm text-text-secondary mt-1">{selectedMaterial.topics?.length || 0} topics extracted</p>
              </div>
              <button onClick={() => setSelectedMaterial(null)} className="p-2 hover:text-accent-primary transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {(selectedMaterial.topics || []).length === 0 ? (
                <div className="text-center py-12 text-text-secondary">
                  <Tag size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No topics extracted yet. Try reprocessing this material.</p>
                </div>
              ) : (
                selectedMaterial.topics!.map((topic: Topic) => (
                  <div key={topic.id} className="p-4 bg-bg-raised rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{topic.name}</h4>
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                        topic.difficulty === "easy" ? "bg-green-100 text-green-700" :
                        topic.difficulty === "hard" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      )}>
                        {topic.difficulty}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(topic.subtopics || []).map((st, i) => (
                        <span key={i} className="text-[10px] bg-white border border-border rounded-full px-2 py-0.5 text-text-secondary">{st}</span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MaterialCard({ material, view, onView, onDelete, onReprocess }: {
  material: Material;
  view: "grid" | "list";
  onView: () => void;
  onDelete: () => void;
  onReprocess: () => void;
}) {
  const statusColor = {
    ready: "bg-green-100 text-green-700",
    processing: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700",
    uploaded: "bg-blue-100 text-blue-700",
  }[material.status] || "bg-gray-100 text-gray-700";

  if (view === "list") {
    return (
      <Card className="p-4 flex items-center justify-between gap-4 hover:shadow-lg transition-all">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0">
            <FileText size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{material.filename}</p>
            <p className="text-xs text-text-secondary">{material.topic_count} topics · {formatDate(material.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", statusColor)}>{material.status}</span>
          <Button variant="ghost" className="h-8 px-3 text-xs" onClick={onView}>Topics</Button>
          <button onClick={onDelete} className="p-2 text-text-secondary hover:text-red-500 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden group hover:shadow-xl transition-all">
      <div className="h-32 bg-gradient-to-br from-accent-primary/10 to-accent-warm/10 flex items-center justify-center">
        <FileText size={40} className="text-accent-primary/40 group-hover:text-accent-primary transition-colors" />
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight flex-1 min-w-0 truncate">{material.filename}</h3>
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0", statusColor)}>{material.status}</span>
        </div>
        <p className="text-xs text-text-secondary">{material.topic_count} topics · {formatDate(material.created_at)}</p>
        <div className="flex gap-2 pt-1">
          <Button className="flex-1 h-9 text-xs" onClick={onView}>View Topics</Button>
          {material.status === "error" && (
            <button onClick={onReprocess} className="p-2 text-text-secondary hover:text-accent-primary transition-colors" title="Reprocess">
              <RefreshCw size={16} />
            </button>
          )}
          <button onClick={onDelete} className="p-2 text-text-secondary hover:text-red-500 transition-colors" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
}
