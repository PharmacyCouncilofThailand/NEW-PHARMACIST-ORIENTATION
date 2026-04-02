"use client";

import { useRef, memo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import CountdownSection from "./CountdownSection";
import { useStatsData, StatItem } from "./StatsSection";
import { useLang } from "../../contexts/LangContext";
import { useAuth } from "../../contexts/AuthContext";
import { ssoRedirectToConferenceWeb } from "../../../lib/sso";
import { useRegistrationStatus } from "../../hooks/useRegistrationStatus";

const ArrowIcon = memo(function ArrowIcon() {
  return (
    <motion.svg 
      className="w-5 h-5" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </motion.svg>
  );
});

// Framer motion variants for staggering children
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 15 }
  }
};

const EVENT_CODE = process.env.NEXT_PUBLIC_ORIENTATION_EVENT_CODE || "NPHA-2026";

export default function HeroSection() {
  const router = useRouter();
  const { t, lang } = useLang();
  const { isLoggedIn, token } = useAuth();
  const { isRegistered } = useRegistrationStatus();
  const stats = useStatsData();
  const sectionRef = useRef<HTMLElement>(null);

  const handleRegisterClick = useCallback(() => {
    if (!isLoggedIn || !token) {
      router.push("/login?from=/");
      return;
    }
    ssoRedirectToConferenceWeb(token, `/events/${EVENT_CODE}`);
  }, [isLoggedIn, token, router]);

  // Framer Motion hook to track scroll progress within this section for parallax effect
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityParallax = useTransform(scrollY, [0, 600], [1, 0]);
  const scaleParallax = useTransform(scrollY, [0, 1000], [1, 0.9]);

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/BGn.mp4" type="video/mp4" />
      </video>

      {/* CONTENT WITH FRAMER MOTION PARALLAX */}
      <motion.div 
        className="relative px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 short:pt-24 pb-8 w-full max-w-[1500px] flex flex-col xl:flex-row items-center justify-center min-h-screen gap-6 xl:gap-12 2xl:gap-24" 
        style={{ zIndex: 2, y: yParallax, opacity: opacityParallax, scale: scaleParallax }}
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >

        {/* Left Stats (xl+ screens) */}
        <div className="hidden xl:flex flex-col gap-5 w-[260px] shrink-0" style={{ zIndex: 10 }}>
          {stats.slice(0, 3).map((stat, i) => (
            <motion.div key={`left-${i}`} variants={fadeSlideUp} className="animate-float">
               <StatItem {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Center Main Content */}
        <div className="flex flex-col items-center justify-center text-center w-full max-w-[760px] shrink-0" style={{ zIndex: 20 }}>
          
          {/* Logo */}
          <motion.div variants={fadeSlideUp} className="flex justify-center mb-3">
            <div className="w-28 h-28 short:w-20 short:h-20 flex items-center justify-center drop-shadow-2xl">
              <Image src="/logo สภาเภสัชกรรม.jpg" alt="Pharmacy Council" width={112} height={112} className="object-contain w-full h-full rounded-2xl" quality={100} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 variants={fadeSlideUp} suppressHydrationWarning style={{ letterSpacing: 'inherit' }} className={`font-black tracking-tighter mb-2 ${lang === "TH" ? "leading-[1.2]" : "leading-[0.85]"}`}>
            <span suppressHydrationWarning style={{ fontFamily: "var(--font-noto-thai), 'Noto Sans Thai', sans-serif" }} className="block text-[clamp(2rem,6.5vw,5.5rem)] bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">{t("hero.mainTitle1")}</span>
            <span suppressHydrationWarning style={{ fontFamily: "var(--font-noto-thai), 'Noto Sans Thai', sans-serif" }} className="block text-[clamp(2rem,6.5vw,5rem)] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.2)]">{t("hero.mainTitle2")}</span>
          </motion.h1>

          {/* Event Date & Venue badges */}
          <motion.div variants={fadeSlideUp} className="flex flex-col items-center gap-2 mb-4">
            <span suppressHydrationWarning className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/60 border border-white/80 text-slate-700 text-sm font-bold tracking-wider backdrop-blur-md shadow-sm">
              <svg className="w-4 h-4 text-violet-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t("hero.eventDate")}
            </span>
            <span suppressHydrationWarning className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/60 border border-white/80 text-slate-700 text-sm font-bold tracking-wider backdrop-blur-md shadow-sm">
              <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t("hero.year")}
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p variants={fadeSlideUp} suppressHydrationWarning className="text-[clamp(1rem,2.5vw,1.2rem)] text-white max-w-2xl mx-auto mb-8 leading-relaxed font-semibold drop-shadow-md bg-black/40 md:bg-transparent px-4 py-2 rounded-2xl md:p-0 backdrop-blur-sm md:backdrop-blur-none border border-white/10 md:border-transparent">
            {t("hero.subtitle1")} <span suppressHydrationWarning className="text-pink-600 font-bold">{t("hero.future")}</span> {t("hero.subtitle2")}
            <br className="hidden md:block" />
            {t("hero.subtitle3")} <span suppressHydrationWarning className="text-violet-600 font-bold">{t("hero.journey")}</span> <span className="whitespace-nowrap">{t("hero.subtitle4")}</span>
          </motion.p>

          {/* CTA using Framer Motion specifically for hover per prompt requirements */}
          <motion.div variants={fadeSlideUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-20">
            {isRegistered ? (
              <motion.div
                className="px-10 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)]"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {t("hero.registered")}
                </span>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                id="hero-register-btn"
                onClick={handleRegisterClick}
                className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold text-lg shadow-[0_10px_40px_-10px_rgba(168,85,247,0.7)] overflow-hidden"
              >
                <span suppressHydrationWarning className="relative z-10 flex items-center gap-2">
                  {t("hero.register")}
                  <motion.div className="inline-block" initial={{ x: 0 }} whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <ArrowIcon />
                  </motion.div>
                </span>
                <div className="absolute inset-0 animate-shimmer pointer-events-none" />
              </motion.button>
            )}
          </motion.div>

          {/* Countdown */}
          <motion.div variants={fadeSlideUp} className="w-full flex justify-center relative z-20 mt-4 sm:mt-6 mb-4">
            <CountdownSection />
          </motion.div>
        </div>

        {/* Right Stats (xl+ screens) */}
        <div className="hidden xl:flex flex-col gap-5 w-[260px] shrink-0" style={{ zIndex: 10 }}>
          {stats.slice(3, 6).map((stat, i) => (
            <motion.div key={`right-${i}`} variants={fadeSlideUp} className="animate-float">
              <StatItem {...stat} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
