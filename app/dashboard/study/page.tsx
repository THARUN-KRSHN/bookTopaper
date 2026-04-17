"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brain, Target, ChevronRight, Loader2, Tag } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { study as studyApi, type Topic, type WeakArea } from "@/lib/api";
import { toast } from "@/lib/toast";

export default function StudyPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([studyApi.topics(), studyApi.weakAreas()])
      .then(([t, w]) => { setTopics(t); setWeakAreas(w); })
      .catch(() => toast.error("Failed to load study data."))
      .finally(() => setLoading(false));
  }, []);

  const diffColor = (d: string) => ({
    easy: "bg-green-100 text-green-700",
    medium: "bg-amber-100 text-amber-700",
    hard: "bg-red-100 text-red-700",
  }[d?.toLowerCase()] || "bg-gray-100 text-gray-700");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={36} className="animate-spin text-accent-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-styrene font-semibold mb-2">Study Sessions</h1>
        <p className="text-text-secondary">Learn, recall, and test your knowledge topic by topic.</p>
      </div>

      {/* Weak Areas */}
      {weakAreas.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-styrene font-semibold flex items-center gap-2">
              <Target size={20} className="text-red-400" /> Focus Areas
            </h2>
            <Link href="/dashboard/weak-areas">
              <Button variant="ghost" className="h-9 px-3 text-xs gap-1 border-border">
                View all <ChevronRight size={14} />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weakAreas.slice(0, 3).map((w, i) => (
              <Link key={i} href={`/dashboard/study/${encodeURIComponent(w.topic_name)}`}>
                <Card className="p-5 hover:shadow-lg transition-all cursor-pointer border-red-100 hover:border-red-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      {w.average_score.toFixed(0)}% accuracy
                    </span>
                    <Target size={16} className="text-red-300" />
                  </div>
                  <h3 className="font-semibold text-sm leading-tight">{w.topic_name}</h3>
                  <div className="h-1.5 bg-bg-raised rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full" style={{ width: `${w.average_score}%` }} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Topics */}
      <section className="space-y-4">
        <h2 className="text-xl font-styrene font-semibold flex items-center gap-2">
          <Brain size={20} className="text-accent-primary" /> All Topics
        </h2>
        {topics.length === 0 ? (
          <div className="text-center py-16 text-text-secondary">
            <Tag size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No topics yet.</p>
            <p className="text-sm mt-1">Upload and process study materials to generate topics.</p>
            <Link href="/dashboard/materials">
              <Button className="mt-4">Upload Materials</Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <Link key={topic.id} href={`/dashboard/study/${topic.id}`}>
                <Card className="p-5 hover:shadow-xl transition-all cursor-pointer group space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", diffColor(topic.difficulty))}>
                      {topic.difficulty}
                    </span>
                    <ChevronRight size={16} className="text-text-secondary group-hover:text-accent-primary transition-colors" />
                  </div>
                  <h3 className="font-styrene font-semibold">{topic.name}</h3>
                  <div className="flex flex-wrap gap-1">
                    {(topic.subtopics || []).slice(0, 3).map((st, i) => (
                      <span key={i} className="text-[10px] bg-bg-raised border border-border rounded-full px-2 py-0.5 text-text-secondary">
                        {st}
                      </span>
                    ))}
                    {(topic.subtopics || []).length > 3 && (
                      <span className="text-[10px] text-text-secondary">+{topic.subtopics.length - 3} more</span>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
