"use client";

import { useEffect, useRef, memo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { getSourceColor, formatPrice } from "@/lib/api";

// Clean light style matching our warm UI — using free OSM vector tiles.
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

// Georgia center
const DEFAULT_CENTER: [number, number] = [44.0, 42.0];
const DEFAULT_ZOOM = 6.5;

interface LotMarker {
  id: number;
  lat: number;
  lng: number;
  title: string;
  price?: number;
  currency?: string;
  source: string;
  property_type?: string;
}

interface LotMapProps {
  markers?: LotMarker[];
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  height?: string;
  interactive?: boolean;
  singlePin?: boolean; // For lot detail — just one pin, no popups
  onMarkerClick?: (id: number) => void;
  className?: string;
}

export const LotMap = memo(function LotMap({
  markers = [],
  center,
  zoom,
  height = "100%",
  interactive = true,
  singlePin = false,
  onMarkerClick,
  className = "",
}: LotMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const mapCenter = center || (markers.length === 1
      ? [markers[0].lng, markers[0].lat] as [number, number]
      : DEFAULT_CENTER);

    const mapZoom = zoom || (markers.length === 1 ? 15 : singlePin ? 14 : DEFAULT_ZOOM);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: mapCenter,
      zoom: mapZoom,
      attributionControl: false,
      interactive,
    });

    mapRef.current = map;

    if (interactive) {
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    }

    map.on("load", () => {
      // Add markers
      markers.forEach((m) => {
        const el = createMarkerElement(m, singlePin);

        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([m.lng, m.lat])
          .addTo(map);

        if (!singlePin && onMarkerClick) {
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            onMarkerClick(m.id);
          });
        }

        if (!singlePin && m.price) {
          const popup = new maplibregl.Popup({
            offset: 28,
            closeButton: false,
            closeOnClick: true,
            className: "lot-popup",
          }).setHTML(`
            <div style="font-family: 'DM Sans', system-ui; padding: 4px 0;">
              <div style="font-weight: 600; font-size: 13px; color: #222; line-height: 1.3; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${m.title}
              </div>
              <div style="font-weight: 700; font-size: 15px; color: #222; margin-top: 4px;">
                ${formatPrice(m.price, m.currency)}
              </div>
            </div>
          `);
          marker.setPopup(popup);
        }
      });

      // Fit bounds if multiple markers
      if (markers.length > 1 && !center) {
        const bounds = new maplibregl.LngLatBounds();
        markers.forEach((m) => bounds.extend([m.lng, m.lat]));
        map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [markers, center, zoom, height, interactive, singlePin, onMarkerClick]);

  return (
    <div
      ref={containerRef}
      className={`w-full rounded-2xl overflow-hidden ${className}`}
      style={{ height }}
    />
  );
});

function createMarkerElement(marker: LotMarker, singlePin: boolean): HTMLElement {
  const el = document.createElement("div");

  if (singlePin) {
    // Simple copper pin for detail page
    el.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
        <div style="width:32px;height:32px;background:#E07A2F;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);"></div>
      </div>
    `;
  } else if (marker.price) {
    // Airbnb-style price bubble
    const color = getSourceColor(marker.source);
    el.innerHTML = `
      <div style="
        background: white;
        border: 2px solid ${color};
        border-radius: 20px;
        padding: 4px 10px;
        font-family: 'DM Sans', system-ui;
        font-size: 12px;
        font-weight: 700;
        color: #222;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        cursor: pointer;
        transition: transform 0.15s, box-shadow 0.15s;
      " onmouseover="this.style.transform='scale(1.08)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.18)'"
         onmouseout="this.style.transform='scale(1)';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.12)'"
      >
        ${formatPrice(marker.price, marker.currency)}
      </div>
    `;
  } else {
    // Small dot for lots without price
    const color = getSourceColor(marker.source);
    el.innerHTML = `
      <div style="width:12px;height:12px;background:${color};border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2);cursor:pointer;"></div>
    `;
  }

  return el;
}
