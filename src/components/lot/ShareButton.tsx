"use client";

import { useCallback } from "react";
import { useToast } from "@/components/notifications/ToastProvider";
import { useI18n } from "@/lib/i18n/context";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  size?: "sm" | "md";
}

export function ShareButton({ title, text, url, size = "md" }: ShareButtonProps) {
  const { push } = useToast();
  const { t } = useI18n();

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Try native Web Share API (mobile).
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        // User cancelled or not supported — fall through to clipboard.
      }
    }

    // Fallback: copy link.
    try {
      await navigator.clipboard.writeText(shareUrl);
      push({
        type: "info",
        title: t("share.copied"),
        message: shareUrl,
      });
    } catch {
      // Final fallback.
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      push({ type: "info", title: t("share.copied"), message: shareUrl });
    }
  }, [title, text, shareUrl, push, t]);

  const sizeClasses = size === "md"
    ? "w-10 h-10 rounded-full"
    : "w-8 h-8 rounded-lg";

  return (
    <button
      onClick={handleShare}
      className={`${sizeClasses} flex items-center justify-center bg-surface text-text-secondary hover:text-text hover:bg-border transition-colors active:scale-90`}
      aria-label={t("share.title")}
    >
      <svg className={size === "md" ? "w-5 h-5" : "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
    </button>
  );
}
