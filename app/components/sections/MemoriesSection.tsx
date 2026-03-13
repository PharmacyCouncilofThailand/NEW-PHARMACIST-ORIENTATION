"use client";

import ScrollReveal from "../scroll/ScrollReveal";
import Image from "next/image";
import { useLang } from "../../contexts/LangContext";

interface Memory {
  img: string;
  year: string;
  title: string;
  desc: string;
}

const rawMemories: Memory[] = [
  { img: "/recent-photos/1E53B59F01CD44CD787B849199CF5C0F3E267069.jpeg", year: "2026", title: "New Pharmacist Orientation", desc: "Memorable moments together" },
  { img: "/recent-photos/51B995066240D701A0DD085CA2ED2FB1D7187928.jpeg", year: "2026", title: "New Pharmacist Orientation", desc: "Memorable moments together" },
  { img: "/recent-photos/773CB9D0F423CB04543E6FE0609A024C37881EBF.jpeg", year: "2026", title: "New Pharmacist Orientation", desc: "Memorable moments together" },
  { img: "/recent-photos/7F0FC46AD05B780BA0652C2E5C82B8D030F690E2.jpeg", year: "2026", title: "New Pharmacist Orientation", desc: "Memorable moments together" },
  { img: "/recent-photos/854EE14C1FE23AE07940D6DCC50B6F9711F6F69E.jpeg", year: "2026", title: "New Pharmacist Orientation", desc: "Memorable moments together" },
  { img: "/recent-photos/B5BD2714196F1975A1125DAF6C40D30278F262E5.jpeg", year: "2026", title: "New Pharmacist Orientation", desc: "Memorable moments together" },
  { img: "/recent-photos/E47A6A1D43F7DD875B3DF3D29F8BBCB7988618A9.jpeg", year: "2026", title: "New Pharmacist Orientation", desc: "Memorable moments together" },
  { img: "/recent-photos/F60B64B5CEA083BD81DE9B4D2E4466A69BE01059.jpeg", year: "2026", title: "New Pharmacist Orientation", desc: "Memorable moments together" },
  { img: "/recent-photos/FD1719C1BB54DC20CC78A18EBA501119E994A669.jpeg", year: "2026", title: "New Pharmacist Orientation", desc: "Memorable moments together" },
  { img: "/recent-photos/FE540C7BDE9AEB1B564C7BD4961B4BEB964BDA37.jpeg", year: "2026", title: "New Pharmacist Orientation", desc: "Memorable moments together" },
];

// Pre-computed reversed array (avoids re-creating on every render)
const reversedMemories = [...rawMemories].reverse();

const MarqueeColumn = ({ items, direction = "up", speed = "40s" }: { items: Memory[]; direction?: "up" | "down"; speed?: string }) => {
  return (
    <div className="relative h-[650px] overflow-hidden group [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]">


      {/* Moving Container */}
      <div
        className={`flex flex-col gap-6 ${direction === "up" ? "animate-marquee-up" : "animate-marquee-down"} hover:[animation-play-state:paused] will-change-transform`}
        style={{ animationDuration: speed, transform: "translateZ(0)" }}
      >
        {[...items, ...items].map((mem, i) => (
          <div key={`${i}-${mem.title}`} className="relative rounded-2xl overflow-hidden shrink-0 group/card cursor-pointer transform-gpu shadow-lg hover:shadow-2xl hover:shadow-violet-200/30 transition-all duration-500">
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
              <div className="absolute inset-0">
                <Image
                  src={mem.img}
                  alt={mem.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-110 filter grayscale group-hover/card:grayscale-0 will-change-transform"
                  loading="lazy"
                />
              </div>

              {/* Overlay wash */}
              <div className="absolute inset-0 bg-gradient-to-b from-violet-100/20 to-blue-100/20 group-hover/card:opacity-0 transition-opacity duration-500" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover/card:opacity-100 transition-all duration-400 translate-y-4 group-hover/card:translate-y-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative z-10">
                  <span className="text-violet-300 text-xs font-bold tracking-widest uppercase mb-2 block">{mem.year}</span>
                  <h3 className="text-white font-bold text-lg leading-tight">{mem.title}</h3>
                  <p className="text-slate-300 text-xs mt-1">{mem.desc}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function MemoriesSection() {
  const { t } = useLang();
  return (
    <section id="memories" className="relative py-32 z-10 overflow-hidden transform-gpu">
      {/* Background - using consistent aurora opacity */}
      <div className="absolute inset-0 aurora-bg opacity-20 pointer-events-none" />

      {/* Decorative top line - blue/violet theme */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <ScrollReveal variant="blur">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-[0.9] tracking-tight text-slate-900 dark:text-white">
                 {t("memories.title1")}<br />
                 <span className="gradient-text-anim">{t("memories.title2")}</span>
              </h2>
            </div>
          </div>
        </ScrollReveal>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
          <MarqueeColumn items={rawMemories} direction="up" speed="55s" />
          <div className="hidden md:block pt-24">
            <MarqueeColumn items={reversedMemories} direction="down" speed="60s" />
          </div>
          <div className="hidden md:block">
            <MarqueeColumn items={rawMemories} direction="up" speed="50s" />
          </div>
        </div>
      </div>
    </section>
  );
}
