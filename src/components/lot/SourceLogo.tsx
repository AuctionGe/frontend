"use client";

import { memo } from "react";

const LOGOS: Record<string, { gradient: string; text: string; fullName: string }> = {
  livo: {
    gradient: "from-indigo-500 to-violet-500",
    text: "livo",
    fullName: "Livo (TBC Bank)",
  },
  bog: {
    gradient: "from-cyan-500 to-teal-500",
    text: "BoG",
    fullName: "Bank of Georgia",
  },
  eauction: {
    gradient: "from-violet-500 to-purple-600",
    text: "eA",
    fullName: "eAuction.ge",
  },
  tbilisi: {
    gradient: "from-emerald-500 to-green-600",
    text: "Tb",
    fullName: "Tbilisi Municipality",
  },
};

interface SourceLogoProps {
  source: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export const SourceLogo = memo(function SourceLogo({ source, size = "md", showName = false }: SourceLogoProps) {
  const config = LOGOS[source] || LOGOS.eauction;
  const sizeMap = {
    sm: "w-6 h-6 text-[8px] rounded-md",
    md: "w-10 h-10 text-[13px] rounded-xl",
    lg: "w-14 h-14 text-[16px] rounded-2xl",
  };

  // Use real SVG logo for Livo (we have it).
  if (source === "livo") {
    return (
      <div className="flex items-center gap-2">
        <div className={`${sizeMap[size]} bg-gradient-to-br ${config.gradient} flex items-center justify-center overflow-hidden`}>
          <img src="/sources/livo.svg" alt="Livo" className="w-[70%] h-[70%] object-contain brightness-0 invert" />
        </div>
        {showName && <span className="text-[14px] font-semibold text-text">{config.fullName}</span>}
      </div>
    );
  }

  // Use real GIF for eAuction.
  if (source === "eauction") {
    return (
      <div className="flex items-center gap-2">
        <div className={`${sizeMap[size]} bg-gradient-to-br ${config.gradient} flex items-center justify-center overflow-hidden`}>
          <img src="/sources/eauction.gif" alt="eAuction" className="w-[80%] h-[80%] object-contain brightness-0 invert" />
        </div>
        {showName && <span className="text-[14px] font-semibold text-text">{config.fullName}</span>}
      </div>
    );
  }

  // Styled text fallback for BoG and Tbilisi.
  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeMap[size]} bg-gradient-to-br ${config.gradient} flex items-center justify-center font-bold text-white`}>
        {config.text}
      </div>
      {showName && <span className="text-[14px] font-semibold text-text">{config.fullName}</span>}
    </div>
  );
});
