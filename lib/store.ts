import { create } from "zustand";
import type { User } from "@/lib/api";

export type Theme = "light" | "dark" | "system";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
}

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: "login" | "signup";
  setAuthMode: (mode: "login" | "signup") => void;

  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  helpModalOpen: boolean;
  setHelpModalOpen: (open: boolean) => void;

  typographyScale: number;
  setTypographyScale: (scale: number) => void;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, token: string, refreshToken?: string) => void;
  clearAuth: () => void;
  initAuth: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  authModalOpen: false,
  setAuthModalOpen: (open) => set({ authModalOpen: open }),
  authMode: "login",
  setAuthMode: (mode) => set({ authMode: mode }),

  theme: "system",
  setTheme: (theme) => {
    localStorage.setItem("btp_theme", theme);
    set({ theme });
    applyTheme(theme);
  },

  notifications: [],
  addNotification: (n) => {
    const notification: Notification = {
      ...n,
      id: Math.random().toString(36).slice(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
    };
    const newNotifications = [notification, ...get().notifications].slice(0, 50);
    localStorage.setItem("btp_notifications", JSON.stringify(newNotifications));
    set({ notifications: newNotifications });
  },
  markNotificationAsRead: (id) => {
    const newNotifications = get().notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem("btp_notifications", JSON.stringify(newNotifications));
    set({ notifications: newNotifications });
  },
  clearNotifications: () => {
    localStorage.removeItem("btp_notifications");
    set({ notifications: [] });
  },

  helpModalOpen: false,
  setHelpModalOpen: (open) => set({ helpModalOpen: open }),

  typographyScale: 100,
  setTypographyScale: (scale) => {
    localStorage.setItem("btp_typo", scale.toString());
    set({ typographyScale: scale });
    document.documentElement.style.fontSize = `${scale}%`;
  },
}));

function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  const root = window.document.documentElement;
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

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

    // Init UI State
    const ui = useUIStore.getState();
    const savedTheme = localStorage.getItem("btp_theme") as Theme;
    if (savedTheme) ui.setTheme(savedTheme);
    else applyTheme("system");

    const savedNotifications = localStorage.getItem("btp_notifications");
    if (savedNotifications) {
      try {
        useUIStore.setState({ notifications: JSON.parse(savedNotifications) });
      } catch {}
    }

    const savedTypo = localStorage.getItem("btp_typo");
    if (savedTypo) ui.setTypographyScale(parseInt(savedTypo));
  },
}));
