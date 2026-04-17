import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: "login" | "signup";
  setAuthMode: (mode: "login" | "signup") => void;
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
