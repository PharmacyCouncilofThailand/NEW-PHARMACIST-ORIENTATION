"use client";


import ScrollReveal from "../scroll/ScrollReveal";
import { useLang } from "../../contexts/LangContext";

// ข้อมูลจำลองสำหรับ Sponsor (สามารถเปลี่ยนเป็นโลโก้จริงได้ในภายหลัง)
const sponsors = [
  { id: 1, name: "สภาเภสัชกรรม", image: "/logo สภาเภสัชกรรม.jpg" },
  { id: 2, name: "Sponsor 2" },
  { id: 3, name: "Sponsor 3" },
  { id: 4, name: "Sponsor 4" },
  { id: 5, name: "Sponsor 5" },
  { id: 6, name: "Sponsor 6" },
  { id: 7, name: "Sponsor 7" },
  { id: 8, name: "Sponsor 8" },
];

export default function SponsorSection() {
  const { t } = useLang();

  return (
    <section id="sponsors" className="py-24 sm:py-32 relative overflow-hidden bg-white dark:bg-slate-950">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <ScrollReveal variant="blur">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-black leading-tight tracking-tight text-slate-900 dark:text-white">
              {t("sponsor.title1")} <span className="bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text text-transparent">{t("sponsor.title2")}</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {t("sponsor.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Sponsor Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10 items-center justify-items-center max-w-6xl mx-auto">
          {sponsors.map((s, i) => (
            <ScrollReveal key={s.id} variant="fade-up" delay={i * 50} className="w-full flex justify-center">
              <div 
                className="relative w-full max-w-[240px] aspect-[2/1] xl:aspect-[16/9] rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden p-3 sm:p-5"
              >
                {s.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={encodeURI(s.image)} 
                    alt={s.name} 
                    className="w-full h-full object-contain" 
                    loading="lazy"
                  />
                ) : (
                  <span className="font-bold text-slate-300 dark:text-slate-700 text-sm sm:text-base">{s.name}</span>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
