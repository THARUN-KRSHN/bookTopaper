"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * /dashboard/exam — redirects to Papers page so the user can
 * select a paper and start an exam from there.
 */
export default function ExamIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/papers");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] gap-3 text-text-secondary">
      <Loader2 size={24} className="animate-spin text-accent-primary" />
      <span>Redirecting to papers…</span>
    </div>
  );
}
