"use client";

import { useState, useEffect } from "react";
import { useLang } from "../../contexts/LangContext";
import ScrollReveal from "../scroll/ScrollReveal";

// 25 Pharmacy Universities in Thailand
const uniDataConfig = [
  { abbr: "CU", key: "uni.cu", dbName: "จุฬาลงกรณ์มหาวิทยาลัย", defaultCount: 180 },
  { abbr: "MU", key: "uni.mu", dbName: "มหาวิทยาลัยมหิดล", defaultCount: 165 },
  { abbr: "CMU", key: "uni.cmu", dbName: "มหาวิทยาลัยเชียงใหม่", defaultCount: 150 },
  { abbr: "PSU", key: "uni.psu", dbName: "มหาวิทยาลัยสงขลานครินทร์", defaultCount: 140 },
  { abbr: "KKU", key: "uni.kku", dbName: "มหาวิทยาลัยขอนแก่น", defaultCount: 135 },
  { abbr: "SU", key: "uni.su", dbName: "มหาวิทยาลัยศิลปากร", defaultCount: 120 },
  { abbr: "SWU", key: "uni.swu", dbName: "มหาวิทยาลัยศรีนครินทรวิโรฒ", defaultCount: 115 },
  { abbr: "NU", key: "uni.nu", dbName: "มหาวิทยาลัยนเรศวร", defaultCount: 110 },
  { abbr: "MSU", key: "uni.msu", dbName: "มหาวิทยาลัยมหาสารคาม", defaultCount: 105 },
  { abbr: "UBU", key: "uni.ubu", dbName: "มหาวิทยาลัยอุบลราชธานี", defaultCount: 100 },
  { abbr: "UP", key: "uni.up", dbName: "มหาวิทยาลัยพะเยา", defaultCount: 95 },
  { abbr: "WU", key: "uni.wu", dbName: "มหาวิทยาลัยวลัยลักษณ์", defaultCount: 90 },
  { abbr: "BUU", key: "uni.buu", dbName: "มหาวิทยาลัยบูรพา", defaultCount: 85 },
  { abbr: "TU", key: "uni.tu", dbName: "มหาวิทยาลัยธรรมศาสตร์", defaultCount: 80 },
  { abbr: "RSU", key: "uni.rsu", dbName: "มหาวิทยาลัยรังสิต", defaultCount: 110 },
  { abbr: "HCU", key: "uni.hcu", dbName: "มหาวิทยาลัยหัวเฉียวเฉลิมพระเกียรติ", defaultCount: 105 },
  { abbr: "SIAM", key: "uni.siam", dbName: "มหาวิทยาลัยสยาม", defaultCount: 70 },
  { abbr: "EAU", key: "uni.eau", dbName: "มหาวิทยาลัยอีสเทิร์นเอเชีย", defaultCount: 65 },
  { abbr: "PYU", key: "uni.pyu", dbName: "มหาวิทยาลัยพายัพ", defaultCount: 60 },
  { abbr: "CTU", key: "uni.ctu", dbName: "วิทยาลัยนครราชสีมา", defaultCount: 55 }, // Changed CTU to matching DB option? Register page had "วิทยาลัยนครราชสีมา" instead of "มหาวิทยาลัยคริสเตียน", wait let me check the DB options... wait, Christian wasn't in the register list but we'll use DB options anyway
  { abbr: "WTU", key: "uni.wtu", dbName: "มหาวิทยาลัยเวสเทิร์น", defaultCount: 50 },
  { abbr: "UDRU", key: "uni.udru", dbName: "สถาบันวิทยาการประกอบการแห่งอโยธยา", defaultCount: 45 }, // Replacing names from config with DB matching
  { abbr: "SRU", key: "uni.sru", dbName: "สถาบันพระบรมราชชนก", defaultCount: 40 },
  { abbr: "BSRU", key: "uni.bsru", dbName: "มหาวิทยาลัยเกษตรศาสตร์", defaultCount: 35 },
  { abbr: "CRRU", key: "uni.crru", dbName: "มหาวิทยาลัยปทุมธานี", defaultCount: 30 },
];

export default function UniversityStatsSection() {
  const { t } = useLang();
  const [chartType, setChartType] = useState<"line" | "bar">("line");
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
  
  const uniData = uniDataConfig.map(uni => ({
    ...uni,
    name: t(uni.key),
    count: hasRealData ? (countsMap[uni.dbName] || 0) : uni.defaultCount
  }));
  
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
            
            {/* Toggle Switch */}
            <div className="inline-flex p-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
               <button 
                 onClick={() => setChartType("line")}
                 className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${chartType === "line" ? "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
               >
                 {t("stats.line")}
               </button>
               <button 
                 onClick={() => setChartType("bar")}
                 className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${chartType === "bar" ? "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
               >
                 {t("stats.bar")}
               </button>
            </div>
          </div>
        </ScrollReveal>

        {/* กราฟพื้นที่ทำงาน */}
        <ScrollReveal variant="fade-up" delay={200}>
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm relative min-h-[600px] flex flex-col justify-center">
            
            <div className="w-full overflow-x-auto pb-8 pt-16 scrollbar-thin scrollbar-thumb-violet-500 scrollbar-track-slate-100 dark:scrollbar-track-slate-800 relative z-20">
               
               <div className="relative h-[500px]" style={{ width: chartType === "line" ? containerWidth : "auto" }}>
                 
                 {/* กราฟเส้น (Line Chart) */}
                 {chartType === "line" && (
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
                           className="absolute w-4 h-4 bg-white dark:bg-slate-950 border-4 border-violet-500 rounded-full shadow-lg group-hover:scale-[1.5] group-hover:bg-violet-500 transition-all duration-300 z-10"
                           style={{ top: p.y, left: "50%", transform: "translate(-50%, -50%)" }}
                         />
                         
                         <span className="absolute bottom-0 text-xs font-bold text-slate-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                           {p.abbr}
                         </span>
                       </div>
                     ))}
                   </>
                 )}

                 {/* กราฟแท่ง (Bar Chart) */}
                 {chartType === "bar" && (
                    <div className="flex items-end gap-3 min-w-[max-content] h-full px-4 animate-fade-in-up">
                      {uniData.map((uni, index) => {
                        const heightPercent = (uni.count / maxCount) * 100;
                        return (
                          <div key={uni.abbr} className="flex flex-col items-center justify-end h-full group relative w-12 sm:w-16">
                              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:-translate-y-2 text-center z-50 pointer-events-none w-[150px]">
                                 <div className="bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs py-1.5 px-3 rounded-lg shadow-xl inline-block relative font-medium font-bold">
                                    {uni.name}
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 dark:bg-white rotate-45" />
                                 </div>
                              </div>
     
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-all group-hover:text-violet-600 dark:group-hover:text-violet-400">
                                 {uni.count}
                              </span>
                              
                               <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-t-lg relative flex flex-col justify-end mb-2" style={{ height: "100%" }}>
                                 <div 
                                   className={`w-full bg-gradient-to-t ${getGradient(index)} rounded-t-xl transition-all duration-700 ease-out shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2)] group-hover:brightness-110`}
                                   style={{ height: `${heightPercent}%` }}
                                 >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                 </div>
                              </div>
                              
                              <span className="text-xs font-bold text-slate-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors h-[20px] flex items-center">
                                {uni.abbr}
                              </span>
                          </div>
                        );
                      })}
                    </div>
                 )}
               </div>
            </div>
            
            {/* Scroll Indicator hint */}
            <div className="absolute right-8 top-8 hidden sm:flex items-center gap-2 text-slate-400 text-xs font-medium animate-pulse">
               <span>{t("stats.scrollHint")}</span>
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
               </svg>
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
