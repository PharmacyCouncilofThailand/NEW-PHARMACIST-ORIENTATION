"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "../../contexts/LangContext";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 25 Pharmacy Universities in Thailand
const uniDataConfig = [
  { abbr: "CU", key: "uni.cu", dbName: "จุฬาลงกรณ์มหาวิทยาลัย", logoUrl: "/Logo/Cu.png", defaultCount: 180 },
  { abbr: "MU", key: "uni.mu", dbName: "มหาวิทยาลัยมหิดล", logoUrl: "/Logo/mu.png", defaultCount: 165 },
  { abbr: "CMU", key: "uni.cmu", dbName: "มหาวิทยาลัยเชียงใหม่", logoUrl: "/Logo/cmu.png", defaultCount: 150 },
  { abbr: "PSU", key: "uni.psu", dbName: "มหาวิทยาลัยสงขลานครินทร์", logoUrl: "/Logo/psu.png", defaultCount: 140 },
  { abbr: "KKU", key: "uni.kku", dbName: "มหาวิทยาลัยขอนแก่น", logoUrl: "/Logo/kku.png", defaultCount: 135 },
  { abbr: "SU", key: "uni.su", dbName: "มหาวิทยาลัยศิลปากร", logoUrl: "/Logo/su.png", defaultCount: 120 },
  { abbr: "NU", key: "uni.nu", dbName: "มหาวิทยาลัยนเรศวร", logoUrl: "/Logo/nu.png", defaultCount: 110 },
  { abbr: "SWU", key: "uni.swu", dbName: "มหาวิทยาลัยศรีนครินทรวิโรฒ", logoUrl: "/Logo/swu.png", defaultCount: 115 },
  { abbr: "MSU", key: "uni.msu", dbName: "มหาวิทยาลัยมหาสารคาม", logoUrl: "/Logo/msu.png", defaultCount: 105 },
  { abbr: "UBU", key: "uni.ubu", dbName: "มหาวิทยาลัยอุบลราชธานี", logoUrl: "/Logo/Ubu.png", defaultCount: 100 },
  { abbr: "UP", key: "uni.up", dbName: "มหาวิทยาลัยพะเยา", logoUrl: "/Logo/up.png", defaultCount: 95 },
  { abbr: "RSU", key: "uni.rsu", dbName: "มหาวิทยาลัยรังสิต", logoUrl: "/Logo/rsu.png", defaultCount: 110 },
  { abbr: "HCU", key: "uni.hcu", dbName: "มหาวิทยาลัยหัวเฉียวเฉลิมพระเกียรติ", logoUrl: "/Logo/hcu.png", defaultCount: 105 },
  { abbr: "SIAM", key: "uni.siam", dbName: "มหาวิทยาลัยสยาม", logoUrl: "/Logo/siam.jpg", defaultCount: 70 },
  { abbr: "PYU", key: "uni.pyu", dbName: "มหาวิทยาลัยพายัพ", logoUrl: "/Logo/pyu.png", defaultCount: 60 },
  { abbr: "WU", key: "uni.wu", dbName: "มหาวิทยาลัยวลัยลักษณ์", logoUrl: "/Logo/wu.png", defaultCount: 90 },
  { abbr: "BUU", key: "uni.buu", dbName: "มหาวิทยาลัยบูรพา", logoUrl: "/Logo/buu.jpg", defaultCount: 85 },
  { abbr: "EAU", key: "uni.eau", dbName: "มหาวิทยาลัยอีสเทิร์นเอเชีย", logoUrl: "/Logo/eau.png", defaultCount: 65 },
  { abbr: "TU", key: "uni.tu", dbName: "มหาวิทยาลัยธรรมศาสตร์", logoUrl: "/Logo/tu.png", defaultCount: 80 },
  { abbr: "WTU", key: "uni.wtu", dbName: "มหาวิทยาลัยเวสเทิร์น", logoUrl: "/Logo/WTU.png", defaultCount: 50 },
  { abbr: "IESA", key: "uni.iesa", dbName: "สถาบันวิทยาการประกอบการแห่งอโยธยา", logoUrl: "/Logo/iesa.png", defaultCount: 45 },
  { abbr: "PI", key: "uni.pi", dbName: "สถาบันพระบรมราชชนก", logoUrl: "/Logo/pi.png", defaultCount: 40 },
  { abbr: "NMC", key: "uni.nmc", dbName: "วิทยาลัยนครราชสีมา", logoUrl: "/Logo/nmc.png", defaultCount: 55 },
  { abbr: "KU", key: "uni.ku", dbName: "มหาวิทยาลัยเกษตรศาสตร์", logoUrl: "/Logo/ku.png", defaultCount: 35 },
  { abbr: "PTU", key: "uni.ptu", dbName: "มหาวิทยาลัยปทุมธานี", logoUrl: "/Logo/ptu.jpg", defaultCount: 30 },
];

const UniLogo = ({
  src,
  abbr,
  width,
  height,
  imgClass,
  textClass,
}: {
  src?: string;
  abbr: string;
  width: number;
  height: number;
  imgClass: string;
  textClass: string;
}) => {
  const [error, setError] = useState(!src);
  if (error) {
    return (
      <div className="w-full h-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center rounded-full overflow-hidden">
        <span className={`font-black text-violet-600 dark:text-violet-300 text-center leading-tight ${textClass}`}>
          {abbr}
        </span>
      </div>
    );
  }
  return (
    <Image
      src={src!}
      alt={abbr}
      width={width}
      height={height}
      className={imgClass}
      onError={() => setError(true)}
    />
  );
};

export default function UniversityStatsSection() {
  const { t } = useLang();
  const [countsMap, setCountsMap] = useState<Record<string, number>>({});
  const [isShortScreen, setIsShortScreen] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const chartGroupRef = useRef<HTMLDivElement>(null);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, {
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });

      gsap.from(chartGroupRef.current, {
        scrollTrigger: {
          trigger: chartGroupRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Detect Nest Hub short viewport
  useEffect(() => {
    const checkHeight = () => setIsShortScreen(window.innerHeight <= 680);
    checkHeight();
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, []);
  
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats/universities");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const map: Record<string, number> = {};
          let totalUsers = 0;
          json.data.forEach((item: { university: string; count: number }) => {
            map[item.university] = item.count;
            totalUsers += item.count;
          });
          // If we have at least 1 real user, show 0 for missing. Otherwise use mock data.
          if (totalUsers > 0) {
             setCountsMap(map);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);
  
  const hasRealData = Object.keys(countsMap).length > 0;
  
  const uniData = [...uniDataConfig]
    .map(uni => ({
      ...uni,
      name: t(uni.key),
      count: hasRealData ? (countsMap[uni.dbName] || 0) : uni.defaultCount
    }))
    .sort((a, b) => b.count - a.count); // ยอดเยอะสุดขึ้นก่อน
  
  const maxCount = Math.max(...uniData.map(d => d.count), 1);

  const chartHeight = isShortScreen ? 220 : 400;
  const pointSpacing = isShortScreen ? 72 : 80;
  const paddingLeft = 40;  
  const paddingY = isShortScreen ? 50 : 80;

  const points = uniData.map((uni, index) => {
    const x = paddingLeft + index * pointSpacing;
    const availableHeight = chartHeight - paddingY * 2;
    const heightPercent = uni.count / maxCount;
    const y = chartHeight - paddingY - (heightPercent * availableHeight);
    return { ...uni, x, y };
  });

  const getSmoothPath = (pts: typeof points) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const cx = (p1.x + p2.x) / 2;
        d += ` C ${cx} ${p1.y}, ${cx} ${p2.y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const containerWidth = points.length > 0 ? points[points.length - 1].x + paddingLeft : 800;

  return (
    <section id="stats" ref={sectionRef} className="scroll-mt-40 min-h-screen short:min-h-0 flex flex-col justify-center py-12 md:py-20 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 dark:bg-violet-600/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        
        <div ref={headlineRef} className="text-center mb-10 short:mb-4">
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-black tracking-tight text-slate-900 dark:text-white mb-3 short:mb-2 text-center">
            {t("stats.title1")}<span className="gradient-text-anim">{t("stats.title2")}</span>
          </h2>

          {/* Badges row */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
            {/* Institution count badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 text-xs font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {t("stats.institutions")}
            </div>

            {/* Sort note badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 text-xs font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              {t("stats.sortDesc")}
            </div>
          </div>
        </div>

        {/* กราฟพื้นที่ทำงาน */}
        <div ref={chartGroupRef}>
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 short:md:p-5 shadow-xl border border-slate-200 dark:border-slate-800 md:backdrop-blur-sm relative min-h-[400px] md:min-h-[600px] short:md:min-h-[300px] flex flex-col justify-center">
            
            {/* Desktop Chart - xl screens only */}
            <div className="hidden xl:block w-full overflow-x-auto pb-6 pt-10 scrollbar-thin scrollbar-thumb-violet-500 scrollbar-track-slate-100 dark:scrollbar-track-slate-800 relative z-20">
               
               <div className="relative" style={{ width: containerWidth, height: chartHeight }}>
                 
                 {/* กราฟเส้น (Line Chart) */}
                   <>
                     <svg className="absolute inset-0 w-full h-full pointer-events-none animate-fade-in-up" style={{ overflow: "visible" }}>
                       <defs>
                         <linearGradient id="lineColor" x1="0%" y1="0%" x2="100%" y2="0%">
                           <stop offset="0%" stopColor="#8b5cf6" />
                           <stop offset="50%" stopColor="#ec4899" />
                           <stop offset="100%" stopColor="#f59e0b" />
                         </linearGradient>
                         
                         <linearGradient id="areaColor" x1="0%" y1="0%" x2="0%" y2="100%">
                           <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                           <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                         </linearGradient>
                       </defs>
                       
                       {points.length > 0 && (
                         <path 
                           d={`${getSmoothPath(points)} L ${points[points.length-1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`} 
                           fill="url(#areaColor)" 
                         />
                       )}
                       
                       {points.length > 0 && (
                         <path 
                           d={getSmoothPath(points)} 
                           fill="none" 
                           stroke="url(#lineColor)" 
                           strokeWidth="4" 
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           className="drop-shadow-lg"
                         />
                       )}
                     </svg>

                     {points.map((p) => (
                       <div 
                         key={p.abbr} 
                         className="absolute flex flex-col items-center group cursor-pointer animate-fade-in-up"
                         style={{ left: p.x, bottom: 0, transform: "translateX(-50%)", height: "100%" }}
                       >
                         <div 
                           className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:-translate-y-2 text-center z-50 pointer-events-none min-w-[150px] whitespace-nowrap"
                           style={{ bottom: "100%", marginBottom: "15px" }}
                         >
                            <div className="bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs py-1.5 px-3 rounded-lg shadow-xl inline-block relative font-bold">
                               {p.name}
                               <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 dark:bg-white rotate-45" />
                            </div>
                         </div>

                         <span 
                           className="absolute font-black text-slate-700 dark:text-slate-200 transition-all group-hover:scale-125 group-hover:text-violet-600 dark:group-hover:text-violet-400"
                           style={{ top: p.y - 35 }}
                         >
                            {p.count}
                         </span>
                         
                         <div 
                           className="absolute w-[2px] border-l-2 border-dashed border-violet-500/0 group-hover:border-violet-500/30 transition-all duration-300"
                           style={{ top: p.y, bottom: "30px", left: "50%", transform: "translateX(-50%)", zIndex: 0 }}
                         />

                         <div 
                           className="absolute w-8 h-8 rounded-full shadow-md group-hover:scale-125 transition-all duration-300 z-10 overflow-hidden bg-white border border-slate-200 dark:border-slate-700 flex items-center justify-center"
                           style={{ top: p.y, left: "50%", transform: "translate(-50%, -50%)" }}
                         >
                            <UniLogo 
                              src={p.logoUrl} 
                              abbr={p.abbr} 
                              width={32} 
                              height={32} 
                              imgClass="w-full h-full object-contain p-[2px]" 
                              textClass="text-[7px]" 
                            />
                         </div>
                         
                         <span className="absolute bottom-0 text-xs font-bold text-slate-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                           {p.abbr}
                         </span>
                       </div>
                     ))}
                   </>

               </div>
            </div>
            
            {/* Mobile + Tablet Vertical List */}
            <div className="xl:hidden w-full flex flex-col gap-3 max-h-[500px] md:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar mt-2 relative z-20">
              {uniData.map((uni, idx) => {
                const percent = (uni.count / maxCount) * 100;
                return (
                  <div key={uni.abbr} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 md:p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-transform cursor-default">
                    <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                      <UniLogo 
                        src={uni.logoUrl} 
                        abbr={uni.abbr} 
                        width={48} 
                        height={48} 
                        imgClass="w-8 h-8 object-contain" 
                        textClass="text-[10px]" 
                      />
                      
                      {idx < 3 && (
                        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-400' : 'bg-orange-400'}`}>
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate text-[13px] md:text-sm">{uni.name}</span>
                        <span className="font-black text-violet-600 dark:text-violet-400 text-sm ml-2">{uni.count}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Scroll Indicator hint */}
            <div className="absolute right-8 top-8 short:top-4 short:right-4 hidden sm:flex items-center gap-2 text-slate-400 text-xs font-medium animate-pulse">
               <span>{t("stats.scrollHint")}</span>
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
               </svg>
            </div>

            {/* Summary Box */}
            {(() => {
              const totalCount = uniData.reduce((sum, u) => sum + u.count, 0);
              const top3 = uniData.slice(0, 3);
              return (
                <div className="mt-6 md:mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 animate-fade-in">
                  {/* Total */}
                  <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/20 rounded-2xl p-5 border border-violet-100 dark:border-violet-800 flex flex-col gap-1 items-center">
                    <span className="text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest text-center sm:text-left">{t("stats.totalRegistered")}</span>
                    <span className="text-4xl short:text-2xl font-black text-violet-700 dark:text-violet-300">{totalCount.toLocaleString()}</span>
                  </div>

                   {/* Top 3 - big logo redesign */}
                   {top3.map((u, i) => {
                     const medalBg = i === 0 ? "from-amber-400 to-yellow-500" : i === 1 ? "from-slate-300 to-slate-400" : "from-orange-400 to-amber-500";
                     return (
                       <div key={u.abbr} className="flex bg-white dark:bg-slate-800/60 rounded-2xl px-3 md:px-2 lg:px-4 py-3 md:py-4 lg:py-3 border border-slate-100 dark:border-slate-700 flex-row items-center justify-center gap-3 lg:gap-4 relative overflow-hidden group hover:shadow-lg transition-all duration-300 md:h-full lg:h-auto">
                         {/* rank badge */}
                         <div className={`absolute top-2 right-2 md:top-2 md:right-2 w-6 h-6 rounded-full bg-gradient-to-br ${medalBg} flex items-center justify-center text-white text-[11px] font-black shadow-md z-10`}>
                           {i + 1}
                         </div>
                         {/* logo */}
                         <div className="w-20 h-20 md:w-20 md:h-20 lg:w-20 lg:h-20 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 shadow-md flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300 relative z-0">
                           <UniLogo 
                             src={u.logoUrl} 
                             abbr={u.abbr} 
                             width={80} 
                             height={80} 
                             imgClass="w-full h-full object-contain p-2" 
                             textClass="text-xs" 
                           />
                         </div>
                         {/* text */}
                         <div className="flex-col min-w-0 pr-6 lg:pr-2 xl:pr-6 flex md:hidden lg:flex">
                           <span className="text-xl xl:text-2xl font-black text-slate-800 dark:text-white leading-none">{u.count.toLocaleString()}</span>
                           <span className="text-[10px] xl:text-[11px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-2 mt-0.5">{u.name}</span>
                         </div>
                       </div>
                     );
                   })}
                </div>
              );
            })()}

          </div>
        </div>

      </div>
    </section>
  );
}
