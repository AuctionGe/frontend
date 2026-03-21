import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://auctionge.com";

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${API_BASE}/api/v1/lots/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return { title: `Lot #${id}` };
    }

    const lot = await res.json();

    const price = lot.current_price
      ? `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(lot.current_price)} ${lot.currency || "GEL"}`
      : "Price on auction";

    const city = lot.city_en || "";
    const type = lot.property_type
      ? lot.property_type.charAt(0).toUpperCase() + lot.property_type.slice(1)
      : "Property";

    const title = `${type} in ${city || "Georgia"} — ${price}`;
    const description = [
      lot.title,
      city ? `Location: ${city}` : null,
      lot.building_area ? `Area: ${lot.building_area}m²` : lot.land_area ? `Land: ${lot.land_area}m²` : null,
      lot.cadastral_code ? `Cadastral: ${lot.cadastral_code}` : null,
      `Source: ${lot.source}`,
    ].filter(Boolean).join(" · ");

    const images = lot.thumbnail ? [{ url: lot.thumbnail, width: 800, height: 600 }] : [];

    return {
      title,
      description,
      openGraph: {
        type: "article",
        url: `${SITE_URL}/lot/${id}`,
        title,
        description,
        images,
        siteName: "AuctionGe",
      },
      twitter: {
        card: lot.thumbnail ? "summary_large_image" : "summary",
        title,
        description,
        images: lot.thumbnail ? [lot.thumbnail] : [],
      },
      alternates: {
        canonical: `${SITE_URL}/lot/${id}`,
      },
    };
  } catch {
    return { title: `Lot #${id} | AuctionGe` };
  }
}

export default function LotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
