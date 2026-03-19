"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { fetchLots, Lot } from "@/lib/api";

const LotMap = dynamic(() => import("@/components/map/LotMap").then(m => ({ default: m.LotMap })), {
  ssr: false,
  loading: () => <div className="h-screen bg-surface animate-pulse" />,
});

export default function MapPage() {
  const router = useRouter();
  const [markers, setMarkers] = useState<Array<{
    id: number; lat: number; lng: number;
    title: string; price?: number; currency?: string;
    source: string; property_type?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMarkers() {
      try {
        // Fetch lots with coordinates.
        const res = await fetchLots({ per_page: "500", has_location: "true" });
        const lots = (res.data || []).filter(
          (l: Lot) => l.latitude && l.longitude && l.latitude !== 0
        );

        setMarkers(
          lots.map((l: Lot) => ({
            id: l.id,
            lat: l.latitude!,
            lng: l.longitude!,
            title: l.title,
            price: l.current_price || l.starting_price,
            currency: l.currency,
            source: l.source,
            property_type: l.property_type,
          }))
        );
      } catch (err) {
        console.error("Failed to load map data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMarkers();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Floating header */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-[env(safe-area-inset-top)]">
        <div className="mx-4 mt-3 bg-white/90 backdrop-blur-lg rounded-2xl px-4 py-3 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[17px] font-bold text-text">Map</h1>
              <p className="text-[12px] text-text-secondary">
                {loading ? "Loading..." : `${markers.length} lots with location`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen map */}
      <LotMap
        markers={markers}
        height="100vh"
        onMarkerClick={(id) => router.push(`/lot/${id}`)}
        className="rounded-none"
      />
    </div>
  );
}
