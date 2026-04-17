"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, X, Info } from "lucide-react";
import { toast } from "@/lib/toast";

export function Toast() {
  const [toasts, setToasts] = useState<
    { id: string; message: string; type: string }[]
  >([]);

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  const icons: Record<string, React.ReactNode> = {
    success: <CheckCircle2 size={18} className="text-green-500" />,
    error: <XCircle size={18} className="text-red-500" />,
    loading: <Loader2 size={18} className="text-accent-primary animate-spin" />,
    info: <Info size={18} className="text-blue-500" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-3 bg-white border border-border rounded-2xl px-4 py-3 shadow-2xl min-w-[280px] max-w-[380px]"
          >
            {icons[t.type] || icons.info}
            <p className="flex-1 text-sm font-medium text-text-primary leading-snug">
              {t.message}
            </p>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-text-secondary hover:text-accent-primary transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
