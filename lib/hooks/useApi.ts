"use client";

import { useState, useCallback } from "react";
import { toast } from "@/lib/toast";

/**
 * A basic hook for handling API calls with loading and error states.
 */
export function useApi<T>(apiFunc: (...args: any[]) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(err.message || "An error occurred");
        setError(error);
        toast.error(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, loading, error, execute, setData };
}
