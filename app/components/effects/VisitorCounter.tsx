"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "../../contexts/LangContext";

const SESSION_KEY = "pharma-session-ts";
const SESSION_MS  = 30 * 60 * 1000; // 30 min
const SYNC_MS     = 2  * 60 * 1000; // 2 min

interface VisitorStats {
  today:    number;
  threeDay: number;
}

async function fetchVisitorStats(method: "GET" | "POST" = "GET"): Promise<VisitorStats | null> {
  try {
    const res = await fetch("/api/visitors", { method });
    if (!res.ok) return null;
    const data = await res.json();
    return { today: data.today ?? 0, threeDay: data.threeDay ?? 0 };
  } catch {
    return null;
  }
}

export default function VisitorCounter() {
  const { t }   = useLang();
  const [stats, setStats]     = useState<VisitorStats>({ today: 0, threeDay: 0 });
  const [mounted, setMounted] = useState(false);
  const syncRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const lastTs = Number(localStorage.getItem(SESSION_KEY) ?? "0");
      const isNew  = Date.now() - lastTs > SESSION_MS;

      if (isNew) {
        const data = await fetchVisitorStats("POST");
        if (!cancelled && data) {
          localStorage.setItem(SESSION_KEY, String(Date.now()));
          setStats(data);
        }
      } else {
        const data = await fetchVisitorStats("GET");
        if (!cancelled && data) setStats(data);
      }

      if (!cancelled) setMounted(true);
    }

    init();

    // Sync every 2 min to keep multiple tabs in agreement
    syncRef.current = setInterval(async () => {
      const data = await fetchVisitorStats("GET");
      if (data) setStats(data);
    }, SYNC_MS);

    return () => {
      cancelled = true;
      if (syncRef.current) clearInterval(syncRef.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "5px",
        padding: "10px 0",
        fontSize: "12px",
        color: "#94a3b8",
      }}
    >
      {/* Live dot — uses global @keyframes ping from globals.css */}
      <span style={{ position: "relative", display: "inline-flex", width: 6, height: 6, marginRight: 2 }}>
        <span className="loader-ping" />
        <span
          style={{
            position: "relative", display: "block",
            width: 6, height: 6, borderRadius: "50%", background: "#10b981",
          }}
        />
      </span>

      <span>{t("visitor.label")}</span>
      <span style={{ color: "#64748b" }}>·</span>
      <span>{t("visitor.today")}</span>
      <span style={{ fontWeight: 600, color: "#64748b", fontVariantNumeric: "tabular-nums" }}>
        {stats.today.toLocaleString()}
      </span>
      <span style={{ color: "#64748b", margin: "0 2px" }}>|</span>
      <span>{t("visitor.threeDay")}</span>
      <span style={{ fontWeight: 600, color: "#64748b", fontVariantNumeric: "tabular-nums" }}>
        {stats.threeDay.toLocaleString()}
      </span>
    </div>
  );
}
