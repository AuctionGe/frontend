"use client";

import Link from "next/link";
import { Lot, getSourceLabel, getSourceColor, formatPrice } from "@/lib/api";
import { useI18n } from "@/lib/i18n/context";

export function NoBidsSection({ lots, onSeeAll }: { lots: Lot[]; onSeeAll?: () => void }) {
  const { t } = useI18n();
  if (lots.length === 0) return null;

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between px-5 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-[17px] text-text">{t("home.no_bids")}</h2>
          <span className="bg-gold-light text-gold text-[11px] font-bold px-2 py-0.5 rounded-full">
            {t("home.opportunity")}
          </span>
        </div>
        <button onClick={onSeeAll} className="text-[13px] text-copper font-medium active:opacity-70">
          {t("home.see_all")}
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1">
        {lots.map((lot, i) => (
          <NoBidCard key={lot.id} lot={lot} index={i} />
        ))}
      </div>
    </section>
  );
}

function NoBidCard({ lot, index }: { lot: Lot; index: number }) {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
      <Link href={`/lot/${lot.id}`} className="block">
        <div className="w-[200px] bg-white rounded-2xl border-2 border-gold/20 p-3.5 hover:shadow-md hover:border-gold/40 transition-all flex-shrink-0 relative overflow-hidden">
          {/* Subtle gold gradient at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/40 via-gold/80 to-gold/40" />

          {/* Source */}
          <span
            className="text-[11px] font-medium px-1.5 py-0.5 rounded-full inline-block mb-2"
            style={{
              color: getSourceColor(lot.source),
              backgroundColor: getSourceColor(lot.source) + "14",
            }}
          >
            {getSourceLabel(lot.source)}
          </span>

          {/* Title */}
          <h3 className="font-semibold text-[14px] leading-snug text-text line-clamp-2 mb-1.5">
            {lot.title}
          </h3>

          {/* City */}
          {lot.city_en && (
            <p className="text-[12px] text-text-secondary mb-2">{lot.city_en}</p>
          )}

          {/* Price */}
          <span className="font-bold text-[16px] text-text">
            {formatPrice(lot.current_price || lot.starting_price, lot.currency)}
          </span>
        </div>
      </Link>
    </div>
  );
}
