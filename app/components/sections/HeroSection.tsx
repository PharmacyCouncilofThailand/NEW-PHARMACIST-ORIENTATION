"use client";

import { useEffect, useRef, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CountdownSection from "./CountdownSection";
import { useStatsData, StatItem } from "./StatsSection";
import { useLang } from "../../contexts/LangContext";

const ArrowIcon = memo(function ArrowIcon() {
  return (
    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
});

export default function HeroSection() {
  const router = useRouter();
  const { t, lang } = useLang();
  const stats = useStatsData();
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll-based parallax for hero content
  useEffect(() => {
    let scrollTicking = false;
    const handleScroll = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          if (contentRef.current) {
            const scrollY = Math.max(0, window.scrollY);
            const opacity = Math.max(0, 1 - scrollY / 600);
            const translateY = scrollY * 0.3;
            const scale = Math.max(0.9, 1 - scrollY / 3000);
            contentRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
            contentRef.current.style.opacity = `${opacity}`;
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/test.mp4" type="video/mp4" />
      </video>

      {/* Subtle dark overlay for readability (Removed per user request) */}

      {/* CONTENT */}
      <div ref={contentRef} className="relative px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 short:pt-24 pb-8 w-full max-w-[1500px] flex flex-col xl:flex-row items-center justify-center min-h-screen gap-6 xl:gap-12 2xl:gap-24" style={{ zIndex: 2 }}>

        {/* Left Stats (xl+ screens) */}
        <div className="hidden xl:flex flex-col gap-5 w-[260px] shrink-0 hero-entrance-delay-3" style={{ zIndex: 10 }}>
          {stats.slice(0, 3).map((stat, i) => (
            <div key={`left-${i}`} className="animate-float hover:-translate-y-2 transition-transform duration-500" style={{ animationDelay: `${i * 0.3}s` }}>
              <StatItem {...stat} />
            </div>
          ))}
        </div>

        {/* Center Main Content */}
        <div className="flex flex-col items-center justify-center text-center w-full max-w-[760px] shrink-0" style={{ zIndex: 20 }}>
          {/* Logo */}
          <div className="flex justify-center mb-3 hero-entrance">
            <div className="w-28 h-28 short:w-20 short:h-20 flex items-center justify-center animate-float drop-shadow-2xl">
              <Image src="/logo สภาเภสัชกรรม.jpg" alt="Pharmacy Council" width={112} height={112} className="object-contain w-full h-full rounded-2xl" quality={100} />
            </div>
          </div>

          {/* Title */}
          <h1 suppressHydrationWarning style={{ letterSpacing: 'inherit' }} className={`font-black tracking-tighter mb-2 ${lang === "TH" ? "leading-[1.2]" : "leading-[0.85]"}`}>
            <span suppressHydrationWarning style={{ fontFamily: "var(--font-noto-thai), 'Noto Sans Thai', sans-serif" }} className="block text-[clamp(2rem,6.5vw,5.5rem)] bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 bg-clip-text text-transparent hero-entrance-delay-1 drop-shadow-sm">{t("hero.mainTitle1")}</span>
            <span suppressHydrationWarning style={{ fontFamily: "var(--font-noto-thai), 'Noto Sans Thai', sans-serif" }} className="block text-[clamp(2rem,6.5vw,5rem)] text-white hero-entrance-delay-2 drop-shadow-[0_4px_20px_rgba(0,0,0,0.2)]">{t("hero.mainTitle2")}</span>
          </h1>

          {/* Event Date & Venue badges */}
          <div className="flex flex-col items-center gap-2 mb-4 hero-entrance-delay-2">
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
          </div>

          {/* Subtitle */}
          <p suppressHydrationWarning className="text-[clamp(1rem,2.5vw,1.2rem)] text-slate-700 max-w-2xl mx-auto mb-8 leading-relaxed font-semibold hero-entrance-delay-3 drop-shadow-sm bg-white/40 md:bg-transparent px-4 py-2 rounded-2xl md:p-0 backdrop-blur-sm md:backdrop-blur-none border border-white/50 md:border-transparent">
            {t("hero.subtitle1")} <span suppressHydrationWarning className="text-pink-600 font-bold">{t("hero.future")}</span> {t("hero.subtitle2")}
            <br className="hidden md:block" />
            {t("hero.subtitle3")} <span suppressHydrationWarning className="text-violet-600 font-bold">{t("hero.journey")}</span> <span className="whitespace-nowrap">{t("hero.subtitle4")}</span>
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-20 hero-entrance-delay-4">
            <button
              id="hero-register-btn"
              onClick={() => router.push("/register")}
              className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(168,85,247,0.7)] overflow-hidden"
            >
              <span suppressHydrationWarning className="relative z-10 flex items-center gap-2">
                {t("hero.register")}
                <ArrowIcon />
              </span>
              <div className="absolute inset-0 animate-shimmer pointer-events-none" />
            </button>
          </div>

          {/* Countdown */}
          <div className="w-full flex justify-center relative z-20 hero-entrance-delay-4 mt-4 sm:mt-6 mb-4">
            <CountdownSection />
          </div>
        </div>

        {/* Right Stats (xl+ screens) */}
        <div className="hidden xl:flex flex-col gap-5 w-[260px] shrink-0 hero-entrance-delay-3" style={{ zIndex: 10 }}>
          {stats.slice(3, 6).map((stat, i) => (
            <div key={`right-${i}`} className="animate-float hover:-translate-y-2 transition-transform duration-500" style={{ animationDelay: `${(i + 3) * 0.3}s` }}>
              <StatItem {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
