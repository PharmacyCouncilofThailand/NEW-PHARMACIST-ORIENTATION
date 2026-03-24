"use client";

import ScrollReveal from "../scroll/ScrollReveal";
import { useLang } from "../../contexts/LangContext";

// ข้อมูลสปอนเซอร์
const sponsors = [
  { id: 1, name: "สภาเภสัชกรรม", image: "/logo สภาเภสัชกรรม.jpg", tier: "platinum" },
  { id: 2, name: "Pipat T.", image: "/sponsor/1773714520895 - pipat t.jpg", tier: "gold" },
  { id: 3, name: "Kuk Jundoom", image: "/sponsor/IMG_4354 - Kuk Jundoom.jpeg", tier: "gold" },
  { id: 4, name: "Chonlatorn Nualsopa", image: "/sponsor/IMG_7271 - Chonlatorn Nualsopa.png", tier: "silver" },
  { id: 5, name: "Viiew", image: "/sponsor/RGB TP Standard Logo_Red - viiew.png", tier: "silver" },
];

// ทำซ้ำเพื่อให้ marquee loop ได้สวยงาม (ยิ่งมีสปอนเซอร์น้อย ยิ่งต้องทำซ้ำเยอะเพื่อให้พอเต็มหน้าจอ)
const marqueeItems = Array(12).fill(sponsors).flat();
// แถวที่ 2 — ลำดับสลับกัน
const marqueeItemsRow2 = [...marqueeItems].reverse();






export default function SponsorSection() {
  const { t } = useLang();

  return (
    <section
      id="sponsors"
      className="flex flex-col justify-center relative py-10 sm:py-14 z-10 overflow-hidden"
    >
      {/* Aurora background */}
      <div className="absolute inset-0 aurora-bg opacity-15 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent z-10" />
      <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-violet-200/20 to-blue-200/20 blur-3xl pointer-events-none z-10 hidden md:block" />
      <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/20 blur-3xl pointer-events-none z-10 hidden md:block" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 w-full">
        {/* Heading */}
        <ScrollReveal variant="fade-up">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-[clamp(1.5rem,3.5vw,3rem)] font-black leading-tight tracking-tight text-slate-900 dark:text-white mb-3 md:mb-8">
              {t("sponsor.title1")}{" "}
              <span className="gradient-text-anim">
                {t("sponsor.title2")}
              </span>
            </h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 whitespace-nowrap mx-auto">
              {t("sponsor.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Marquee Row 1 */}
        <div className="relative">
          <div
            className="overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
          >
            <div
              className="flex gap-4 sm:gap-6 w-max"
              style={{ animation: "sponsor-scroll 40s linear infinite" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")}
            >
              {marqueeItems.map((s, i) => (
                <div
                  key={`${s.id}-${i}`}
                  className="flex-shrink-0 flex items-center gap-4 sm:gap-8 cursor-default select-none"
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
              style={{ animation: "sponsor-scroll-reverse 45s linear infinite" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")}
            >
              {marqueeItemsRow2.map((s, i) => (
                <div
                  key={`r2-${s.id}-${i}`}
                  className="flex-shrink-0 flex items-center gap-4 sm:gap-8 cursor-default select-none"
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
