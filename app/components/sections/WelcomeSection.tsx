"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import Image from "next/image";
import { useLang } from "../../contexts/LangContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

// Swiper for Mobile / Tablet
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

gsap.registerPlugin(ScrollTrigger);

interface Person {
  id: string;
  nameKey: string;
  posKey: string;
  msgKey: string;
  image: string;
}

const people: Person[] = [
  {
    id: "p1",
    nameKey: "welcome.presidentName",
    posKey: "welcome.presidentPosition",
    msgKey: "welcome.message",
    image: "/welcome-pre.png"
  },
  {
    id: "p2",
    nameKey: "welcome.p2Name",
    posKey: "welcome.p2Position",
    msgKey: "welcome.p2Message",
    image: "/welcome-se.png"
  },
  {
    id: "p3",
    nameKey: "welcome.p3Name",
    posKey: "welcome.p3Position",
    msgKey: "welcome.p3Message",
    image: "/welcome-p3.png"
  }
];

/* =================================================================********* */
/* 1. NEW PREMIUM DESKTOP COMPONENTS (lg and up) */
/* =================================================================********* */

const easeOutApple: [number, number, number, number] = [0.22, 1, 0.36, 1];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
    filter: "blur(12px)",
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.8,
      ease: easeOutApple,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 60 : -60,
    opacity: 0,
    filter: "blur(12px)",
    scale: 0.95,
    transition: { duration: 0.6, ease: easeOutApple }
  })
};

const photoVariants = {
  enter: { x: -40, opacity: 0, scale: 0.9 },
  center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.8, ease: easeOutApple } }
};

const textItemVariants = {
  enter: { y: 20, opacity: 0, filter: "blur(4px)" },
  center: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: easeOutApple } }
};

const BackgroundBlobs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden lg:block">
    <motion.div 
      className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-violet-400/20 dark:bg-violet-600/20 rounded-full blur-[120px]"
      animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div 
      className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-[140px]"
      animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
  </div>
);

const NavButtons = ({ next, prev, index, total }: any) => (
  <div className="hidden lg:flex items-center gap-6 mt-8 lg:mt-0 lg:absolute lg:bottom-12 lg:right-12 z-30 justify-center lg:justify-end">
    <div className="flex items-center gap-2 text-sm font-black tracking-widest font-mono">
      <span className="text-violet-600 dark:text-violet-400 text-base">{String(index + 1).padStart(2, '0')}</span>
      <span className="text-slate-300 dark:text-slate-600">/</span>
      <span className="text-slate-400 dark:text-slate-500">{String(total).padStart(2, '0')}</span>
    </div>
    <div className="flex gap-3">
      <motion.button 
        onClick={prev}
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full bg-white/70 dark:bg-slate-800/80 backdrop-blur-md border border-white/80 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
      >
        <svg className="w-5 h-5 ml-[-2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>
      
      <motion.button 
        onClick={next}
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full bg-white/70 dark:bg-slate-800/80 backdrop-blur-md border border-white/80 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
      >
        <svg className="w-5 h-5 ml-[2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </div>
  </div>
);

// Inner Content Component to be used inside AnimatePresence (Desktop)
const GlassCardContent = ({ person }: { person: Person }) => {
  const { t } = useLang();
  
  return (
    <>
      <motion.div variants={photoVariants} className="w-[38%] relative shrink-0 lg:-ml-12 lg:mb-0 z-20 mx-auto">
        <div className="absolute inset-0 bg-violet-500 blur-3xl opacity-20 dark:opacity-40 animate-pulse rounded-full" />
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border-[3px] border-white/80 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-900 group">
          <Image 
            src={person.image} 
            alt={t(person.nameKey)}
            fill
            unoptimized
            className="object-cover object-[center_35%] transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />
        </div>
      </motion.div>

      {/* Right Side: Text & Welcome Msg */}
      <div className="w-[62%] lg:pl-12 xl:pl-16 lg:pr-12 md:pr-0 py-4 flex flex-col justify-center relative z-20 h-full">
        
        <motion.div variants={textItemVariants} className="mb-6 inline-flex lg:justify-start">
          <span className="px-5 py-2 rounded-full bg-violet-100/80 dark:bg-violet-900/40 backdrop-blur-md border border-violet-200/80 dark:border-violet-700/50 text-violet-700 dark:text-violet-300 text-xs font-black uppercase tracking-widest shadow-sm">
            {t("welcome.title1")}
          </span>
        </motion.div>
        
        <motion.h2 variants={textItemVariants} className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-[1.2] tracking-tight lg:text-left">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-600 dark:from-violet-400 dark:to-blue-400 whitespace-nowrap lg:text-[clamp(1.5rem,5vw,3rem)] lg:text-5xl inline-block py-2 pr-4">
            {t(person.posKey)}{"\u00A0"}
          </span>
          <span className="text-2xl sm:text-3xl lg:text-4xl text-slate-800 dark:text-slate-200 mt-3 block font-bold leading-snug">
            {t(person.nameKey)}
          </span>
        </motion.h2>
        
        <motion.div variants={textItemVariants} className="space-y-4 text-slate-600 dark:text-slate-300 text-[15px] sm:text-base lg:text-[17px] leading-[1.8] relative max-w-2xl lg:text-left">
          {t(person.msgKey).split('\n').map((line, idx) => line.trim() ? (
            <p key={idx}>{line}</p>
          ) : null)}
        </motion.div>
      </div>
    </>
  );
};


/* =================================================================********* */
/* 2. ORIGINAL SWIPER COMPONENT FOR MOBILE / TABLET (under lg) */
/* =================================================================********* */

const OriginalWelcomeCard = memo(function OriginalWelcomeCard({
  person,
  index,
}: {
  person: Person;
  index: number;
}) {
  const { t } = useLang();
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="antialiased group relative overflow-hidden rounded-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col md:flex-row h-auto min-h-[500px] md:h-[450px] w-full"
    >
      {/* Picture Half */}
      <div className="relative h-[280px] md:h-full w-full md:w-[45%] shrink-0 overflow-hidden">
        <Image 
          src={person.image} 
          alt={t(person.nameKey)} 
          fill 
          unoptimized={true}
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105 object-[center_45%]" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent z-10" />
        
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex flex-col text-left z-20">
          <h3 className="text-[20px] md:text-2xl font-bold text-white mb-2 shadow-black drop-shadow-lg leading-tight">
            {t(person.nameKey)}
          </h3>
          <p className="text-xs md:text-sm font-medium text-white bg-black/60 md:bg-black/30 md:backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm inline-block w-fit">
            {t(person.posKey)}
          </p>
        </div>
      </div>

      {/* Text Half */}
      <div className="p-6 md:p-8 relative flex-1 flex flex-col bg-white dark:bg-slate-900 justify-center">
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <p className="text-[15px] md:text-base leading-[1.65] md:leading-[1.8] text-slate-700 dark:text-slate-200 font-normal m-0 relative z-10 text-left" style={{ textRendering: "optimizeLegibility" }}>
            {t(person.msgKey)}
          </p>
        </div>
        
        <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] md:text-xs text-slate-400 dark:text-slate-500 font-mono flex-shrink-0">
           <span className="font-bold text-violet-600 dark:text-violet-400">0{index + 1} / 0{people.length}</span>
           <span className="md:inline uppercase text-slate-400 dark:text-slate-500 tracking-wider font-medium">{t("welcome.swipeHint")}</span>
        </div>
      </div>
    </motion.div>
  );
});


/* =================================================================********* */
/* 3. MAIN WRAPPER SECTION */
/* =================================================================********* */

export default function WelcomeSection() {
  const { t } = useLang();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRefMobile = useRef<HTMLDivElement>(null);
  const sliderRefMobile = useRef<HTMLDivElement>(null);
  
  const nextSlide = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % people.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + people.length) % people.length);
  }, []);

  useEffect(() => {
    // Only run custom timer on desktop
    if (window.innerWidth >= 1280) {
      const timer = setInterval(nextSlide, 8000);
      return () => clearInterval(timer);
    }
  }, [nextSlide]);

  // Section Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // General Reveal for both modes container
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      });

      // Dedicated Mobile GSAP reveal (if rendered)
      if (headlineRefMobile.current && sliderRefMobile.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        });
        tl.from(headlineRefMobile.current, { y: 40, opacity: 0, duration: 0.8, ease: "power2.out" })
          .from(sliderRefMobile.current, { y: 60, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.4");
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="welcome" ref={sectionRef} className="scroll-mt-40 relative py-16 md:py-24 lg:py-32 overflow-hidden z-20">
      <BackgroundBlobs />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/30 to-transparent z-0" />

      {/*
        DESKTOP LAYOUT (xl & above)
        - Uses Framer Motion Glassmorphic Carousel
      */}
      <div className="hidden xl:flex max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 flex-col justify-center">
        <div className="relative w-full max-w-6xl mx-auto py-16 px-8 mt-12 lg:mt-0">
          {/* Glass Effect Background */}
          <div className="absolute inset-0 right-0 left-[12%] rounded-[2.5rem] backdrop-blur-3xl bg-white/50 dark:bg-slate-900/50 border border-white/60 dark:border-slate-700/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] z-0" />

          {/* Animated slides */}
          <div className="relative z-10 w-full min-h-[550px]">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative flex flex-row items-center w-full"
              >
                <GlassCardContent person={people[index] || people[0]} />
              </motion.div>
            </AnimatePresence>
          </div>
          
          <NavButtons next={nextSlide} prev={prevSlide} index={index} total={people.length} />
        </div>
      </div>


      {/*
        MOBILE & TABLET LAYOUT (below xl)
        - Uses the Original Swiper Carousel
      */}
      <div className="flex xl:hidden w-full relative z-10 flex-col px-4 sm:px-6">
        
        {/* Dynamic BG elements from old layout strictly for mobile wrapper appearance */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none -z-10" />

        <div ref={headlineRefMobile} className="text-center mb-10 md:mb-16 flex flex-col items-center justify-center">
          <h2 className="text-[clamp(1.8rem,3.5vw,3.5rem)] font-black leading-[1.1] text-slate-900 dark:text-white tracking-tighter">
            {t("welcome.title1")}{" "}
            <span className="gradient-text-anim whitespace-nowrap inline-block mt-1 sm:mt-0">{t((people[index] || people[0]).posKey)}</span>
          </h2>
        </div>

        <div ref={sliderRefMobile} className="w-full pb-10 relative max-w-7xl mx-auto z-20">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="welcome-nav-prev hidden md:flex absolute md:-left-2 left-0 top-[45%] -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 items-center justify-center text-violet-600 dark:text-violet-400 transition-colors cursor-pointer hover:bg-violet-50 dark:hover:bg-slate-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </motion.button>
          
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="welcome-nav-next hidden md:flex absolute md:-right-2 right-0 top-[45%] -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 items-center justify-center text-violet-600 dark:text-violet-400 transition-colors cursor-pointer hover:bg-violet-50 dark:hover:bg-slate-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </motion.button>

          <Swiper
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            spaceBetween={40}
            roundLengths={true}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: '.welcome-nav-next',
              prevEl: '.welcome-nav-prev',
            }}
            loop={true}
            onSlideChange={(swiper) => setIndex(swiper.realIndex)}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Navigation, Autoplay]}
            className="w-full max-w-[1100px] !pb-14 pt-2"
          >
            {people.map((p, i) => (
              <SwiperSlide key={p.id} className="!w-[85vw] max-w-[360px] sm:max-w-none sm:!w-[450px] md:!w-[650px] lg:!w-[850px] h-auto">
                <OriginalWelcomeCard person={p} index={i} />
              </SwiperSlide>
            ))}
          </Swiper>
          
          <style>{`
            #welcome .swiper-pagination { bottom: 0 !important; }
            #welcome .swiper-pagination-bullet {
              background-color: #8b5cf6 !important; opacity: 0.4; width: 8px; height: 8px; transition: all 0.3s;
            }
            #welcome .swiper-pagination-bullet-active {
              opacity: 1; width: 24px; border-radius: 4px;
            }
            #welcome .swiper-button-disabled { opacity: 0.3 !important; cursor: not-allowed !important; pointer-events: none; }
          `}</style>
        </div>
      </div>
    </section>
  );
}
