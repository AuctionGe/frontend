"use client";

import Link from "next/link";
import { Lot, formatPrice, timeLeft, getSourceLabel, getSourceColor } from "@/lib/api";
import { useI18n } from "@/lib/i18n/context";

export function EndingSoonCarousel({ lots, onSeeAll }: { lots: Lot[]; onSeeAll?: () => void }) {
  const { t } = useI18n();
  if (lots.length === 0) return null;

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="font-bold text-[17px] text-text">{t("home.ending_soon")}</h2>
        <button onClick={onSeeAll} className="text-[13px] text-copper font-medium active:opacity-70">
          {t("home.see_all")}
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1">
        {lots.map((lot, i) => (
          <EndingSoonCard key={lot.id} lot={lot} index={i} />
        ))}
      </div>
    </section>
  );
}

function EndingSoonCard({ lot, index }: { lot: Lot; index: number }) {
  const remaining = timeLeft(lot.auction_end);
  const isUrgent = remaining && !remaining.includes("d");

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
      <Link href={`/lot/${lot.id}`} className="block">
        <div className="w-[200px] bg-white rounded-2xl border border-border p-3.5 hover:shadow-md transition-shadow flex-shrink-0">
          {/* Timer badge */}
          <div className={`inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full mb-2.5 ${
            isUrgent
              ? "bg-danger-light text-danger"
              : "bg-copper-light text-copper-dark"
          }`}>
            <span className="animate-pulse">●</span>
            {remaining || "—"}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-[14px] leading-snug text-text line-clamp-2 mb-1.5">
            {lot.title}
          </h3>

          {/* City + Source */}
          <div className="flex items-center gap-1.5 mb-2">
            {lot.city_en && (
              <span className="text-[12px] text-text-secondary">{lot.city_en}</span>
            )}
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
              style={{
                color: getSourceColor(lot.source),
                backgroundColor: getSourceColor(lot.source) + "14",
              }}
            >
              {getSourceLabel(lot.source)}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <span className="font-bold text-[16px] text-text">
              {formatPrice(lot.current_price || lot.starting_price, lot.currency)}
            </span>
            {lot.bids_count > 0 && (
              <span className="text-[11px] text-text-secondary bg-surface px-1.5 py-0.5 rounded-full">
                {lot.bids_count}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
