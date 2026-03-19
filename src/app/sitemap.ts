import type { MetadataRoute } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://auctionge.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages.
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "hourly", priority: 1.0 },
    { url: `${SITE_URL}/map`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/live`, lastModified: new Date(), changeFrequency: "always", priority: 0.7 },
  ];

  // Dynamic lot pages — fetch IDs from API.
  try {
    const res = await fetch(`${API_BASE}/api/v1/lots?per_page=100&status=active`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      const lots = data.data || [];

      const lotPages: MetadataRoute.Sitemap = lots.map((lot: { id: number; updated_at: string }) => ({
        url: `${SITE_URL}/lot/${lot.id}`,
        lastModified: new Date(lot.updated_at),
        changeFrequency: "daily" as const,
        priority: 0.6,
      }));

      return [...staticPages, ...lotPages];
    }
  } catch {
    // API unavailable — return static pages only.
  }

  return staticPages;
}
