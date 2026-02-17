"use client";

import { useEffect, useRef } from "react";
import ScrollReveal from "./ScrollReveal";
import TextReveal from "./TextReveal";
import { useLang } from "../contexts/LangContext";

const cardKeys = [
  {
    icon: "🏥",
    titleKey: "card.org.title",
    descKey: "card.org.desc",
    gradient: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-200/50 dark:border-violet-700/50",
    shadow: "shadow-violet-200/50 dark:shadow-violet-900/20",
    textAccel: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: "💊",
    titleKey: "card.dispensing.title",
    descKey: "card.dispensing.desc",
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-200/50 dark:border-blue-700/50",
    shadow: "shadow-blue-200/50 dark:shadow-blue-900/20",
    textAccel: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: "🤝",
    titleKey: "card.culture.title",
    descKey: "card.culture.desc",
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-200/50 dark:border-pink-700/50",
    shadow: "shadow-pink-200/50 dark:shadow-pink-900/20",
    textAccel: "text-pink-600 dark:text-pink-400",
  },
  {
    icon: "🚀",
    titleKey: "card.career.title",
    descKey: "card.career.desc",
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-200/50 dark:border-amber-700/50",
    shadow: "shadow-amber-200/50 dark:shadow-amber-900/20",
    textAccel: "text-amber-600 dark:text-amber-400",
  },
];

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
        <ScrollReveal variant="blur">
          <div className="text-center mb-24 max-w-4xl mx-auto relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/10 blur-[100px] rounded-full -z-10" />
            
             <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-[0.7rem] uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-slate-400">
                  {t("welcome.badge")}
                </span>
             </span>

            <h2 className="text-[clamp(3rem,6vw,5rem)] font-black leading-[1] mb-8 text-slate-900 dark:text-white tracking-tighter">
              {t("welcome.title1")}
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("welcome.title2")}
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
              <TextReveal text={`${t("welcome.desc1")} ${t("welcome.desc2")}`} staggerMs={40} />
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {cardKeys.map((card, idx) => (
            <ScrollReveal key={idx} delay={idx * 150} variant="fade-up">
              <div
                className={`group relative h-full bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl rounded-[2.5rem] p-1 border ${card.border} transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${card.shadow}`}
              >
                 {/* Inner Content */}
                <div className="relative h-full bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-900/80 dark:to-slate-900/40 rounded-[2.3rem] p-8 overflow-hidden flex flex-col items-start z-10">
                   
                   {/* Background Number */}
                   <span className="absolute -right-4 -bottom-10 text-[10rem] font-black text-slate-950/[0.03] dark:text-white/[0.03] select-none leading-none z-0 transition-transform duration-700 group-hover:scale-110 group-hover:-translate-x-4">
                     0{idx + 1}
                   </span>
                   
                   {/* Background Gradient Blob */}
                   <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                   {/* Icon */}
                   <div className="relative mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                         {card.icon}
                      </div>
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} blur-xl opacity-40 -z-10`} />
                   </div>

                   {/* Text */}
                   <h3 className={`text-2xl font-bold mb-4 ${card.textAccel} transition-colors duration-300`}>
                     {t(card.titleKey)}
                   </h3>
                   
                   <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light mb-8 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                     {t(card.descKey)}
                   </p>

                   {/* Action (Auto-pushes to bottom) */}
                   <div className="mt-auto flex items-center gap-3 text-sm font-bold opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                      <span className="uppercase tracking-widest text-[0.65rem] text-slate-400 dark:text-slate-500">Explore</span>
                      <div className={`w-8 h-[1px] bg-gradient-to-r ${card.gradient}`} />
                   </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
