"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface FavoritesContextValue {
  favorites: Set<number>;
  toggle: (lotId: number) => void;
  isFavorite: (lotId: number) => boolean;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = "auctionge_favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Load from localStorage.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setFavorites(new Set(JSON.parse(saved)));
    } catch { /* ignore */ }
  }, []);

  // Persist.
  const persist = useCallback((set: Set<number>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  }, []);

  const toggle = useCallback((lotId: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(lotId)) {
        next.delete(lotId);
      } else {
        next.add(lotId);
      }
      persist(next);
      return next;
    });
  }, [persist]);

  const isFavorite = useCallback((lotId: number) => favorites.has(lotId), [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite, count: favorites.size }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be inside FavoritesProvider");
  return ctx;
}
