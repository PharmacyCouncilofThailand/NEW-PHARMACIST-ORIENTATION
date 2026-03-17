"use client";

import ScrollReveal from "../scroll/ScrollReveal";
import { useLang } from "../../contexts/LangContext";

// ข้อมูลสปอนเซอร์ — เพิ่ม image path เมื่อมีโลโก้จริง
const sponsors = [
  { id: 1, name: "สภาเภสัชกรรม", image: "/logo สภาเภสัชกรรม.jpg", tier: "platinum" },
  { id: 2, name: "Sponsor 2",    image: null, tier: "gold" },
  { id: 3, name: "Sponsor 3",    image: null, tier: "gold" },
  { id: 4, name: "Sponsor 4",    image: null, tier: "gold" },
  { id: 5, name: "Sponsor 5",    image: null, tier: "silver" },
  { id: 6, name: "Sponsor 6",    image: null, tier: "silver" },
  { id: 7, name: "Sponsor 7",    image: null, tier: "silver" },
  { id: 8, name: "Sponsor 8",    image: null, tier: "silver" },
];

// ทำซ้ำเพื่อให้ marquee loop ได้สวยงาม
const marqueeItems = [...sponsors, ...sponsors, ...sponsors];
// แถวที่ 2 — ลำดับสลับกัน
const marqueeItemsReverse = [...sponsors].reverse();
const marqueeItemsRow2 = [...marqueeItemsReverse, ...marqueeItemsReverse, ...marqueeItemsReverse];






export default function SponsorSection() {
  const { t } = useLang();

  return (
    <section
      id="sponsors"
      className="min-h-[60vh] flex flex-col justify-center relative py-10 sm:py-14 z-10 overflow-hidden"
    >
      {/* Aurora background — same as other sections */}
      <div className="absolute inset-0 aurora-bg opacity-15 pointer-events-none" />

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />

      {/* Floating decorations */}
      <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-violet-200/20 to-blue-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        {/* ─── Heading ─── */}
        <ScrollReveal variant="blur">
          <div className="text-center mb-8">

            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight tracking-tight text-slate-900 dark:text-white mb-12">
              {t("sponsor.title1")}{" "}
              <span className="gradient-text-anim">
                {t("sponsor.title2")}
              </span>
            </h2>
          </div>
        </ScrollReveal>

        {/* ─── Marquee Track ─── */}
        <div className="relative">
          {/* Scrolling strip */}
          <div
            className="overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
          >
            <div
              className="flex gap-6 w-max"
              style={{
                animation: "sponsor-scroll 40s linear infinite",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.animationPlayState =
                  "paused")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.animationPlayState =
                  "running")
              }
            >
              {marqueeItems.map((s, i) => (
                <div
                  key={`${s.id}-${i}`}
                  className="flex-shrink-0 flex items-center gap-10 group cursor-default select-none"
                >
                  <div className="flex items-center gap-3">

                    {s.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={encodeURI(s.image)}
                        alt={s.name}
                        className="h-24 sm:h-28 w-auto object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span
                        className="text-2xl sm:text-3xl font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap"
                      >
                        {s.name}
                      </span>
                    )}
                  </div>

                  {/* Divider */}
                  <span
                    aria-hidden
                    className="w-px h-6 bg-gradient-to-b from-transparent via-violet-300/40 dark:via-violet-700/30 to-transparent flex-shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Marquee Track Row 2 (reverse) ─── */}
        <div className="relative mt-6">
          {/* Scrolling strip */}
          <div
            className="overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
          >
            <div
              className="flex gap-6 w-max"
              style={{
                animation: "sponsor-scroll-reverse 45s linear infinite",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.animationPlayState =
                  "paused")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.animationPlayState =
                  "running")
              }
            >
              {marqueeItemsRow2.map((s, i) => (
                <div
                  key={`r2-${s.id}-${i}`}
                  className="flex-shrink-0 flex items-center gap-10 cursor-default select-none"
                >
                  <div className="flex items-center gap-3">
                    {s.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={encodeURI(s.image)}
                        alt={s.name}
                        className="h-24 sm:h-28 w-auto object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-2xl sm:text-3xl font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                        {s.name}
                      </span>
                    )}
                  </div>

                  {/* Divider */}
                  <span
                    aria-hidden
                    className="w-px h-6 bg-gradient-to-b from-transparent via-violet-300/40 dark:via-violet-700/30 to-transparent flex-shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />

      {/* Keyframe for marquee */}
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
