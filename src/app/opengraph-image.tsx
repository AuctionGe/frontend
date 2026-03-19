import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AuctionGe — Real Estate Auctions in Georgia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
          padding: "80px",
          fontFamily: "system-ui",
        }}
      >
        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, backgroundColor: "#E07A2F" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              backgroundColor: "#E07A2F",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <span style={{ fontSize: 48, fontWeight: 700, color: "#222222" }}>AuctionGe</span>
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 28, color: "#717171", marginBottom: 16 }}>
          Real estate auctions in Georgia
        </div>

        {/* Stats */}
        <div style={{ fontSize: 22, color: "#E07A2F", fontWeight: 600, marginBottom: 40 }}>
          11,000+ lots from 4 sources
        </div>

        {/* Source badges */}
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { name: "Livo", color: "#6366F1", bg: "#EEF0FF" },
            { name: "Bank of Georgia", color: "#0891B2", bg: "#E8F6F9" },
            { name: "eAuction.ge", color: "#7C3AED", bg: "#F0EBFF" },
            { name: "Tbilisi Gov", color: "#059669", bg: "#E8F8EE" },
          ].map((s) => (
            <div
              key={s.name}
              style={{
                backgroundColor: s.bg,
                color: s.color,
                padding: "8px 20px",
                borderRadius: 20,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {s.name}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
