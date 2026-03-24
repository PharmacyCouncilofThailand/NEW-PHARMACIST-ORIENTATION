"use client";

import { useState, useCallback, useRef, useEffect, memo } from "react";
import Image from "next/image";
import ScrollReveal from "../scroll/ScrollReveal";
import { useLang } from "../../contexts/LangContext";

/* ────────────────────── types ────────────────────── */
interface TimelineEvent {
  id: string;
  time: string;
  durationKey: string;
  durationMin: number;
  badgeKey: string;
  badgeColor: string;
  icon: string;
  titleKey: string;
  descKey: string;
  metaKey?: string;
  speakerImage?: string;
  nestedEvents?: TimelineEvent[];
  isHighlight?: boolean;
}

interface DayData {
  num: number;
  dateKey: string;
  themeKey: string;
  themeDescKey: string;
  events: TimelineEvent[];
}

/* ────────────────────── style map ────────────────────── */
const badgeStyles: Record<string, { bg: string; text: string; dot: string; border: string; glow: string }> = {
  register:  { bg: "bg-blue-500/10 dark:bg-blue-500/20",    text: "text-blue-600 dark:text-blue-400",    dot: "bg-blue-500",    border: "border-blue-500/30", glow: "shadow-blue-500/20" },
  ceremony:  { bg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/20", text: "text-fuchsia-600 dark:text-fuchsia-400",  dot: "bg-fuchsia-500",  border: "border-fuchsia-500/30", glow: "shadow-fuchsia-500/20" },
  lecture:   { bg: "bg-violet-500/10 dark:bg-violet-500/20", text: "text-violet-600 dark:text-violet-400",  dot: "bg-violet-500",  border: "border-violet-500/30", glow: "shadow-violet-500/20" },
  workshop:  { bg: "bg-purple-500/10 dark:bg-purple-500/20", text: "text-purple-600 dark:text-purple-400",  dot: "bg-purple-500",  border: "border-purple-500/30", glow: "shadow-purple-500/20" },
  break:     { bg: "bg-emerald-500/10 dark:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500", border: "border-emerald-500/30", glow: "shadow-emerald-500/20" },
  summary:   { bg: "bg-amber-500/10 dark:bg-amber-500/20",  text: "text-amber-600 dark:text-amber-400",   dot: "bg-amber-500",   border: "border-amber-500/30", glow: "shadow-amber-500/20" },
};

/* ────────────────────── data ────────────────────── */
const days: DayData[] = [
  {
    num: 1, dateKey: "agenda.day1.date", themeKey: "agenda.day1.theme", themeDescKey: "agenda.day1.themeDesc",
    events: [
      { id: "d1e1", time: "10:00", durationKey: "agenda.dur.150min", durationMin: 150, badgeKey: "agenda.badge.activity", badgeColor: "workshop", icon: "💼", titleKey: "agenda.d1e1.title", descKey: "agenda.d1e1.desc", metaKey: "agenda.d1e1.meta", isHighlight: true },
      { 
        id: "d1e_group_opening", 
        time: "12:30 - 12:40", 
        durationKey: "", 
        durationMin: 50, 
        badgeKey: "agenda.badge.ceremony", 
        badgeColor: "ceremony", 
        icon: "✨", 
        titleKey: "agenda.group.opening.title",
        descKey: "agenda.group.opening.desc",
        nestedEvents: [
          { id: "d1e2", time: "12:30", durationKey: "agenda.dur.5min", durationMin: 5, badgeKey: "agenda.badge.registration", badgeColor: "register", icon: "🎁", titleKey: "agenda.d1e2.title", descKey: "agenda.d1e2.desc", metaKey: "agenda.d1e2.meta" },
          { id: "d1e3", time: "12:35", durationKey: "agenda.dur.5min", durationMin: 5, badgeKey: "agenda.badge.ceremony", badgeColor: "ceremony", icon: "🎙️", titleKey: "agenda.d1e3.title", descKey: "agenda.d1e3.desc", metaKey: "agenda.d1e3.meta", speakerImage: "/1.png" },
          { id: "d1e4", time: "12:40", durationKey: "agenda.dur.40min", durationMin: 40, badgeKey: "agenda.badge.ceremony", badgeColor: "ceremony", icon: "🗣️", titleKey: "agenda.d1e4.title", descKey: "agenda.d1e4.desc", metaKey: "agenda.d1e4.meta", speakerImage: "/2.png" },
        ]
      },
      { id: "d1e5", time: "13:20", durationKey: "agenda.dur.130min", durationMin: 130, badgeKey: "agenda.badge.lecture", badgeColor: "lecture", icon: "📜", titleKey: "agenda.d1e5.title", descKey: "agenda.d1e5.desc", metaKey: "agenda.d1e5.meta" },
      { id: "d1e6", time: "15:30", durationKey: "agenda.dur.30min", durationMin: 30, badgeKey: "agenda.badge.lecture", badgeColor: "lecture", icon: "💡", titleKey: "agenda.d1e6.title", descKey: "agenda.d1e6.desc", metaKey: "agenda.d1e6.meta", speakerImage: "/2.png" },
      { id: "d1e7", time: "16:00", durationKey: "agenda.dur.30min", durationMin: 30, badgeKey: "agenda.badge.summary", badgeColor: "summary", icon: "🏁", titleKey: "agenda.d1e7.title", descKey: "agenda.d1e7.desc", metaKey: "agenda.d1e7.meta" },
    ],
  },
];

/* ───────── Agenda Item Sub-Components ───────── */

type BadgeStyle = { bg: string; text: string; dot: string; border: string; glow: string };

const TimelineNode = memo(({ style, isHovered }: { style: BadgeStyle, isHovered: boolean }) => (
  <div
    suppressHydrationWarning
    className="absolute left-[28px] md:left-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 bg-white z-20 
                  -translate-x-1/2 transform transition-all duration-500 ease-out flex items-center justify-center shadow-lg"
    style={isHovered ? { transform: 'translateX(-50%) scale(1.6)', borderColor: '#f1f5f9' } : { transform: 'translateX(-50%) scale(1)' }}
  >
    <div className={`w-2.5 h-2.5 rounded-full ${style.dot} ${isHovered ? 'animate-pulse' : ''} transition-colors duration-300`} />
  </div>
));

const AgendaContent = memo(({ 
  event, 
  isExpanded, 
  isGrouped,
  style,
  t 
}: { 
  event: TimelineEvent; 
  isExpanded: boolean; 
  isGrouped: boolean;
  style: BadgeStyle;
  t: (k: string) => string 
}) => {
  return (
    <div className="flex flex-col gap-3">
       {/* Single Event View */}
       {!event.nestedEvents && (
          <div className="flex flex-col">
             <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 leading-snug">
                      {t(event.titleKey)}
                    </h3>
                    <p className={`text-sm md:text-base line-clamp-2 transition-all duration-300 text-slate-500 dark:text-slate-400 ${isExpanded ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
                      {t(event.descKey)}
                    </p>
                </div>
                <div className={`transition-transform duration-500 mt-1 shrink-0 text-slate-400 bg-slate-100 dark:bg-slate-700 p-2 rounded-full ${isExpanded ? "rotate-180 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400" : ""}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
             </div>
             
             <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
                <div className="overflow-hidden">
                  <div className={`pt-4 border-t border-slate-100 dark:border-slate-800`}>
                     <div className="flex flex-col sm:flex-row gap-6 items-start justify-between">
                       <div className="flex-1">
                         <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 mb-6 font-medium">
                           {t(event.descKey)}
                         </p>
                         <div className="flex flex-wrap gap-3 mt-4">
                            {event.metaKey && (
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700`}>
                                <span>📍</span>
                                <span>{t(event.metaKey)}</span>
                              </div>
                            )}
                         </div>
                       </div>
                       
                       {event.speakerImage && (
                          <div className="shrink-0 hidden sm:block relative group-hover:scale-105 transition-transform duration-500">
                            <Image src={event.speakerImage} alt="Speaker" width={96} height={96} className="relative w-24 h-24 rounded-2xl object-cover shadow-xl border-2 border-white dark:border-slate-700" />
                          </div>
                       )}
                     </div>
                  </div>
                </div>
             </div>
          </div>
       )}

       {/* Nested Events View */}
       {event.nestedEvents && (
          <div className="flex flex-col gap-6 mt-2">

            <div className="space-y-4">
              {event.nestedEvents.map((subEvent, subIndex) => (
                <div key={subEvent.id} className={`group/sub relative flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700`}>
                   <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[0.65rem] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${
                               badgeStyles[subEvent.badgeColor]?.text || "text-slate-500"
                            } ${badgeStyles[subEvent.badgeColor]?.border || "border-current/20"} ${badgeStyles[subEvent.badgeColor]?.bg || "bg-current/5"}`}>
                               {t(subEvent.badgeKey)}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t(subEvent.titleKey)}</h4>
                          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400 leading-relaxed">{t(subEvent.descKey)}</p>
                          {subEvent.metaKey && (
                              <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-[0.7rem] font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm">
                                 <span>👤</span>
                                 <span>{t(subEvent.metaKey)}</span>
                              </div>
                          )}
                        </div>
                        
                        {subEvent.speakerImage && (
                            <div className="shrink-0 hidden sm:block">
                              <Image src={subEvent.speakerImage} alt="Speaker" width={64} height={64} className="w-16 h-16 rounded-xl object-cover shadow-md border-2 border-white dark:border-slate-700 transition-transform duration-300 group-hover/sub:scale-110 group-hover/sub:-rotate-3 group-hover/sub:shadow-xl" />
                            </div>
                        )}
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
       )}
    </div>
  );
});

/* ───────── Main Agenda Item ───────── */
const AgendaItem = memo(({ 
  event, index, expandedIdx, toggleExpand, t 
}: { 
  event: TimelineEvent; index: number; expandedIdx: number | null; toggleExpand: (i: number) => void; t: (k: string) => string;
}) => {
  const isEven = index % 2 === 0;
  const style = badgeStyles[event.badgeColor] || badgeStyles.lecture;
  const isExpanded = expandedIdx === index;
  const [isHovered, setIsHovered] = useState(false);
  const isGrouped = !!event.nestedEvents;

  return (
    <div 
      className={`relative flex w-full my-8 md:my-16 flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''}`}
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => toggleExpand(index)}
    >
      <TimelineNode style={style} isHovered={isHovered} />

      {/* Time Display */}
      <div className={`flex-1 flex md:items-center pl-16 md:pl-0 ${isEven ? 'md:pr-16 md:justify-end' : 'md:pl-16 md:justify-start'}`}>
          <div className="flex flex-col items-start md:items-center">
             <div className="flex items-center gap-3">
               <span className={`text-4xl md:text-5xl font-black tracking-tighter transition-all duration-500 font-mono ${style.text} ${isHovered ? "scale-105" : ""}`}>
                 {event.time.split(" - ")[0]}
               </span>
             </div>
             {event.time.includes(" - ") && (
                 <span className="text-xl md:text-2xl font-bold text-slate-400 dark:text-slate-500 font-mono mt-1 opacity-60">
                     to {event.time.split(" - ")[1]}
                 </span>
             )}
          </div>
      </div>

      {/* Content Card */}
      <div className={`flex-1 pl-16 md:pl-0 mt-6 md:mt-0 ${isEven ? 'md:pl-16' : 'md:pr-16'} relative z-10`}>
          <div className={`relative p-6 md:p-8 rounded-3xl md:backdrop-blur-xl ${event.isHighlight ? 'bg-purple-50/80 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 shadow-[0_8px_30px_rgba(168,85,247,0.2)]' : 'bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/50 shadow-xl'} transition-transform transition-shadow duration-500 cursor-pointer overflow-hidden ${isHovered ? `-translate-y-2 shadow-2xl ${style.glow}` : ''} ${isExpanded ? 'ring-2 ring-violet-500/50' : ''}`}>
             
             {/* Gradient Shine Effect */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/5 dark:to-transparent pointer-events-none" />
             
             {/* Badge Header */}
             <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${style.bg} ${style.border} ${style.text}`}>
                    {isGrouped ? t("agenda.specialSession") : t(event.badgeKey)}
                </div>

             </div>

             <div className="relative z-10">
               <AgendaContent 
                 event={event} 
                 isExpanded={isExpanded} 
                 isGrouped={isGrouped}
                 style={style}
                 t={t}
               />
             </div>
          </div>
      </div>
    </div>
  );
});

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
export default function AgendaSection() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const currentDay = days[0];
  const { t } = useLang();

  const toggleExpand = useCallback((idx: number) => {
    setExpandedIdx((prev) => (prev === idx ? null : idx));
  }, []);

  return (
    <section id="agenda" className="scroll-mt-40 min-h-screen py-16 md:py-24 lg:py-32 relative z-10 overflow-hidden bg-slate-50/50 dark:bg-[#0B0F19]">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent dark:from-violet-900/20 pointer-events-none" />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal variant="fade-up">
          <div className="text-center mb-20">
            <h2 className="text-[clamp(2.2rem,4.5vw,3.8rem)] font-black mb-6 tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
              {t("agenda.title1")}<br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                {t("agenda.title2") || "Event Timeline"}
              </span>
            </h2>

          </div>
        </ScrollReveal>

        <div className="relative max-w-5xl mx-auto">
            {/* The Vertical Timeline Line */}
            <div className="absolute left-[35px] md:left-1/2 top-0 bottom-0 w-1.5 md:-translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
            <div className="absolute left-[35px] md:left-1/2 top-0 bottom-0 w-1.5 md:-translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-violet-500/20 to-transparent blur-sm" />

            <div className="space-y-4">
                {currentDay.events.map((event, i) => (
                  <ScrollReveal key={event.id} variant="fade-up" delay={i * 100}>
                    <AgendaItem 
                      event={event} 
                      index={i} 
                      expandedIdx={expandedIdx} 
                      toggleExpand={toggleExpand} 
                      t={t} 
                    />
                  </ScrollReveal>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
