"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: { id: number; message: string; type: "success" | "error" };
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-card ${
        toast.type === "success" ? "bg-[#222] text-white" : "bg-[#ff385c] text-white"
      }`}
    >
      {toast.type === "success" ? (
        <CheckCircle className="h-5 w-5 shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0" />
      )}
      <span className="text-sm font-medium">{toast.message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss">
        <X className="h-4 w-4 opacity-70" />
      </button>
    </div>
  );
}
