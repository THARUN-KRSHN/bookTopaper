"use client";

import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div 
        className="relative w-full max-w-md bg-white dark:bg-bg-raised rounded-3xl shadow-2xl p-8 space-y-6 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-start justify-between">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
            variant === "danger" ? "bg-red-50 text-red-500" :
            variant === "warning" ? "bg-amber-50 text-amber-500" :
            "bg-accent-primary/10 text-accent-primary"
          )}>
            <AlertCircle size={28} />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-raised rounded-xl transition-colors text-text-secondary">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-styrene font-bold text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="flex-1 h-11 border-border shadow-sm text-sm"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "flex-1 h-11 shadow-lg text-sm",
              variant === "danger" && "bg-red-500 hover:bg-red-600 text-white",
              variant === "warning" && "bg-amber-500 hover:bg-amber-600 text-white"
            )}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
