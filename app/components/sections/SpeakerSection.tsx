"use client";

import { useState, useRef, useEffect, memo } from "react";
import Image from "next/image";
import ScrollReveal from "../scroll/ScrollReveal";
import { useLang } from "../../contexts/LangContext";

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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
    image: "/2.png",
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
    image: "/1.png",
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
    image: "/2.png",
  },
  {
    id: "s4",
    nameKey: "speaker.s4.name",
    positionKey: "speaker.s4.position",
    topicKey: "speaker.s4.topic",
    descKey: "speaker.s4.desc",
    emoji: "🔬",
    gradient: "from-blue-600 to-cyan-700",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
    tags: ["speaker.tag.expert"],
    image: "/1.png",
  },
  {
    id: "s5",
    nameKey: "speaker.s5.name",
    positionKey: "speaker.s5.position",
    topicKey: "speaker.s5.topic",
    descKey: "speaker.s5.desc",
    emoji: "🏥",
    gradient: "from-teal-500 to-emerald-600",
    badgeColor: "bg-teal-500/10 text-teal-600 border-teal-200 dark:border-teal-800",
    tags: ["speaker.tag.expert"],
    image: "/2.png",
  },
  {
    id: "s6",
    nameKey: "speaker.s6.name",
    positionKey: "speaker.s6.position",
    topicKey: "speaker.s6.topic",
    descKey: "speaker.s6.desc",
    emoji: "🏢",
    gradient: "from-sky-500 to-blue-600",
    badgeColor: "bg-sky-500/10 text-sky-600 border-sky-200 dark:border-sky-800",
    tags: ["speaker.tag.expert"],
    image: "/1.png",
  },
  {
    id: "s7",
    nameKey: "speaker.s7.name",
    positionKey: "speaker.s7.position",
    topicKey: "speaker.s7.topic",
    descKey: "speaker.s7.desc",
    emoji: "📋",
    gradient: "from-rose-500 to-pink-600",
    badgeColor: "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800",
    tags: ["speaker.tag.expert"],
    image: "/2.png",
  },
  {
    id: "s8",
    nameKey: "speaker.s8.name",
    positionKey: "speaker.s8.position",
    topicKey: "speaker.s8.topic",
    descKey: "speaker.s8.desc",
    emoji: "💻",
    gradient: "from-fuchsia-500 to-purple-600",
    badgeColor: "bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-200 dark:border-fuchsia-800",
    tags: ["speaker.tag.expert"],
    image: "/1.png",
  },
  {
    id: "s9",
    nameKey: "speaker.s9.name",
    positionKey: "speaker.s9.position",
    topicKey: "speaker.s9.topic",
    descKey: "speaker.s9.desc",
    emoji: "🏭",
    gradient: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800",
    tags: ["speaker.tag.expert"],
    image: "/2.png",
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
        transition: `opacity 0.7s cubic-bezier(0.23,1,0.32,1) ${index * 0.15}s, transform 0.7s cubic-bezier(0.23,1,0.32,1) ${index * 0.15}s`,
      }}
      className="antialiased group relative overflow-hidden rounded-none aspect-[3/4] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition duration-500 transform hover:-translate-y-2"
    >
      {/* Picture */}
      {speaker.image ? (
        <Image
          src={speaker.image}
          alt={t(speaker.nameKey)}
          fill
          unoptimized={true}
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${speaker.gradient} flex items-center justify-center transition-transform duration-700 group-hover:scale-105`}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.4)_0%,transparent_50%)]" />
          <span className="text-[100px] sm:text-[120px] drop-shadow-xl">{speaker.emoji}</span>
        </div>
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent opacity-100 transition-opacity duration-500" />

      {/* Name and Position */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center justify-end text-center h-1/2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-[20px] sm:text-2xl font-bold text-white mb-2 shadow-black drop-shadow-lg leading-tight" style={{ textRendering: "optimizeLegibility" }}>
          {t(speaker.nameKey)}
        </h3>
        <p className="text-[13px] sm:text-base font-medium text-white bg-black/60 md:bg-black/20 md:backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm opacity-100 transition-opacity duration-300">
          {t(speaker.positionKey)}
        </p>
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
    <section id="speakers" ref={ref} className="scroll-mt-40 py-12 md:py-20 lg:py-24 relative overflow-hidden">
      {/* BG Video */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <video
          src="/BgSp.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Optional overlay to darken/tint the video to ensure text readability */}
        <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
      </div>
      
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/30 to-transparent z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <ScrollReveal variant="fade-up">
          <div className="text-center mt-6 mb-8 md:mb-12">
            <h2 className="text-[clamp(1.2rem,3vw,2.6rem)] font-black tracking-tight text-slate-900 dark:text-white mb-4">
              <span className="gradient-text-anim">{t("speaker.title2")}</span>
            </h2>

          </div>
        </ScrollReveal>

        {/* Swiper Slider */}
        <div className="w-full pb-12 relative max-w-7xl mx-auto md:px-20">
          {/* Custom Navigation Buttons (Desktop Only) */}
          <button className="speaker-nav-prev hidden md:flex absolute lg:-left-4 md:-left-2 left-0 top-[40%] -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 items-center justify-center text-violet-600 dark:text-violet-400 hover:scale-110 hover:bg-violet-50 dark:hover:bg-slate-700 transition-all cursor-pointer">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button className="speaker-nav-next hidden md:flex absolute lg:-right-4 md:-right-2 right-0 top-[40%] -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 items-center justify-center text-violet-600 dark:text-violet-400 hover:scale-110 hover:bg-violet-50 dark:hover:bg-slate-700 transition-all cursor-pointer">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            roundLengths={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1.5,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: '.speaker-nav-next',
              prevEl: '.speaker-nav-prev',
            }}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="w-full max-w-[900px] !pb-12"
          >
            {speakers.map((s, i) => (
              <SwiperSlide key={s.id} className="!w-[65vw] max-w-[280px] sm:!w-[320px] sm:max-w-none">
                <SpeakerCard speaker={s} index={i} visible={visible} />
              </SwiperSlide>
            ))}
          </Swiper>
          
          <style>{`
            .swiper-pagination {
              bottom: 0 !important;
            }
            .swiper-pagination-bullet {
              background-color: #8b5cf6 !important;
              opacity: 0.5;
            }
            .swiper-pagination-bullet-active {
              opacity: 1;
            }
            .swiper-button-disabled {
              opacity: 0.3 !important;
              cursor: not-allowed !important;
              pointer-events: none;
            }
          `}</style>
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
