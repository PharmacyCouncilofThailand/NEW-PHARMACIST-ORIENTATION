"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useLang } from "../../contexts/LangContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ข้อมูลสปอนเซอร์
const sponsors = [
  { id: 1, name: "สภาเภสัชกรรม", image: "/logo-pharmacy-council.jpg", tier: "platinum" },
  { id: 2, name: "Sponsor 1", image: "/sponsor/Logo01-01.png", tier: "gold" },
  { id: 3, name: "Sponsor 2", image: "/sponsor/Logo01-02.png", tier: "gold" },
  { id: 4, name: "Sponsor 3", image: "/sponsor/Logo01-03.png", tier: "gold" },
  { id: 5, name: "Sponsor 4", image: "/sponsor/Logo01-04.png", tier: "gold" },
  { id: 6, name: "Sponsor 5", image: "/sponsor/Logo01-05.png", tier: "gold" },
  { id: 7, name: "Sponsor 6", image: "/sponsor/Logo01-06.png", tier: "gold" },
  { id: 8, name: "Sponsor 7", image: "/sponsor/Logo01-07.png", tier: "gold" },
  { id: 9, name: "Sponsor 8", image: "/sponsor/Logo01-08.png", tier: "gold" },
  { id: 10, name: "Sponsor 9", image: "/sponsor/Logo01-09.png", tier: "gold" },
  { id: 11, name: "Sponsor 10", image: "/sponsor/Logo02-01.png", tier: "gold" },
  { id: 12, name: "Sponsor 11", image: "/sponsor/Logo02-02.png", tier: "gold" },
  { id: 13, name: "Sponsor 12", image: "/sponsor/Logo02-03.png", tier: "gold" },
  { id: 14, name: "Sponsor 13", image: "/sponsor/Logo02-04.png", tier: "gold" },
  { id: 15, name: "Sponsor 14", image: "/sponsor/Logo02-05.png", tier: "gold" },
  { id: 16, name: "Sponsor 15", image: "/sponsor/Logo02-06.png", tier: "gold" },
  { id: 17, name: "Sponsor 16", image: "/sponsor/Logo02-07.png", tier: "gold" },
  { id: 18, name: "Sponsor 17", image: "/sponsor/Logo02-08.png", tier: "gold" },
  { id: 19, name: "Sponsor 18", image: "/sponsor/Logo01-10_11zon.webp", tier: "gold" },
  { id: 20, name: "Sponsor 19", image: "/sponsor/Logo01-11_11zon.webp", tier: "gold" },
  { id: 21, name: "Sponsor 20", image: "/sponsor/Logo01-12_11zon.webp", tier: "gold" },
  { id: 22, name: "Sponsor 21", image: "/sponsor/Logo01-13_11zon.webp", tier: "gold" },
  { id: 23, name: "Sponsor 22", image: "/sponsor/Logo01-14_11zon.webp", tier: "gold" },
  { id: 24, name: "Sponsor 23", image: "/sponsor/Logo02-09_11zon.webp", tier: "gold" },
];

// ทำซ้ำเพื่อให้ marquee loop ได้สวยงาม (ลดจำนวนรอบลงเพราะเรามีสปอนเซอร์เยอะแล้ว)
const marqueeItems = Array(6).fill(sponsors).flat();
// แถวที่ 2 — ลำดับสลับกัน
const marqueeItemsRow2 = [...marqueeItems].reverse();

export default function SponsorSection() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, {
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sponsors"
      ref={sectionRef}
      className="flex flex-col justify-center relative py-10 sm:py-14 z-10 overflow-hidden"
    >
      {/* Aurora background */}
      <div className="absolute inset-0 aurora-bg opacity-15 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent z-10" />
      <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-violet-200/20 to-blue-200/20 blur-3xl pointer-events-none z-10 hidden md:block" />
      <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/20 blur-3xl pointer-events-none z-10 hidden md:block" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 w-full">
        {/* Heading */}
        <div ref={headlineRef} className="text-center mb-6 md:mb-10">
          <h2 style={{ fontFamily: "var(--font-noto-thai), 'Noto Sans Thai', sans-serif" }} className="text-[clamp(1.5rem,3.5vw,3rem)] font-black leading-tight tracking-tight text-slate-900 dark:text-white mb-3 md:mb-8">
            {t("sponsor.title1")}{" "}
          </h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 whitespace-nowrap mx-auto">
            {t("sponsor.subtitle")}
          </p>
        </div>

        {/* Marquee Row 1 */}
        <div className="relative">
          <div
            className="overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
          >
            <div
              className="flex gap-4 sm:gap-6 w-max"
              style={{ animation: "sponsor-scroll 70s linear infinite" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")}
            >
              {marqueeItems.map((s, i) => (
                <div
                  key={`${s.id}-${i}`}
                  className="flex-shrink-0 flex items-center gap-4 sm:gap-8 cursor-default select-none hover:scale-105 transition-all duration-300 opacity-90 hover:opacity-100"
                >
                  <div className="flex items-center justify-center">
                    {s.image ? (
                      <Image
                        src={s.image}
                        alt={s.name}
                        width={400}
                        height={100}
                        sizes="200px"
                        className="h-14 sm:h-20 md:h-24 w-auto object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                        {s.name}
                      </span>
                    )}
                  </div>
                  <span aria-hidden className="w-px h-6 bg-gradient-to-b from-transparent via-violet-300/40 dark:via-violet-700/30 to-transparent flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marquee Row 2 (reverse) — hidden on small mobile, show md+ */}
        <div className="relative mt-4 sm:mt-6 hidden sm:block">
          <div
            className="overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
          >
            <div
              className="flex gap-4 sm:gap-6 w-max"
              style={{ animation: "sponsor-scroll-reverse 80s linear infinite" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")}
            >
              {marqueeItemsRow2.map((s, i) => (
                <div
                  key={`r2-${s.id}-${i}`}
                  className="flex-shrink-0 flex items-center gap-4 sm:gap-8 cursor-default select-none hover:scale-105 transition-all duration-300 opacity-90 hover:opacity-100"
                >
                  <div className="flex items-center justify-center">
                    {s.image ? (
                      <Image
                        src={s.image}
                        alt={s.name}
                        width={400}
                        height={100}
                        sizes="200px"
                        className="h-14 sm:h-20 md:h-24 w-auto object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                        {s.name}
                      </span>
                    )}
                  </div>
                  <span aria-hidden className="w-px h-6 bg-gradient-to-b from-transparent via-violet-300/40 dark:via-violet-700/30 to-transparent flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />

      <style>{`
        @keyframes sponsor-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes sponsor-scroll-reverse {
          from { transform: translateX(-33.333%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
