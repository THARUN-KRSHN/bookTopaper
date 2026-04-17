/**
 * lib/toast.ts — Lightweight toast notification system (no external deps)
 */
type ToastType = "success" | "error" | "loading" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners: Listener[] = [];

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

export const toast = {
  subscribe(listener: Listener) {
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) listeners.splice(idx, 1);
    };
  },

  show(message: string, type: ToastType = "info", duration = 4000) {
    const id = Math.random().toString(36).slice(2);
    toasts = [...toasts, { id, message, type }];
    notify();
    if (type !== "loading") {
      setTimeout(() => {
        toasts = toasts.filter((t) => t.id !== id);
        notify();
      }, duration);
    }
    return id;
  },

  success(message: string, duration = 4000) {
    return toast.show(message, "success", duration);
  },

  error(message: string, duration = 5000) {
    return toast.show(message, "error", duration);
  },

  loading(message: string) {
    return toast.show(message, "loading");
  },

  dismiss(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
};
