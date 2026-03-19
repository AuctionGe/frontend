"use client";

import { useEffect, useState } from "react";
import { SourceHealth, fetchSourcesHealth, getSourceLabel } from "@/lib/api";
import { SourceLogo } from "@/components/lot/SourceLogo";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { useFavorites } from "@/lib/favorites/context";
import { Locale } from "@/lib/i18n/translations";

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: "ka", label: "ქართული", flag: "🇬🇪" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export default function ProfilePage() {
  const { locale, setLocale, t } = useI18n();
  const { count: favCount } = useFavorites();
  const [health, setHealth] = useState<SourceHealth[]>([]);

  useEffect(() => {
    fetchSourcesHealth().then(setHealth).catch(console.error);
  }, []);

  return (
    <div className="px-5 pt-[env(safe-area-inset-top)] mt-4 lg:pt-0 lg:max-w-3xl lg:mx-auto">
      <header className="mb-6">
        <h1 className="text-[22px] font-bold text-text tracking-tight lg:text-[28px]">{t("profile.title")}</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">{t("profile.subtitle")}</p>
      </header>

      {/* Favorites */}
      <Link href="/favorites" className="block mb-6 bg-surface rounded-2xl p-4 hover:bg-border/50 transition-colors active:scale-[0.99]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-danger" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-text">Favorites</p>
              <p className="text-[12px] text-text-secondary">{favCount} saved lots</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </Link>

      {/* Language selector */}
      <section className="mb-6">
        <h2 className="text-[15px] font-semibold text-text mb-3">{t("profile.language")}</h2>
        <div className="flex gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLocale(lang.code)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[14px] transition-colors ${
                locale === lang.code
                  ? "border-copper bg-copper-light text-copper-dark font-medium"
                  : "border-border text-text-secondary hover:bg-surface"
              }`}
            >
              <span>{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      </section>

      {/* Data sources health */}
      <section>
        <h2 className="text-[15px] font-semibold text-text mb-3">{t("profile.data_sources")}</h2>
        <div className="space-y-2.5">
          {health.map((source) => (
            <div
              key={source.source}
              className="bg-surface rounded-2xl p-4 flex items-center gap-3"
            >
              <SourceLogo source={source.source} size="md" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-text">
                    {getSourceLabel(source.source)}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    source.is_healthy ? "bg-success" : "bg-danger"
                  }`} />
                </div>
                <p className="text-[12px] text-text-secondary mt-0.5">
                  {source.lots_count.toLocaleString()} {t("profile.lots")}
                  {source.last_success && (
                    <> · {t("profile.synced")} {new Date(source.last_success).toLocaleTimeString()}</>
                  )}
                </p>
              </div>
              {source.consecutive_failures > 0 && (
                <span className="text-[11px] text-danger bg-danger-light px-2 py-0.5 rounded-full">
                  {source.consecutive_failures} fails
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
