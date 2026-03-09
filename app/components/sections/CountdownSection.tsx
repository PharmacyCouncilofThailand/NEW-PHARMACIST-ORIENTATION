"use client";

import { useState, useEffect, useRef, memo } from "react";
import { useLang } from "../../contexts/LangContext";

// วันงาน: 17 พ.ค. 2569 = 17 May 2026
const EVENT_DATE = new Date("2026-05-17T10:00:00+07:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeLeft(): TimeLeft {
  const diff = EVENT_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const FlipUnit = memo(function FlipUnit({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent: string;
}) {
  const [prev, setPrev] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      setFlip(true);
      const t = setTimeout(() => {
        setPrev(value);
        setFlip(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [value, prev]);

  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative w-16 h-16 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${accent} group`}
      >
        {/* Shine */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 dark:from-white/5 to-transparent pointer-events-none z-10" />
        {/* Divider */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-100 dark:bg-white/10 z-20" />
        {/* Number */}
        <div
          className="absolute inset-0 flex items-center justify-center z-30"
          style={{
            transform: flip ? "translateY(-8px)" : "translateY(0)",
            opacity: flip ? 0 : 1,
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
          }}
        >
          <span className="text-3xl sm:text-5xl font-black tracking-tighter tabular-nums text-slate-800 dark:text-white">
            {display}
          </span>
        </div>
        {/* Glow */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-10 opacity-10 dark:opacity-20 blur-xl pointer-events-none ${accent}`}
        />
      </div>
      <span className="text-[0.6rem] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
    </div>
  );
});

export default function CountdownSection() {
  const { t, lang } = useLang();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const eventPassed = timeLeft.total <= 0;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: timeLeft.days,    label: t("countdown.days"),    accent: "bg-violet-600" },
    { value: timeLeft.hours,   label: t("countdown.hours"),   accent: "bg-blue-600"   },
    { value: timeLeft.minutes, label: t("countdown.minutes"), accent: "bg-indigo-500" },
    { value: timeLeft.seconds, label: t("countdown.seconds"), accent: "bg-purple-500" },
  ];

  return (
    <div ref={ref} className="w-full flex flex-col items-center justify-center">
      {!eventPassed ? (
        <div
          className="flex items-center justify-center gap-3 sm:gap-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.95)",
            transition: "all 0.8s cubic-bezier(0.23,1,0.32,1) 0.2s",
          }}
        >
          {units.map((u, i) => (
            <div key={i} className="flex items-start gap-3 sm:gap-6">
              <FlipUnit value={u.value} label={u.label} accent={u.accent} />
              {i < units.length - 1 && (
                <span className="text-3xl sm:text-5xl font-black text-slate-300 dark:text-slate-600 mt-4 sm:mt-6 select-none">:</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-6xl text-center">🎉</div>
      )}
    </div>
  );
}
