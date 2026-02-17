"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "../contexts/ThemeContext";
import { useLang } from "../contexts/LangContext";

const navLinks = [
  { href: "#hero", key: "nav.home" },
  { href: "#welcome", key: "nav.welcome" },
  { href: "#agenda", key: "nav.agenda" },
  { href: "#memories", key: "nav.gallery" },
] as const;

// Extract section IDs once (never changes)
const sectionIds = navLinks.map(link => link.href.substring(1));

// Memoized SVG icons to avoid re-rendering
const SunIcon = memo(function SunIcon() {
  return (
    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
    </svg>
  );
});

const MoonIcon = memo(function MoonIcon() {
  return (
    <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  );
});

const ArrowIcon = memo(function ArrowIcon() {
  return (
    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
});

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const { lang, toggleLang, t } = useLang();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          
          let current = "hero";
          for (const id of sectionIds) {
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 200 && rect.bottom >= 200) {
                current = id;
                break;
              }
            }
          }
          setActiveSection(current);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAnchorClick = useCallback((href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);

  return (
    <>
      {/* Fixed Header Container */}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-500">
        
        {/* Ad / Announcement Banner */}
        <div className="w-full overflow-hidden transition-all duration-500 ease-in-out cursor-pointer z-50 max-h-12 opacity-100 bg-transparent hover:bg-white/10 dark:hover:bg-white/5" 
          onClick={() => handleAnchorClick("#agenda")}
        >
          <div className="animate-marquee-left flex items-center gap-[50vw] py-2.5 px-4 whitespace-nowrap">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-4 shrink-0">
                <span className="flex items-center justify-center h-5 px-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-[10px] font-bold text-white tracking-wider uppercase shadow-md shadow-violet-200 dark:shadow-violet-900/50">
                  {t("banner.new")}
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 tracking-wide">
                  {t("banner.text")} <span className="text-violet-700 dark:text-violet-400 font-bold">{t("banner.event")}</span> {t("banner.open")}
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group">
                  {t("banner.earlyBird")}
                  <ArrowIcon />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Navbar */}
        <nav className={`w-full transition-all duration-500 px-6 bg-transparent ${scrolled ? "py-2" : "py-4"}`}>
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            
            {/* Logo */}
            <button 
              onClick={() => handleAnchorClick("#hero")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Image 
                src="/logo.jpg" 
                alt="Logo" 
                width={48} 
                height={48} 
                className="rounded-full object-cover"
                quality={100}
              />
              <span className="font-bold text-xl tracking-tight hidden sm:block bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                {t("nav.brand")}
              </span>
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                
                return (
                  <button
                    key={link.href}
                    onClick={() => handleAnchorClick(link.href)}
                    className={`
                      px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                      ${isActive 
                        ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/30" 
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                      }
                    `}
                  >
                    {t(link.key)}
                  </button>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-2">

              {/* Language Toggle */}
              <button
                onClick={toggleLang}
                className="relative w-[72px] h-9 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 p-0.5 transition-colors hover:bg-slate-200 dark:hover:bg-white/15"
                title="Switch language"
              >
                <div
                  className={`absolute top-0.5 w-[34px] h-8 rounded-full bg-white dark:bg-slate-700 shadow-md transition-all duration-300 ${
                    lang === "EN" ? "left-[34px]" : "left-0.5"
                  }`}
                />
                <div className="relative flex items-center h-full text-[11px] font-bold">
                  <span className={`flex-1 text-center z-10 transition-colors ${lang === "TH" ? "text-violet-700 dark:text-violet-400" : "text-slate-400 dark:text-slate-500"}`}>TH</span>
                  <span className={`flex-1 text-center z-10 transition-colors ${lang === "EN" ? "text-violet-700 dark:text-violet-400" : "text-slate-400 dark:text-slate-500"}`}>EN</span>
                </div>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all hover:bg-slate-200 dark:hover:bg-white/15 hover:scale-110"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

              {/* Sign In */}
              <Link
                href="/login"
                className="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
              >
                {t("nav.signIn")}
              </Link>

              {/* Sign Up */}
              <Link
                href="/register"
                className="px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                {t("nav.signUp")}
              </Link>
            </div>

            {/* Mobile Toggle */}
            <div className="flex md:hidden items-center gap-2">
              {/* Mobile Language */}
              <button
                onClick={toggleLang}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[11px] font-bold text-violet-600 dark:text-violet-400 transition-all"
              >
                {lang}
              </button>

              {/* Mobile Dark Mode */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center transition-all"
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>

              {/* Hamburger */}
              <button
                className={`p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors ${menuOpen ? "bg-slate-100 dark:bg-white/10 ring-2 ring-violet-100" : ""}`}
                onClick={toggleMenu}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="12" x2="20" y2="12" className={menuOpen ? "opacity-0" : ""} />
                  <line x1="4" y1="6" x2="20" y2="6" className={menuOpen ? "rotate-45 translate-y-[6px] origin-center" : ""} />
                  <line x1="4" y1="18" x2="20" y2="18" className={menuOpen ? "-rotate-45 -translate-y-[6px] origin-center" : ""} />
                </svg>
              </button>
            </div>
          </div>
        </nav>

      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl transition-all duration-500 flex flex-col items-center justify-center gap-8
          ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
        `}
      >
        <div className="flex flex-col items-center gap-6">
          {navLinks.map((link, i) => (
            <button
              key={link.href}
              onClick={() => handleAnchorClick(link.href)}
              className={`text-3xl font-bold text-slate-800 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-300 transform
                ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
              `}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {t(link.key)}
            </button>
          ))}
        </div>

        {/* Mobile Auth Buttons */}
        <div 
          className={`flex flex-col items-center gap-3 w-64 transition-all duration-300 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          style={{ transitionDelay: `${navLinks.length * 100}ms` }}
        >
          <Link
            href="/login"
            onClick={closeMenu}
            className="w-full py-3 rounded-xl text-center text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
          >
            {t("nav.signIn")}
          </Link>
          <Link
            href="/register"
            onClick={closeMenu}
            className="w-full py-3 rounded-xl text-center text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/25 transition-all"
          >
            {t("nav.signUp")}
          </Link>
        </div>
      </div>
    </>
  );
}
