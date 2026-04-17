"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Target, TrendingDown, Clock, ChevronRight, Zap, RefreshCw, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { study as studyApi, type WeakArea } from "@/lib/api";
import { toast } from "@/lib/toast";

export default function WeakAreasPage() {
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [practiceQs, setPracticeQs] = useState<{ topic: string; questions: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [practicingTopic, setPracticingTopic] = useState<string | null>(null);

  useEffect(() => {
    studyApi.weakAreas()
      .then(setWeakAreas)
      .catch(() => toast.error("Failed to load weak areas."))
      .finally(() => setLoading(false));
  }, []);

  const handlePractice = async (topicName: string) => {
    setPracticingTopic(topicName);
    const id = toast.loading("Generating practice questions…");
    try {
      const qs = await studyApi.practiceQuestions(topicName);
      setPracticeQs({ topic: topicName, questions: qs });
      toast.dismiss(id);
      toast.success(`${qs.length} questions generated!`);
    } catch {
      toast.dismiss(id);
      toast.error("Failed to generate questions.");
    } finally {
      setPracticingTopic(null);
    }
  };

  const overallConfidence = weakAreas.length > 0
    ? Math.round(weakAreas.reduce((s, a) => s + a.average_score, 0) / weakAreas.length)
    : null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-styrene font-semibold mb-2">Weak Areas</h1>
          <p className="text-text-secondary">Based on your evaluation history, these topics need attention.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={36} className="animate-spin text-accent-primary" />
        </div>
      ) : weakAreas.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">
          <Target size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No weak areas detected yet.</p>
          <p className="text-sm mt-1">Complete and submit exams to get personalised weak area insights.</p>
          <Link href="/dashboard/papers">
            <Button className="mt-6">Take an Exam</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="p-8 flex flex-col items-center justify-center text-center space-y-4 col-span-1 bg-accent-primary/5 border-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="text-5xl font-styrene font-bold text-accent-primary">{overallConfidence}%</div>
              <div className="space-y-1">
                <p className="font-bold text-sm">Avg. Confidence</p>
                <p className="text-xs text-text-secondary">Across {weakAreas.length} weak topics</p>
              </div>
            </Card>

            <Card className="lg:col-span-2 p-8 flex items-center justify-between">
              <div className="space-y-4">
                <h3 className="font-styrene font-bold text-lg">Knowledge Gaps</h3>
                <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
                  We've identified <span className="text-text-primary font-bold">{weakAreas.length} topic{weakAreas.length !== 1 ? "s" : ""}</span> where your score is below 50%. Click "Practice Now" to generate targeted questions.
                </p>
              </div>
              <div className="hidden sm:block">
                <TrendingDown size={64} className="text-accent-primary/20" />
              </div>
            </Card>
          </div>

          <section className="space-y-6">
            <h2 className="text-xl font-styrene font-semibold">Prioritized Practice</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weakAreas.map((area, idx) => (
                <Card key={idx} className="p-0 overflow-hidden group hover:shadow-xl transition-all">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                        {area.average_score.toFixed(0)}% Accuracy
                      </span>
                      <Target className="text-text-secondary/50 group-hover:text-accent-primary transition-colors" size={20} />
                    </div>
                    <h3 className="font-bold text-lg leading-tight">{area.topic_name}</h3>
                    <div className="h-1.5 bg-bg-raised rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: `${area.average_score}%` }} />
                    </div>
                    <p className="text-xs text-text-secondary">{area.scored}/{area.max} marks earned</p>
                  </div>
                  <div className="p-3 bg-bg-raised/50 border-t border-border flex gap-2">
                    <Button
                      className="flex-1 h-9 text-xs shadow-sm"
                      onClick={() => handlePractice(area.topic_name)}
                      disabled={practicingTopic === area.topic_name}
                    >
                      {practicingTopic === area.topic_name ? (
                        <><Loader2 size={12} className="animate-spin mr-1" /> Generating…</>
                      ) : "Practice Now"}
                    </Button>
                    <Link href={`/dashboard/study/${encodeURIComponent(area.topic_name)}`} className="flex-1">
                      <Button variant="ghost" className="w-full h-9 text-xs border-border bg-white shadow-sm">Study Topic</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Practice Questions Panel */}
          {practiceQs && (
            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-styrene font-semibold">Practice: {practiceQs.topic}</h2>
                <button onClick={() => setPracticeQs(null)} className="text-sm text-text-secondary hover:text-accent-primary">
                  Close
                </button>
              </div>
              <div className="space-y-4">
                {practiceQs.questions.map((q: any, i: number) => (
                  <Card key={i} className="p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="bg-accent-primary/10 text-accent-primary font-bold text-xs px-2 py-0.5 rounded-full shrink-0">{i + 1}</span>
                      <p className="text-base leading-relaxed">{q.question}</p>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Write your answer…"
                      className="w-full bg-bg-raised border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-accent-primary resize-none"
                    />
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
