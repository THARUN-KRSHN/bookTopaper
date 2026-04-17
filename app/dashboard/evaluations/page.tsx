"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, ChevronRight, Loader2, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn, formatDate } from "@/lib/utils";
import { evaluations as evalApi } from "@/lib/api";
import { toast } from "@/lib/toast";

export default function EvaluationsPage() {
  const [evalList, setEvalList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    evalApi.list()
      .then(setEvalList)
      .catch(() => toast.error("Failed to load evaluations."))
      .finally(() => setLoading(false));
  }, []);

  const gradeColor = (grade: string) => ({
    S: "bg-violet-100 text-violet-700",
    A: "bg-green-100 text-green-700",
    B: "bg-blue-100 text-blue-700",
    C: "bg-amber-100 text-amber-700",
    D: "bg-orange-100 text-orange-700",
    E: "bg-red-100 text-red-700",
    F: "bg-red-200 text-red-800",
  }[grade] || "bg-gray-100 text-gray-700");

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-styrene font-semibold mb-2">Evaluations</h1>
        <p className="text-text-secondary">AI-graded results from your submitted exams.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={36} className="animate-spin text-accent-primary" />
        </div>
      ) : evalList.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">
          <BadgeCheck size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No evaluations yet.</p>
          <p className="text-sm mt-1">Take an exam and submit it to see your AI-graded results here.</p>
          <Link href="/dashboard/papers">
            <Button className="mt-6">Go to Papers</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evalList.map((ev) => {
            const pct = Math.round((ev.scored_marks / ev.total_marks) * 100);
            return (
              <Link key={ev.id} href={`/dashboard/evaluations/${ev.id}`}>
                <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={cn("px-3 py-1 rounded-full text-sm font-bold", gradeColor(ev.grade))}>
                      Grade {ev.grade}
                    </span>
                    <ChevronRight size={18} className="text-text-secondary group-hover:text-accent-primary transition-colors group-hover:translate-x-1 transition-transform" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-3xl font-styrene font-bold text-text-primary">
                      {ev.scored_marks}
                      <span className="text-base font-normal text-text-secondary">/{ev.total_marks}</span>
                    </div>
                    <div className="text-sm text-text-secondary">{pct}% score</div>
                  </div>

                  <div className="h-2 bg-bg-raised rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-primary to-accent-warm rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <p className="text-xs text-text-secondary">{formatDate(ev.created_at)}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
