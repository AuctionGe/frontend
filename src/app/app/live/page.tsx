"use client";

import dynamic from "next/dynamic";

const LiveFeed = dynamic(() => import("@/components/live/LiveFeed").then(m => ({ default: m.LiveFeed })), {
  ssr: false,
  loading: () => (
    <div className="px-5 pt-4 space-y-3">
      {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse bg-surface rounded-2xl h-20" />)}
    </div>
  ),
});

export default function LivePage() {
  return (
    <div>
      <header className="px-5 pt-[env(safe-area-inset-top)] mt-4 mb-2 lg:pt-0 lg:max-w-3xl lg:mx-auto">
        <h1 className="text-[22px] font-bold text-text tracking-tight lg:text-[28px]">Live</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">Real-time auction activity</p>
      </header>
      <div className="lg:max-w-3xl lg:mx-auto">
      <LiveFeed />
      </div>
    </div>
  );
}
