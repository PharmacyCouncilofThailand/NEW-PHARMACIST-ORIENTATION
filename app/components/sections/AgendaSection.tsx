"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useLang } from "../../contexts/LangContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Speaker {
  nameKey: string;
  image: string;
}

interface TimelineEvent {
  id: string;
  time: string;
  badgeKey: string;
  badgeColor: string;
  titleKey: string;
  descKey: string;
  metaKey?: string;
  speakerImage?: string;
  speakerImages?: string[];
  speakers?: Speaker[];
  speakerLabelKey?: string;
  mcLabelKey?: string;
  mcKey?: string;
  isHighlight?: boolean;
}

const badgeStyles: Record<string, { bg: string; text: string; border: string }> = {
  register:  { bg: "bg-blue-50 dark:bg-blue-900/20",    text: "text-blue-600 dark:text-blue-400",    border: "border-blue-200 dark:border-blue-800" },
  ceremony:  { bg: "bg-fuchsia-50 dark:bg-fuchsia-900/20", text: "text-fuchsia-600 dark:text-fuchsia-400", border: "border-fuchsia-200 dark:border-fuchsia-800" },
  lecture:   { bg: "bg-violet-50 dark:bg-violet-900/20", text: "text-violet-600 dark:text-violet-400", border: "border-violet-200 dark:border-violet-800" },
  workshop:  { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
  activity:  { bg: "bg-amber-50 dark:bg-amber-900/20",  text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  summary:   { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
};

const events: TimelineEvent[] = [
  { id: "e1", time: "10.00 - 16.00 น.", badgeColor: "activity", badgeKey: "agenda.badge.activity", titleKey: "agenda.d1e1.title", descKey: "agenda.d1e1.desc", metaKey: "agenda.d1e1.meta", isHighlight: true },
  { id: "e2", time: "10.00 - 12.30 น.", badgeColor: "register", badgeKey: "agenda.badge.registration", titleKey: "agenda.d1e2.title", descKey: "agenda.d1e2.desc", metaKey: "agenda.d1e2.meta" },
  { id: "e3", time: "12.30 - 12.35 น.", badgeColor: "ceremony", badgeKey: "agenda.badge.ceremony", titleKey: "agenda.d1e3.title", descKey: "agenda.d1e3.desc", metaKey: "agenda.d1e3.meta" },
  { id: "e4", time: "12.35 - 12.40 น.", badgeColor: "ceremony", badgeKey: "agenda.badge.ceremony", titleKey: "agenda.d1e4.title", descKey: "agenda.d1e4.desc", metaKey: "agenda.d1e4.meta", speakerImage: "/welcome message/Pre.png" },
  { id: "e5", time: "12.40 - 13.20 น.", badgeColor: "ceremony", badgeKey: "agenda.badge.ceremony", titleKey: "agenda.d1e5.title", descKey: "agenda.d1e5.desc", metaKey: "agenda.d1e5.meta" },
  { id: "e6", time: "13.20 - 13.25 น.", badgeColor: "activity", badgeKey: "agenda.badge.activity", titleKey: "agenda.d1evt.title", descKey: "agenda.d1evt.desc" },
  { id: "e7", time: "13.25 - 14.00 น.", badgeColor: "lecture", badgeKey: "agenda.badge.lecture", titleKey: "agenda.d1e6.title", descKey: "agenda.d1e6.desc", metaKey: "agenda.d1e6.meta", speakerImage: "/welcome message/Se.png" },
  { id: "e8", time: "14.00 - 15.00 น.", badgeColor: "workshop", badgeKey: "agenda.badge.workshop", titleKey: "agenda.d1e7.title", descKey: "agenda.d1e7.desc",
    speakerLabelKey: "agenda.d1e7.speakerLabel",
    speakers: [
      { nameKey: "agenda.d1e7.speaker1", image: "/speaker/1.png" },
      { nameKey: "agenda.d1e7.speaker2", image: "/speaker/4.png" },
      { nameKey: "agenda.d1e7.speaker3", image: "/speaker/5.png" },
      { nameKey: "agenda.d1e7.speaker4", image: "/speaker/3.png" },
      { nameKey: "agenda.d1e7.speaker5", image: "/speaker/6.png" },
    ],
    mcLabelKey: "agenda.d1e7.mcLabel", mcKey: "agenda.d1e7.mc"
  },
  { id: "e9", time: "15.00 - 15.30 น.", badgeColor: "lecture", badgeKey: "agenda.badge.lecture", titleKey: "agenda.d1e8.title", descKey: "agenda.d1e8.desc", metaKey: "agenda.d1e8.meta", speakerImage: "/speaker/7.png" },
  { id: "e10", time: "15.30 - 16.00 น.", badgeColor: "summary", badgeKey: "agenda.badge.summary", titleKey: "agenda.d1e9.title", descKey: "agenda.d1e9.desc", metaKey: "agenda.d1e9.meta" }
];


export default function AgendaSection() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.agenda-item');
      items.forEach((item, index) => {
        gsap.fromTo(item, 
          { opacity: 0, x: -30, filter: 'blur(10px)' },
          {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="agenda" ref={sectionRef} className="scroll-mt-40 min-h-screen py-24 lg:py-32 relative z-20 overflow-hidden bg-[#FAFAFA] dark:bg-[#050505]">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 h-[800px] bg-gradient-to-b from-violet-100/50 via-transparent to-transparent dark:from-violet-900/10 pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[30%] h-[50%] bg-fuchsia-400/10 dark:bg-fuchsia-600/10 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-400/10 dark:bg-violet-600/10 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="flex flex-col mb-20 md:mb-32">
          <h2 style={{ fontFamily: "var(--font-noto-thai), 'Noto Sans Thai', sans-serif" }} className="text-[clamp(3rem,6vw,5.5rem)] font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            {t("agenda.title1")}<br/>
          </h2>
          <p className="mt-6 md:mt-8 text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium tracking-tight leading-relaxed">
            <span className="text-slate-900 dark:text-white font-bold">{t("agenda.day1.date")}</span> — {t("agenda.day1.themeDesc")}
          </p>
        </div>

        <div ref={containerRef} className="relative before:absolute before:inset-0 before:left-[1rem] md:before:left-[30%] before:-translate-x-px md:before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-violet-600 before:via-fuchsia-500 before:to-transparent before:opacity-20 dark:before:opacity-30">
          
          <div className="flex flex-col gap-10 md:gap-12">
            {events.map((event, i) => {
              
              return (
                <div key={event.id} className="agenda-item relative flex flex-col md:flex-row gap-6 md:gap-16 md:items-start group">
                  
                  {/* Timeline Glowing Dot */}
                  <div className="absolute left-[1rem] md:left-[30%] -translate-x-[50%] mt-2 md:mt-2 w-[11px] h-[11px] rounded-full border-[3px] border-white dark:border-[#050505] bg-violet-600 dark:bg-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.6)] flex items-center justify-center transition-all duration-500 group-hover:scale-150 z-20 group-hover:bg-fuchsia-500 group-hover:shadow-fuchsia-500/50">
                    <div className="absolute w-[30px] h-[30px] rounded-full bg-violet-500/20 dark:bg-violet-400/20 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out" />
                  </div>

                  {/* Time Section */}
                  <div className="md:w-[30%] pl-12 md:pl-0 md:pr-16 md:text-right pt-[2px]">
                     <span className="block text-2xl md:text-[1.8rem] font-bold tracking-tight text-slate-800 dark:text-slate-200 leading-none">
                       {event.time.split(' ')[0]} {event.time.split(' ')[1]} {event.time.split(' ')[2]}{event.time.split(' ')[3] ? ` ${event.time.split(' ')[3]}` : ''}
                     </span>
                     
                     {/* Badge in time column for desktop */}
                     <div className="hidden md:flex justify-end mt-6">
                       <span className="inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-colors duration-300 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:border-violet-200 dark:group-hover:border-violet-700/50">
                         {t(event.badgeKey)}
                       </span>
                     </div>
                  </div>

                  {/* Content Card Section */}
                  <div className="flex-1 pl-12 md:pl-0">
                    <div className={`
                      relative rounded-[2rem] transition-all duration-500
                      ${event.isHighlight 
                        ? 'p-8 md:p-10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl border border-violet-200/60 dark:border-violet-800/50 shadow-[0_8px_30px_rgba(139,92,246,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_20px_40px_rgba(139,92,246,0.12)]' 
                        : 'bg-transparent group-hover:bg-white/40 dark:group-hover:bg-white/[0.01]'
                      }
                      ${!event.isHighlight && 'p-2 md:p-4 -my-4 md:-my-4'}
                    `}>
                      
                      {/* Badge for mobile */}
                      <div className="md:hidden mb-4 inline-flex items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                          {t(event.badgeKey)}
                        </span>
                      </div>

                      {/* Main Title & Description */}
                      <h3 className={`font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-[1.2] transition-colors duration-300 group-hover:text-violet-600 dark:group-hover:text-violet-400
                        ${event.isHighlight ? 'text-3xl md:text-4xl' : 'text-2xl md:text-[1.7rem]'}
                      `}>
                        {t(event.titleKey)}
                      </h3>
                      
                      <p className="text-base md:text-[1.15rem] text-slate-600 dark:text-slate-400/90 leading-relaxed mb-8 max-w-3xl font-medium">
                        {t(event.descKey)}
                      </p>

                      {/* Speakers List (Panel Discussion style) */}
                      {event.speakers && event.speakers.length > 0 && (
                        <div className="relative pl-5 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:rounded-full before:bg-gradient-to-b before:from-violet-500 before:to-fuchsia-500 before:opacity-40">
                          {event.speakerLabelKey && (
                            <span className="block text-[0.85rem] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">
                              {t(event.speakerLabelKey)}
                            </span>
                          )}
                          <div className="space-y-3">
                            {event.speakers.map((speaker, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="relative shrink-0 rounded-xl overflow-hidden shadow-lg border-2 border-white/50 dark:border-white/10 w-14 h-14 md:w-16 md:h-16 ring-1 ring-slate-900/5 dark:ring-white/10">
                                  <Image src={speaker.image} alt="Speaker" fill unoptimized className="object-cover object-top" />
                                </div>
                                <span className="text-[0.95rem] font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
                                  {t(speaker.nameKey)}
                                </span>
                              </div>
                            ))}
                          </div>
                          {event.mcLabelKey && event.mcKey && (
                            <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/40">
                              <span className="block text-[0.85rem] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
                                {t(event.mcLabelKey)}
                              </span>
                              <span className="block text-[0.95rem] font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
                                {t(event.mcKey)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Meta + Speaker Image (single speaker style) */}
                      {!event.speakers && (
                        <div className="relative">
                          <div className={event.metaKey ? "relative pl-5 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:rounded-full before:bg-gradient-to-b before:from-violet-500 before:to-fuchsia-500 before:opacity-40" : ""}>
                            <div className="flex items-center gap-4">
                              {event.speakerImage && (
                                <div className="relative shrink-0 rounded-2xl overflow-hidden shadow-lg border-2 border-white/50 dark:border-white/10 w-16 h-16 md:w-20 md:h-20 ring-1 ring-slate-900/5 dark:ring-white/10 group-hover:scale-105 transition-transform duration-500">
                                  <Image src={event.speakerImage} alt="Speaker" fill unoptimized className="object-cover object-top" />
                                </div>
                              )}
                              {event.metaKey && (
                                <span className="block text-[0.95rem] font-semibold text-slate-700 dark:text-slate-300 whitespace-pre-line leading-loose tracking-wide">
                                  {t(event.metaKey)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
