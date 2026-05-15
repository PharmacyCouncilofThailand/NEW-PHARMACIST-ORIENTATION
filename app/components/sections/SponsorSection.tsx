"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useLang } from "../../contexts/LangContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ข้อมูลสปอนเซอร์
const sponsors = [
  { id: 1,  name: "Sponsor 1",  image: "/sponsor/Logo01-01_1_11zon.webp",  tier: "gold" },
  { id: 2,  name: "Sponsor 2",  image: "/sponsor/Logo01-02_2_11zon.webp",  tier: "gold" },
  { id: 3,  name: "Sponsor 3",  image: "/sponsor/Logo01-03_3_11zon.webp",  tier: "gold" },
  { id: 4,  name: "Sponsor 4",  image: "/sponsor/Logo01-04_4_11zon.webp",  tier: "gold" },
  { id: 5,  name: "Sponsor 5",  image: "/sponsor/Logo01-05_5_11zon.webp",  tier: "gold" },
  { id: 6,  name: "Sponsor 6",  image: "/sponsor/Logo01-06_6_11zon.webp",  tier: "gold" },
  { id: 7,  name: "Sponsor 7",  image: "/sponsor/Logo01-07_7_11zon.webp",  tier: "gold" },
  { id: 8,  name: "Sponsor 8",  image: "/sponsor/Logo01-08_8_11zon.webp",  tier: "gold" },
  { id: 9,  name: "Sponsor 9",  image: "/sponsor/Logo01-09_9_11zon.webp",  tier: "gold" },
  { id: 10, name: "Sponsor 10", image: "/sponsor/Logo01-10_10_11zon.webp", tier: "gold" },
  { id: 11, name: "Sponsor 11", image: "/sponsor/Logo01-11_11_11zon.webp", tier: "gold" },
  { id: 12, name: "Sponsor 12", image: "/sponsor/Logo01-12_12_11zon.webp", tier: "gold" },
  { id: 13, name: "Sponsor 13", image: "/sponsor/Logo01-13_13_11zon.webp", tier: "gold" },
  { id: 14, name: "Sponsor 14", image: "/sponsor/Logo01-14_14_11zon.webp", tier: "gold" },
  { id: 15, name: "Sponsor 15", image: "/sponsor/Logo01-15_15_11zon.webp", tier: "gold" },
  { id: 16, name: "Sponsor 16", image: "/sponsor/Logo01-16_16_11zon.webp", tier: "gold" },
  { id: 17, name: "Sponsor 17", image: "/sponsor/Logo01-17_17_11zon.webp", tier: "gold" },
  { id: 18, name: "Sponsor 18", image: "/sponsor/Logo01-18_18_11zon.webp", tier: "gold" },
  { id: 19, name: "Sponsor 19", image: "/sponsor/Logo01-19_19_11zon.webp", tier: "gold" },
  { id: 20, name: "Sponsor 20", image: "/sponsor/Logo01-20_20_11zon.webp", tier: "gold" },
  { id: 21, name: "Sponsor 21", image: "/sponsor/Logo01-21_21_11zon.webp", tier: "gold" },
  { id: 22, name: "Sponsor 22", image: "/sponsor/Logo01-22_22_11zon.webp", tier: "gold" },
  { id: 23, name: "Sponsor 23", image: "/sponsor/Logo01-23_23_11zon.webp", tier: "gold" },
  { id: 24, name: "Sponsor 24", image: "/sponsor/Logo01-24_24_11zon.webp", tier: "gold" },
  { id: 25, name: "Sponsor 25", image: "/sponsor/Logo01-25_25_11zon.webp", tier: "gold" },
  { id: 26, name: "Sponsor 26", image: "/sponsor/Logo01-26_26_11zon.webp", tier: "gold" },
  { id: 27, name: "Sponsor 27", image: "/sponsor/Logo01-27_27_11zon.webp", tier: "gold" },
  { id: 28, name: "Sponsor 28", image: "/sponsor/Logo01-28_28_11zon.webp", tier: "gold" },
  { id: 29, name: "Sponsor 29", image: "/sponsor/Logo01-29_29_11zon.webp", tier: "gold" },
  { id: 30, name: "Sponsor 30", image: "/sponsor/Logo01-30_30_11zon.webp", tier: "gold" },
  { id: 31, name: "Sponsor 31", image: "/sponsor/Logo01-31_31_11zon.webp", tier: "gold" },
  { id: 32, name: "Sponsor 32", image: "/sponsor/Logo01-32_32_11zon.webp", tier: "gold" },
  { id: 33, name: "Sponsor 33", image: "/sponsor/Logo01-33_33_11zon.webp", tier: "gold" },
  { id: 34, name: "Sponsor 34", image: "/sponsor/Logo01-34_34_11zon.webp", tier: "gold" },
  { id: 35, name: "Sponsor 35", image: "/sponsor/Logo01-35_35_11zon.webp", tier: "gold" },
  { id: 36, name: "Sponsor 36", image: "/sponsor/Logo01-36_36_11zon.webp", tier: "gold" },
  { id: 37, name: "Sponsor 37", image: "/sponsor/Logo01-37_37_11zon.webp", tier: "gold" },
  { id: 38, name: "Sponsor 38", image: "/sponsor/Logo01-38_38_11zon.webp", tier: "gold" },
  { id: 39, name: "Sponsor 39", image: "/sponsor/Logo01-39_39_11zon.webp", tier: "gold" },
  { id: 40, name: "Sponsor 40", image: "/sponsor/Logo01-40_40_11zon.webp", tier: "gold" },
];

// ใช้ 3 ชุดเพื่อให้ translateX(-33.333%) loop ได้ seamless ไม่กระตุก
const marqueeItems = Array(3).fill(sponsors).flat();
// แถวที่ 2 — ลำดับสลับกัน
const marqueeItemsRow2 = [...Array(3).fill(sponsors).flat()].reverse();

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
              className="marquee-track flex gap-4 sm:gap-6 w-max"
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
              className="marquee-track flex gap-4 sm:gap-6 w-max"
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
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-33.333%, 0, 0); }
        }
        @keyframes sponsor-scroll-reverse {
          from { transform: translate3d(-33.333%, 0, 0); }
          to   { transform: translate3d(0, 0, 0); }
        }
        .marquee-track {
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
}
