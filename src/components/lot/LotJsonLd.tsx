import { Lot, getSourceLabel } from "@/lib/api";

export function LotJsonLd({ lot }: { lot: Lot }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: lot.title,
    description: lot.description || lot.title,
    url: lot.source_url,
    ...(lot.current_price && {
      offers: {
        "@type": "Offer",
        price: lot.current_price,
        priceCurrency: lot.currency || "GEL",
        availability: lot.status === "active"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      },
    }),
    ...(lot.latitude && lot.longitude && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: lot.latitude,
        longitude: lot.longitude,
      },
    }),
    ...(lot.city_en && {
      address: {
        "@type": "PostalAddress",
        addressLocality: lot.city_en,
        addressRegion: lot.district_en || undefined,
        addressCountry: "GE",
      },
    }),
    ...(lot.thumbnail && {
      image: lot.thumbnail,
    }),
    ...(lot.building_area && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: lot.building_area,
        unitCode: "MTK",
      },
    }),
    provider: {
      "@type": "Organization",
      name: getSourceLabel(lot.source),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
