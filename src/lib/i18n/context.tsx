"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Locale, translations, TranslationKey } from "./translations";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  // For lot data — pick the right translated field.
  cityName: (lot: { city?: string; city_en?: string; city_ru?: string }) => string;
  districtName: (lot: { district?: string; district_en?: string; district_ru?: string }) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Persist locale.
  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved && ["en", "ka", "ru"].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const entry = translations[key];
      return entry?.[locale] || entry?.en || key;
    },
    [locale]
  );

  const cityName = useCallback(
    (lot: { city?: string; city_en?: string; city_ru?: string }) => {
      if (locale === "ru" && lot.city_ru) return lot.city_ru;
      if (locale === "en" && lot.city_en) return lot.city_en;
      return lot.city_en || lot.city || "";
    },
    [locale]
  );

  const districtName = useCallback(
    (lot: { district?: string; district_en?: string; district_ru?: string }) => {
      if (locale === "ru" && lot.district_ru) return lot.district_ru;
      if (locale === "en" && lot.district_en) return lot.district_en;
      return lot.district_en || lot.district || "";
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, cityName, districtName }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
}
