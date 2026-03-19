import { NextRequest, NextResponse } from "next/server";

// Proxy images from auction sources to avoid CORS issues.
// Usage: /api/img?url=https://property.bog.ge/uploads/property/zoom_xxx.jpg

const ALLOWED_HOSTS = [
  "property.bog.ge",
  "api-auction.livo.ge",
  "eauction.ge",
  "auction.tbilisi.gov.ge",
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  try {
    const parsed = new URL(url);

    if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
      return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": `https://${parsed.hostname}/`,
      },
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const body = await res.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
