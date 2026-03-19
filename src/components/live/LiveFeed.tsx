"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lot, fetchLots, getSourceLabel, getSourceColor, formatPrice } from "@/lib/api";

interface LiveEvent {
  id: string;
  type: "bid" | "new" | "status" | "recent";
  title: string;
  subtitle: string;
  source: string;
  lot_id: number;
  timestamp: Date;
  price?: number;
  currency?: string;
}

export function LiveFeed() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [recentLoaded, setRecentLoaded] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Load recent activity from DB on mount.
  useEffect(() => {
    async function loadRecent() {
      try {
        const res = await fetchLots({ per_page: "30", status: "active" });
        const lots = res.data || [];

        const recentEvents: LiveEvent[] = lots.map((lot: Lot) => ({
          id: `recent-${lot.id}`,
          type: "recent" as const,
          title: lot.title,
          subtitle: lot.city_en
            ? `${lot.city_en} · ${getSourceLabel(lot.source)}`
            : getSourceLabel(lot.source),
          source: lot.source,
          lot_id: lot.id,
          timestamp: new Date(lot.updated_at),
          price: lot.current_price,
          currency: lot.currency,
        }));

        setEvents(recentEvents);
        setRecentLoaded(true);
      } catch (err) {
        console.error("Failed to load recent:", err);
        setRecentLoaded(true);
      }
    }

    loadRecent();
  }, []);

  // WebSocket for real-time.
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

    function connect() {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        setTimeout(connect, 3000);
      };
      ws.onerror = () => ws.close();

      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          const event: LiveEvent = {
            id: `ws-${Date.now()}-${Math.random()}`,
            type: data.action === "bid" ? "bid" : data.action === "created" ? "new" : "status",
            title: data.action === "bid"
              ? `New bid — ${formatPrice(data.data?.price, "GEL")}`
              : data.action === "created"
              ? "New lot added"
              : "Status changed",
            subtitle: `Lot #${data.lot_id} · ${getSourceLabel(data.source)}`,
            source: data.source,
            lot_id: data.lot_id,
            timestamp: new Date(),
            price: data.data?.price,
            currency: "GEL",
          };

          setEvents((prev) => [event, ...prev.slice(0, 99)]);
        } catch {
          // ignore
        }
      };
    }

    connect();
    return () => wsRef.current?.close();
  }, []);

  return (
    <div className="px-5 pt-4">
      {/* Status bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-success animate-pulse" : "bg-text-secondary"}`} />
          <span className="text-[13px] text-text-secondary">
            {connected ? "Live — real-time updates" : "Connecting..."}
          </span>
        </div>
        <span className="text-[12px] text-text-secondary/60">
          {events.length} events
        </span>
      </div>

      {!recentLoaded ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-surface rounded-2xl h-20" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">📡</div>
          <p className="text-text-secondary text-[15px]">No events yet</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -16, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <LiveEventCard event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function LiveEventCard({ event }: { event: LiveEvent }) {
  const config = getEventConfig(event.type);

  return (
    <div className={`rounded-2xl border p-3.5 ${config.borderClass}`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 ${config.iconBg}`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[14px] font-semibold text-text line-clamp-1">
              {event.title}
            </span>
            <span className="text-[11px] text-text-secondary whitespace-nowrap">
              {formatRelativeTime(event.timestamp)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[12px] text-text-secondary">{event.subtitle}</span>
          </div>
          {event.price && event.type === "recent" && (
            <span className="text-[13px] font-semibold text-text mt-1 block">
              {formatPrice(event.price, event.currency)}
            </span>
          )}
        </div>
        <div
          className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
          style={{ backgroundColor: getSourceColor(event.source) }}
        />
      </div>
    </div>
  );
}

function getEventConfig(type: string) {
  switch (type) {
    case "bid":
      return { icon: "⚡", borderClass: "border-copper/20 bg-copper-50", iconBg: "bg-copper-light" };
    case "new":
      return { icon: "🆕", borderClass: "border-success/20 bg-success-light", iconBg: "bg-success-light" };
    case "status":
      return { icon: "🔔", borderClass: "border-border", iconBg: "bg-surface" };
    default:
      return { icon: "📋", borderClass: "border-border", iconBg: "bg-surface" };
  }
}

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
