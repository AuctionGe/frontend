"use client";

import { useEffect, useRef } from "react";
import { useToast } from "./ToastProvider";
import { useFavorites } from "@/lib/favorites/context";
import { formatPrice } from "@/lib/api";

export function LiveNotifications() {
  const { push } = useToast();
  const { isFavorite } = useFavorites();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

    function connect() {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (msg) => {
        try {
          const event = JSON.parse(msg.data);

          // Always notify about bids on favorited lots.
          if (event.action === "bid" && isFavorite(event.lot_id)) {
            push({
              type: "bid",
              title: "New bid on your favorite!",
              message: `Lot #${event.lot_id} — ${formatPrice(event.data?.price, "GEL")}`,
              lotId: event.lot_id,
            });
            return;
          }

          // Notify about new lots (occasional).
          if (event.action === "created") {
            push({
              type: "new",
              title: "New lot added",
              message: `Lot #${event.lot_id} from ${event.source}`,
              lotId: event.lot_id,
            });
          }
        } catch { /* ignore */ }
      };

      ws.onclose = () => setTimeout(connect, 5000);
      ws.onerror = () => ws.close();
    }

    connect();
    return () => wsRef.current?.close();
  }, [push, isFavorite]);

  return null; // Invisible — just listens.
}
