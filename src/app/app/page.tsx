"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Lot, fetchLots, fetchSourcesHealth, SourceHealth } from "@/lib/api";
import { SearchBar, LotFilters } from "@/components/lot/SearchBar";
import { EndingSoonCarousel } from "@/components/lot/EndingSoonCarousel";
import { NoBidsSection } from "@/components/lot/NoBidsSection";
import { LotCard } from "@/components/lot/LotCard";
import { useI18n } from "@/lib/i18n/context";
import { useRealtimeUpdates } from "@/lib/useRealtimeUpdates";

export default function HomePage() {
  const { t } = useI18n();
  const [lots, setLots] = useState<Lot[]>([]);
  const [endingSoon, setEndingSoon] = useState<Lot[]>([]);
  const [noBids, setNoBids] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, sources: 0 });
  const [filters, setFilters] = useState<LotFilters>({ type: "all", priceMin: "", priceMax: "", sort: "newest", source: "" });

  // Live update lot cards when bids come in via WebSocket.
  useRealtimeUpdates(useCallback((lotId: number, data: Record<string, unknown>) => {
    const price = data.price as number | undefined;
    const bidsCount = data.bids_count as number | undefined;
    if (!price && !bidsCount) return;

    setLots((prev) =>
      prev.map((lot) =>
        lot.id === lotId
          ? { ...lot, current_price: price ?? lot.current_price, bids_count: bidsCount ?? lot.bids_count }
          : lot
      )
    );
  }, []));

  const buildParams = useCallback((pageNum: number, type: string, f: LotFilters) => {
    const params: Record<string, string> = {
      page: String(pageNum),
      per_page: "20",
      status: "active",
    };
    if (type !== "all") params.property_type = type;
    if (f.priceMin) params.price_min = f.priceMin;
    if (f.priceMax) params.price_max = f.priceMax;
    if (f.source) params.source = f.source;
    // Sort is handled client-side for now (API sorts by created_at DESC).
    return params;
  }, []);

  const loadLots = useCallback(async (pageNum: number, type: string, reset = false) => {
    try {
      const res = await fetchLots(buildParams(pageNum, type, filters));
      const newLots = res.data || [];

      if (reset) {
        setLots(newLots);
      } else {
        setLots((prev) => [...prev, ...newLots]);
      }
      setHasMore(pageNum < res.total_pages);
    } catch (err) {
      console.error("Failed to load lots:", err);
    } finally {
      setLoading(false);
    }
  }, [buildParams, filters]);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const allActive = await fetchLots({ status: "active", per_page: "100" });
        const activeLots = allActive.data || [];

        const withEndDate = activeLots
          .filter((l) => l.auction_end && new Date(l.auction_end).getTime() > Date.now())
          .sort((a, b) => new Date(a.auction_end!).getTime() - new Date(b.auction_end!).getTime());
        setEndingSoon(withEndDate.slice(0, 10));

        const withNoBids = activeLots
          .filter((l) => l.bids_count === 0 && l.current_price)
          .slice(0, 10);
        setNoBids(withNoBids);

        // Stats.
        const allLots = await fetchLots({ per_page: "1" });
        const health = await fetchSourcesHealth().catch(() => [] as SourceHealth[]);
        setStats({
          total: allLots.total,
          active: allActive.total,
          sources: health.filter((s) => s.is_healthy).length,
        });
      } catch (err) {
        console.error("Failed to load featured:", err);
      }
    }

    loadFeatured();
    loadLots(1, "all", true);
  }, [loadLots]);

  const handleFilterType = useCallback(
    (type: string) => {
      setActiveType(type);
      setPage(1);
      setLoading(true);
      loadLots(1, type, true);
    },
    [loadLots]
  );

  const handleSearch = useCallback((_query: string) => {
    // Search is handled in SearchBar dropdown
  }, []);

  const handleFiltersChange = useCallback((newFilters: LotFilters) => {
    setFilters(newFilters);
    setPage(1);
    setLoading(true);
    // Rebuild and fetch with new filters.
    const params: Record<string, string> = {
      page: "1", per_page: "20", status: "active",
    };
    if (activeType !== "all") params.property_type = activeType;
    if (newFilters.priceMin) params.price_min = newFilters.priceMin;
    if (newFilters.priceMax) params.price_max = newFilters.priceMax;
    if (newFilters.source) params.source = newFilters.source;

    fetchLots(params)
      .then((res) => {
        setLots(res.data || []);
        setHasMore(1 < res.total_pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeType]);

  const [loadingNext, setLoadingNext] = useState(false);

  // Infinite scroll — use callback ref so observer attaches when sentinel mounts.
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setLoadingNext(true);
          }
        },
        { rootMargin: "400px" }
      );
      observer.observe(node);
      return () => observer.disconnect();
    },
    [] // stable — created once
  );

  // When loadingNext triggers, fetch next page.
  useEffect(() => {
    if (!loadingNext || !hasMore) return;

    const nextPage = page + 1;

    fetchLots(buildParams(nextPage, activeType, filters))
      .then((res) => {
        const newLots = res.data || [];
        setLots((prev) => [...prev, ...newLots]);
        setPage(nextPage);
        setHasMore(nextPage < res.total_pages);
      })
      .catch(console.error)
      .finally(() => setLoadingNext(false));
  }, [loadingNext]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {/* Header — hidden on desktop (DesktopNav handles it) */}
      <header className="animate-fade-in-up px-5 pt-[env(safe-area-inset-top)] mt-4 lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-text tracking-tight">{ t("home.title") }</h1>
            <p className="text-[13px] text-text-secondary mt-0.5">{ t("home.subtitle") }</p>
          </div>
          <Link href="/live" className="relative w-10 h-10 flex items-center justify-center rounded-full bg-surface hover:bg-border transition-colors active:scale-95">
            <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 010-5.304m5.304 0a3.75 3.75 0 010 5.304m-7.425 2.121a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M12 12h.008v.008H12V12z" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full animate-pulse ring-2 ring-white" />
          </Link>
        </div>

        {/* Quick stats */}
        {stats.total > 0 && (
          <div
            className="animate-fade-in-up flex gap-2 mt-4"
            style={{ animationDelay: "150ms" }}
          >
            <div className="flex-1 bg-surface rounded-xl px-3 py-2.5">
              <p className="text-[20px] font-bold text-text tracking-tight">{stats.total.toLocaleString()}</p>
              <p className="text-[11px] text-text-secondary mt-0.5">{ t("home.total_lots") }</p>
            </div>
            <div className="flex-1 bg-copper-light rounded-xl px-3 py-2.5">
              <p className="text-[20px] font-bold text-copper-dark tracking-tight">{stats.active.toLocaleString()}</p>
              <p className="text-[11px] text-copper-dark/70 mt-0.5">{ t("home.active_now") }</p>
            </div>
            <div className="flex-1 bg-success-light rounded-xl px-3 py-2.5">
              <p className="text-[20px] font-bold text-success tracking-tight">{stats.sources}</p>
              <p className="text-[11px] text-success/70 mt-0.5">{ t("home.sources_live") }</p>
            </div>
          </div>
        )}
      </header>

      {/* Search + Filters */}
      <SearchBar onSearch={handleSearch} onFilterType={handleFilterType} onFiltersChange={handleFiltersChange} activeType={activeType} filters={filters} />

      {/* Ending Soon */}
      <EndingSoonCarousel lots={endingSoon} onSeeAll={() => {
        setLots(endingSoon);
        setHasMore(false);
        document.getElementById("all-lots")?.scrollIntoView({ behavior: "smooth" });
      }} />

      {/* No Bids */}
      <NoBidsSection lots={noBids} onSeeAll={() => {
        setLots(noBids);
        setHasMore(false);
        document.getElementById("all-lots")?.scrollIntoView({ behavior: "smooth" });
      }} />

      {/* All Lots */}
      <section id="all-lots" className="mt-6 px-5">
        <h2 className="font-bold text-[17px] text-text mb-3 lg:text-[20px]">{ t("home.all_auctions") }</h2>

        {loading && lots.length === 0 ? (
          <div className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:space-y-0">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-surface rounded-2xl h-32" />
            ))}
          </div>
        ) : lots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary text-[14px] mt-2">{ t("home.no_lots") }</p>
          </div>
        ) : (
          <div className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:space-y-0">
            {lots.map((lot, i) => (
              <LotCard key={lot.id} lot={lot} index={i} />
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel — always rendered to prevent layout shift */}
        <div ref={sentinelRef} className="h-16 flex justify-center items-center">
          {hasMore && lots.length > 0 && (
            <div className="flex items-center gap-2 text-text-secondary text-[13px]">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              { t("home.loading_more") }
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
