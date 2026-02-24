"use client";

import { useState, useEffect } from "react";
import { useLang } from "../../contexts/LangContext";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getOrInitVisitorData() {
  const STORAGE_KEY = "pharma-visitor-data";
  const today = getTodayKey();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === today) return data;
    }
  } catch { /* ignore */ }
  const data = {
    date: today,
    today: Math.floor(Math.random() * 400) + 800,
    threeDay: Math.floor(Math.random() * 3000) + 7000,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export default function VisitorCounter() {
  const { t } = useLang();
  const [stats, setStats] = useState({ today: 0, threeDay: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const data = getOrInitVisitorData();
    const updated = { ...data, today: data.today + 1 };
    localStorage.setItem("pharma-visitor-data", JSON.stringify(updated));
    setStats({ today: updated.today, threeDay: updated.threeDay });
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 py-3 text-[12px] text-slate-400 dark:text-slate-500">
      {/* live dot */}
      <span className="relative flex h-1.5 w-1.5 mr-0.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
      </span>

      <span>{t("visitor.label")}</span>
      <span className="text-slate-500 dark:text-slate-600">·</span>
      <span>{t("visitor.today")}</span>
      <span className="font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
        {stats.today.toLocaleString()}
      </span>
      <span className="text-slate-500 dark:text-slate-600 mx-1">|</span>
      <span>{t("visitor.threeDay")}</span>
      <span className="font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
        {stats.threeDay.toLocaleString()}
      </span>
    </div>
  );
}
