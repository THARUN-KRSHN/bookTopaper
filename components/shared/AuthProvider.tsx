"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";

/**
 * AuthProvider — initialises auth from localStorage on every page load.
 * Must be a Client Component; renders nothing visible.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <>{children}</>;
}
