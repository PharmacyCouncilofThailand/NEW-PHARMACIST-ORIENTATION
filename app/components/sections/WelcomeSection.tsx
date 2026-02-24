"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ScrollReveal from "../scroll/ScrollReveal";
import { useLang } from "../../contexts/LangContext";



export default function WelcomeSection() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();

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

  return (
    <section id="welcome" className="relative py-32 overflow-hidden z-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
      
      {/* Spotlight Effect */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(800px_circle_at_var(--x,50%)_var(--y,50%),rgba(139,92,246,0.08),transparent_50%)]"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        {/* Section Header */}
        <ScrollReveal variant="blur">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mb-24 max-w-6xl mx-auto relative">
             {/* Left: Text Content */}
             <div className="flex-1 text-center lg:text-left z-10 w-full">
                 {/* Badge */}
                 <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-sm mb-6">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                    <span className="text-[0.7rem] uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-slate-400">
                      {t("welcome.badge")}
                    </span>
                 </span>

                 {/* Title */}
                 <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-[1.1] mb-6 text-slate-900 dark:text-white tracking-tighter">
                   {t("welcome.title1")}
                   <br />
                   <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                     {t("welcome.title2")}
                   </span>
                 </h2>

                 {/* Date & Location */}
                 <div className="flex flex-col gap-3 mb-8 text-sm  font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl w-full lg:w-fit border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <span className="text-xl">🗓️</span> <span className="text-base">{t("welcome.eventDate")}</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center lg:justify-start text-left">
                        <span className="text-xl shrink-0">📍</span> <span className="text-base leading-snug">{t("welcome.location")}</span>
                    </div>
                 </div>
                
                {/* Message */}
                <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-violet-100 dark:border-violet-900/30 shadow-xl shadow-violet-100/40 dark:shadow-none text-left">
                    <div className="absolute -top-4 -left-2 text-6xl text-violet-200 dark:text-violet-900 opacity-50 font-serif">“</div>
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-light mb-8 relative z-10">
                      {t("welcome.message")}
                    </p>
                    <div className="flex items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                        <div className="bg-gradient-to-br from-violet-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                           P
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-slate-900 dark:text-white text-base">{t("welcome.presidentName")}</p>
                            <p className="text-xs text-violet-600 dark:text-violet-400 font-bold uppercase tracking-wide mt-0.5">{t("welcome.presidentPosition")}</p>
                        </div>
                    </div>
                </div>
             </div>

             {/* Right: President Image (Placeholder) */}
              <div className="w-full max-w-sm lg:w-[400px] relative group perspective-1000 hidden lg:block">
                  <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl shadow-violet-500/20 border-4 border-white dark:border-slate-800 -rotate-2 group-hover:rotate-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                      {/* Placeholder Gradient */}
                      {/* President Image */}
                      <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800">
                        <Image
                          src="/President.jpg"
                          alt={t("welcome.presidentName")}
                          fill
                          className="object-cover object-top"
                          priority
                        />
                      </div>
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute bottom-6 left-6 text-white text-left pr-4">
                          <p className="font-bold text-xl mb-1">{t("welcome.presidentName")}</p>
                          <p className="text-xs font-medium opacity-80 uppercase tracking-wider">{t("welcome.presidentPosition")}</p>
                      </div>
                  </div>
                  
                  {/* Decorative blob behind */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-violet-600/20 blur-[60px] -z-10 rounded-full pointer-events-none" />
              </div>

          </div>
        </ScrollReveal>


      </div>
    </section>
  );
}
