"use client";

import { useToastStore } from "@/hooks/use-toast";
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border animate-in slide-in-from-bottom-5 fade-in duration-300",
            toast.type === "success" && "bg-emerald-50 border-emerald-200 text-emerald-900",
            toast.type === "error" && "bg-rose-50 border-rose-200 text-rose-900",
            toast.type === "warning" && "bg-amber-50 border-amber-200 text-amber-900",
            toast.type === "info" && "bg-blue-50 border-blue-200 text-blue-900"
          )}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600" />}
            {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-600" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-blue-600" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight">{toast.title}</p>
            {toast.message && (
              <p className="text-xs opacity-90 mt-1 leading-snug">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
