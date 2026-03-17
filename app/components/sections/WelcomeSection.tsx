"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ScrollReveal from "../scroll/ScrollReveal";
import { useLang } from "../../contexts/LangContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';



const people = [
  {
    nameKey: "welcome.presidentName",
    posKey: "welcome.presidentPosition",
    msgKey: "welcome.message",
    image: "/2.png"
  },
  {
    nameKey: "welcome.p2Name",
    posKey: "welcome.p2Position",
    msgKey: "welcome.p2Message",
    image: "/1.png"
  },
  {
    nameKey: "welcome.p3Name",
    posKey: "welcome.p3Position",
    msgKey: "welcome.p3Message",
    image: "/4.png"
  }
];

export default function WelcomeSection() {
  const containerRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();
  const [activeIndex, setActiveIndex] = useState(0);

  const activePerson = people[activeIndex];

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

  // Track scroll progress to flip book pages
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollableDistance = height - windowHeight;
      if (scrollableDistance <= 0) return;
      
      // Calculate scroll progress from 0.0 to 1.0 within this section
      let progress = -top / scrollableDistance;
      progress = Math.max(0, Math.min(1, progress));
      
      // Determine the active person (each person gets an equal fraction of the progress)
      // Multiply by people.length + 0.5 so we have a small "dead zone" at the very end 
      // where index stops at 2, creating a delay before unlocking the section
      const activeCalc = Math.floor(progress * (people.length + 0.5));
      const newIndex = Math.min(people.length - 1, activeCalc);
      
      setActiveIndex(newIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [people.length]);

  return (
    <section id="welcome" ref={containerRef} className="relative h-auto md:h-[350vh] z-20 mb-20 md:mb-64">
      {/* Sticky Area */}
      <div className="md:sticky md:top-0 md:h-[100dvh] flex flex-col items-center justify-start md:justify-center pt-20 md:pt-28 pb-4 relative z-10 w-full overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
        
        {/* Spotlight Effect */}
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(800px_circle_at_var(--x,50%)_var(--y,50%),rgba(139,92,246,0.08),transparent_50%)]"
        />

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center justify-center h-full">
        {/* Section Header */}
        <div className="max-w-6xl mx-auto relative mb-8 w-full z-20">
          <ScrollReveal variant="fade-up">
            {/* Title */}
            <div className="text-center">
              <h2 className="text-[clamp(2.3rem,4vw,3.5rem)] font-black leading-[1.1] text-slate-900 dark:text-white tracking-tighter">
                {t("welcome.title1")} 
                <span className="md:hidden block mt-1 text-[min(8vw,2.5rem)] bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t("welcome.title2")}
                </span>
                <br className="hidden md:block" />
                <span key={`title-${activeIndex}`} className="hidden md:inline-block bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
                  {t(activePerson.posKey)}
                </span>
              </h2>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="fade-up" className="w-full">
          {/* Book Layout (Desktop Only) */}
          <div className="hidden md:flex relative w-full max-w-5xl mx-auto md:h-[65vh] md:min-h-[550px] md:max-h-[700px] perspective-[2000px] shrink-0 mt-4 md:mt-10">
             {/* Book Shadow */}
             <div className="absolute top-10 inset-x-4 md:inset-x-10 bottom-0 bg-slate-900/20 dark:bg-black/60 blur-2xl rounded-3xl -z-10" />
             
             {/* Book Container */}
             <div className="relative w-full h-full bg-[#fdfcfb] dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl md:rounded-[2rem] flex flex-col md:flex-row border border-slate-200 dark:border-slate-800 shadow-xl overflow-visible">
                
                {/* Book Spine (Desktop only) */}
                <div className="hidden md:block absolute inset-y-0 left-1/2 w-16 -ml-8 bg-gradient-to-r from-transparent via-slate-300/40 dark:via-black/50 to-transparent z-20 pointer-events-none" />
                <div className="hidden md:block absolute inset-y-0 left-1/2 w-[1px] bg-slate-300/50 dark:bg-slate-800 z-20" />
                
                {/* Page Stacks (simulating thick pages on edges) */}
                <div className="hidden md:block absolute top-3 bottom-3 -right-2 w-4 bg-slate-200 dark:bg-slate-800 rounded-r shadow-[2px_0_5px_rgba(0,0,0,0.1)] -z-10" />
                <div className="hidden md:block absolute top-5 bottom-5 -right-4 w-4 bg-slate-300/50 dark:bg-slate-900 rounded-r shadow-[2px_0_5px_rgba(0,0,0,0.05)] -z-20" />

                <div className="hidden md:block absolute top-3 bottom-3 -left-2 w-4 bg-slate-200 dark:bg-slate-800 rounded-l shadow-[-2px_0_5px_rgba(0,0,0,0.1)] -z-10" />

                {/* Left Page (Image) */}
                <div className="w-full md:w-1/2 h-[45%] md:h-full relative overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-t-2xl md:rounded-none md:rounded-l-[2rem]">
                   <div key={`img-${activeIndex}`} className="absolute inset-0 animate-fade-in">
                       <Image 
                         src={activePerson.image}
                         alt={t(activePerson.nameKey)}
                         fill
                         className="object-cover object-top" 
                         priority
                       />
                       <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 z-20 text-white" style={{textShadow: '0 2px 8px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)'}}>
                           <p className="font-bold text-lg md:text-2xl mb-1">{t(activePerson.nameKey)}</p>
                           <p className="text-[10px] md:text-sm font-medium opacity-90 uppercase tracking-widest text-violet-300">
                             {t(activePerson.posKey)}
                           </p>
                       </div>
                   </div>
                </div>

                {/* Right Page (Text) */}
                <div className="w-full md:w-1/2 h-[55%] md:h-full flex flex-col justify-between p-5 md:p-8 lg:p-12 relative z-10 overflow-y-auto">
                    <div key={`msg-${activeIndex}`} className="relative z-10 animate-fade-in-up flex-1 flex flex-col">
                        <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 text-5xl md:text-8xl text-violet-300/40 dark:text-violet-900/40 font-serif leading-none">“</div>
                        
                        <div className="flex-1 mt-2 md:mt-6 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
                            <p className="text-xs md:text-base lg:text-lg text-slate-700 dark:text-slate-300 leading-[1.6] md:leading-[1.8] font-light">
                               {t(activePerson.msgKey)}
                            </p>
                        </div>
                    </div>

                    {/* Pagination & Indicators */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/50 flex items-center justify-between flex-shrink-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 font-mono text-sm">
                           <span className="font-bold text-violet-600 dark:text-violet-400">0{activeIndex + 1} <span className="text-slate-400 font-normal">/ 0{people.length}</span></span>
                        </div>
                        
                        <div className="flex gap-2 items-center text-slate-400 dark:text-slate-500 font-medium text-[10px] md:text-sm uppercase tracking-widest animate-pulse">
                           <span className="hidden md:inline">Scroll</span>
                           <span className="inline md:hidden">Swipe</span>
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                        </div>
                    </div>
                </div>
             </div>

             {/* Animated Flip Overlay (Decorative) */}
             <div className="hidden md:block absolute inset-y-0 right-0 w-1/2 bg-white/5 dark:bg-white/5 pointer-events-none rounded-r-[2rem] mix-blend-overlay"></div>
          </div>

          {/* Mobile Layout (Like SpeakerCard) */}
          <div className="w-full md:hidden mt-2 relative z-20">
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1.05}
              centeredSlides={true}
              className="w-full h-auto pb-12"
            >
              {people.map((person, idx) => (
                <SwiperSlide key={idx} className="h-auto pb-8">
                  <div className="bg-[#121826] rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl relative flex flex-col h-[550px] max-h-[70vh]">
                    
                    {/* Picture Half */}
                    <div className="relative h-1/2 w-full shrink-0">
                      <Image 
                        src={person.image} 
                        alt={t(person.nameKey)} 
                        fill 
                        className={`object-cover ${person.image === '/4.png' ? 'object-[center_45%]' : 'object-top'}`} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121826] via-[#121826]/40 to-transparent z-10" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col text-left z-20">
                        <h3 className="text-[1.35rem] leading-[1.2] font-black text-white drop-shadow-md mb-1">
                          {t(person.nameKey)}
                        </h3>
                        <p className="text-[10px] font-bold text-violet-300 uppercase tracking-widest drop-shadow break-words opacity-90">
                          {t(person.posKey)}
                        </p>
                      </div>
                    </div>

                    {/* Text Half */}
                    <div className="p-5 pt-2 relative flex-1 bg-[#121826] flex flex-col justify-between">
                      <div className="relative z-10 flex-1 overflow-y-auto pr-1">
                        <div className="text-4xl text-violet-500/30 font-serif leading-none absolute -top-1 -left-1">“</div>
                        <p className="text-[13px] leading-[1.65] text-slate-300 font-light mt-3 px-2">
                          {t(person.msgKey)}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                         <span className="font-bold text-violet-400">0{idx + 1} / 0{people.length}</span>
                      </div>
                    </div>

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <style>{`
              #welcome .swiper-pagination {
                bottom: 0px !important;
              }
              #welcome .swiper-pagination-bullet {
                background-color: #8b5cf6 !important;
                opacity: 0.3;
                width: 6px;
                height: 6px;
                transition: all 0.3s;
              }
              #welcome .swiper-pagination-bullet-active {
                opacity: 1;
                width: 20px;
                border-radius: 4px;
              }
            `}</style>
          </div>
        </ScrollReveal>
      </div>


      </div>
    </section>
  );
}
