"use client";

import { useState, useRef, useEffect, memo } from "react";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const handleMouse = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    requestAnimationFrame(() => {
      setTilt({ x: (y - 0.5) * -10, y: (x - 0.5) * 10 });
      setSpot({ x: x * 100, y: y * 100 });
    });
  };

  return (
    <div
      className="perspective-1000"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.7s cubic-bezier(0.23,1,0.32,1) ${index * 0.15}s`,
      }}
    >
      <div
        ref={cardRef}
        className="relative cursor-pointer h-full"
        style={{
          transform: hovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
            : "perspective(1000px) rotateX(0) rotateY(0) scale(1)",
          transition: hovered ? "transform 0.1s ease-out" : "transform 0.4s cubic-bezier(0.23,1,0.32,1)",
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouse}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
        onClick={() => setFlipped((f) => !f)}
      >
        {/* Card Face */}
        <div
          className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl hover:shadow-violet-200/30 dark:hover:shadow-violet-900/20 transition-shadow duration-300 h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Spotlight */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
            style={{
              background: `radial-gradient(300px circle at ${spot.x}% ${spot.y}%, rgba(124,58,237,0.07), transparent 70%)`,
            }}
          />

          {/* Top: Avatar area */}
          <div className={`relative h-36 bg-gradient-to-br ${speaker.gradient} overflow-hidden`}>
            {/* BG Pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 0%, transparent 50%)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-lg">
                {speaker.emoji}
              </div>
            </div>
            {/* Flip hint */}
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[0.55rem] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
              {t("speaker.clickHint")}
            </div>
          </div>

          {/* Body */}
          <div className="p-6 relative z-10">
            {/* Name & Position */}
            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-1">
              {t(speaker.nameKey)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-snug">
              {t(speaker.positionKey)}
            </p>

            {/* Topic pill */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border mb-4 ${speaker.badgeColor}`}>
              🎤 {t(speaker.topicKey)}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {speaker.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[0.65rem] font-semibold text-slate-500 dark:text-slate-400"
                >
                  {t(tag)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Flip Back — Description */}
        <div
          className={`absolute inset-0 rounded-3xl p-6 bg-gradient-to-br ${speaker.gradient} text-white flex flex-col justify-center transition-all duration-500 ${
            flipped ? "opacity-100 z-20" : "opacity-0 pointer-events-none z-0"
          }`}
        >
          <div className="text-4xl mb-4">{speaker.emoji}</div>
          <h3 className="text-lg font-black mb-3">{t(speaker.nameKey)}</h3>
          <p className="text-sm leading-relaxed text-white/90">{t(speaker.descKey)}</p>
          <button
            className="mt-6 text-xs font-bold text-white/60 hover:text-white transition-colors underline underline-offset-4"
            onClick={(e) => { e.stopPropagation(); setFlipped(false); }}
          >
            ← {t("speaker.back")}
          </button>
        </div>
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
    <section ref={ref} className="py-24 sm:py-32 relative overflow-hidden">
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
