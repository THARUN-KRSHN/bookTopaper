"use client";

import { useEffect, useState } from "react";
import {
  Files, FileText, Activity, Target, Plus, Zap, Brain, Clock, Loader2
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthStore, useUIStore } from "@/lib/store";
import { materials as materialsApi, papers as papersApi, evaluations as evalApi } from "@/lib/api";
import { toast } from "@/lib/toast";

export default function DashboardHome() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    materials: 0,
    papers: 0,
    exams: 0,
    avgScore: null as number | null,
  });
  const [recentEvals, setRecentEvals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.full_name?.split(" ")[0] || "there";

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [mats, paps, evals] = await Promise.all([
          materialsApi.list().catch(() => []),
          papersApi.list().catch(() => []),
          evalApi.list().catch(() => []),
        ]);

        const avgScore =
          evals.length > 0
            ? Math.round(
                evals.reduce(
                  (sum: number, e: any) =>
                    sum + (e.scored_marks / e.total_marks) * 100,
                  0
                ) / evals.length
              )
            : null;

        setStats({
          materials: mats.length,
          papers: paps.length,
          exams: evals.length,
          avgScore,
        });
        setRecentEvals(evals.slice(0, 3));
      } catch {
        // silently fail — show zeros
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const { addNotification } = useUIStore();

  useEffect(() => {
    if (user && !sessionStorage.getItem("btp_welcome_sent")) {
      addNotification({
        title: `Welcome back, ${firstName}!`,
        message: "You've successfully signed in. Let's get some studying done today.",
        type: "success",
      });
      sessionStorage.setItem("btp_welcome_sent", "true");
    }
  }, [user, firstName, addNotification]);

  const statCards = [
    { label: "Materials uploaded", value: stats.materials, icon: Files, color: "text-blue-500" },
    { label: "Papers generated", value: stats.papers, icon: FileText, color: "text-accent-primary" },
    { label: "Exams taken", value: stats.exams, icon: Clock, color: "text-amber-500" },
    {
      label: "Average score",
      value: stats.avgScore !== null ? `${stats.avgScore}%` : "—",
      icon: Target,
      color: "text-green-500",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-styrene font-semibold mb-1 md:mb-2 text-text-primary">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-sm text-text-secondary leading-tight opacity-70">
            Track your progress and pick up where you left off.
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/dashboard/evaluations" className="flex-1 md:flex-none">
            <Button variant="ghost" className="w-full h-10 md:h-11 shadow-sm px-4 md:px-5 text-sm">
              Evaluations
            </Button>
          </Link>
          <Link href="/dashboard/papers" className="flex-1 md:flex-none">
            <Button className="w-full h-10 md:h-11 shadow-lg px-4 md:px-5 flex items-center justify-center gap-2 text-sm">
              <Plus size={16} />
              New Paper
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {statCards.map((stat, idx) => (
          <Card
            key={idx}
            className="p-4 md:p-6 flex flex-col gap-3 md:gap-4 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "p-2 md:p-2.5 rounded-xl bg-bg-raised group-hover:bg-white transition-colors",
                  stat.color
                )}
              >
                <stat.icon size={18} className="md:w-5 md:h-5" />
              </div>
              {loading ? (
                <Loader2 size={12} className="text-text-secondary/30 animate-spin" />
              ) : (
                <Activity size={14} className="text-text-secondary/30 hidden md:block" />
              )}
            </div>
            <div>
              <p className="text-2xl md:text-[32px] font-styrene font-bold tabular-nums text-text-primary">
                {loading ? "—" : stat.value}
              </p>
              <p className="text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">
                {stat.label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Quick Actions + Activity */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <section>
            <h2 className="text-lg md:text-xl font-styrene font-semibold mb-4 md:mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <Link href="/dashboard/materials">
                <ActionCard
                  icon={Plus}
                  title="Upload Material"
                  desc="Add PDFs, images or notes"
                  variant="primary"
                />
              </Link>
              <Link href="/dashboard/papers">
                <ActionCard
                  icon={Zap}
                  title="Generate Paper"
                  desc="AI-powered exam drafting"
                />
              </Link>
              <Link href="/dashboard/papers">
                <ActionCard
                  icon={Clock}
                  title="Start Exam"
                  desc="Begin a timed session"
                />
              </Link>
              <Link href="/dashboard/study">
                <ActionCard
                  icon={Brain}
                  title="Study Session"
                  desc="Flashcards & active recall"
                />
              </Link>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-styrene font-semibold">Recent Evaluations</h2>
              <Link href="/dashboard/evaluations">
                <Button variant="ghost" className="text-xs px-3 h-8">
                  View All
                </Button>
              </Link>
            </div>
            <Card className="divide-y divide-border p-0 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={24} className="animate-spin text-accent-primary" />
                </div>
              ) : recentEvals.length === 0 ? (
                <div className="text-center py-10 text-text-secondary text-sm">
                  <p>No evaluations yet.</p>
                  <Link href="/dashboard/papers">
                    <Button className="mt-3 h-9 text-xs px-4">Take your first exam</Button>
                  </Link>
                </div>
              ) : (
                recentEvals.map((ev: any, i: number) => (
                  <Link key={i} href={`/dashboard/evaluations/${ev.id}`}>
                    <div className="p-4 flex items-center justify-between gap-4 hover:bg-bg-raised/50 transition-colors cursor-pointer">
                      <div className="flex gap-3 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-accent-primary mt-1.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">
                            Grade {ev.grade} — {ev.scored_marks}/{ev.total_marks} marks
                          </p>
                          <p className="text-xs text-text-secondary truncate">
                            {Math.round((ev.scored_marks / ev.total_marks) * 100)}% score
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-text-secondary/50 uppercase whitespace-nowrap">
                        {new Date(ev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </Card>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-styrene font-semibold mb-6">Score Overview</h2>
            <Card className="p-6 bg-gradient-to-br from-accent-primary to-accent-primary/80 text-white relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-6xl font-berkeley font-bold mb-2">
                  {loading || stats.avgScore === null ? "—" : `${stats.avgScore}%`}
                </div>
                <p className="text-sm font-medium opacity-90 mb-4 uppercase tracking-widest">
                  Avg. Score
                </p>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-6 h-6 rounded-md",
                        i < (stats.exams > 7 ? 7 : stats.exams)
                          ? "bg-white/30"
                          : "bg-white/10"
                      )}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-styrene font-semibold mb-6">Study Hub</h2>
            <Card className="p-0 overflow-hidden">
              <div className="bg-bg-raised p-4 border-b border-border">
                <p className="text-sm font-semibold">Get Started</p>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-text-secondary leading-relaxed">
                  Upload your study materials to unlock AI-powered topic cards, practice questions, and a personalised revision plan.
                </p>
                <div className="space-y-2">
                  <Link href="/dashboard/study">
                    <Button className="w-full bg-accent-warm hover:bg-accent-warm/90 border-none shadow-md h-10 text-sm">
                      Browse Topics
                    </Button>
                  </Link>
                  <Link href="/dashboard/planner">
                    <Button variant="ghost" className="w-full h-10 text-sm border-border">
                      Revision Planner
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  desc,
  variant = "default",
}: {
  icon: any;
  title: string;
  desc: string;
  variant?: "primary" | "default";
}) {
  return (
    <div
      className={cn(
        "p-4 md:p-5 rounded-2xl border flex items-center md:items-start gap-4 text-left transition-all hover:shadow-lg group cursor-pointer",
        variant === "primary"
          ? "bg-accent-primary/5 border-accent-primary/20"
          : "bg-bg-surface border-border hover:border-accent-primary/30"
      )}
    >
      <div
        className={cn(
          "p-2 md:p-2.5 rounded-xl transition-colors shrink-0",
          variant === "primary"
            ? "bg-accent-primary text-white"
            : "bg-bg-raised group-hover:bg-accent-primary group-hover:text-white"
        )}
      >
        <Icon size={18} className="md:w-5 md:h-5" />
      </div>
      <div>
        <p className="font-bold text-sm mb-0.5 md:mb-1">{title}</p>
        <p className="text-[11px] md:text-xs text-text-secondary leading-normal opacity-70">{desc}</p>
      </div>
    </div>
  );
}
