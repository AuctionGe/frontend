"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchSourcesHealth, SourceHealth } from "@/lib/api";

/* ───────────────────────── Stats from API ───────────────────────── */
function useLiveStats() {
  const [stats, setStats] = useState({ lots: 0, sources: 0, cities: 0 });
  useEffect(() => {
    (async () => {
      try {
        const health = await fetchSourcesHealth();
        const totalLots = health.reduce((s: number, h: SourceHealth) => s + h.lots_count, 0);
        setStats({ lots: totalLots, sources: health.filter((h: SourceHealth) => h.is_healthy).length, cities: 55 });
      } catch { setStats({ lots: 11270, sources: 4, cities: 55 }); }
    })();
  }, []);
  return stats;
}

/* ───────────────────────── Counter animation ───────────────────────── */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) return;
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display.toLocaleString()}{suffix}</>;
}

/* ───────────────────────── Features data ───────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    title: "4 Sources, One Platform",
    desc: "Livo, eAuction.ge, Tbilisi Municipality — all auctions aggregated in real-time. No more checking multiple sites.",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Live Bid Updates",
    desc: "Real-time price tracking via WebSocket. See bids as they happen — never miss an opportunity.",
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: "Interactive Map",
    desc: "Explore lots on a beautiful map with price bubbles. Find properties near you instantly.",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: "Smart Search",
    desc: "Search by name, address, cadastral code — in Georgian, English or Russian. Instant results.",
    color: "from-sky-500 to-blue-500",
    bg: "bg-sky-50",
  },
];

const STEPS = [
  { num: "01", title: "Discover", desc: "Browse thousands of auction lots from all Georgian sources in one place." },
  { num: "02", title: "Analyze", desc: "Compare prices, check locations on map, view photos and cadastral data." },
  { num: "03", title: "Act", desc: "Go directly to the auction source and place your bid with confidence." },
];

const SOURCES_DATA = [
  { name: "Livo", sub: "TBC Bank auctions", color: "from-indigo-500 to-violet-500", lots: "3,700+" },
  { name: "eAuction.ge", sub: "State property", color: "from-violet-500 to-purple-600", lots: "200+" },
  { name: "Tbilisi Gov", sub: "Municipal property", color: "from-emerald-500 to-green-600", lots: "6,200+" },
];

/* ───────────────────────── Page ───────────────────────── */
export default function LandingPage() {
  const stats = useLiveStats();

  return (
    <div className="min-h-screen bg-white">

      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">AuctionGe</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[14px] text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#sources" className="hover:text-gray-900 transition-colors">Sources</a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
          <Link
            href="/app"
            className="bg-gray-900 text-white text-[13px] font-medium px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            Open App →
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-44 lg:pb-32">
        {/* Background gradient — full width */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/70 via-amber-50/30 to-white" />
        <div className="absolute top-20 right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-amber-100/50 to-orange-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-[5%] w-[400px] h-[400px] bg-gradient-to-tr from-violet-100/30 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[13px] text-gray-600">Live now — tracking {stats.sources} auction sources</span>
            </div>

            <h1 className="text-[42px] lg:text-[64px] font-bold text-gray-900 leading-[1.1] tracking-tight">
              Every real estate auction in
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent"> Georgia</span>,
              one place.
            </h1>

            <p className="text-[18px] lg:text-[20px] text-gray-500 mt-6 max-w-xl leading-relaxed">
              Stop checking multiple government sites. We aggregate all property auctions
              and deliver them in a beautiful, searchable interface.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mt-10">
              <Link
                href="/app"
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[15px] font-semibold px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-amber-500/25 transition-all active:scale-[0.98]"
              >
                Browse Auctions
              </Link>
              <Link
                href="/app/map"
                className="bg-white text-gray-700 text-[15px] font-medium px-8 py-3.5 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                View on Map
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-16 max-w-lg">
            <div>
              <p className="text-[32px] lg:text-[40px] font-bold text-gray-900 tracking-tight">
                <AnimatedNumber value={stats.lots} suffix="+" />
              </p>
              <p className="text-[13px] text-gray-400 mt-1">Auction lots</p>
            </div>
            <div>
              <p className="text-[32px] lg:text-[40px] font-bold text-gray-900 tracking-tight">
                <AnimatedNumber value={stats.sources} />
              </p>
              <p className="text-[13px] text-gray-400 mt-1">Data sources</p>
            </div>
            <div>
              <p className="text-[32px] lg:text-[40px] font-bold text-gray-900 tracking-tight">
                <AnimatedNumber value={stats.cities} suffix="+" />
              </p>
              <p className="text-[13px] text-gray-400 mt-1">Cities covered</p>
            </div>
          </div>

          {/* Hero image */}
          <div className="mt-16 rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/50 max-w-4xl">
            <img
              src="https://images.unsplash.com/photo-1692803341595-dd131eb0ea51?w=1400&auto=format&fit=crop&q=80"
              alt="Tbilisi aerial view — Georgian real estate"
              className="w-full aspect-[16/9] object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>


      {/* ─── Features ─── */}
      <section id="features" className="py-20 lg:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[32px] lg:text-[40px] font-bold text-gray-900 tracking-tight">
              Built for auction hunters
            </h2>
            <p className="text-gray-500 mt-4 text-[16px] leading-relaxed">
              Tools that give you an unfair advantage in Georgian real estate auctions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-3xl border border-gray-100 p-8 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 ${f.bg} rounded-2xl flex items-center justify-center mb-5`}>
                  <div className={`bg-gradient-to-br ${f.color} bg-clip-text text-transparent`}>
                    {f.icon}
                  </div>
                </div>
                <h3 className="text-[20px] font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-[15px] leading-relaxed">{f.desc}</p>

                {/* Subtle gradient on hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 lg:py-32 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[32px] lg:text-[40px] font-bold text-gray-900 tracking-tight">
              Three steps to your next deal
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="relative">
                <span className="text-[64px] font-bold bg-gradient-to-b from-gray-300 to-gray-200 bg-clip-text text-transparent leading-none">{step.num}</span>
                <h3 className="text-[22px] font-bold text-gray-900 mt-2">{step.title}</h3>
                <p className="text-gray-500 text-[15px] mt-3 leading-relaxed">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-gray-200">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* App screenshot */}
          <div className="mt-16 rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-300/30 max-w-5xl mx-auto">
            <img
              src="/app-preview.png?v=2"
              alt="AuctionGe app — browse real estate auctions"
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ─── Sources ─── */}
      <section id="sources" className="py-20 lg:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[32px] lg:text-[40px] font-bold text-gray-900 tracking-tight">
              Data from official sources
            </h2>
            <p className="text-gray-500 mt-4 text-[16px]">
              We aggregate auction data from trusted Georgian platforms.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {SOURCES_DATA.map((src, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 p-8 text-center hover:shadow-lg transition-all">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${src.color} flex items-center justify-center text-white font-bold text-lg mb-5`}>
                  {src.name.slice(0, 2)}
                </div>
                <h3 className="text-[18px] font-bold text-gray-900">{src.name}</h3>
                <p className="text-gray-400 text-[14px] mt-1">{src.sub}</p>
                <p className="text-[28px] font-bold text-gray-900 mt-4">{src.lots}</p>
                <p className="text-gray-400 text-[12px]">lots indexed</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 lg:p-20 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-full blur-2xl" />

            <div className="relative">
              <h2 className="text-[28px] lg:text-[40px] font-bold text-white tracking-tight">
                Ready to find your next property?
              </h2>
              <p className="text-gray-400 mt-4 text-[16px] max-w-lg mx-auto">
                Join thousands of buyers exploring Georgian real estate auctions. Free, no registration required.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-10">
                <Link
                  href="/app"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[15px] font-semibold px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                >
                  Start Browsing →
                </Link>
                <Link
                  href="/app/map"
                  className="bg-white/10 text-white text-[15px] font-medium px-8 py-3.5 rounded-full border border-white/20 hover:bg-white/20 transition-all"
                >
                  Explore Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer id="contact" className="border-t border-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold text-gray-900">AuctionGe</span>
              </div>
              <p className="text-gray-400 text-[14px] leading-relaxed max-w-sm">
                The first real estate auction aggregator in Georgia. We make property auctions transparent and accessible to everyone.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-[14px] font-semibold text-gray-900 mb-4">Product</h4>
              <div className="space-y-2.5 text-[14px] text-gray-400">
                <Link href="/app" className="block hover:text-gray-600 transition-colors">Browse Auctions</Link>
                <Link href="/app/map" className="block hover:text-gray-600 transition-colors">Map View</Link>
                <Link href="/app/live" className="block hover:text-gray-600 transition-colors">Live Updates</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[14px] font-semibold text-gray-900 mb-4">Contact</h4>
              <div className="space-y-2.5 text-[14px] text-gray-400">
                <p>hello@auctionge.com</p>
                <p>Tbilisi, Georgia</p>
                <div className="flex gap-3 mt-4">
                  <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-12 pt-8 text-center text-[13px] text-gray-300">
            © 2026 AuctionGe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
