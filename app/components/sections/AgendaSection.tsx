"use client";

import { useState, useCallback, useRef, useEffect, useMemo, memo } from "react";
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
  nestedEvents?: TimelineEvent[];
}

interface DayData {
  num: number;
  dateKey: string;
  themeKey: string;
  themeDescKey: string;
  events: TimelineEvent[];
}

/* ────────────────────── style map ────────────────────── */
const badgeStyles: Record<string, { bg: string; text: string; dot: string; glow: string }> = {
  register:  { bg: "bg-blue-500/10 dark:bg-blue-500/20",    text: "text-blue-500",    dot: "bg-blue-500",    glow: "rgba(59,130,246,.35)" },
  ceremony:  { bg: "bg-violet-500/10 dark:bg-violet-500/20", text: "text-violet-500",  dot: "bg-violet-500",  glow: "rgba(139,92,246,.35)" },
  lecture:   { bg: "bg-indigo-500/10 dark:bg-indigo-500/20", text: "text-indigo-500",  dot: "bg-indigo-500",  glow: "rgba(99,102,241,.35)" },
  workshop:  { bg: "bg-purple-500/10 dark:bg-purple-500/20", text: "text-purple-500",  dot: "bg-purple-500",  glow: "rgba(168,85,247,.35)" },
  break:     { bg: "bg-emerald-500/10 dark:bg-emerald-500/20", text: "text-emerald-500", dot: "bg-emerald-500", glow: "rgba(16,185,129,.35)" },
  summary:   { bg: "bg-amber-500/10 dark:bg-amber-500/20",  text: "text-amber-500",   dot: "bg-amber-500",   glow: "rgba(245,158,11,.35)" },
};

/* ────────────────────── data ────────────────────── */
const days: DayData[] = [
  {
    num: 1, dateKey: "agenda.day1.date", themeKey: "agenda.day1.theme", themeDescKey: "agenda.day1.themeDesc",
    events: [
      { id: "d1e1", time: "10:00", durationKey: "agenda.dur.150min", durationMin: 150, badgeKey: "agenda.badge.activity", badgeColor: "workshop", icon: "💼", titleKey: "agenda.d1e1.title", descKey: "agenda.d1e1.desc", metaKey: "agenda.d1e1.meta" },
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
          { id: "d1e3", time: "12:35", durationKey: "agenda.dur.5min", durationMin: 5, badgeKey: "agenda.badge.ceremony", badgeColor: "ceremony", icon: "🎙️", titleKey: "agenda.d1e3.title", descKey: "agenda.d1e3.desc", metaKey: "agenda.d1e3.meta" },
          { id: "d1e4", time: "12:40", durationKey: "agenda.dur.40min", durationMin: 40, badgeKey: "agenda.badge.ceremony", badgeColor: "ceremony", icon: "🗣️", titleKey: "agenda.d1e4.title", descKey: "agenda.d1e4.desc", metaKey: "agenda.d1e4.meta" },
        ]
      },
      { id: "d1e5", time: "13:20", durationKey: "agenda.dur.130min", durationMin: 130, badgeKey: "agenda.badge.ceremony", badgeColor: "lecture", icon: "📜", titleKey: "agenda.d1e5.title", descKey: "agenda.d1e5.desc", metaKey: "agenda.d1e5.meta" },
      { id: "d1e6", time: "15:30", durationKey: "agenda.dur.30min", durationMin: 30, badgeKey: "agenda.badge.lecture", badgeColor: "lecture", icon: "💡", titleKey: "agenda.d1e6.title", descKey: "agenda.d1e6.desc", metaKey: "agenda.d1e6.meta" },
      { id: "d1e7", time: "16:00", durationKey: "agenda.dur.30min", durationMin: 30, badgeKey: "agenda.badge.summary", badgeColor: "summary", icon: "🏁", titleKey: "agenda.d1e7.title", descKey: "agenda.d1e7.desc", metaKey: "agenda.d1e7.meta" },
    ],
  },
];

const FILTER_ALL = "all";

/* ───────── Shared Components ───────── */

const AnimatedNumber = memo(function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 800;
    const startTime = performance.now();
    let frameId: number;
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * end * 10) / 10);
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value]);
  return <span>{display}{suffix}</span>;
});

const TiltCard = memo(function TiltCard({
  children,
  isExpanded,
  glowColor,
  onClick,
}: {
  children: (ripple: { x: number; y: number; id: number } | null) => React.ReactNode;
  isExpanded: boolean;
  glowColor: string;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    requestAnimationFrame(() => {
      setTilt({ x: (y - 0.5) * -8, y: (x - 0.5) * 8 });
      setSpotPos({ x: x * 100, y: y * 100 });
    });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: Date.now(),
    });
    onClick();
  }, [onClick]);

  useEffect(() => {
    if (ripple) {
      const t = setTimeout(() => setRipple(null), 600);
      return () => clearTimeout(t);
    }
  }, [ripple]);

  return (
    <div
      ref={cardRef}
      className="relative cursor-pointer transition-transform duration-200 ease-out"
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.015)`
          : isExpanded ? "scale(1.02)" : "translateZ(0)",
      }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }); }}
      onClick={handleClick}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          opacity: isHovered ? 0.7 : 0,
          background: `radial-gradient(400px circle at ${spotPos.x}% ${spotPos.y}%, ${glowColor}, transparent 60%)`,
        }}
      />
      {children(ripple)}
    </div>
  );
});

const FilterButton = memo(function FilterButton({
  active, label, color, count, onClick,
}: {
  active: boolean; label: string; color: string; count: number; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 overflow-hidden ${
        active
          ? "text-white shadow-md"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/40"
      }`}
    >
      {active && <div className={`absolute inset-0 ${color} rounded-xl`} />}
      <span className="relative z-10">{label}</span>
      <span className={`relative z-10 w-5 h-5 rounded-md flex items-center justify-center text-[0.6rem] font-black ${
        active ? "bg-white/20" : "bg-slate-200/60 dark:bg-slate-700/60"
      }`}>
        {count}
      </span>
    </button>
  );
});

/* ───────── Agenda Item Sub-Components ───────── */

const AgendaSidebar = memo(({ 
  time, 
  isGrouped, 
  badgeKey, 
  badgeStyle, 
  isFirst, 
  isLast, 
  isActive, 
  timeColor,
  t 
}: { 
  time: string; 
  isGrouped: boolean; 
  badgeKey: string; 
  badgeStyle: any; 
  isFirst: boolean; 
  isLast: boolean; 
  isActive: boolean; 
  timeColor: string; 
  t: (k: string) => string 
}) => {
  const [start, end] = time.includes(" - ") ? time.split(" - ") : [time, null];
  
  return (
    <div className={`p-6 md:p-8 md:w-48 shrink-0 flex md:flex-col items-center justify-between gap-4 md:border-r ${
      isFirst || isLast ? "border-white/20" : "border-slate-200/60 dark:border-slate-700/60"
    }`}>
      {/* Top Group */}
      <div className="flex items-center gap-3 md:flex-col md:items-center md:gap-4 md:w-full">
         {/* Mobile: Full String / Desktop: Start Time */}
         <span className={`font-black tracking-tighter tabular-nums block text-center ${timeColor} ${time.length > 5 ? "md:hidden text-xl" : "text-2xl md:text-3xl"}`}>
           {time}
         </span>
         
         {end && (
            <span className={`hidden md:block text-3xl font-black tracking-tighter tabular-nums text-center ${timeColor}`}>
                {start}
            </span>
         )}
      
         {/* Badge */}
         <div className={`px-2.5 py-1 rounded-lg text-[0.65rem] font-bold uppercase tracking-widest border border-current/20 w-fit ${
             isFirst || isLast ? "bg-white/20 text-white" : 
             isGrouped ? "bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400" :
             `${badgeStyle.bg} ${badgeStyle.text}`
         }`}>
             {isGrouped ? "Session" : t(badgeKey)}
         </div>
      </div>

      {/* Connecting Line */}
      {end && (
        <div className={`hidden md:flex flex-col flex-1 items-center justify-center py-2 opacity-30 ${timeColor}`}>
            <div className="w-0.5 h-full bg-current rounded-full" />
        </div>
      )}

      {/* Bottom Group */}
      {end && (
        <div className="hidden md:block w-full text-center">
            <span className={`text-3xl font-black tracking-tighter tabular-nums block opacity-40 ${timeColor}`}>
              {end}
            </span>
        </div>
      )}
    </div>
  );
});

const AgendaContent = memo(({ 
  event, 
  isExpanded, 
  titleColor, 
  descColor, 
  isFirst, 
  isLast, 
  t 
}: { 
  event: TimelineEvent; 
  isExpanded: boolean; 
  titleColor: string; 
  descColor: string; 
  isFirst: boolean; 
  isLast: boolean; 
  t: (k: string) => string 
}) => {
  return (
    <div className="flex-1 p-6 md:p-8 pt-0 md:pt-8 md:pl-8">
       {/* Single Event View */}
       {!event.nestedEvents && (
          <div className="flex flex-col gap-4">
             <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h3 className={`text-xl md:text-2xl font-bold leading-tight mb-2 ${titleColor}`}>
                      {t(event.titleKey)}
                    </h3>
                    <p className={`text-sm md:text-base line-clamp-2 transition-opacity ${descColor} ${isExpanded ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
                      {t(event.descKey)}
                    </p>
                </div>
                <div className={`transition-transform duration-300 mt-1 shrink-0 ${isExpanded ? "rotate-180" : ""} ${isFirst || isLast ? "text-white/70" : "text-slate-400"}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
             </div>
             <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className={`pt-6 border-t ${isFirst || isLast ? "border-white/20" : "border-slate-200/60 dark:border-slate-700/60"}`}>
                     <p className={`text-base leading-relaxed mb-6 ${isFirst || isLast ? "text-white/90" : "text-slate-600 dark:text-slate-300"}`}>
                       {t(event.descKey)}
                     </p>
                     <div className="flex flex-wrap gap-3">
                        {event.metaKey && (
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${isFirst || isLast ? "bg-white/20 text-white backdrop-blur-sm" : "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400"}`}>
                            📍 {t(event.metaKey)}
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
          <div className="flex flex-col gap-6">
            {event.nestedEvents.map((subEvent, subIndex) => (
              <div key={subEvent.id} className={`relative flex gap-4 ${subIndex !== event.nestedEvents!.length - 1 ? "pb-6 border-b border-slate-100 dark:border-slate-700/30" : ""}`}>
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                         badgeStyles[subEvent.badgeColor]?.text || "text-slate-500"
                      } border-current/20 bg-current/5`}>
                         {t(subEvent.badgeKey)}
                      </span>
                    </div>
                    <h4 className={`text-lg font-bold ${titleColor}`}>{t(subEvent.titleKey)}</h4>
                    <p className={`text-sm mt-1 ${descColor}`}>{t(subEvent.descKey)}</p>
                    {subEvent.metaKey && (
                        <div className={`mt-2 inline-flex items-center gap-2 px-2 py-1 rounded-md text-[0.65rem] font-medium border border-current/10 w-fit ${
                           isFirst || isLast ? "bg-white/10 text-white/90" : "bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400"
                        }`}>
                           👤 {t(subEvent.metaKey)}
                        </div>
                    )}
                 </div>
              </div>
            ))}
          </div>
       )}
    </div>
  );
});

/* ───────── Main Agenda Item ───────── */
const AgendaItem = memo(({ 
  event, index, isActive, isFirst, isLast, expandedIdx, toggleExpand, cardsVisible, t 
}: { 
  event: TimelineEvent; index: number; isActive: boolean; isFirst: boolean; isLast: boolean; 
  expandedIdx: number | null; toggleExpand: (i: number) => void; cardsVisible: boolean; t: (k: string) => string;
}) => {
  const style = badgeStyles[event.badgeColor] || badgeStyles.lecture;
  const isExpanded = expandedIdx === index;

  const cardClasses = useMemo(() => {
    if (isFirst) return "bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl shadow-violet-500/20 border-violet-500/50";
    if (isLast) return "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-500/20 border-amber-500/50";
    if (isActive) return "bg-white dark:bg-slate-800 border-violet-200 dark:border-violet-700 shadow-xl scale-[1.02]";
    return "bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg";
  }, [isActive, isFirst, isLast]);

  const timeColor = isFirst || isLast ? "text-white/90" : isActive ? "text-violet-600 dark:text-violet-400" : "text-slate-500 dark:text-slate-400";
  const titleColor = isFirst || isLast ? "text-white" : isActive ? "text-slate-900 dark:text-white" : "text-slate-800 dark:text-slate-200";
  const descColor = isFirst || isLast ? "text-white/80" : "text-slate-500 dark:text-slate-400";

  return (
    <div
      className="group relative transition-all duration-500"
      style={{
        opacity: cardsVisible ? 1 : 0,
        transform: cardsVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${index * 50}ms`,
      }}
      data-index={index}
    >
      <TiltCard isExpanded={isExpanded} glowColor={style.glow} onClick={() => toggleExpand(index)}>
        {(ripple) => (
          <div className={`relative rounded-3xl border transition-all duration-500 overflow-hidden ${cardClasses}`}>
            {ripple && (
              <div
                key={ripple.id}
                className="absolute rounded-full bg-white opacity-20 animate-[rippleExpand_0.8s_ease-out_forwards] pointer-events-none z-0"
                style={{ left: ripple.x, top: ripple.y, width: 1200, height: 1200, transform: "translate(-50%,-50%) scale(0)" }}
              />
            )}
            <div className="flex flex-col md:flex-row relative z-10">
               <AgendaSidebar 
                 time={event.time} 
                 isGrouped={!!event.nestedEvents} 
                 badgeKey={event.badgeKey} 
                 badgeStyle={style} 
                 isFirst={isFirst} 
                 isLast={isLast} 
                 isActive={isActive} 
                 timeColor={timeColor} 
                 t={t} 
               />
               <AgendaContent 
                 event={event} 
                 isExpanded={isExpanded} 
                 titleColor={titleColor} 
                 descColor={descColor} 
                 isFirst={isFirst} 
                 isLast={isLast} 
                 t={t}
               />
            </div>
            {isActive && !isFirst && !isLast && (
              <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${style.bg.replace('/10','').replace('/20','')}`} />
            )}
          </div>
        )}
      </TiltCard>
    </div>
  );
});

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
export default function AgendaSection() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState(FILTER_ALL);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(false);
  const currentDay = days[0];
  const { t } = useLang();
  
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const filteredEvents = useMemo(() => {
    if (activeFilter === FILTER_ALL) return currentDay.events;
    return currentDay.events.filter((e) => {
      if (activeFilter === "lecture") return e.badgeColor === "lecture";
      if (activeFilter === "workshop") return e.badgeColor === "workshop";
      if (activeFilter === "break") return e.badgeColor === "break" || e.badgeColor === "summary";
      return true;
    });
  }, [activeFilter, currentDay.events]);

  useEffect(() => { setExpandedIdx(null); }, [activeFilter]);

  const counts = useMemo(() => ({
    all: currentDay.events.length,
    lecture: currentDay.events.filter((e) => e.badgeColor === "lecture").length,
    workshop: currentDay.events.filter((e) => e.badgeColor === "workshop").length,
    break: currentDay.events.filter((e) => e.badgeColor === "break" || e.badgeColor === "summary").length,
  }), [currentDay.events]);

  const totalHours = useMemo(() =>
    Math.round(currentDay.events.reduce((sum, e) => sum + e.durationMin, 0) / 60 * 10) / 10,
    [currentDay.events]
  );

  useEffect(() => {
    const t = setTimeout(() => setCardsVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const toggleExpand = useCallback((idx: number) => {
    setExpandedIdx((prev) => (prev === idx ? null : idx));
  }, []);

  const setRef = useCallback((el: HTMLDivElement | null, index: number) => {
    if (el) cardRefs.current.set(index, el);
    else cardRefs.current.delete(index);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (cardRefs.current.size === 0) { ticking = false; return; }
          const viewCenter = window.innerHeight / 2;
          let closest = 0;
          let closestDist = Infinity;
          for (const [index, el] of cardRefs.current.entries()) {
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) continue; 
            const dist = Math.abs(rect.top + rect.height / 2 - viewCenter);
            if (dist < closestDist) { closestDist = dist; closest = index; }
          }
          setActiveCardIdx(closest);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredEvents]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        setActiveCardIdx((prev) => Math.min(prev + 1, filteredEvents.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        setActiveCardIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleExpand(activeCardIdx);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeCardIdx, filteredEvents.length, toggleExpand]);

  return (
    <section id="agenda" className="py-32 relative z-10 overflow-hidden">
      <div className="absolute inset-0 aurora-bg opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <ScrollReveal variant="blur">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] font-black mb-6 tracking-tight text-slate-900 dark:text-white">
              {t("agenda.title1")}<span className="gradient-text-anim">{t("agenda.title2")}</span>
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal variant="scale">
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-violet-100/20 dark:shadow-violet-900/10">
              <span className="text-2xl">🗓️</span>
              <div className="flex flex-col">
                <span className="text-[0.65rem] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">{t("agenda.badge")}</span>
                <span className="text-lg font-black font-mono text-slate-800 dark:text-white">{t(currentDay.dateKey)}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={200}>
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            <FilterButton active={activeFilter === FILTER_ALL} label={t("agenda.events")} color="bg-gradient-to-r from-violet-600 to-blue-600" count={counts.all} onClick={() => setActiveFilter(FILTER_ALL)} />
            <FilterButton active={activeFilter === "lecture"} label={t("agenda.lectures")} color="bg-indigo-500" count={counts.lecture} onClick={() => setActiveFilter("lecture")} />
            <FilterButton active={activeFilter === "workshop"} label={t("agenda.workshops")} color="bg-purple-500" count={counts.workshop} onClick={() => setActiveFilter("workshop")} />
            <FilterButton active={activeFilter === "break"} label={t("agenda.badge.break")} color="bg-emerald-500" count={counts.break} onClick={() => setActiveFilter("break")} />
          </div>
        </ScrollReveal>
        <div className="max-w-4xl mx-auto space-y-6">
            {filteredEvents.map((event, i) => (
              <div key={event.id} ref={(el) => setRef(el, i)}>
                  <AgendaItem event={event} index={i} isActive={activeCardIdx === i} isFirst={i === 0} isLast={i === filteredEvents.length - 1} expandedIdx={expandedIdx} toggleExpand={toggleExpand} cardsVisible={cardsVisible} t={t} />
              </div>
            ))}
        </div>
        {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <span className="text-4xl mb-4 block">🔍</span>
              <p className="text-slate-400 dark:text-slate-500 text-sm">No events match this filter</p>
            </div>
        )}
        <ScrollReveal variant="blur" delay={600}>
          <div className="text-center mt-14">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl border border-slate-200/20 dark:border-slate-700/20">
              <span className="text-[0.65rem] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-semibold">{t("agenda.clickHint")}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="text-[0.65rem] text-slate-400 dark:text-slate-500 font-mono">↑↓ Enter</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
