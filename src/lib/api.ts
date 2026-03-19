const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Proxy external images through our server to avoid CORS blocks.
const PROXY_HOSTS = ["property.bog.ge", "eauction.ge", "auction.tbilisi.gov.ge"];

export function proxyImg(url?: string): string {
  if (!url) return "";
  try {
    const host = new URL(url).hostname;
    if (PROXY_HOSTS.some(h => host.includes(h))) {
      return `/api/img?url=${encodeURIComponent(url)}`;
    }
  } catch { /* not a valid URL */ }
  return url;
}

export interface Lot {
  id: number;
  source: "livo" | "bog" | "eauction" | "tbilisi";
  external_id: string;
  title: string;
  description?: string;
  status: "active" | "finished" | "failed" | "cancelled" | "stopped" | "not_started" | "paused" | "sold";
  property_type?: string;
  starting_price?: number;
  current_price?: number;
  bid_step?: number;
  buy_now_price?: number;
  currency: string;
  bids_count: number;
  address?: string;
  city?: string;
  city_en?: string;
  city_ru?: string;
  district?: string;
  district_en?: string;
  district_ru?: string;
  latitude?: number;
  longitude?: number;
  cadastral_code?: string;
  building_area?: number;
  land_area?: number;
  rooms?: number;
  floor?: number;
  images?: string[];
  thumbnail?: string;
  source_url?: string;
  auction_start?: string;
  auction_end?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[] | null;
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface SourceHealth {
  source: string;
  is_healthy: boolean;
  last_success?: string;
  lots_count: number;
  consecutive_failures: number;
}

export async function fetchLots(params: Record<string, string> = {}): Promise<PaginatedResponse<Lot>> {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/v1/lots?${query}`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error("Failed to fetch lots");
  return res.json();
}

export async function fetchLot(id: number): Promise<Lot> {
  const res = await fetch(`${API_BASE}/api/v1/lots/${id}`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error("Failed to fetch lot");
  return res.json();
}

export async function searchLots(q: string, params: Record<string, string> = {}) {
  const query = new URLSearchParams({ q, ...params }).toString();
  const res = await fetch(`${API_BASE}/api/v1/search?${query}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function fetchSourcesHealth(): Promise<SourceHealth[]> {
  const res = await fetch(`${API_BASE}/api/v1/sources/health`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch health");
  return res.json();
}

export function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    livo: "#6366F1",
    bog: "#0891B2",
    eauction: "#7C3AED",
    tbilisi: "#059669",
  };
  return colors[source] || "#717171";
}

export function getSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    livo: "Livo",
    bog: "BoG",
    eauction: "eAuction",
    tbilisi: "Tbilisi",
  };
  return labels[source] || source;
}

export function getPropertyTypeLabel(type?: string): string {
  const labels: Record<string, string> = {
    apartment: "Apartment",
    house: "House",
    land: "Land",
    commercial: "Commercial",
    hotel: "Hotel",
    garage: "Garage",
    factory: "Factory",
    restaurant: "Restaurant",
    other: "Other",
  };
  return labels[type || ""] || "—";
}

export function formatPrice(price?: number, currency?: string): string {
  if (!price) return "Price on auction";
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(price);
  return `${formatted} ${currency || "GEL"}`;
}

export function formatArea(area?: number): string | null {
  if (!area || area <= 1) return null; // Filter out 1m² parser artifacts
  if (area >= 10000) return `${(area / 10000).toFixed(1)} ha`;
  return `${area}m²`;
}

export function timeLeft(endDate?: string): string | null {
  if (!endDate) return null;
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const diff = end - now;
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
