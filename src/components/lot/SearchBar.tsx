"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { searchLots, formatPrice, getSourceLabel, getSourceColor } from "@/lib/api";
import { useI18n } from "@/lib/i18n/context";
import { TranslationKey } from "@/lib/i18n/translations";

const PROPERTY_TYPES: { key: string; labelKey: TranslationKey }[] = [
  { key: "all", labelKey: "type.all" },
  { key: "apartment", labelKey: "type.apartment" },
  { key: "land", labelKey: "type.land" },
  { key: "commercial", labelKey: "type.commercial" },
  { key: "house", labelKey: "type.house" },
  { key: "hotel", labelKey: "type.hotel" },
];

interface SearchHit {
  id: number;
  title: string;
  current_price?: number;
  currency?: string;
  city_en?: string;
  source: string;
  property_type?: string;
}

export interface LotFilters {
  type: string;
  priceMin: string;
  priceMax: string;
  sort: string;
  source: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterType: (type: string) => void;
  onFiltersChange: (filters: LotFilters) => void;
  activeType: string;
  filters: LotFilters;
}

const SORT_OPTIONS = [
  { key: "newest", label: "sort.newest" },
  { key: "price_asc", label: "sort.price_asc" },
  { key: "price_desc", label: "sort.price_desc" },
  { key: "bids", label: "sort.bids" },
];

const SOURCES = [
  { key: "", label: "All sources" },
  { key: "livo", label: "Livo" },
  { key: "bog", label: "BoG" },
  { key: "eauction", label: "eAuction" },
  { key: "tbilisi", label: "Tbilisi" },
];

export function SearchBar({ onSearch, onFilterType, onFiltersChange, activeType, filters }: SearchBarProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<LotFilters>(filters);
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search.
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchLots(query, { limit: "6" });
        const hits = (res.hits || []) as SearchHit[];
        setResults(hits);
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close dropdown on outside click.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(query);
      setShowResults(false);
    },
    [query, onSearch]
  );

  const clear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    onSearch("");
  };

  return (
    <div className="px-5 pt-3 pb-1" ref={containerRef}>
      {/* Search input */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center gap-2.5 bg-surface rounded-2xl px-4 py-3 border transition-colors duration-200 ${
            focused ? "border-copper/40 shadow-sm" : "border-transparent"
          }`}
        >
          <svg className="w-5 h-5 text-text-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { setFocused(true); if (results.length > 0) setShowResults(true); }}
            onBlur={() => setFocused(false)}
            placeholder={t("search.placeholder")}
            className="flex-1 bg-transparent text-[15px] text-text placeholder:text-text-secondary/60 outline-none"
          />
          {searching && (
            <svg className="w-4 h-4 text-text-secondary animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {query && !searching && (
            <button type="button" onClick={clear} className="text-text-secondary hover:text-text flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-border shadow-lg overflow-hidden z-30 animate-fade-in-up" style={{ animationDuration: "0.15s" }}>
            {results.map((hit) => (
              <Link
                key={hit.id}
                href={`/lot/${hit.id}`}
                onClick={() => setShowResults(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors border-b border-divider last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-text truncate">{hit.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {hit.city_en && <span className="text-[12px] text-text-secondary">{hit.city_en}</span>}
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{ color: getSourceColor(hit.source), backgroundColor: getSourceColor(hit.source) + "14" }}
                    >
                      {getSourceLabel(hit.source)}
                    </span>
                  </div>
                </div>
                <span className="text-[14px] font-bold text-text whitespace-nowrap">
                  {formatPrice(hit.current_price, hit.currency)}
                </span>
              </Link>
            ))}
            <button
              onClick={handleSubmit as any}
              className="w-full px-4 py-2.5 text-[13px] text-copper font-medium text-center hover:bg-copper-light transition-colors"
            >
              {t("search.see_all_results")} &quot;{query}&quot;
            </button>
          </div>
        )}
      </form>

      {/* Type chips + filter button */}
      <div className="flex items-center gap-2 mt-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 flex-1">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type.key}
              onClick={() => onFilterType(type.key)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${
                activeType === type.key
                  ? "bg-text text-white"
                  : "bg-surface text-text-secondary hover:bg-border"
              }`}
            >
              {t(type.labelKey)}
            </button>
          ))}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => { setLocalFilters(filters); setShowFilters(!showFilters); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all flex-shrink-0 ${
            hasActiveFilters(filters)
              ? "bg-copper text-white"
              : "bg-surface text-text-secondary hover:bg-border"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          {t("filter.filters")}
          {hasActiveFilters(filters) && (
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-3 bg-white rounded-2xl border border-border p-4 animate-fade-in-up shadow-sm" style={{ animationDuration: "0.15s" }}>
          {/* Price range */}
          <div className="mb-4">
            <label className="text-[13px] font-semibold text-text mb-2 block">{t("filter.price_range")}</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder={t("filter.min_price")}
                value={localFilters.priceMin}
                onChange={(e) => setLocalFilters({ ...localFilters, priceMin: e.target.value })}
                className="flex-1 bg-surface rounded-xl px-3 py-2.5 text-[14px] text-text outline-none border border-transparent focus:border-copper/30 transition-colors"
              />
              <span className="text-text-secondary self-center">—</span>
              <input
                type="number"
                placeholder={t("filter.max_price")}
                value={localFilters.priceMax}
                onChange={(e) => setLocalFilters({ ...localFilters, priceMax: e.target.value })}
                className="flex-1 bg-surface rounded-xl px-3 py-2.5 text-[14px] text-text outline-none border border-transparent focus:border-copper/30 transition-colors"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="mb-4">
            <label className="text-[13px] font-semibold text-text mb-2 block">{t("filter.sort_by")}</label>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setLocalFilters({ ...localFilters, sort: opt.key })}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                    localFilters.sort === opt.key
                      ? "bg-text text-white"
                      : "bg-surface text-text-secondary hover:bg-border"
                  }`}
                >
                  {t(opt.label as any)}
                </button>
              ))}
            </div>
          </div>

          {/* Source */}
          <div className="mb-4">
            <label className="text-[13px] font-semibold text-text mb-2 block">{t("filter.source")}</label>
            <div className="flex flex-wrap gap-2">
              {SOURCES.map((src) => (
                <button
                  key={src.key}
                  onClick={() => setLocalFilters({ ...localFilters, source: src.key })}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                    localFilters.source === src.key
                      ? "bg-text text-white"
                      : "bg-surface text-text-secondary hover:bg-border"
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                const reset: LotFilters = { type: "all", priceMin: "", priceMax: "", sort: "newest", source: "" };
                setLocalFilters(reset);
                onFiltersChange(reset);
                setShowFilters(false);
              }}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-text-secondary bg-surface hover:bg-border transition-colors"
            >
              {t("filter.reset")}
            </button>
            <button
              onClick={() => {
                onFiltersChange(localFilters);
                setShowFilters(false);
              }}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-white bg-copper hover:bg-copper-dark transition-colors"
            >
              {t("filter.apply")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function hasActiveFilters(f: LotFilters): boolean {
  return f.priceMin !== "" || f.priceMax !== "" || f.sort !== "newest" || f.source !== "";
}
