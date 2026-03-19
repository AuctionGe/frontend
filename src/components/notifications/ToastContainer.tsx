"use client";

import Link from "next/link";
import { useToast, Toast } from "./ToastProvider";

const TOAST_CONFIG: Record<string, { icon: string; accent: string; bg: string }> = {
  bid: { icon: "⚡", accent: "text-copper-dark", bg: "bg-copper-50 border-copper/20" },
  new: { icon: "🆕", accent: "text-success", bg: "bg-success-light border-success/20" },
  favorite: { icon: "♥", accent: "text-danger", bg: "bg-danger-light border-danger/20" },
  info: { icon: "ℹ", accent: "text-text", bg: "bg-surface border-border" },
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[90] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)] lg:top-20">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;

  const content = (
    <div
      className={`rounded-2xl border p-3.5 shadow-lg animate-fade-in-up backdrop-blur-lg ${config.bg}`}
      style={{ animationDuration: "0.2s" }}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5">{config.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-semibold ${config.accent}`}>{toast.title}</p>
          <p className="text-[12px] text-text-secondary mt-0.5 line-clamp-2">{toast.message}</p>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDismiss(); }}
          className="text-text-secondary/50 hover:text-text-secondary flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );

  if (toast.lotId) {
    return <Link href={`/lot/${toast.lotId}`} onClick={onDismiss}>{content}</Link>;
  }

  return content;
}
