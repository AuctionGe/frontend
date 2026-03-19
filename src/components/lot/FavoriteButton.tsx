"use client";

import { useFavorites } from "@/lib/favorites/context";
import { useToast } from "@/components/notifications/ToastProvider";

interface FavoriteButtonProps {
  lotId: number;
  lotTitle?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({ lotId, lotTitle, size = "sm" }: FavoriteButtonProps) {
  const { toggle, isFavorite } = useFavorites();
  const { push } = useToast();
  const active = isFavorite(lotId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(lotId);

    if (!active) {
      push({
        type: "favorite",
        title: "Added to favorites",
        message: lotTitle || `Lot #${lotId}`,
        lotId,
      });
    }
  };

  const sizeClasses = size === "md"
    ? "w-10 h-10 rounded-full"
    : "w-8 h-8 rounded-lg";

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses} flex items-center justify-center transition-all active:scale-90 ${
        active
          ? "bg-danger/10 text-danger"
          : "bg-surface text-text-secondary hover:text-danger hover:bg-danger/5"
      }`}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className={size === "md" ? "w-5 h-5" : "w-4 h-4"}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={active ? 0 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
