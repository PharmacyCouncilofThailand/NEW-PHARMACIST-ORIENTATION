"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "../../contexts/ThemeContext";
import { useLang } from "../../contexts/LangContext";
import { useAuth } from "../../contexts/AuthContext";

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



export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const { user, isLoggedIn, logout } = useAuth();

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
        <div className="w-full overflow-hidden transition-all duration-500 ease-in-out cursor-pointer z-50 max-h-12 opacity-100 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800" 
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

              </div>
            ))}
          </div>
        </div>

        {/* Main Navbar */}
        <nav className={`w-full transition-all duration-500 px-6 bg-white dark:bg-slate-900 shadow-sm ${scrolled ? "py-2" : "py-4"}`}>
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            
            {/* Logo */}
            <button 
              onClick={() => handleAnchorClick("#hero")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Image 
                src="/logo สภาเภสัชกรรม.jpg" 
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

              {isLoggedIn ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors hover:bg-slate-200 dark:hover:bg-white/20">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold uppercase">
                      {user?.name?.[0] ?? user?.email?.[0] ?? "U"}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                      {user?.name ?? user?.email}
                    </span>
                    <svg className="w-3 h-3 text-slate-400 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Panel */}
                  <div className="absolute right-0 top-full mt-2 w-60 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl shadow-black/10 dark:shadow-black/40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right scale-95 group-hover:scale-100 p-1.5 z-50">
                    {/* User Info Header */}
                    <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700 mb-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>

                    {/* License ID */}
                    <div className="px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 flex items-center justify-between gap-2">
                      <span className="shrink-0">{t("nav.license")}</span>
                      <span className="text-xs font-mono bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                        {user?.licenseId || "—"}
                      </span>
                    </div>

                    {/* University */}
                    <div className="px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      <span className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                        {user?.university || "—"}
                      </span>
                    </div>

                    {/* Phone */}
                    <div className="px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 flex items-center justify-between">
                      <span>{t("nav.phone")}</span>
                      <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                        {user?.phone || "—"}
                      </span>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />

                    {/* Logout */}
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t("nav.signOut")}
                    </button>
                  </div>
                </div>
              ) : (
                /* Guest state */
                <>
                  <Link
                    href="/login"
                    className="px-5 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                  >
                    {t("nav.signIn")}
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  >
                    {t("nav.signUp")}
                  </Link>
                </>
              )}
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
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 w-full justify-center">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                  {user?.name?.[0] ?? user?.email?.[0] ?? "U"}
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {user?.name ?? user?.email}
                </span>
              </div>
              <button
                onClick={() => { closeMenu(); logout(); }}
                className="w-full py-3 rounded-xl text-center text-sm font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                {t("nav.signOut")}
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </>
  );
}
