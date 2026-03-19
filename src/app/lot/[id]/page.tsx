"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Lot, fetchLot, formatPrice, formatArea, timeLeft,
  getSourceLabel, getSourceColor, getPropertyTypeLabel, proxyImg,
} from "@/lib/api";
import { PropertyIcon } from "@/components/lot/PropertyIcon";
import { PhotoLightbox } from "@/components/lot/PhotoLightbox";
import { LotJsonLd } from "@/components/lot/LotJsonLd";
import { FavoriteButton } from "@/components/lot/FavoriteButton";
import { ShareButton } from "@/components/lot/ShareButton";
import { SourceLogo } from "@/components/lot/SourceLogo";

const LotMap = dynamic(() => import("@/components/map/LotMap").then(m => ({ default: m.LotMap })), {
  ssr: false,
  loading: () => <div className="h-[180px] bg-surface rounded-2xl animate-pulse" />,
});

export default function LotDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lot, setLot] = useState<Lot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchLot(Number(id))
      .then(setLot)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="px-5 pt-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface rounded-xl w-2/3" />
          <div className="h-5 bg-surface rounded-xl w-1/3" />
          <div className="h-32 bg-surface rounded-2xl" />
          <div className="h-20 bg-surface rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="px-5 pt-16 text-center">
        <p className="text-text-secondary text-[15px]">Lot not found</p>
      </div>
    );
  }

  const remaining = lot.status === "active" ? timeLeft(lot.auction_end) : null;
  const isUrgent = remaining && !remaining.includes("d");
  const hasImages = lot.images && lot.images.length > 0;

  return (
    <>
    <LotJsonLd lot={lot} />
    <div className="pb-8 lg:pb-12">
      {/* Fixed header — mobile only (desktop has DesktopNav) */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-border lg:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-12 mt-[env(safe-area-inset-top)]">
          <button onClick={() => router.back()} className="p-1.5 -ml-1.5 rounded-full hover:bg-surface">
            <svg className="w-6 h-6 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="text-[13px] text-text-secondary font-medium">Lot #{lot.id}</span>
          <div className="flex items-center gap-1">
            <FavoriteButton lotId={lot.id} lotTitle={lot.title} size="md" />
            <ShareButton
              title={lot.title}
              text={`${lot.title} — ${lot.current_price ? formatPrice(lot.current_price, lot.currency) : ""}`}
              size="md"
            />
          </div>
        </div>
      </div>

      <div className="pt-14 px-5 lg:pt-4 lg:px-0 lg:max-w-4xl lg:mx-auto">
        {/* Status + Source */}
        <div
          className="flex items-center gap-2 mt-4"
        >
          {lot.status === "active" ? (
            <span className="text-[12px] font-semibold text-success bg-success-light px-2.5 py-1 rounded-full">
              Active
            </span>
          ) : (
            <span className="text-[12px] font-medium text-text-secondary bg-surface px-2.5 py-1 rounded-full capitalize">
              {lot.status}
            </span>
          )}
          <span
            className="text-[11px] font-medium px-2 py-1 rounded-full"
            style={{
              color: getSourceColor(lot.source),
              backgroundColor: getSourceColor(lot.source) + "14",
            }}
          >
            {getSourceLabel(lot.source)}
          </span>
          {remaining && (
            <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${
              isUrgent ? "bg-danger-light text-danger" : "bg-copper-light text-copper-dark"
            }`}>
              ⏰ {remaining}
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          className="text-[22px] font-bold text-text leading-tight mt-3"
        >
          {lot.title}
        </h1>

        {/* Location */}
        {(lot.city_en || lot.address) && (
          <p
            className="text-[14px] text-text-secondary mt-1.5"
          >
            {[lot.city_en, lot.district_en, lot.address].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Price block */}
        <div
          className="mt-5 bg-surface rounded-2xl p-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] text-text-secondary font-medium uppercase tracking-wide">Current Price</p>
              <p className="text-[28px] font-bold text-text tracking-tight mt-0.5">
                {formatPrice(lot.current_price, lot.currency)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-text-secondary">Bids</p>
              <p className="text-[22px] font-bold text-text">{lot.bids_count}</p>
            </div>
          </div>

          {(lot.starting_price || lot.bid_step) && (
            <div className="flex gap-4 mt-3 pt-3 border-t border-divider">
              {lot.starting_price && (
                <div>
                  <p className="text-[11px] text-text-secondary">Starting</p>
                  <p className="text-[14px] font-semibold text-text">{formatPrice(lot.starting_price, lot.currency)}</p>
                </div>
              )}
              {lot.bid_step && (
                <div>
                  <p className="text-[11px] text-text-secondary">Bid Step</p>
                  <p className="text-[14px] font-semibold text-text">{formatPrice(lot.bid_step, lot.currency)}</p>
                </div>
              )}
              {lot.buy_now_price && (
                <div>
                  <p className="text-[11px] text-text-secondary">Buy Now</p>
                  <p className="text-[14px] font-semibold text-copper">{formatPrice(lot.buy_now_price, lot.currency)}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        {lot.source_url && (
          <a
            href={lot.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 w-full py-3.5 bg-copper hover:bg-copper-dark text-white font-semibold text-[15px] text-center rounded-2xl transition-colors active:scale-[0.99]"
          >
            Go to auction →
          </a>
        )}

        {/* Photos */}
        {hasImages && (
          <div
            className="mt-6"
          >
            <h3 className="text-[15px] font-semibold text-text mb-3">Photos</h3>
            <PhotoGallery images={lot.images!} propertyType={lot.property_type} />
          </div>
        )}

        {/* Characteristics */}
        <div
          className="mt-6"
        >
          <h3 className="text-[15px] font-semibold text-text mb-3">Details</h3>
          <div className="bg-surface rounded-2xl divide-y divide-divider">
            {lot.property_type && (
              <DetailRow label="Type" value={getPropertyTypeLabel(lot.property_type)} />
            )}
            {formatArea(lot.building_area) && <DetailRow label="Building Area" value={formatArea(lot.building_area)!} />}
            {formatArea(lot.land_area) && <DetailRow label="Land Area" value={formatArea(lot.land_area)!} />}
            {lot.rooms && <DetailRow label="Rooms" value={String(lot.rooms)} />}
            {lot.floor && <DetailRow label="Floor" value={String(lot.floor)} />}
            {lot.cadastral_code && (
              <DetailRow label="Cadastral Code" value={lot.cadastral_code} mono />
            )}
            {lot.auction_start && (
              <DetailRow label="Auction Start" value={new Date(lot.auction_start).toLocaleDateString()} />
            )}
            {lot.auction_end && (
              <DetailRow label="Auction End" value={new Date(lot.auction_end).toLocaleDateString()} />
            )}
          </div>
        </div>

        {/* Location map + actions */}
        {(lot.latitude || lot.address || lot.city_en) && (
          <div
            className="mt-6"
          >
            <h3 className="text-[15px] font-semibold text-text mb-3">Location</h3>

            {/* Interactive mini-map */}
            {lot.latitude && lot.longitude ? (
              <div className="mb-3 border border-border rounded-2xl overflow-hidden">
                <LotMap
                  markers={[{
                    id: lot.id,
                    lat: lot.latitude,
                    lng: lot.longitude,
                    title: lot.title,
                    source: lot.source,
                  }]}
                  height="180px"
                  interactive={false}
                  singlePin
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-surface border border-border h-[120px] flex items-center justify-center mb-3">
                <div className="text-center">
                  <svg className="w-8 h-8 text-text-secondary/30 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <p className="text-[12px] text-text-secondary/50 mt-1">{lot.city_en || "Location unavailable"}</p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              {lot.latitude && lot.longitude && (
                <a
                  href={`https://www.google.com/maps?q=${lot.latitude},${lot.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface rounded-xl text-[13px] font-medium text-text hover:bg-border transition-colors active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Open in Maps
                </a>
              )}
              {(lot.address || lot.city_en) && (
                <button
                  onClick={() => {
                    const text = [lot.address, lot.city_en, "Georgia"].filter(Boolean).join(", ");
                    navigator.clipboard.writeText(text);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface rounded-xl text-[13px] font-medium text-text hover:bg-border transition-colors active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  Copy Address
                </button>
              )}
            </div>
          </div>
        )}

        {/* Source info */}
        <div
          className="mt-6 bg-surface rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <SourceLogo source={lot.source} size="md" />
            <div>
              <p className="text-[14px] font-semibold text-text">{getSourceLabel(lot.source)}</p>
              <p className="text-[12px] text-text-secondary">
                Updated {new Date(lot.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[13px] text-text-secondary">{label}</span>
      <span className={`text-[14px] font-medium text-text ${mono ? "font-mono text-[12px]" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function PhotoGallery({ images, propertyType }: { images: string[]; propertyType?: string }) {
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const [errors, setErrors] = useState<Record<number, boolean>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allFailed = Object.keys(errors).length === images.length;
  const validImages = images.filter((_, i) => !errors[i]);

  if (allFailed) {
    return (
      <div className="flex items-center justify-center py-6">
        <PropertyIcon type={propertyType} size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar rounded-2xl">
        {images.map((img, i) =>
          errors[i] ? null : (
            <button
              key={i}
              onClick={() => setLightboxIndex(validImages.indexOf(img))}
              className="w-[200px] h-[140px] rounded-xl bg-surface flex-shrink-0 overflow-hidden relative cursor-zoom-in lg:w-[240px] lg:h-[170px] hover:opacity-90 transition-opacity"
            >
              {!loaded[i] && !errors[i] && (
                <div className="absolute inset-0 animate-pulse bg-surface" />
              )}
              <img
                src={proxyImg(img)}
                alt={`Photo ${i + 1}`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${loaded[i] ? "opacity-100" : "opacity-0"}`}
                loading="lazy"
                onLoad={() => setLoaded((p) => ({ ...p, [i]: true }))}
                onError={() => setErrors((p) => ({ ...p, [i]: true }))}
              />
            </button>
          )
        )}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          images={validImages.map(proxyImg)}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
