"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/lib/favorites/context";
import { useI18n } from "@/lib/i18n/context";
import { Lot, fetchLot } from "@/lib/api";
import { LotCard } from "@/components/lot/LotCard";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { t } = useI18n();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.size === 0) {
      setLots([]);
      setLoading(false);
      return;
    }

    Promise.all(
      [...favorites].map((id) => fetchLot(id).catch(() => null))
    ).then((results) => {
      setLots(results.filter(Boolean) as Lot[]);
      setLoading(false);
    });
  }, [favorites]);

  return (
    <div className="px-5 pt-[env(safe-area-inset-top)] mt-4 lg:pt-0">
      <header className="mb-6">
        <h1 className="text-[22px] font-bold text-text tracking-tight lg:text-[28px]">
          Favorites
        </h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          {favorites.size} saved lots
        </p>
      </header>

      {loading ? (
        <div className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:space-y-0">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-surface rounded-2xl h-32" />
          ))}
        </div>
      ) : lots.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-text-secondary/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <p className="text-text-secondary text-[15px] font-medium">No favorites yet</p>
          <p className="text-text-secondary/60 text-[13px] mt-1">Tap the heart icon on any lot to save it</p>
        </div>
      ) : (
        <div className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:space-y-0">
          {lots.map((lot, i) => (
            <LotCard key={lot.id} lot={lot} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
