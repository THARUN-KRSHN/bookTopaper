"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Brain, Flame, Loader2, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { planner as plannerApi, materials as materialsApi, type RevisionPlan, type Material } from "@/lib/api";
import { toast } from "@/lib/toast";
import { format, addMonths, subMonths, startOfMonth, getDaysInMonth, getDay } from "date-fns";

export default function PlannerPage() {
  const [plan, setPlan] = useState<RevisionPlan | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [formState, setFormState] = useState({
    exam_name: "",
    exam_date: "",
    intensity: "moderate" as "light" | "moderate" | "intensive",
    material_ids: [] as string[],
  });

  const fetchData = useCallback(async () => {
    try {
      const [p, m] = await Promise.all([plannerApi.get(), materialsApi.list()]);
      setPlan(p);
      setMaterials(m.filter((mat) => mat.status === "ready"));
    } catch {
      toast.error("Failed to load planner.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleGenerate = async () => {
    if (!formState.exam_date) { toast.error("Please select an exam date."); return; }
    if (!formState.exam_name) { toast.error("Please enter an exam name."); return; }

    setGenerating(true);
    const id = toast.loading("Generating your revision plan…");
    try {
      const newPlan = await plannerApi.generate(formState);
      setPlan(newPlan);
      setShowForm(false);
      toast.dismiss(id);
      toast.success("Revision plan created!");
    } catch (err: any) {
      toast.dismiss(id);
      toast.error(err.message || "Failed to generate plan.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!plan || !confirm("Delete this plan?")) return;
    try {
      await plannerApi.delete(plan.id);
      setPlan(null);
      toast.success("Plan deleted.");
    } catch {
      toast.error("Failed to delete plan.");
    }
  };

  // Calendar helpers
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfWeek = (getDay(startOfMonth(currentMonth)) + 6) % 7; // 0=Mon

  const planDayMap: Record<string, { type: string; topics: string[] }> = {};
  if (plan) {
    plan.plan.forEach((d) => {
      planDayMap[d.date] = { type: d.type, topics: d.topics };
    });
  }

  // Today's study tasks
  const today = new Date().toISOString().split("T")[0];
  const todayPlan = plan?.plan.find((d) => d.date === today);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={36} className="animate-spin text-accent-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-styrene font-semibold mb-2">Revision Planner</h1>
          <p className="text-text-secondary">
            {plan ? `${plan.exam_name} · ${format(new Date(plan.exam_date), "MMM d, yyyy")}` : "Smart schedule built around your upcoming exams."}
          </p>
        </div>
        <div className="flex gap-3">
          {plan && (
            <Button variant="ghost" className="h-11 gap-2 border-border" onClick={handleDeletePlan}>
              <X size={16} /> Delete Plan
            </Button>
          )}
          <Button className="h-11 shadow-lg gap-2" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} />
            {plan ? "New Plan" : "Create Plan"}
          </Button>
        </div>
      </div>

      {/* Generate Form */}
      {showForm && (
        <Card className="p-8 space-y-6 border-2 border-accent-primary/20 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <h2 className="font-styrene font-bold text-xl">Configure Revision Plan</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Exam Name</label>
              <input
                value={formState.exam_name}
                onChange={(e) => setFormState((f) => ({ ...f, exam_name: e.target.value }))}
                placeholder="e.g. Computer Networks Finals"
                className="w-full bg-bg-raised border border-border rounded-xl px-4 py-3 text-sm focus:border-accent-primary outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Exam Date</label>
              <input
                type="date"
                value={formState.exam_date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFormState((f) => ({ ...f, exam_date: e.target.value }))}
                className="w-full bg-bg-raised border border-border rounded-xl px-4 py-3 text-sm focus:border-accent-primary outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Study Intensity</label>
              <div className="flex gap-3">
                {(["light", "moderate", "intensive"] as const).map((i) => (
                  <button
                    key={i}
                    onClick={() => setFormState((f) => ({ ...f, intensity: i }))}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all",
                      formState.intensity === i
                        ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                        : "border-border bg-bg-surface hover:border-accent-primary"
                    )}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            {materials.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Materials (optional)</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {materials.map((m) => (
                    <label key={m.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.material_ids.includes(m.id)}
                        onChange={(e) => {
                          setFormState((f) => ({
                            ...f,
                            material_ids: e.target.checked
                              ? [...f.material_ids, m.id]
                              : f.material_ids.filter((id) => id !== m.id),
                          }));
                        }}
                        className="accent-accent-primary"
                      />
                      <span className="text-sm truncate">{m.filename}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button onClick={handleGenerate} disabled={generating} className="w-full h-12 text-lg shadow-xl">
            {generating ? <><Loader2 size={18} className="animate-spin mr-2" />Generating…</> : "Generate Plan →"}
          </Button>
        </Card>
      )}

      {plan && (
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-styrene font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
                <div className="flex bg-bg-raised p-1 rounded-lg">
                  <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 text-text-secondary hover:text-text-primary">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 text-text-secondary hover:text-text-primary">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <LegendItem color="bg-accent-primary" label="Study" />
                <LegendItem color="bg-accent-warm" label="Revision" />
                <LegendItem color="bg-bg-raised" label="Rest" />
              </div>
            </div>

            <Card className="p-0 overflow-hidden shadow-xl border-none ring-1 ring-border">
              <div className="grid grid-cols-7 border-b border-border bg-bg-raised/50">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d} className="py-3 text-center text-[10px] font-bold text-text-secondary uppercase tracking-widest">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {/* Empty cells before first day */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[80px] border-r border-b border-border opacity-20" />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const dateStr = `${format(currentMonth, "yyyy-MM")}-${String(day).padStart(2, "0")}`;
                  const dayData = planDayMap[dateStr];
                  const isToday = dateStr === today;
                  const absoluteIdx = firstDayOfWeek + day - 1;
                  return (
                    <div
                      key={day}
                      className={cn(
                        "min-h-[80px] p-1.5 border-r border-b border-border transition-colors",
                        isToday && "bg-accent-primary/5",
                        (absoluteIdx + 1) % 7 === 0 && "border-r-0"
                      )}
                    >
                      <span className={cn(
                        "text-xs font-berkeley font-bold",
                        isToday
                          ? "text-accent-primary bg-accent-primary/10 w-5 h-5 rounded-full flex items-center justify-center -ml-0.5"
                          : "text-text-secondary/50"
                      )}>
                        {day}
                      </span>
                      {dayData && dayData.type !== "rest" && (
                        <div className="mt-1 space-y-0.5">
                          {dayData.topics.slice(0, 2).map((t, i) => (
                            <div
                              key={i}
                              className={cn(
                                "px-1 py-0.5 rounded text-[9px] font-bold truncate border-l-2",
                                dayData.type === "revision"
                                  ? "bg-accent-warm/10 border-accent-warm text-accent-warm"
                                  : "bg-accent-primary/10 border-accent-primary text-accent-primary"
                              )}
                            >
                              {t}
                            </div>
                          ))}
                        </div>
                      )}
                      {dayData?.type === "rest" && (
                        <div className="mt-1 text-[9px] text-text-secondary/50 font-medium">Rest</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-styrene font-semibold mb-4">Today's Goals</h2>
              <Card className="p-6 space-y-4">
                {todayPlan && todayPlan.topics.length > 0 ? (
                  <>
                    {todayPlan.topics.map((t, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-9 h-9 rounded-xl bg-accent-warm/10 flex items-center justify-center text-accent-warm font-bold text-sm shrink-0">
                          {t[0]?.toUpperCase() || "T"}
                        </div>
                        <div>
                          <p className="text-sm font-bold truncate">{t}</p>
                          <p className="text-xs text-text-secondary">{todayPlan.duration} session</p>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full h-10 bg-accent-warm hover:bg-accent-warm/90 border-none shadow-md text-sm">
                      Start Session
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4 text-text-secondary text-sm">
                    {todayPlan?.type === "rest" ? "🎉 Rest day! Take a break." : "No tasks for today."}
                  </div>
                )}
              </Card>
            </section>

            <section>
              <h2 className="text-lg font-styrene font-semibold mb-4">Plan Stats</h2>
              <Card className="p-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Exam</span>
                  <span className="font-medium">{plan.exam_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Date</span>
                  <span className="font-medium">{format(new Date(plan.exam_date), "MMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Intensity</span>
                  <span className="font-medium capitalize">{plan.intensity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Days</span>
                  <span className="font-medium">{plan.plan.length}</span>
                </div>
              </Card>
            </section>
          </div>
        </div>
      )}

      {!plan && !showForm && (
        <div className="text-center py-20 text-text-secondary">
          <CalendarIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No revision plan yet.</p>
          <p className="text-sm mt-1">Create your first plan to get a day-by-day study schedule.</p>
          <Button className="mt-6 gap-2" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Create Plan
          </Button>
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
      <div className={cn("w-2 h-2 rounded-full", color)} />
      {label}
    </div>
  );
}
