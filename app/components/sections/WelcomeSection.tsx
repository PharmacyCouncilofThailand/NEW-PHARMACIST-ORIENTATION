"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ScrollReveal from "../scroll/ScrollReveal";
import { useLang } from "../../contexts/LangContext";



export default function WelcomeSection() {
  const containerRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();
  const [activeIndex, setActiveIndex] = useState(0);

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
    <section id="welcome" ref={containerRef} className="relative h-[500vh] z-20 mb-32 md:mb-64">
      {/* Sticky Area */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex flex-col items-center justify-start pt-[100px] md:pt-[140px]">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
        
        {/* Spotlight Effect */}
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(800px_circle_at_var(--x,50%)_var(--y,50%),rgba(139,92,246,0.08),transparent_50%)]"
        />

        <div className="max-w-7xl w-full mx-auto px-6 relative z-10 pt-16 md:pt-0">
        {/* Section Header */}
        <ScrollReveal variant="blur">
          <div className="max-w-6xl mx-auto relative mb-8">
            {/* Title */}
            <div className="text-center">
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-[1.1] text-slate-900 dark:text-white tracking-tighter">
                {t("welcome.title1")} <br className="hidden md:block" />
                <span key={`title-${activeIndex}`} className="bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent inline-block animate-fade-in">
                  {t(activePerson.posKey)}
                </span>
              </h2>
            </div>
          </div>

          {/* Book Layout */}
          <div className="relative w-full max-w-6xl mx-auto min-h-[750px] sm:min-h-[800px] md:min-h-0 md:h-[600px] lg:h-[650px] mt-8 md:mt-12 perspective-[2000px]">
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
                <div className="w-full md:w-1/2 h-[350px] sm:h-[400px] md:h-full relative overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-t-2xl md:rounded-none md:rounded-l-[2rem]">
                   {/* We can use standard mapping or just animate the key change. We'll use React Key to force re-render animation. */}
                   <div key={`img-${activeIndex}`} className="absolute inset-0 animate-fade-in">
                       <Image 
                         src={activePerson.image}
                         alt={t(activePerson.nameKey)}
                         fill
                         className="object-cover object-top" 
                         priority
                       />
                       <div className="absolute bottom-6 left-6 right-6 z-20 text-white" style={{textShadow: '0 2px 8px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)'}}>
                           <p className="font-bold text-2xl md:text-3xl mb-1">{t(activePerson.nameKey)}</p>
                           <p className="text-sm md:text-base font-medium opacity-90 uppercase tracking-widest text-violet-300">
                             {t(activePerson.posKey)}
                           </p>
                       </div>
                   </div>
                </div>

                {/* Right Page (Text) */}
                <div className="w-full md:w-1/2 flex flex-col justify-between p-6 md:p-10 lg:p-14 relative z-10">
                    <div key={`msg-${activeIndex}`} className="relative z-10 animate-fade-in-up flex-1 flex flex-col">
                        <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 text-5xl md:text-8xl text-violet-300/40 dark:text-violet-900/40 font-serif leading-none">“</div>
                        
                        <div className="flex-1 mt-4 md:mt-8 relative z-10">
                            <p className="text-base md:text-lg lg:text-xl text-slate-700 dark:text-slate-300 leading-[1.8] font-light">
                               {t(activePerson.msgKey)}
                            </p>
                        </div>
                    </div>

                    {/* Pagination & Indicators */}
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50 flex items-center justify-between">
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
        </ScrollReveal>
      </div>


      </div>
    </section>
  );
}
