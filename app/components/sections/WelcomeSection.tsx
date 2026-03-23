"use client";

import { useEffect, useRef, useState, memo } from "react";
import Image from "next/image";
import ScrollReveal from "../scroll/ScrollReveal";
import { useLang } from "../../contexts/LangContext";

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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

const WelcomeCard = memo(function WelcomeCard({
  person,
  index,
  visible,
}: {
  person: Person;
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
      className="group relative overflow-hidden rounded-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row h-[550px] md:h-[450px] lg:h-[500px] w-full transform hover:-translate-y-2"
    >
      {/* Picture Half (Top on mobile, Left on desktop) */}
      <div className="relative h-1/2 md:h-full w-full md:w-[45%] shrink-0 overflow-hidden">
        <Image 
          src={person.image} 
          alt={t(person.nameKey)} 
          fill 
          className={`object-cover transition-transform duration-700 group-hover:scale-105 ${person.id === 'p3' ? 'object-[center_45%]' : 'object-top'}`} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10" />
        
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 lg:p-8 flex flex-col text-left z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white drop-shadow-md leading-snug mb-2" style={{textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>
            {t(person.nameKey)}
          </h3>
          <p className="text-[10px] md:text-sm font-medium text-white/80 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm inline-block w-fit opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            {t(person.posKey)}
          </p>
        </div>
      </div>

      {/* Text Half (Bottom on mobile, Right on desktop) */}
      <div className="p-6 md:p-8 lg:p-12 relative flex-1 flex flex-col bg-white dark:bg-slate-900">
        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2 md:pr-4">
          <p className="text-[14px] md:text-base lg:text-lg leading-[1.7] md:leading-[1.8] text-slate-600 dark:text-slate-300 font-light mt-4 md:mt-2 relative z-10 text-left">
            {t(person.msgKey)}
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono flex-shrink-0">
           <span className="font-bold text-violet-600 dark:text-violet-400">0{index + 1} / 0{people.length}</span>
           <span className="hidden md:inline uppercase text-slate-400 dark:text-slate-500 tracking-wider">{t("welcome.swipeHint")}</span>
        </div>
      </div>
    </div>
  );
});

export default function WelcomeSection() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Spotlight effect
  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (spotlightRef.current) {
            const { clientX, clientY } = e;
            spotlightRef.current.style.setProperty("--x", `${clientX}px`);
            spotlightRef.current.style.setProperty("--y", `${clientY}px`);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="welcome" ref={ref} className="scroll-mt-40 py-24 sm:py-32 short:py-12 relative overflow-hidden z-20">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/30 to-transparent z-0" />
      
      {/* Spotlight Effect */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(800px_circle_at_var(--x,50%)_var(--y,50%),rgba(139,92,246,0.12),transparent_50%)] z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal variant="blur">
          <div className="text-center mb-12 lg:mb-16 short:mb-6 flex flex-col items-center justify-center">
            <h2 className="text-[clamp(1.8rem,3.5vw,3.5rem)] font-black leading-[1.1] text-slate-900 dark:text-white tracking-tighter">
              {t("welcome.title1")}{" "}
              <span className="gradient-text-anim block sm:inline mt-1 sm:mt-0">{t("welcome.title2")}</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Swiper Slider with Coverflow (Movement like Speaker Section) */}
        <div className="w-full pb-12 relative max-w-7xl mx-auto md:px-20 z-20">
          
          {/* Custom Navigation Buttons (Desktop Only) */}
          <button className="welcome-nav-prev hidden md:flex absolute lg:-left-2 md:-left-2 left-0 top-[45%] -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 items-center justify-center text-violet-600 dark:text-violet-400 hover:scale-110 hover:bg-violet-50 dark:hover:bg-slate-700 transition-all cursor-pointer">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button className="welcome-nav-next hidden md:flex absolute lg:-right-2 md:-right-2 right-0 top-[45%] -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 items-center justify-center text-violet-600 dark:text-violet-400 hover:scale-110 hover:bg-violet-50 dark:hover:bg-slate-700 transition-all cursor-pointer">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: '.welcome-nav-next',
              prevEl: '.welcome-nav-prev',
            }}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="w-full max-w-[1100px] !pb-16 pt-4"
          >
            {people.map((p, i) => (
              /* The slide is very wide for desktop, turning it into a horizontal card */
              <SwiperSlide key={p.id} className="max-w-[340px] sm:max-w-[450px] md:max-w-[750px] lg:max-w-[900px] xl:max-w-[950px]">
                <WelcomeCard person={p} index={i} visible={visible} />
              </SwiperSlide>
            ))}
          </Swiper>
          
          <style>{`
            #welcome .swiper-pagination {
              bottom: 0 !important;
            }
            #welcome .swiper-pagination-bullet {
              background-color: #8b5cf6 !important;
              opacity: 0.4;
              width: 8px;
              height: 8px;
              transition: all 0.3s;
            }
            #welcome .swiper-pagination-bullet-active {
              opacity: 1;
              width: 24px;
              border-radius: 4px;
            }
            #welcome .swiper-button-disabled {
              opacity: 0.3 !important;
              cursor: not-allowed !important;
              pointer-events: none;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(139, 92, 246, 0.4);
              border-radius: 20px;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
