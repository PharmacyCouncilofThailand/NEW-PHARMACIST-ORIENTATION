"use client";

import { useRef, useEffect } from "react";
import { useLang } from "../../contexts/LangContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ข้อมูลสปอนเซอร์
const sponsors = [
  { id: 1, name: "สภาเภสัชกรรม", image: "/logo สภาเภสัชกรรม.jpg", tier: "platinum" },
  { id: 2, name: "Pipat T.", image: "/sponsor/1773714520895 - pipat t.jpg", tier: "gold" },
  { id: 3, name: "Kuk Jundoom", image: "/sponsor/IMG_4354 - Kuk Jundoom.jpeg", tier: "gold" },
  { id: 4, name: "Chonlatorn Nualsopa", image: "/sponsor/IMG_7271 - Chonlatorn Nualsopa.png", tier: "silver" },
  { id: 5, name: "Viiew", image: "/sponsor/RGB TP Standard Logo_Red - viiew.png", tier: "silver" },
  { id: 6, name: "Biovalys BVL", image: "/sponsor/01-1_Biovalys_Vertical-Color - Biovalys BVL.png", tier: "gold" },
  { id: 7, name: "Tung Kaenchan", image: "/sponsor/1775613129544 (1) - Tung Kaenchan.png", tier: "silver" },
  { id: 8, name: "BMH 1", image: "/sponsor/BMH 1 - แผนก บุคคล.jpeg", tier: "silver" },
  { id: 9, name: "FASCINO", image: "/sponsor/FASCINO LOGO 23-05_0 - Jiraporn Rodparn.png", tier: "gold" },
  { id: 10, name: "ทิฆัมพร หมวดสิงห์", image: "/sponsor/IMG_3964 - ทิฆัมพร หมวดสิงห์.jpeg", tier: "silver" },
  { id: 11, name: "boommie zung", image: "/sponsor/IMG_7212 - boommie zung.png", tier: "silver" },
  { id: 12, name: "ATC", image: "/sponsor/LOGO-ATC - Hratlantic.jpg", tier: "gold" },
  { id: 13, name: "CP AXTRA Makro Lotuss", image: "/sponsor/Logo CP AXTRA I Makro Lotuss Artwork_โลโก้โลตัส - Yanisa C..png", tier: "gold" },
  { id: 14, name: "Siam Bheasach", image: "/sponsor/Logo_siam_Bheasach_mail - Pusadee Isarasereepong.jpg", tier: "silver" },
  { id: 15, name: "Boots", image: "/sponsor/boots new logo-01 - Naphatsorn Phromraksa.png", tier: "gold" },
  { id: 16, name: "อังคณา พวงสมบัติ", image: "/sponsor/inbound5383401797846593023 - อังคณา พวงสมบัติ.jpg", tier: "silver" },
  { id: 17, name: "Topscare", image: "/sponsor/topscare-25 - Budsaya Rangdee.jpg", tier: "gold" },
  { id: 18, name: "สุมณฑา สืบเหล่ารบ", image: "/sponsor/นามบัตร - สุมณฑา สืบเหล่ารบ.jpg", tier: "silver" },
  { id: 19, name: "โรงพยาบาลสินแพทย์ ศรีนครินทร์", image: "/sponsor/โลโก้2 - โรงพยาบาลสินแพทย์ ศรีนครินทร์.jpg", tier: "gold" },
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={encodeURI(s.image)}
                        alt={s.name}
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={encodeURI(s.image)}
                        alt={s.name}
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
