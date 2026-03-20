"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Lot } from "./api";

interface RealtimeEvent {
  action: string;
  source: string;
  lot_id: number;
  data?: Record<string, unknown>;
}

// Hook that listens to WebSocket and provides lot update callbacks.
export function useRealtimeUpdates(onLotUpdate?: (lotId: number, data: Record<string, unknown>) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const callbackRef = useRef(onLotUpdate);
  callbackRef.current = onLotUpdate;

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

    function connect() {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        setTimeout(connect, 5000);
      };
      ws.onerror = () => ws.close();

      ws.onmessage = (msg) => {
        try {
          const event: RealtimeEvent = JSON.parse(msg.data);
          if (callbackRef.current && event.lot_id) {
            callbackRef.current(event.lot_id, {
              action: event.action,
              source: event.source,
              ...event.data,
            });
          }
        } catch { /* ignore */ }
      };
    }

    connect();
    return () => wsRef.current?.close();
  }, []);

  return { connected };
}

// Hook for lot detail page — auto-refresh from API every N seconds.
export function useLotPolling(lotId: number | null, intervalMs: number = 15000) {
  const [lot, setLot] = useState<Lot | null>(null);

  useEffect(() => {
    if (!lotId) return;

    const fetchLot = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/lots/${lotId}`
        );
        if (res.ok) {
          const data = await res.json();
          setLot(data);
        }
      } catch { /* ignore */ }
    };

    fetchLot(); // Initial.
    const timer = setInterval(fetchLot, intervalMs);
    return () => clearInterval(timer);
  }, [lotId, intervalMs]);

  return lot;
}
