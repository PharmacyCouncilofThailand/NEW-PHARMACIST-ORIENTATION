"use client";

import { useEffect, useRef, useState, memo } from "react";
import { useLang } from "../../contexts/LangContext";

// Hook นี้นับค่าจาก 0 ไปถึง end อย่างรวดเร็วแล้วค้างไว้
function useCountUp(end: number, duration: number = 2000) {
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
            // Easing function (easeOutExpo)
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

interface StatItemProps {
  end: number;
  suffix: string;
  label: string;
  delay: string;
}

const StatItem = memo(function StatItem({ end, suffix, label, delay }: StatItemProps) {
  const { count, ref } = useCountUp(end, 2500);

  return (
    <div 
      ref={ref}
      className={`relative flex flex-col items-center p-6 sm:p-8 rounded-3xl bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 dark:border-slate-800/60 shadow-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-500 will-change-transform ${delay}`}
    >
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
      
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-violet-400 to-pink-400 text-transparent bg-clip-text tabular-nums tracking-tighter drop-shadow-sm">
          {count.toLocaleString()}
        </span>
        <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 text-transparent bg-clip-text drop-shadow-sm">
          {suffix}
        </span>
      </div>
      <p className="text-sm sm:text-base font-medium text-slate-300 dark:text-slate-400 tracking-wide text-center">
        {label}
      </p>
    </div>
  );
});

export default function StatsSection() {
  const { lang } = useLang();

  const stats = [
    {
      end: 2000,
      suffix: "+",
      label: lang === "TH" ? "เภสัชกรใหม่เข้าร่วมงาน" : "New Pharmacists",
      delay: "animate-fade-in-up",
    },
    {
      end: 50,
      suffix: "+",
      label: lang === "TH" ? "บูธนิทรรศการและสมัครงาน" : "Exhibition & Job Booths",
      delay: "animate-fade-in-up delay-100",
    },
    {
      end: 10,
      suffix: "+",
      label: lang === "TH" ? "วิทยากรผู้ทรงคุณวุฒิ" : "Expert Speakers",
      delay: "animate-fade-in-up delay-200",
    },
  ];

  return (
    <section className="relative z-30 -mt-16 sm:-mt-24 mb-16 px-6 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {stats.map((stat, i) => (
          <StatItem key={i} {...stat} />
        ))}
      </div>
    </section>
  );
}
