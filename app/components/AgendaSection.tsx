"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import ScrollReveal from "./ScrollReveal";
import { useLang } from "../contexts/LangContext";

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
      { id: "d1e1", time: "08:00", durationKey: "agenda.dur.30min", durationMin: 30, badgeKey: "agenda.badge.registration", badgeColor: "register", icon: "📋", titleKey: "agenda.d1e1.title", descKey: "agenda.d1e1.desc", metaKey: "agenda.d1e1.meta" },
      { id: "d1e2", time: "08:30", durationKey: "agenda.dur.30min", durationMin: 30, badgeKey: "agenda.badge.ceremony", badgeColor: "ceremony", icon: "🎓", titleKey: "agenda.d1e2.title", descKey: "agenda.d1e2.desc", metaKey: "agenda.d1e2.meta" },
      { id: "d1e3", time: "09:00", durationKey: "agenda.dur.90min", durationMin: 90, badgeKey: "agenda.badge.lecture", badgeColor: "lecture", icon: "📚", titleKey: "agenda.d1e3.title", descKey: "agenda.d1e3.desc", metaKey: "agenda.d1e3.meta" },
      { id: "d1e4", time: "10:30", durationKey: "agenda.dur.15min", durationMin: 15, badgeKey: "agenda.badge.break", badgeColor: "break", icon: "☕", titleKey: "agenda.d1e4.title", descKey: "agenda.d1e4.desc" },
      { id: "d1e5", time: "10:45", durationKey: "agenda.dur.75min", durationMin: 75, badgeKey: "agenda.badge.lecture", badgeColor: "lecture", icon: "💻", titleKey: "agenda.d1e5.title", descKey: "agenda.d1e5.desc", metaKey: "agenda.d1e5.meta" },
      { id: "d1e6", time: "12:00", durationKey: "agenda.dur.60min", durationMin: 60, badgeKey: "agenda.badge.lunch", badgeColor: "break", icon: "🍽️", titleKey: "agenda.d1e6.title", descKey: "agenda.d1e6.desc" },
      { id: "d1e7", time: "13:00", durationKey: "agenda.dur.120min", durationMin: 120, badgeKey: "agenda.badge.workshop", badgeColor: "workshop", icon: "🔬", titleKey: "agenda.d1e7.title", descKey: "agenda.d1e7.desc", metaKey: "agenda.d1e7.meta" },
      { id: "d1e8", time: "15:00", durationKey: "agenda.dur.60min", durationMin: 60, badgeKey: "agenda.badge.lecture", badgeColor: "lecture", icon: "🛡️", titleKey: "agenda.d1e8.title", descKey: "agenda.d1e8.desc", metaKey: "agenda.d1e8.meta" },
      { id: "d1e9", time: "16:00", durationKey: "agenda.dur.30min", durationMin: 30, badgeKey: "agenda.badge.summary", badgeColor: "summary", icon: "📝", titleKey: "agenda.d1e9.title", descKey: "agenda.d1e9.desc" },
    ],
  },
];

const MAX_DURATION = 120;
const FILTER_ALL = "all";

/* ───────── Animated Count-Up ───────── */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    let frameId: number;
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      start = Math.round(eased * end * 10) / 10;
      setDisplay(start);
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <span ref={ref}>{display}{suffix}</span>;
}







/* ───────── 3D Tilt + Spotlight Card ───────── */
function TiltCard({
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
    
    // Throttle to animation frame
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
      className="relative cursor-pointer transition-transform duration-200 will-change-transform"
      style={{
        transform: isHovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.015)`
          : isExpanded
            ? "perspective(800px) scale(1.02)"
            : "perspective(800px) scale(1)",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }); }}
      onClick={handleClick}
    >
      {/* Spotlight glow */}
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
}



/* ───────── Filter Button ───────── */
function FilterButton({
  active, label, color, count, onClick,
}: {
  active: boolean;
  label: string;
  color: string;
  count: number;
  onClick: () => void;
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
      {active && (
        <div className={`absolute inset-0 ${color} rounded-xl`} />
      )}
      <span className="relative z-10">{label}</span>
      <span className={`relative z-10 w-5 h-5 rounded-md flex items-center justify-center text-[0.6rem] font-black ${
        active ? "bg-white/20" : "bg-slate-200/60 dark:bg-slate-700/60"
      }`}>
        {count}
      </span>
    </button>
  );
}

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
export default function AgendaSection() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState(FILTER_ALL);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(false);
  const currentDay = days[0];
  const { t } = useLang();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (activeFilter === FILTER_ALL) return currentDay.events;
    return currentDay.events.filter((e) => {
      if (activeFilter === "lecture") return e.badgeColor === "lecture";
      if (activeFilter === "workshop") return e.badgeColor === "workshop";
      if (activeFilter === "break") return e.badgeColor === "break" || e.badgeColor === "summary";
      return true;
    });
  }, [currentDay.events, activeFilter]);

  // Reset expanded state when filter changes
  useEffect(() => {
    setExpandedIdx(null);
  }, [activeFilter]);

  // Counts for filters
  const counts = useMemo(() => ({
    all: currentDay.events.length,
    lecture: currentDay.events.filter((e) => e.badgeColor === "lecture").length,
    workshop: currentDay.events.filter((e) => e.badgeColor === "workshop").length,
    break: currentDay.events.filter((e) => e.badgeColor === "break" || e.badgeColor === "summary").length,
  }), [currentDay.events]);

  // Stats
  const totalHours = useMemo(() =>
    Math.round(currentDay.events.reduce((sum, e) => sum + e.durationMin, 0) / 60 * 10) / 10,
    [currentDay.events]
  );

  // Day switching


  // Trigger card visibility on mount and day switch
  useEffect(() => {
    const t = setTimeout(() => setCardsVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Toggle expand
  const toggleExpand = useCallback((idx: number) => {
    setExpandedIdx((prev) => (prev === idx ? null : idx));
  }, []);

  // Scroll-based active card detection
  // Scroll-based active card detection (Throttled)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!cardRefs.current.length) {
            ticking = false;
            return;
          }
          const viewCenter = window.innerHeight / 2;
          let closest = 0;
          let closestDist = Infinity;
          
          cardRefs.current.forEach((el, i) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const dist = Math.abs(rect.top + rect.height / 2 - viewCenter);
            if (dist < closestDist) { closestDist = dist; closest = i; }
          });
          
          setActiveCardIdx(closest);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredEvents]);

  // Keyboard navigation
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

  // Scroll active card into view on keyboard nav
  useEffect(() => {
    const el = cardRefs.current[activeCardIdx];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeCardIdx]);



  // Clear refs on re-render
  cardRefs.current = [];

  return (
    <section id="agenda" className="py-32 relative z-10 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 aurora-bg opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />

      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal variant="blur">
          <div className="text-center mb-16">
            <span className="section-badge text-violet-600 border-violet-200 mb-6">
              {t("agenda.badge")}
            </span>
            <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] font-black mb-6 tracking-tight text-slate-900 dark:text-white">
              {t("agenda.title1")}<span className="gradient-text-anim">{t("agenda.title2")}</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed font-light">
              {t("agenda.subtitle1")}
              <br />{t("agenda.subtitle2")}
            </p>
          </div>
        </ScrollReveal>

        {/* Day Selector + Progress Ring */}
        {/* Date & Theme Header */}
        <ScrollReveal variant="scale">
          <div className="flex flex-col items-center gap-4 mb-12">
            
            {/* Date Display */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-violet-100/20 dark:shadow-violet-900/10">
              <span className="text-2xl">🗓️</span>
              <div className="flex flex-col">
                <span className="text-[0.65rem] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">
                  {t("agenda.badge")}
                </span>
                <span className="text-lg font-black font-mono text-slate-800 dark:text-white">
                  {t(currentDay.dateKey)}
                </span>
              </div>
            </div>

            {/* Theme & Stats */}
            <div className="flex items-center gap-6 mt-4">
              {/* Theme */}
              <div className="text-center">
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-violet-400/60" />
                  <span className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-[0.2em] animate-pulse">
                    {t(currentDay.themeKey)}
                  </span>
                  <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-violet-400/60" />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-light tracking-wide">{t(currentDay.themeDescKey)}</p>
              </div>
            </div>

            {/* Stats Row */}
             <div className="flex items-center gap-6 text-xs text-slate-400 dark:text-slate-500 mt-2 bg-slate-100/50 dark:bg-slate-800/50 px-6 py-2 rounded-full border border-slate-200/20 dark:border-slate-700/20">
               <span className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                 <span className="font-semibold text-slate-600 dark:text-slate-300"><AnimatedNumber value={counts.lecture} /></span> {t("agenda.lectures")}
               </span>
               <div className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
               <span className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                 <span className="font-semibold text-slate-600 dark:text-slate-300"><AnimatedNumber value={counts.workshop} /></span> {t("agenda.workshops")}
               </span>
               <div className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
               <span className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 <span className="font-semibold text-slate-600 dark:text-slate-300"><AnimatedNumber value={totalHours} suffix="h" /></span> {t("agenda.total")}
               </span>
             </div>

          </div>
        </ScrollReveal>

        {/* Category Filters */}
        <ScrollReveal variant="fade-up" delay={200}>
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            <FilterButton active={activeFilter === FILTER_ALL} label={t("agenda.events")} color="bg-gradient-to-r from-violet-600 to-blue-600" count={counts.all} onClick={() => setActiveFilter(FILTER_ALL)} />
            <FilterButton active={activeFilter === "lecture"} label={t("agenda.lectures")} color="bg-indigo-500" count={counts.lecture} onClick={() => setActiveFilter("lecture")} />
            <FilterButton active={activeFilter === "workshop"} label={t("agenda.workshops")} color="bg-purple-500" count={counts.workshop} onClick={() => setActiveFilter("workshop")} />
            <FilterButton active={activeFilter === "break"} label={t("agenda.badge.break")} color="bg-emerald-500" count={counts.break} onClick={() => setActiveFilter("break")} />
          </div>
        </ScrollReveal>

        {/* Timeline */}
        {/* Premium List Layout */}
        <div className="max-w-4xl mx-auto space-y-6">
            {filteredEvents.map((event, i) => {
              const isActive = activeCardIdx === i;
              const style = badgeStyles[event.badgeColor] || badgeStyles.lecture;
              
              return (
                <div
                  key={event.id}
                  ref={(el) => { if(el) cardRefs.current[i] = el; }}
                  className="group relative flex flex-col md:flex-row gap-6 md:gap-10 transition-all duration-500"
                  style={{
                    opacity: cardsVisible ? 1 : 0,
                    transform: cardsVisible ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${i * 50}ms`,
                  }}
                >
                  {/* Time Column */}
                  <div className="md:w-32 flex-shrink-0 flex md:flex-col items-center md:items-end pt-2 md:pt-4 gap-3 md:gap-1">
                     <span className={`text-2xl md:text-3xl font-black tracking-tighter tabular-nums transition-colors duration-300 ${
                       isActive ? "text-violet-600 dark:text-violet-400 scale-110" : "text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400"
                     }`}>
                       {event.time}
                     </span>
                     <div className="flex items-center gap-2">
                        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                          {t(event.durationKey)}
                        </span>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />}
                     </div>
                  </div>
                  
                  {/* Connector (Mobile only) */}
                  <div className="md:hidden absolute left-[19px] top-[3.5rem] bottom-[-1.5rem] w-px bg-slate-200 dark:bg-slate-800" />
                  
                  {/* Card Column */}
                  <div className="flex-1 min-w-0">
                    <TiltCard isExpanded={expandedIdx === i} glowColor={style.glow} onClick={() => toggleExpand(i)}>
                      {(ripple) => (
                        <div className={`relative rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                          expandedIdx === i
                            ? "bg-white/90 dark:bg-slate-800/90 border-violet-300 dark:border-violet-500 shadow-2xl shadow-violet-200/50 dark:shadow-violet-900/40 ring-4 ring-violet-100 dark:ring-violet-900/20"
                            : isActive
                              ? "bg-white/80 dark:bg-slate-800/80 border-violet-200 dark:border-violet-700 shadow-xl shadow-violet-100/30 dark:shadow-violet-900/10 scale-[1.02]"
                              : "bg-white/40 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:border-violet-200 dark:hover:border-violet-700 hover:shadow-lg"
                        } backdrop-blur-md`}>
                          
                          {/* Ripple Effect */}
                          {ripple && (
                            <div
                              key={ripple.id}
                              className="absolute rounded-full bg-current opacity-10 animate-[rippleExpand_0.8s_ease-out_forwards] pointer-events-none z-0"
                              style={{ left: ripple.x, top: ripple.y, width: 1200, height: 1200, transform: "translate(-50%,-50%) scale(0)", color: style.glow }}
                            />
                          )}

                          {/* Decorative Bar */}
                          <div className={`absolute top-0 bottom-0 left-0 w-1.5 transition-all duration-500 ${
                             isActive ? style.bg.replace('/10','').replace('/20','') : "bg-transparent"
                          } ${isActive ? "opacity-100" : "opacity-0"}`} />

                          <div className="p-6 md:p-8 relative z-10">
                            <div className="flex items-start gap-6">
                               {/* Icon Box */}
                               <div className={`shrink-0 w-16 h-16 rounded-2xl ${style.bg} flex items-center justify-center text-3xl transition-transform duration-500 ${
                                 expandedIdx === i ? "scale-110 rotate-3" : "group-hover:scale-105"
                               }`}>
                                 {event.icon}
                               </div>

                               <div className="flex-1 min-w-0 pt-1">
                                  {/* Badges */}
                                  <div className="flex items-center gap-2 mb-3">
                                     <span className={`px-2.5 py-0.5 rounded-md text-[0.6rem] font-bold uppercase tracking-widest border ${style.text} border-current/20`}>
                                        {t(event.badgeKey)}
                                     </span>
                                     {event.metaKey && (
                                       <span className="hidden sm:inline-block text-[0.65rem] text-slate-400 dark:text-slate-500 font-medium truncate">
                                         • {t(event.metaKey)}
                                       </span>
                                     )}
                                  </div>

                                  <h3 className={`text-xl md:text-2xl font-bold leading-tight mb-2 transition-colors ${
                                    isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200"
                                  }`}>
                                    {t(event.titleKey)}
                                  </h3>
                                  
                                  {/* Description (Preview) */}
                                  <p className={`text-sm text-slate-500 dark:text-slate-400 line-clamp-1 transition-opacity ${
                                    expandedIdx === i ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
                                  }`}>
                                    {t(event.descKey)}
                                  </p>

                                  {/* Expanded Content */}
                                  <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                                    expandedIdx === i ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                                  }`}>
                                    <div className="overflow-hidden">
                                      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                         <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                                           {t(event.descKey)}
                                         </p>
                                         
                                         {event.metaKey && (
                                            <div className="mt-6 flex flex-wrap gap-2">
                                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-xs font-medium text-slate-600 dark:text-slate-400">
                                                📍 {t(event.metaKey)}
                                              </div>
                                            </div>
                                         )}
                                      </div>
                                    </div>
                                  </div>
                               </div>

                               <div className={`mt-2 transition-transform duration-300 ${expandedIdx === i ? "rotate-180" : ""}`}>
                                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                               </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </TiltCard>
                  </div>
                </div>
              );
            })}
        </div>


        {/* Empty state */}
        {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <span className="text-4xl mb-4 block">🔍</span>
              <p className="text-slate-400 dark:text-slate-500 text-sm">No events match this filter</p>
            </div>
          )}


        {/* Bottom hint */}
        <ScrollReveal variant="blur" delay={600}>
          <div className="text-center mt-14">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl border border-slate-200/20 dark:border-slate-700/20">
              <span className="text-[0.65rem] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-semibold">
                {t("agenda.clickHint")}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="text-[0.65rem] text-slate-400 dark:text-slate-500 font-mono">
                ↑↓ Enter
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
