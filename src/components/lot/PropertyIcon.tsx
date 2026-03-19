import { memo } from "react";

const ICONS: Record<string, { path: string; color: string; bg: string }> = {
  land: {
    path: "M2 22l5-5 3 3 4-4 3 3 5-5M2 22V8l5 5 3-3 4 4 3-3 5 5v6H2z",
    color: "#16A34A",
    bg: "#E8F8EE",
  },
  apartment: {
    path: "M6 3h12v18H6V3zm3 3h2v2H9V6zm4 0h2v2h-2V6zM9 10h2v2H9v-2zm4 0h2v2h-2v-2zM9 14h2v2H9v-2zm4 0h2v2h-2v-2zM10 18h4v3h-4v-3z",
    color: "#6366F1",
    bg: "#EEF0FF",
  },
  house: {
    path: "M3 12l9-8 9 8M5 10v10h14V10M9 21v-6h6v6",
    color: "#E07A2F",
    bg: "#FFF3E8",
  },
  commercial: {
    path: "M4 21V8l8-5 8 5v13H4zm4-8h2v2H8v-2zm4-4h2v2h-2v-2zm4 4h2v2h-2v-2zm-4 4h2v2h-2v-2z",
    color: "#0891B2",
    bg: "#E8F6F9",
  },
  hotel: {
    path: "M3 21V7l9-4 9 4v14M7 11h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM7 15h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM10 21v-3h4v3",
    color: "#7C3AED",
    bg: "#F0EBFF",
  },
  garage: {
    path: "M4 21V10l8-6 8 6v11H4zm3-4h10v3H7v-3zm2-3h6v2H9v-2z",
    color: "#71717A",
    bg: "#F4F4F5",
  },
  factory: {
    path: "M4 21V11l4-3v4l4-3v4l4-3v4l4-3v7H4zm2-4h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z",
    color: "#92400E",
    bg: "#FEF3C7",
  },
  restaurant: {
    path: "M7 3v6a3 3 0 003 3h0a3 3 0 003-3V3M10 12v9M17 3v18M17 3c-2 0-3 1.5-3 4s1 4 3 4",
    color: "#DC2626",
    bg: "#FEE8E8",
  },
};

const DEFAULT = {
  path: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  color: "#71717A",
  bg: "#F4F4F5",
};

export const PropertyIcon = memo(function PropertyIcon({ type, size = "md" }: { type?: string; size?: "sm" | "md" | "lg" }) {
  const config = ICONS[type || ""] || DEFAULT;
  const sizeMap = { sm: "w-10 h-10", md: "w-20 h-20", lg: "w-28 h-28" };
  const iconSize = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };

  return (
    <div
      className={`${sizeMap[size]} rounded-xl flex items-center justify-center`}
      style={{ backgroundColor: config.bg }}
    >
      <svg
        className={iconSize[size]}
        fill="none"
        viewBox="0 0 24 24"
        stroke={config.color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={config.path} />
      </svg>
    </div>
  );
});
