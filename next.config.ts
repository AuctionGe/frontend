import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api-auction.livo.ge" },
      { protocol: "https", hostname: "property.bog.ge" },
      { protocol: "https", hostname: "eauction.ge" },
      { protocol: "https", hostname: "auction.tbilisi.gov.ge" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Optimize chunk splitting.
  experimental: {
    optimizePackageImports: ["framer-motion", "maplibre-gl"],
  },
  // Cache headers for static assets.
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
