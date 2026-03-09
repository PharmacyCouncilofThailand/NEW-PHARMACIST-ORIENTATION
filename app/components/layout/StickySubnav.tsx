"use client";

import { useEffect, useState, useCallback } from "react";

const sections = [
  { id: "hero", label: "Pharmacy Orientation" },
  { id: "welcome", label: "Welcome" },
  { id: "agenda", label: "Event Agenda" },
  { id: "memories", label: "Gallery" },
  { id: "job-posters", label: "Job Fair" },
] as const;

/**
 * Apple-style floating section indicator.
 * Shows current section name as a small pill at the bottom center of the viewport.
 * Fades in after scrolling past the hero.
 */
export default function StickySubnav() {
  const [visible, setVisible] = useState(false);
  const [activeLabel, setActiveLabel] = useState("Pharmacy Orientation");

  const handleScroll = useCallback(() => {
    const pastHero = window.scrollY > window.innerHeight * 0.6;
    const nearBottom =
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 100;
    setVisible(pastHero && !nearBottom);

    // Determine active section
    const scrollY = window.scrollY + 200;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (el && el.offsetTop <= scrollY) {
        setActiveLabel(sections[i].label);
        break;
      }
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="px-6 py-2.5 rounded-full backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-black/10 dark:shadow-black/30 flex items-center gap-3">
        {/* Pulsing dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
        </span>

        {/* Section label */}
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight whitespace-nowrap">
          {activeLabel}
        </span>

        {/* Scroll-to-top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="ml-1 w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-white flex items-center justify-center text-xs hover:scale-110 transition-transform shadow-md"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
