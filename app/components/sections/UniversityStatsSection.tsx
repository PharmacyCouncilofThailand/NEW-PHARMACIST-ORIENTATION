"use client";

import { useState, useEffect } from "react";
import { useLang } from "../../contexts/LangContext";
import ScrollReveal from "../scroll/ScrollReveal";
import Image from "next/image";

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
  { abbr: "IESA", key: "uni.iesa", dbName: "สถาบันวิทยาการประกอบการแห่งอโยธยา", logoUrl: "/Logo/iesa.jpg", defaultCount: 45 },
  { abbr: "PI", key: "uni.pi", dbName: "สถาบันพระบรมราชชนก", logoUrl: "/Logo/pi.png", defaultCount: 40 },
  { abbr: "NMC", key: "uni.nmc", dbName: "วิทยาลัยนครราชสีมา", logoUrl: "/Logo/nmc.png", defaultCount: 55 },
  { abbr: "KU", key: "uni.ku", dbName: "มหาวิทยาลัยเกษตรศาสตร์", logoUrl: "/Logo/ku.png", defaultCount: 35 },
  { abbr: "PTU", key: "uni.ptu", dbName: "มหาวิทยาลัยปทุมธานี", logoUrl: "/Logo/ptu.jpg", defaultCount: 30 },
];


export default function UniversityStatsSection() {
  const { t } = useLang();
  const [countsMap, setCountsMap] = useState<Record<string, number>>({});
  
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

  const chartHeight = 400; // ปรับความสูงกราฟให้พอดีกับกล่อง
  const pointSpacing = 80; 
  const paddingLeft = 40;  
  const paddingY = 80; // เพิ่ม padding บน/ล่างให้ตัวเลขหรือชื่อไม่โดนตัด

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

  const getGradient = (index: number) => {
    const gradients = [
      "from-violet-500 to-purple-600",
      "from-blue-500 to-cyan-500",
      "from-emerald-500 to-teal-500",
      "from-rose-500 to-orange-500",
      "from-amber-500 to-yellow-500",
      "from-fuchsia-500 to-pink-500",
      "from-indigo-500 to-blue-600",
    ];
    return gradients[index % gradients.length];
  };

  const containerWidth = points.length > 0 ? points[points.length - 1].x + paddingLeft : 800;

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 dark:bg-violet-600/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        
        <ScrollReveal variant="blur">
          <div className="text-center mb-10">
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-black tracking-tight text-slate-900 dark:text-white mb-6">
              {t("stats.title1")}<span className="gradient-text-anim">{t("stats.title2")}</span>{t("stats.title3")}
            </h2>
            
            {/* Sort note */}
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 text-xs font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              เรียงจากมากไปน้อย
            </div>
          </div>
        </ScrollReveal>

        {/* กราฟพื้นที่ทำงาน */}
        <ScrollReveal variant="fade-up" delay={200}>
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm relative min-h-[600px] flex flex-col justify-center">
            
            <div className="w-full overflow-x-auto pb-8 pt-16 scrollbar-thin scrollbar-thumb-violet-500 scrollbar-track-slate-100 dark:scrollbar-track-slate-800 relative z-20">
               
               <div className="relative h-[500px]" style={{ width: containerWidth }}>
                 
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
                            {p.logoUrl ? (
                              <img 
                                src={p.logoUrl}
                                alt={p.abbr}
                                className="w-full h-full object-contain p-[2px]"
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.classList.add('bg-violet-100', 'dark:bg-violet-900');
                                    parent.innerHTML = `<span class="text-[7px] font-black text-violet-600 dark:text-violet-300 text-center leading-tight">${p.abbr}</span>`;
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-[7px] font-black text-violet-600 dark:text-violet-300 text-center leading-tight">{p.abbr}</span>
                            )}
                         </div>
                         
                         <span className="absolute bottom-0 text-xs font-bold text-slate-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                           {p.abbr}
                         </span>
                       </div>
                     ))}
                   </>

               </div>
            </div>
            
            {/* Scroll Indicator hint */}
            <div className="absolute right-8 top-8 hidden sm:flex items-center gap-2 text-slate-400 text-xs font-medium animate-pulse">
               <span>{t("stats.scrollHint")}</span>
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
               </svg>
            </div>

            {/* Summary Box */}
            {(() => {
              const totalCount = uniData.reduce((sum, u) => sum + u.count, 0);
              const top3 = uniData.slice(0, 3);
              const rankColors = [
                "bg-amber-400 text-white",
                "bg-slate-400 text-white",
                "bg-orange-400 text-white",
              ];
              return (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in">
                  {/* Total */}
                  <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/20 rounded-2xl p-5 border border-violet-100 dark:border-violet-800 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest">ผู้ลงทะเบียนทั้งหมด</span>
                    <span className="text-4xl font-black text-violet-700 dark:text-violet-300">{totalCount.toLocaleString()}</span>
                  </div>

                  {/* Top 3 */}
                  {top3.map((u, i) => (
                    <div key={u.abbr} className="bg-white dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${rankColors[i]}`}>{i + 1}</span>
                        {u.logoUrl && (
                          <img src={u.logoUrl} alt={u.abbr} className="w-6 h-6 object-contain rounded-full bg-white border border-slate-100" loading="lazy" />
                        )}
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{u.abbr}</span>
                      </div>
                      <span className="text-3xl font-black text-slate-800 dark:text-white">{u.count.toLocaleString()}</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight line-clamp-2">{u.name}</span>
                    </div>
                  ))}
                </div>
              );
            })()}

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
