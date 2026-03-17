"use client";

import { useEffect, useRef, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CountdownSection from "./CountdownSection";
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
        style={{ zIndex: 0 }}
      >
        <source src="/bg5.mp4" type="video/mp4" />
      </video>

      {/* Subtle dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" style={{ zIndex: 1 }} />

      {/* CONTENT */}
      <div ref={contentRef} className="relative text-center px-4 sm:px-6 pt-28 md:pt-36 pb-8 w-full max-w-[1400px] will-change-transform flex flex-col items-center justify-center min-h-screen" style={{ zIndex: 2 }}>

        {/* Logo */}
        <div className="flex justify-center mb-3 hero-entrance">
          <div className="w-28 h-28 flex items-center justify-center animate-float drop-shadow-2xl">
            <Image src="/logo สภาเภสัชกรรม.jpg" alt="Pharmacy Council" width={112} height={112} className="object-contain w-full h-full rounded-2xl" quality={100} />
          </div>
        </div>

        {/* Title */}
        <h1 suppressHydrationWarning className={`font-black tracking-tighter mb-2 ${lang === "TH" ? "leading-[1.2]" : "leading-[0.85]"}`}>
          <span suppressHydrationWarning className="block text-[clamp(2rem,6.5vw,5.5rem)] bg-gradient-to-r from-pink-400 via-violet-300 to-blue-400 bg-clip-text text-transparent hero-entrance-delay-1 drop-shadow-lg">{t("hero.mainTitle1")}</span>
          <span suppressHydrationWarning className="block text-[clamp(2rem,6.5vw,5rem)] text-white hero-entrance-delay-2 drop-shadow-lg">{t("hero.mainTitle2")}</span>
        </h1>

        {/* Year badge */}
        <div className="flex justify-center mb-4 hero-entrance-delay-2">
          <span suppressHydrationWarning className="px-5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-semibold tracking-wider backdrop-blur-sm">
            {t("hero.year")}
          </span>
        </div>

        {/* Subtitle */}
        <p suppressHydrationWarning className="text-[clamp(1rem,2.5vw,1.2rem)] text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed font-light hero-entrance-delay-3">
          {t("hero.subtitle1")} <span suppressHydrationWarning className="text-pink-300 font-semibold">{t("hero.future")}</span> {t("hero.subtitle2")}
          <br className="hidden md:block" />
          {t("hero.subtitle3")} <span suppressHydrationWarning className="text-violet-300 font-semibold">{t("hero.journey")}</span> {t("hero.subtitle4")}
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
    </section>
  );
}
