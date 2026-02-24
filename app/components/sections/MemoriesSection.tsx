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
  { img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80", year: "2025", title: "Opening Ceremony", desc: "Grand opening with directors" },
  { img: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80", year: "2025", title: "Dispensing Workshop", desc: "Hands-on practice at OPD" },
  { img: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&q=80", year: "2025", title: "Aseptic Lab", desc: "Clean room training" },
  { img: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&q=80", year: "2024", title: "Team Building", desc: "Building relationships" },
  { img: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&q=80", year: "2024", title: "Certification", desc: "Proud moment" },
  { img: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80", year: "2024", title: "Group Photo", desc: "Memorable shot" },
  { img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80", year: "2023", title: "Learning", desc: "Knowledge sharing" },
  { img: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80", year: "2023", title: "Closing", desc: "Until next time" },
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
              <span className="section-badge text-violet-600 border-violet-200 mb-6">
                {t("memories.badge")}
              </span>
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-[0.9] tracking-tight text-slate-900 dark:text-white">
                 {t("memories.title1")}<br />
                 <span className="gradient-text-anim">{t("memories.title2")}</span>
              </h2>
            </div>
            <p className="text-slate-400 max-w-sm text-right leading-relaxed hidden md:block border-l border-slate-200 dark:border-slate-700 pl-6 font-light">
              Scroll through our collection of moments.<br />
              <span className="text-violet-600 font-semibold">Captured in time.</span>
            </p>
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
