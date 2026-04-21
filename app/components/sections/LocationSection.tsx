"use client";

import { useRef, useEffect, useState } from "react";
import { useLang } from "../../contexts/LangContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LocationSection() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const [openTransport, setOpenTransport] = useState<string | null>("mrt");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".loc-fade-up",
        { y: 30, opacity: 0, filter: 'blur(5px)' },
        {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const transportOptions = [
    {
      id: "mrt",
      titleKey: "location.mrt.title",
      descKey: "location.mrt.desc",
      color: "purple",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="16" x="4" y="3" rx="2" />
          <path d="M4 11h16" />
          <path d="M12 3v8" />
          <path d="m8 19-2 3" />
          <path d="m18 22-2-3" />
          <path d="M8 15h0" />
          <path d="M16 15h0" />
        </svg>
      )
    },
    {
      id: "bus",
      titleKey: "location.bus.title",
      descKey: "location.bus.desc",
      color: "blue",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 6v6" />
          <path d="M15 6v6" />
          <path d="M2 12h19.6" />
          <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
          <circle cx="7" cy="18" r="2" />
          <path d="M9 18h5" />
          <circle cx="16" cy="18" r="2" />
        </svg>
      )
    },
    {
      id: "car",
      titleKey: "location.car.title",
      descKey: "location.car.desc",
      color: "amber",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      )
    }
  ];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'purple': return { bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-500/20' };
      case 'blue': return { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-500/20' };
      case 'amber': return { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-500/20' };
      default: return { bg: '', text: '', border: '' };
    }
  };

  return (
    <section id="location" ref={sectionRef} className="py-16 lg:py-20 relative z-20 overflow-hidden bg-[#FAFAFA] dark:bg-[#050505]">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[30%] h-[40%] bg-violet-400/10 dark:bg-violet-600/10 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-fuchsia-400/10 dark:bg-fuchsia-600/10 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 dark:opacity-[0.02]" />
      </div>
      
      <div className="max-w-[1000px] mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-10 md:mb-14 loc-fade-up">
          <h2 style={{ fontFamily: "var(--font-noto-thai), 'Noto Sans Thai', sans-serif" }} className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            {t("location.title1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">{t("location.title2")}</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
            {t("location.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Main Venue Card */}
          <div className="lg:col-span-5 flex flex-col loc-fade-up group">
            <div className="bg-white/60 dark:bg-white/[0.02] backdrop-blur-2xl border border-slate-200/60 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] rounded-3xl p-6 md:p-8 flex-1 flex flex-col justify-between relative overflow-hidden transition-all duration-700 hover:shadow-[0_15px_40px_rgba(139,92,246,0.1)] hover:border-violet-300 dark:hover:border-violet-500/30">
              
              {/* Dynamic Glow Background */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet-400/20 dark:bg-violet-600/20 blur-[60px] rounded-full -mr-16 -mt-16 transition-transform duration-1000 group-hover:scale-125 group-hover:bg-fuchsia-400/20 dark:group-hover:bg-fuchsia-600/20" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-white/10 flex items-center justify-center mb-5 transform transition-transform duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_5px_15px_rgba(139,92,246,0.2)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600 dark:text-violet-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight leading-tight whitespace-pre-line">
                  {t("location.venue.title")}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed font-medium">
                  {t("location.venue.desc")}
                </p>
              </div>
              
              <div className="mt-8 relative z-10">
                <a href="https://www.google.com/maps/search/?api=1&query=อาคารมหิตลาธิเบศร+กระทรวงสาธารณสุข" target="_blank" rel="noopener noreferrer" className="group/btn inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(15,23,42,0.15)] dark:hover:shadow-[0_8px_25px_rgba(255,255,255,0.15)] active:scale-[0.98]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                  </span>
                  {t("location.map.btn")}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Transport Options Accordion */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200/60 dark:border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.02)] dark:shadow-none rounded-3xl overflow-hidden loc-fade-up">
              {transportOptions.map((opt, index) => {
                const isOpen = openTransport === opt.id;
                const colors = getColorClasses(opt.color);
                
                return (
                  <div key={opt.id} className={`border-b border-slate-200/50 dark:border-white/5 last:border-b-0`}>
                    <button
                      onClick={() => setOpenTransport(isOpen ? null : opt.id)}
                      className="w-full px-6 md:px-8 py-5 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border transition-colors ${isOpen ? colors.bg + ' ' + colors.border + ' ' + colors.text : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-400 dark:text-slate-500'}`}>
                          {opt.icon}
                        </div>
                        <h4 className={`text-[16px] md:text-[17px] font-bold tracking-tight transition-colors ${isOpen ? colors.text : 'text-slate-900 dark:text-white'}`}>
                          {t(opt.titleKey)}
                        </h4>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-slate-100 dark:bg-white/10' : 'bg-transparent'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isOpen ? colors.text : 'text-slate-400'}>
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </div>
                    </button>
                    
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="px-6 md:px-8 pb-6 pt-1 pl-[72px] md:pl-[88px]">
                        <p className="text-slate-500 dark:text-slate-400 text-[14px] leading-relaxed font-medium">
                          {t(opt.descKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
