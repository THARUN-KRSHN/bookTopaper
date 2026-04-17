import { create } from "zustand";
import type { User } from "@/lib/api";

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: "login" | "signup";
  setAuthMode: (mode: "login" | "signup") => void;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, token: string, refreshToken?: string) => void;
  clearAuth: () => void;
  initAuth: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  authModalOpen: false,
  setAuthModalOpen: (open) => set({ authModalOpen: open }),
  authMode: "login",
  setAuthMode: (mode) => set({ authMode: mode }),
}));

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token, refreshToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("btp_token", token);
      localStorage.setItem("btp_user", JSON.stringify(user));
      if (refreshToken) localStorage.setItem("btp_refresh_token", refreshToken);
    }
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("btp_token");
      localStorage.removeItem("btp_user");
      localStorage.removeItem("btp_refresh_token");
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  initAuth: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("btp_token");
    const userStr = localStorage.getItem("btp_user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem("btp_token");
        localStorage.removeItem("btp_user");
      }
    }
  },
}));
