"use client";

import { useRef, useEffect, useState, memo } from "react";
import Image from "next/image";
import { useLang } from "../../contexts/LangContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

gsap.registerPlugin(ScrollTrigger);

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
    emoji: "👩‍⚕️",
    gradient: "from-violet-600 to-purple-700",
    badgeColor: "bg-violet-500/10 text-violet-600 border-violet-200 dark:border-violet-800",
    tags: ["speaker.tag.expert", "speaker.tag.pharmacy"],
    image: "/welcome-se.png",
  },
  {
    id: "s2",
    nameKey: "speaker.s2.name",
    positionKey: "speaker.s2.position",
    topicKey: "speaker.s2.topic",
    descKey: "speaker.s2.desc",
    emoji: "🏪",
    gradient: "from-blue-500 to-indigo-600",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
    tags: ["speaker.tag.expert"],
    image: "/speaker/1.png",
  },
  {
    id: "s3",
    nameKey: "speaker.s3.name",
    positionKey: "speaker.s3.position",
    topicKey: "speaker.s3.topic",
    descKey: "speaker.s3.desc",
    emoji: "🏥",
    gradient: "from-indigo-500 to-violet-600",
    badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800",
    tags: ["speaker.tag.expert"],
    image: "/speaker/4.png",
  },

  {
    id: "s5",
    nameKey: "speaker.s5.name",
    positionKey: "speaker.s5.position",
    topicKey: "speaker.s5.topic",
    descKey: "speaker.s5.desc",
    emoji: "⏳",
    gradient: "from-slate-500 to-slate-600",
    badgeColor: "bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-800",
    tags: ["speaker.tag.expert"],
    image: "/speaker/5.png",
  },
  {
    id: "s6",
    nameKey: "speaker.s6.name",
    positionKey: "speaker.s6.position",
    topicKey: "speaker.s6.topic",
    descKey: "speaker.s6.desc",
    emoji: "🏛️",
    gradient: "from-teal-500 to-emerald-600",
    badgeColor: "bg-teal-500/10 text-teal-600 border-teal-200 dark:border-teal-800",
    tags: ["speaker.tag.expert"],
    image: "/speaker/3.png",
  },
  {
    id: "s7",
    nameKey: "speaker.s7.name",
    positionKey: "speaker.s7.position",
    topicKey: "speaker.s7.topic",
    descKey: "speaker.s7.desc",
    emoji: "⏳",
    gradient: "from-slate-500 to-slate-600",
    badgeColor: "bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-800",
    tags: ["speaker.tag.expert"],
    image: "/speaker/6.png",
  },
  {
    id: "s8",
    nameKey: "speaker.s8.name",
    positionKey: "speaker.s8.position",
    topicKey: "speaker.s8.topic",
    descKey: "speaker.s8.desc",
    emoji: "⏳",
    gradient: "from-slate-500 to-slate-600",
    badgeColor: "bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-800",
    tags: ["speaker.tag.expert"],
    image: "/speaker/7.png",
  },
];

const SpeakerCard = memo(function SpeakerCard({
  speaker,
}: {
  speaker: Speaker;
}) {
  const { t } = useLang();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="antialiased group relative overflow-hidden rounded-none aspect-[3/4] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl"
    >
      {/* Picture */}
      {speaker.image ? (
        <Image
          src={speaker.image}
          alt={t(speaker.nameKey)}
          fill
          sizes="(max-width: 640px) 65vw, 320px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${speaker.gradient} flex items-center justify-center transition-transform duration-700 group-hover:scale-105`}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.4)_0%,transparent_50%)]" />
          <span className="text-[100px] sm:text-[120px] drop-shadow-xl">{speaker.emoji}</span>
        </div>
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-100 transition-opacity duration-500" />

      {/* Name and Position */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center justify-end text-center h-1/2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-[15px] sm:text-[18px] tracking-tight font-bold text-white mb-1.5 shadow-black drop-shadow-lg leading-snug whitespace-nowrap" style={{ textRendering: "optimizeLegibility" }}>
          {t(speaker.nameKey)}
        </h3>
        <p className="whitespace-pre-line text-[12px] sm:text-sm font-medium text-white bg-black/60 md:bg-black/20 md:backdrop-blur-md px-3 py-1 rounded-full shadow-sm opacity-100 transition-opacity duration-300">
          {t(speaker.positionKey)}
        </p>
      </div>
    </motion.div>
  );
});

export default function SpeakerSection() {
  const { t } = useLang();
  
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Lazy-load the background video only when section is near the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || videoLoaded) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVideoLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" } // start loading 400px before section enters view
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [videoLoaded]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a timeline for the entire section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });

      tl.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      })
      .from(sliderRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.4");
      
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="speakers" ref={sectionRef} className="scroll-mt-40 py-12 md:py-20 lg:py-24 relative overflow-hidden">
      {/* BG Video (lazy-loaded when section is near viewport) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {videoLoaded && (
          <video
            src="/BgSp.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        )}
        {/* Optional overlay to darken/tint the video to ensure text readability */}
        <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
      </div>
      
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/30 to-transparent z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div ref={titleRef} className="text-center mt-6 mb-8 md:mb-12">
          <h2 style={{ fontFamily: "var(--font-noto-thai), 'Noto Sans Thai', sans-serif" }} className="text-[clamp(1.2rem,3vw,2.6rem)] font-black tracking-tight text-slate-900 dark:text-white mb-4">
            <span className="gradient-text-anim">{t("speaker.title2")}</span>
          </h2>
        </div>

        {/* Swiper Slider */}
        <div ref={sliderRef} className="w-full pb-12 relative max-w-7xl mx-auto md:px-20">
          {/* Custom Navigation Buttons (Desktop Only) */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="speaker-nav-prev hidden md:flex absolute lg:-left-4 md:-left-2 left-0 top-[40%] -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 items-center justify-center text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="speaker-nav-next hidden md:flex absolute lg:-right-4 md:-right-2 right-0 top-[40%] -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 items-center justify-center text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

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
            {speakers.map((s) => (
              <SwiperSlide key={s.id} className="!w-[65vw] max-w-[280px] sm:!w-[320px] sm:max-w-none">
                <SpeakerCard speaker={s} />
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
      </div>
    </section>
  );
}
