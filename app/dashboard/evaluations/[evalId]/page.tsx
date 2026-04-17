"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Loader2, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { evaluations as evalApi, type Evaluation } from "@/lib/api";
import { toast } from "@/lib/toast";

export default function EvaluationDetailPage() {
  const { evalId } = useParams<{ evalId: string }>();
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    evalApi.get(evalId)
      .then(setEvaluation)
      .catch(() => toast.error("Evaluation not found."))
      .finally(() => setLoading(false));
  }, [evalId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={36} className="animate-spin text-accent-primary" />
      </div>
    );
  }

  if (!evaluation) return null;

  const pct = Math.round((evaluation.scored_marks / evaluation.total_marks) * 100);

  const gradeColor = {
    S: "text-violet-600", A: "text-green-600", B: "text-blue-600",
    C: "text-amber-600", D: "text-orange-500", E: "text-red-500", F: "text-red-700",
  }[evaluation.grade] || "text-text-primary";

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back */}
      <Button variant="ghost" className="gap-2 h-9 px-3 -ml-2" onClick={() => router.back()}>
        <ChevronLeft size={16} /> Back to Evaluations
      </Button>

      {/* Score Card */}
      <Card className="p-10 flex flex-col md:flex-row md:items-center gap-10 bg-gradient-to-br from-accent-primary/5 to-accent-warm/5 border-none shadow-2xl">
        <div className="text-center space-y-2">
          <div className={cn("text-8xl font-styrene font-bold", gradeColor)}>{evaluation.grade}</div>
          <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">Grade</p>
        </div>
        <div className="flex-1 space-y-6">
          <div>
            <div className="text-5xl font-styrene font-bold">
              {evaluation.scored_marks}
              <span className="text-xl text-text-secondary">/{evaluation.total_marks}</span>
            </div>
            <p className="text-text-secondary mt-1">{pct}% overall score</p>
          </div>
          <div className="h-3 bg-bg-raised rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-warm transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Topic Performance */}
      {evaluation.topic_scores && evaluation.topic_scores.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-styrene font-semibold">Topic Performance</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {evaluation.topic_scores.map((ts, i) => {
              const topicPct = ts.max > 0 ? Math.round((ts.score / ts.max) * 100) : 0;
              return (
                <Card key={i} className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate">{ts.topic}</span>
                    <span className="font-bold font-berkeley text-accent-primary">{topicPct}%</span>
                  </div>
                  <div className="h-2 bg-bg-raised rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        topicPct >= 70 ? "bg-green-500" : topicPct >= 50 ? "bg-amber-500" : "bg-red-400"
                      )}
                      style={{ width: `${topicPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-secondary">{ts.score}/{ts.max} marks</p>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Question Breakdown */}
      <section className="space-y-4">
        <h2 className="text-xl font-styrene font-semibold">Question Breakdown</h2>
        <div className="space-y-4">
          {evaluation.breakdown.map((item, idx) => {
            const score_ratio = item.marks_awarded / item.max_marks;
            const isOpen = openIdx === idx;
            return (
              <Card key={idx} className="overflow-hidden">
                <button
                  className="w-full p-5 flex items-center gap-4 text-left hover:bg-bg-raised/50 transition-colors"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                >
                  <div className="shrink-0">
                    {score_ratio >= 0.7 ? (
                      <CheckCircle2 size={20} className="text-green-500" />
                    ) : score_ratio >= 0.4 ? (
                      <CheckCircle2 size={20} className="text-amber-400" />
                    ) : (
                      <XCircle size={20} className="text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{item.question_text}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-berkeley font-bold text-sm text-accent-primary">
                      {item.marks_awarded}/{item.max_marks}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-border">
                    <div className="pt-4">
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Your Answer</p>
                      <p className="text-sm bg-bg-raised rounded-xl p-3 text-text-primary italic">
                        {item.user_answer || <span className="text-text-secondary not-italic">No answer given</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">AI Feedback</p>
                      <p className="text-sm text-text-primary leading-relaxed">{item.ai_feedback}</p>
                    </div>
                    {item.correct_hint && (
                      <div className="flex gap-3 p-3 bg-accent-primary/5 rounded-xl border border-accent-primary/10">
                        <Lightbulb size={16} className="text-accent-warm shrink-0 mt-0.5" />
                        <p className="text-sm text-text-primary leading-relaxed">{item.correct_hint}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <div className="flex gap-4 pb-10">
        <Button onClick={() => router.push("/dashboard/papers")} className="gap-2">
          Generate New Paper
        </Button>
        <Button variant="ghost" onClick={() => router.push("/dashboard/study")} className="gap-2">
          Study Weak Topics
        </Button>
      </div>
    </div>
  );
}
