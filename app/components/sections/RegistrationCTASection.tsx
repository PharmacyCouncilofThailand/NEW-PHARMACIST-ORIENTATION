"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLang } from "../../contexts/LangContext";

export default function RegistrationCTASection() {
  const { t } = useLang();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const pills = [
    { icon: "✅", label: t("regcta.info1") },
    { icon: "🆓", label: t("regcta.info2") },
    { icon: "⏰", label: t("regcta.info4") },
  ];

  return (
    <section id="registration-cta" className="py-6 sm:py-8">
      <div ref={ref} className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-center gap-6 p-4 sm:p-6"
        >
          {/* Left: Text */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase text-violet-600 bg-violet-500/10 border border-violet-500/20 rounded-full px-2.5 py-0.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              {t("regcta.badge")}
            </span>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2 leading-[1.15]">
              {t("regcta.title1")}{" "}
              <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                {t("regcta.title2")}
              </span>
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              {t("regcta.desc")}
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px self-stretch bg-slate-200 dark:bg-white/10" />

          {/* Right: CTA */}
          <div className="flex flex-col items-center md:items-start gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/register")}
              className="group relative px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-xs shadow-[0_6px_20px_-4px_rgba(124,58,237,0.45)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {t("regcta.btn")}
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 animate-shimmer pointer-events-none" />
            </motion.button>

            {/* Info pills */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {pills.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-medium"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
