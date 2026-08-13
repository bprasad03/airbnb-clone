"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

interface AppContextValue {
  user: User | null;
  userId: number;
  setUserId: (id: number) => void;
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "error") => void;
  dismissToast: (id: number) => void;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const refreshUser = useCallback(async () => {
    try {
      const u = await api.getCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("userId");
    if (stored) setUserIdState(Number(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("userId", String(userId));
    refreshUser();
  }, [userId, refreshUser]);

  const setUserId = (id: number) => setUserIdState(id);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismissToast(id), 4000);
  }, [dismissToast]);

  return (
    <AppContext.Provider
      value={{
        user,
        userId,
        setUserId,
        toasts,
        showToast,
        dismissToast,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
