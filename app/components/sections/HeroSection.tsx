"use client";

import { useEffect, useRef, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CountdownSection from "./CountdownSection";

import { useLang } from "../../contexts/LangContext";
import { useAuth } from "../../contexts/AuthContext";

// SVG arrow icon extracted as constant to avoid re-creation
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
  const { isLoggedIn } = useAuth();
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 20;
          const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
          if (orb1Ref.current) orb1Ref.current.style.transform = `translate3d(${x * -2}px, ${y * -2}px, 0)`;
          if (orb2Ref.current) orb2Ref.current.style.transform = `translate3d(${x * 2}px, ${y * 2}px, 0)`;
          if (orb3Ref.current) orb3Ref.current.style.transform = `translate3d(${x * 1.5}px, ${y * -1.5}px, 0)`;
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll-based parallax for hero content (Apple-style)
  useEffect(() => {
    let scrollTicking = false;

    const handleScroll = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          if (contentRef.current) {
            const scrollY = window.scrollY;
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
    <section
      id="hero"
      className="relative min-h-[110vh] flex items-center justify-center overflow-hidden"
    >
      {/* LAYER 1: AURORA */}
      <div className="absolute inset-0 aurora-bg opacity-40 pointer-events-none" />

      {/* LAYER 2: PERSPECTIVE GRID */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124, 58, 237, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          transform: "perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)",
          maskImage: "linear-gradient(to bottom, transparent 0%, white 40%, white 80%, transparent 100%)",
        }}
      />

      {/* LAYER 3: FLOATING ORBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          ref={orb1Ref}
          className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-violet-400/20 blur-[120px] rounded-full animate-float will-change-transform"
        />
        <div
          ref={orb2Ref}
          className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-blue-400/20 blur-[120px] rounded-full animate-float will-change-transform"
          style={{ animationDelay: "-3s" }}
        />
        <div
          ref={orb3Ref}
          className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] bg-pink-300/10 blur-[100px] rounded-full animate-float-slow will-change-transform"
          style={{ animationDelay: "-5s" }}
        />
      </div>

      {/* LAYER 4: CONTENT — with scroll parallax + entrance animations */}
      <div ref={contentRef} className="relative z-10 text-center px-6 pt-[80px] w-full max-w-[1400px] will-change-transform">

        {/* Logo — entrance animation */}
        <div className="flex justify-center mb-8 hero-entrance">
          <div className="w-24 h-24 flex items-center justify-center animate-float">
            <Image src="/logo สภาเภสัชกรรม.jpg" alt="Pharmacy Council" width={96} height={96} className="object-contain w-full h-full" quality={100} />
          </div>
        </div>

        {/* Title — staggered entrance */}
        <h1 className={`font-black tracking-tighter mb-6 ${lang === "TH" ? "leading-[1.2]" : "leading-[0.85]"}`}>
          <span className="block text-[clamp(2.5rem,8vw,7rem)] gradient-text-anim hero-entrance-delay-1">{t("hero.mainTitle1")}</span>
          <span className="block text-[clamp(2.5rem,8vw,6.5rem)] text-slate-800 dark:text-white hero-entrance-delay-2">{t("hero.mainTitle2")}</span>
        </h1>

        {/* Decorative — entrance delay */}
        <div className="flex items-center justify-center gap-4 mb-8 hero-entrance-delay-3">
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-violet-400 rounded-full" />
          <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-blue-400 rounded-full" />
        </div>

        {/* Subtitle — entrance delay */}
        <p className="text-[clamp(1rem,2.5vw,1.3rem)] text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed font-light hero-entrance-delay-3">
          {t("hero.subtitle1")} <span className="text-violet-600 dark:text-violet-400 font-semibold">{t("hero.future")}</span> {t("hero.subtitle2")}
          <br className="hidden md:block" />
          {t("hero.subtitle3")} <span className="text-blue-600 dark:text-blue-400 font-semibold">{t("hero.journey")}</span> {t("hero.subtitle4")}
        </p>

        {/* CTA — entrance delay */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center relative z-20 hero-entrance-delay-4">
          <button
            onClick={() => router.push("/register")}
            className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(124,58,237,0.5)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("hero.register")}
              <ArrowIcon />
            </span>
            <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          </button>

          {isLoggedIn && (
            <button
              onClick={() => router.push("/scroll")}
              className="px-8 py-4 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-lg hover:bg-white dark:hover:bg-slate-800 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-200 dark:hover:border-violet-900 transition-all duration-300 shadow-sm"
            >
              {t("hero.explore")}
            </button>
          )}
        </div>

        {/* Embedded Countdown */}
        <div className="w-full flex justify-center relative z-20 hero-entrance-delay-4 mt-8 sm:mt-12 mb-10">
           <CountdownSection />
        </div>
      </div>

    </section>
  );
}

