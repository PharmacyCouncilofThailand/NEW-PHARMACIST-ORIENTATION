"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLang } from "../../contexts/LangContext";

export default function StickySubnav() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const pastHero = window.scrollY > window.innerHeight * 0.6;
    const nearBottom =
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 100;
    
    setVisible(pastHero && !nearBottom);
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
    handleScroll(); // Trigger once on mount
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
      <Link
        href="/register"
        className="px-6 py-3 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-white text-sm sm:text-base font-bold hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/40 transition-all shadow-xl flex items-center gap-2.5 whitespace-nowrap"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>
        {t("countdown.cta")}
      </Link>
    </div>
  );
}
