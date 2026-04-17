"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, RefreshCw, Loader2, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { study as studyApi, type Topic, type Flashcard } from "@/lib/api";
import { toast } from "@/lib/toast";

type Phase = "learn" | "recall" | "test";

export default function TopicStudyPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const router = useRouter();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [phase, setPhase] = useState<Phase>("learn");
  const [loading, setLoading] = useState(true);
  const [generatingCards, setGeneratingCards] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, cards] = await Promise.all([
          studyApi.topic(topicId),
          studyApi.flashcards(topicId),
        ]);
        setTopic(t);
        setFlashcards(cards);
      } catch (err: any) {
        // topicId might be a topic name (from weak areas link) — use as fallback
        toast.error("Topic not found.");
        router.replace("/dashboard/study");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [topicId]);

  const handleGenerateFlashcards = async () => {
    setGeneratingCards(true);
    const id = toast.loading("Generating flashcards with AI…");
    try {
      const cards = await studyApi.generateFlashcards(topicId, 10);
      setFlashcards(cards);
      toast.dismiss(id);
      toast.success(`${cards.length} flashcards generated!`);
    } catch {
      toast.dismiss(id);
      toast.error("Flashcard generation failed.");
    } finally {
      setGeneratingCards(false);
    }
  };

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => setCurrentCard((i) => Math.min(i + 1, flashcards.length - 1)), 150);
  };

  const prevCard = () => {
    setFlipped(false);
    setTimeout(() => setCurrentCard((i) => Math.max(i - 1, 0)), 150);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={36} className="animate-spin text-accent-primary" />
      </div>
    );
  }

  if (!topic) return null;

  const card = flashcards[currentCard];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button variant="ghost" className="gap-2 h-9 px-3 -ml-2" onClick={() => router.back()}>
        <ChevronLeft size={16} /> Back
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-styrene font-semibold">{topic.name}</h1>
          <p className="text-text-secondary mt-1">{(topic.subtopics || []).join(" · ")}</p>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-sm font-bold self-start",
          topic.difficulty === "easy" ? "bg-green-100 text-green-700" :
          topic.difficulty === "hard" ? "bg-red-100 text-red-700" :
          "bg-amber-100 text-amber-700"
        )}>
          {topic.difficulty}
        </span>
      </div>

      {/* Phase Switcher */}
      <div className="flex bg-bg-raised p-1 rounded-2xl w-fit">
        {(["learn", "recall", "test"] as Phase[]).map((p) => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-medium transition-all capitalize",
              phase === p ? "bg-white shadow-md text-accent-primary" : "text-text-secondary hover:text-text-primary"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Learn Phase — Summary */}
      {phase === "learn" && (
        <Card className="p-8 space-y-6">
          <h2 className="font-styrene font-bold text-xl">Topic Summary</h2>
          {topic.content ? (
            <div className="prose prose-sm max-w-none text-text-primary leading-relaxed whitespace-pre-wrap">
              {topic.content}
            </div>
          ) : (
            <p className="text-text-secondary italic">No summary available yet.</p>
          )}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-widest text-text-secondary">Key Subtopics</h3>
            <div className="flex flex-wrap gap-2">
              {(topic.subtopics || []).map((st, i) => (
                <span key={i} className="px-3 py-1.5 bg-accent-primary/10 text-accent-primary text-sm rounded-full font-medium">
                  {st}
                </span>
              ))}
            </div>
          </div>
          <Button onClick={() => setPhase("recall")} className="w-full h-11">
            Start Recall Practice →
          </Button>
        </Card>
      )}

      {/* Recall Phase — Flashcards */}
      {phase === "recall" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-styrene font-bold text-xl">Flashcards</h2>
            <Button
              variant="ghost"
              onClick={handleGenerateFlashcards}
              disabled={generatingCards}
              className="gap-2 h-9 px-3 text-xs border-border"
            >
              {generatingCards ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {flashcards.length > 0 ? "Regenerate" : "Generate"} Cards
            </Button>
          </div>

          {flashcards.length === 0 ? (
            <Card className="p-12 text-center space-y-4">
              <Sparkles size={40} className="mx-auto text-accent-warm" />
              <p className="font-semibold">No flashcards yet</p>
              <p className="text-sm text-text-secondary">Generate AI flashcards for this topic to start recall practice.</p>
              <Button onClick={handleGenerateFlashcards} disabled={generatingCards} className="mx-auto">
                {generatingCards ? "Generating…" : "Generate Flashcards"}
              </Button>
            </Card>
          ) : (
            <>
              {/* Card counter */}
              <div className="text-center text-sm text-text-secondary font-medium">
                {currentCard + 1} / {flashcards.length}
              </div>

              {/* Flashcard */}
              <div
                className="relative cursor-pointer"
                style={{ perspective: "1000px" }}
                onClick={() => setFlipped((f) => !f)}
              >
                <div
                  className="relative w-full transition-all duration-500"
                  style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}
                >
                  {/* Front */}
                  <Card className="p-12 min-h-[240px] flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-br from-accent-primary/5 to-accent-warm/5 cursor-pointer" style={{ backfaceVisibility: "hidden" }}>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Question — click to reveal</p>
                    <p className="text-xl font-styrene leading-relaxed">{card?.front}</p>
                    <RotateCcw size={16} className="text-text-secondary/50" />
                  </Card>

                  {/* Back */}
                  <Card className="p-12 min-h-[240px] flex flex-col items-center justify-center text-center space-y-4 bg-accent-primary text-white absolute inset-0 cursor-pointer" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Answer</p>
                    <p className="text-xl leading-relaxed">{card?.back}</p>
                  </Card>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-6">
                <Button variant="ghost" disabled={currentCard === 0} onClick={prevCard} className="gap-2">
                  <ChevronLeft size={16} /> Prev
                </Button>
                <Button variant="ghost" disabled={currentCard === flashcards.length - 1} onClick={nextCard} className="gap-2">
                  Next <ChevronRight size={16} />
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Test Phase — Practice Questions */}
      {phase === "test" && (
        <PracticeTest topicName={topic.name} />
      )}
    </div>
  );
}

function PracticeTest({ topicName }: { topicName: string }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const qs = await studyApi.practiceQuestions(topicName);
      setQuestions(qs);
      setAnswers({});
      setSubmitted(false);
    } catch {
      toast.error("Failed to generate practice questions.");
    } finally {
      setLoading(false);
    }
  };

  if (questions.length === 0) {
    return (
      <Card className="p-12 text-center space-y-4">
        <Sparkles size={40} className="mx-auto text-accent-warm" />
        <p className="font-semibold">Practice Questions</p>
        <p className="text-sm text-text-secondary">Generate 5 AI-targeted questions for this topic.</p>
        <Button onClick={generate} disabled={loading} className="mx-auto">
          {loading ? <><Loader2 size={16} className="animate-spin mr-2" />Generating…</> : "Generate Questions"}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-styrene font-bold text-xl">Practice Questions</h2>
        <Button variant="ghost" onClick={generate} disabled={loading} className="gap-1.5 h-9 px-3 text-xs border-border">
          <RefreshCw size={14} /> New Questions
        </Button>
      </div>
      {questions.map((q, i) => (
        <Card key={i} className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="bg-accent-primary/10 text-accent-primary font-bold text-xs px-2 py-0.5 rounded-full shrink-0">{i + 1}</span>
            <p className="text-base leading-relaxed">{q.question}</p>
          </div>
          {!submitted && (
            <textarea
              rows={4}
              value={answers[i] || ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
              placeholder="Write your answer…"
              className="w-full bg-bg-raised border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-accent-primary resize-none"
            />
          )}
        </Card>
      ))}
      {!submitted && (
        <Button className="w-full h-11" onClick={() => setSubmitted(true)}>
          Mark as Done ✓
        </Button>
      )}
      {submitted && (
        <div className="text-center py-6 space-y-3">
          <CheckCircle2 size={40} className="mx-auto text-green-500" />
          <p className="font-styrene font-bold text-lg">Great job! Session complete.</p>
          <Button onClick={generate} className="gap-2">
            <RefreshCw size={16} /> New Questions
          </Button>
        </div>
      )}
    </div>
  );
}

function CheckCircle2({ size, className }: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
