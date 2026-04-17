"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock, Send, CheckCircle2, Loader2, Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { exams as examsApi, evaluations as evalApi, type Exam, type Question } from "@/lib/api";
import { toast } from "@/lib/toast";

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [elapsedSecs, setElapsedSecs] = useState(0);

  // Debounce timer ref for auto-save
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load exam
  useEffect(() => {
    const load = async () => {
      try {
        const e = await examsApi.get(examId);
        setExam(e);
        setElapsedSecs(e.elapsed_secs || 0);
        // Re-hydrate answers from server
        const savedAnswers: Record<string, string> = {};
        (e.answers || []).forEach((a) => {
          savedAnswers[a.question_id] = a.answer_text;
        });
        setAnswers(savedAnswers);
      } catch (err: any) {
        toast.error("Failed to load exam.");
        router.replace("/dashboard/papers");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [examId]);

  // Timer
  useEffect(() => {
    if (!exam || exam.status === "submitted") return;
    timerInterval.current = setInterval(() => {
      setElapsedSecs((s) => s + 1);
    }, 1000);
    return () => { if (timerInterval.current) clearInterval(timerInterval.current); };
  }, [exam]);

  // Auto-save answer with debounce
  const handleAnswerChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await examsApi.saveAnswer(examId, questionId, text);
      } catch {}
    }, 800);
  };

  const handleSubmit = async () => {
    if (!confirm("Submit this exam? You cannot change answers after submission.")) return;
    if (timerInterval.current) clearInterval(timerInterval.current);
    setSubmitting(true);
    const id = toast.loading("Submitting and evaluating…");
    try {
      await examsApi.submit(examId);
      const evaluation = await evalApi.create(examId);
      toast.dismiss(id);
      toast.success("Exam submitted! AI evaluation complete.");
      router.push(`/dashboard/evaluations/${evaluation.id}`);
    } catch (err: any) {
      toast.dismiss(id);
      toast.error(err.message || "Submission failed.");
      setSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (loading || !exam) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-accent-primary" />
      </div>
    );
  }

  // Flatten all questions
  const allQuestions: Question[] = (exam.paper?.sections || []).flatMap((s) => s.questions);
  const totalQ = allQuestions.length;
  const currentQ = allQuestions[currentQIdx];
  const answeredCount = Object.values(answers).filter((v) => v.trim()).length;
  const durationSecs = (exam.duration_mins || 180) * 60;
  const timeLeft = Math.max(0, durationSecs - elapsedSecs);
  const timeWarning = timeLeft < 300; // last 5 minutes

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Bar */}
      <div className="sticky top-16 z-30 flex items-center justify-between bg-bg-surface/90 backdrop-blur border border-border rounded-2xl px-5 py-3 shadow-lg">
        <div>
          <h1 className="font-styrene font-bold text-base truncate max-w-xs">{exam.paper?.title || "Exam"}</h1>
          <p className="text-xs text-text-secondary">{answeredCount}/{totalQ} answered</p>
        </div>
        <div className={cn(
          "flex items-center gap-2 font-berkeley font-bold text-lg px-4 py-1.5 rounded-xl",
          timeWarning ? "text-red-600 bg-red-50 animate-pulse" : "text-accent-primary bg-accent-primary/10"
        )}>
          <Clock size={18} />
          {formatTime(timeLeft)}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={submitting || exam.status === "submitted"}
          className="h-10 px-5 gap-2 shadow-lg"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          Submit Exam
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Question Navigator */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-styrene font-semibold text-sm uppercase tracking-widest text-text-secondary">Questions</h2>
          <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
            {allQuestions.map((q, idx) => {
              const answered = !!(answers[q.id]?.trim());
              const isCurrent = idx === currentQIdx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIdx(idx)}
                  className={cn(
                    "aspect-square rounded-lg text-xs font-bold transition-all flex items-center justify-center",
                    isCurrent ? "bg-accent-primary text-white shadow-lg scale-110" :
                    answered ? "bg-green-100 text-green-700 border border-green-300" :
                    "bg-bg-raised text-text-secondary hover:bg-bg-surface border border-border"
                  )}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-wider pt-2">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-accent-primary" /> Current</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-100 border border-green-300" /> Answered</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-bg-raised border border-border" /> Pending</div>
          </div>

          {/* Progress */}
          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Progress</span>
              <span>{Math.round((answeredCount / totalQ) * 100)}%</span>
            </div>
            <div className="h-2 bg-bg-raised rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                style={{ width: `${(answeredCount / totalQ) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question + Answer */}
        <div className="lg:col-span-3 space-y-6">
          {currentQ && (
            <Card className="p-8 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-accent-primary/10 text-accent-primary text-xs font-bold rounded-full">
                      Q{currentQIdx + 1}
                    </span>
                    <span className="text-xs text-text-secondary">{currentQ.topic}</span>
                    <span className="ml-auto text-xs font-bold font-berkeley bg-bg-raised px-3 py-1 rounded-full">
                      {currentQ.marks} marks
                    </span>
                  </div>
                  <p className="text-base leading-relaxed font-sohne">{currentQ.text || currentQ.question}</p>

                  {currentQ.options && (
                    <div className="mt-4 space-y-2">
                      {currentQ.options.map((opt, i) => (
                        <label key={i} className="flex items-center gap-3 p-3 bg-bg-raised rounded-xl cursor-pointer hover:bg-bg-surface transition-colors">
                          <input
                            type="radio"
                            name={`q_${currentQ.id}`}
                            value={opt}
                            checked={answers[currentQ.id] === opt}
                            onChange={() => handleAnswerChange(currentQ.id, opt)}
                            className="accent-accent-primary"
                          />
                          <span className="font-medium">{["A","B","C","D"][i]}. {opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {!currentQ.options && (
                <>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest">Your Answer</label>
                  <textarea
                    rows={8}
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    placeholder="Write your answer here…"
                    className="w-full bg-bg-raised border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-accent-primary resize-none transition-colors"
                  />
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <Save size={12} /> Auto-saved
                    </span>
                    <span>{(answers[currentQ.id] || "").length} characters</span>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="ghost"
                  disabled={currentQIdx === 0}
                  onClick={() => setCurrentQIdx((i) => i - 1)}
                  className="gap-2"
                >
                  <ChevronLeft size={16} /> Previous
                </Button>
                {currentQIdx < totalQ - 1 ? (
                  <Button onClick={() => setCurrentQIdx((i) => i + 1)} className="gap-2">
                    Next <ChevronRight size={16} />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitting} className="gap-2 bg-green-600 hover:bg-green-700">
                    <CheckCircle2 size={16} /> Submit Exam
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
