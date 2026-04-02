"use client";

import { useEffect, useRef, useState, memo } from "react";
import { useLang } from "../../contexts/LangContext";

// Hook นี้นับค่าจาก 0 ไปถึง end อย่างรวดเร็วแล้วค้างไว้
export function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp: number;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return { count, ref };
}

export interface StatItemProps {
  end: number;
  suffix: string;
  label: string;
  delay: string;
  icon: React.ReactNode;
  gradient: string;
}

export const StatItem = memo(function StatItem({ end, suffix, label, delay, icon, gradient }: StatItemProps) {
  const { count, ref } = useCountUp(end, 2500);

  return (
    <div 
      ref={ref}
      className={`relative p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden group hover:-translate-y-1 transition-transform duration-300 ${delay}`}
    >
      {/* Glow behind the card on hover */}
      <div className={`absolute -inset-1 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 bg-gradient-to-br ${gradient} pointer-events-none`} />
      
      {/* Card Content */}
      <div className="relative flex flex-col items-center justify-center text-center h-full gap-2">
        
        {/* Top Header: Icon */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br ${gradient} text-white mb-1`}>
          {icon}
        </div>
        
        {/* Bottom Stats */}
        <div className="mt-auto flex flex-col items-center">
          <div className="flex items-baseline justify-center gap-1 mb-0.5">
            <span className={`text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br ${gradient} tabular-nums tracking-tighter drop-shadow-sm`}>
              {count.toLocaleString()}
            </span>
            <span className={`text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-br ${gradient} drop-shadow-sm`}>
              {suffix}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs font-semibold text-white/70 tracking-wide line-clamp-2">
            {label}
          </p>
        </div>

      </div>
    </div>
  );
});

export function useStatsData() {
  const { lang } = useLang();

  return [
    {
      end: 2000,
      suffix: "+",
      label: lang === "TH" ? "เภสัชกรจบใหม่" : "New Pharmacists",
      delay: "animate-fade-in-up",
      gradient: "from-blue-500 to-indigo-600",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      end: 50,
      suffix: "+",
      label: lang === "TH" ? "บูธนิทรรศการ" : "Exhibition Booths",
      delay: "animate-fade-in-up delay-[100ms]",
      gradient: "from-fuchsia-500 to-pink-600",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      end: 10,
      suffix: "+",
      label: lang === "TH" ? "วิทยากรผู้ทรงคุณวุฒิ" : "Expert Speakers",
      delay: "animate-fade-in-up delay-[200ms]",
      gradient: "from-emerald-500 to-teal-500",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
    {
      end: 30,
      suffix: "+",
      label: lang === "TH" ? "หัวข้อการบรรยาย" : "Sessions",
      delay: "animate-fade-in-up delay-[300ms]",
      gradient: "from-amber-400 to-orange-500",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      end: 100,
      suffix: "+",
      label: lang === "TH" ? "ตำแหน่งงานว่าง" : "Job Openings",
      delay: "animate-fade-in-up delay-[400ms]",
      gradient: "from-violet-500 to-purple-600",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      end: 5000,
      suffix: "+",
      label: lang === "TH" ? "ผู้เข้าชมออนไลน์" : "Online Viewers",
      delay: "animate-fade-in-up delay-[500ms]",
      gradient: "from-cyan-500 to-blue-500",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
  ];
}

export default function StatsSection() {
  const stats = useStatsData();

  return (
    <section className="relative z-30 py-12 md:py-16 lg:py-20 px-4 sm:px-6 max-w-[1000px] mx-auto w-full xl:hidden">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <StatItem key={i} {...stat} />
        ))}
      </div>
    </section>
  );
}
