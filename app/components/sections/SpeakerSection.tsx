"use client";

import { useState, useRef, useEffect, memo } from "react";
import Image from "next/image";
import ScrollReveal from "../scroll/ScrollReveal";
import { useLang } from "../../contexts/LangContext";

interface Speaker {
  id: string;
  nameKey: string;
  positionKey: string;
  topicKey: string;
  descKey: string;
  emoji: string;
  gradient: string;
  badgeColor: string;
  tags: string[];
  image?: string;
}

const speakers: Speaker[] = [
  {
    id: "s1",
    nameKey: "speaker.s1.name",
    positionKey: "speaker.s1.position",
    topicKey: "speaker.s1.topic",
    descKey: "speaker.s1.desc",
    emoji: "👨‍⚕️",
    gradient: "from-violet-600 to-purple-700",
    badgeColor: "bg-violet-500/10 text-violet-600 border-violet-200 dark:border-violet-800",
    tags: ["speaker.tag.president", "speaker.tag.pharmacy"],
    image: "/President.jpg",
  },
  {
    id: "s2",
    nameKey: "speaker.s2.name",
    positionKey: "speaker.s2.position",
    topicKey: "speaker.s2.topic",
    descKey: "speaker.s2.desc",
    emoji: "🎙️",
    gradient: "from-blue-500 to-indigo-600",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
    tags: ["speaker.tag.ceremony", "speaker.tag.pr"],
    image: "/President.jpg",
  },
  {
    id: "s3",
    nameKey: "speaker.s3.name",
    positionKey: "speaker.s3.position",
    topicKey: "speaker.s3.topic",
    descKey: "speaker.s3.desc",
    emoji: "💡",
    gradient: "from-indigo-500 to-violet-600",
    badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800",
    tags: ["speaker.tag.expert", "speaker.tag.insight"],
    image: "/President.jpg",
  },
];

const SpeakerCard = memo(function SpeakerCard({
  speaker,
  index,
  visible,
}: {
  speaker: Speaker;
  index: number;
  visible: boolean;
}) {
  const { t } = useLang();

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${index * 0.15}s`,
      }}
      className="group relative overflow-hidden rounded-3xl aspect-[3/4] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
    >
      {/* Picture */}
      {speaker.image ? (
        <Image
          src={speaker.image}
          alt={t(speaker.nameKey)}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${speaker.gradient} flex items-center justify-center transition-transform duration-700 group-hover:scale-105`}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.4)_0%,transparent_50%)]" />
          <span className="text-[100px] sm:text-[120px] drop-shadow-xl">{speaker.emoji}</span>
        </div>
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

      {/* Name */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center justify-end text-center h-1/2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md leading-snug">
          {t(speaker.nameKey)}
        </h3>
      </div>
    </div>
  );
});

export default function SpeakerSection() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="speakers" ref={ref} className="py-24 sm:py-32 relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/30 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <ScrollReveal variant="blur">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight text-slate-900 dark:text-white mb-4">
              <span className="gradient-text-anim">{t("speaker.title2")}</span>
            </h2>

          </div>
        </ScrollReveal>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakers.map((s, i) => (
            <SpeakerCard key={s.id} speaker={s} index={i} visible={visible} />
          ))}
        </div>

        {/* Bottom note */}
        <ScrollReveal variant="fade-up" delay={400}>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-10">
            {t("speaker.note")}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
