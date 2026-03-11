"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLang } from "../../contexts/LangContext";

export default function RegistrationCTASection() {
  const { t } = useLang();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="registration-cta" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Animated aurora BG */}
      <div className="absolute inset-0 aurora-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-600/10 to-transparent pointer-events-none" />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-violet-400/10 blur-[140px] rounded-full animate-float pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-400/10 blur-[120px] rounded-full animate-float-slow pointer-events-none" />

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >

          {/* Badge */}
          <span className="inline-flex items-center gap-2 section-badge text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            {t("regcta.badge")}
          </span>

          {/* Headline */}
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.05]">
            {t("regcta.title1")} <br />
            <span className="gradient-text-anim">{t("regcta.title2")}</span>
          </h2>

          {/* Description */}
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            {t("regcta.desc")}
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/register")}
              className="group relative px-12 py-5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-xl shadow-[0_20px_60px_-10px_rgba(124,58,237,0.5)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                {t("regcta.btn")}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 animate-shimmer pointer-events-none" />
            </motion.button>
          </div>

          {/* Info pills */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: "✅", label: t("regcta.info1") },
              { icon: "🆓", label: t("regcta.info2") },
              { icon: "⏰", label: t("regcta.info4") },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 text-sm text-slate-600 dark:text-slate-400 font-medium shadow-sm"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
