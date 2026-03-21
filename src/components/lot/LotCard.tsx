"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { Lot, formatPrice, formatArea, timeLeft, getSourceLabel, getSourceColor, proxyImg } from "@/lib/api";
import { PropertyIcon } from "./PropertyIcon";
import { FavoriteButton } from "./FavoriteButton";
import { useI18n } from "@/lib/i18n/context";

export const LotCard = memo(function LotCard({ lot, index = 0 }: { lot: Lot; index?: number }) {
  const { t, cityName } = useI18n();
  const remaining = lot.status === "active" ? timeLeft(lot.auction_end) : null;
  const isUrgent = remaining && !remaining.includes("d");
  const noBids = lot.bids_count === 0 && lot.status === "active";
  const [imgError, setImgError] = useState(false);
  const city = cityName(lot);
  const typeKey = `type.${lot.property_type || "other"}` as any;

  return (
    <div
      className={index < 20 ? "animate-fade-in-up" : ""}
      style={index < 20 ? { animationDelay: `${Math.min(index * 40, 400)}ms` } : undefined}
    >
      <Link href={`/app/lot/${lot.id}`} className="block">
        <div className="bg-white rounded-2xl border border-border p-4 hover:shadow-md transition-shadow duration-200 active:scale-[0.99] relative">
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton lotId={lot.id} lotTitle={lot.title} size="sm" />
          </div>
          <div className="flex gap-3.5">
            {/* Thumbnail — small, with fallback */}
            <div className="w-20 h-20 rounded-xl bg-surface flex-shrink-0 overflow-hidden relative">
              {lot.thumbnail && !imgError ? (
                <>
                  <div className="absolute inset-0 animate-pulse bg-surface" />
                  <img
                    src={proxyImg(lot.thumbnail)}
                    alt=""
                    className="relative w-full h-full object-cover"
                    loading="lazy"
                    onError={() => setImgError(true)}
                    onLoad={(e) => {
                      // Hide skeleton when loaded.
                      const el = e.currentTarget.previousElementSibling as HTMLElement;
                      if (el) el.style.display = "none";
                    }}
                  />
                </>
              ) : (
                <PropertyIcon type={lot.property_type} size="md" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[15px] leading-tight text-text line-clamp-2">
                {lot.title}
              </h3>

              {/* Location + Source */}
              <div className="flex items-center gap-1.5 mt-1">
                {city && (
                  <span className="text-[13px] text-text-secondary">{city}</span>
                )}
                {city && <span className="text-divider">·</span>}
                <span
                  className="text-[11px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{
                    color: getSourceColor(lot.source),
                    backgroundColor: getSourceColor(lot.source) + "14",
                  }}
                >
                  {getSourceLabel(lot.source)}
                </span>
              </div>

              {/* Price + Bids */}
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-bold text-[17px] tracking-tight text-text">
                  {formatPrice(lot.current_price || lot.starting_price, lot.currency)}
                </span>
                {lot.bids_count > 0 && (
                  <span className="text-[12px] text-text-secondary">
                    {lot.bids_count} bid{lot.bids_count !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-divider">
            <div className="flex items-center gap-1.5 flex-wrap">
              {lot.property_type && (
                <span className="text-[11px] bg-surface text-text-secondary px-2 py-0.5 rounded-full">
                  {t(typeKey)}
                </span>
              )}
              {formatArea(lot.building_area) && (
                <span className="text-[11px] bg-surface text-text-secondary px-2 py-0.5 rounded-full">
                  {formatArea(lot.building_area)}
                </span>
              )}
              {!lot.building_area && formatArea(lot.land_area) && (
                <span className="text-[11px] bg-surface text-text-secondary px-2 py-0.5 rounded-full">
                  {formatArea(lot.land_area)}
                </span>
              )}
              {lot.rooms && (
                <span className="text-[11px] bg-surface text-text-secondary px-2 py-0.5 rounded-full">
                  {lot.rooms} rm
                </span>
              )}
            </div>

            {remaining ? (
              <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${
                isUrgent ? "bg-danger-light text-danger" : "bg-copper-light text-copper-dark"
              }`}>
                ⏰ {remaining}
              </span>
            ) : noBids ? (
              <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-gold-light text-gold">
                {t("status.no_bids")}
              </span>
            ) : lot.status === "active" ? (
              <span className="text-[12px] font-medium text-success">{t("status.active")}</span>
            ) : (
              <span className="text-[12px] font-medium text-text-secondary capitalize">
                {lot.status}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
});
