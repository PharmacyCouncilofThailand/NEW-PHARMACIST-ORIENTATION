"use client";

import { useAuth } from "../contexts/AuthContext";
import { useLang } from "../contexts/LangContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FloatingLangToggle from "../components/ui/FloatingLangToggle";

export default function LiveStreamingPage() {
  const { user, isLoggedIn } = useAuth();
  const { t, lang } = useLang();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");

  // Redirect if not logged in
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        router.push("/login?redirect=/live");
      } else {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [isLoggedIn, router]);

  if (loading) {
     return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-slate-950 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white mb-2 animate-pulse">{t("live.connecting")}</h2>
            <p className="text-slate-400 text-sm">{t("live.secureConn")}</p>
        </div>
    );
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="min-h-[100dvh] lg:h-screen w-full bg-slate-950 pt-[72px] flex flex-col lg:overflow-hidden">
      <FloatingLangToggle />
      {/* Streaming Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-30 px-3 py-2 md:px-6 md:py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
           {/* Live Badge */}
           <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span className="text-rose-500 font-bold text-xs tracking-wider uppercase">{t("live.badge")}</span>
           </div>
           <div>
             <h1 className="text-white font-bold text-sm md:text-base hidden sm:block">
               {t("hero.mainTitle1")} {t("hero.mainTitle2")} 2026
             </h1>
             <p className="text-slate-400 text-xs hidden sm:block">{t("live.status")}</p>
           </div>
        </div>
        
        <Link 
          href="/"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700 hover:border-slate-600 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">{t("live.back")}</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col min-h-0 lg:overflow-hidden p-4 md:p-8 relative">
        
        {/* Main Video Area */}
        <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-center relative z-20">
          <div className="w-full max-w-[1200px] mx-auto aspect-video relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black">
            <iframe
              src="https://www.youtube.com/embed/xdnn21_E0Cs?autoplay=1&rel=0"
              title="Live Stream"
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>


      </div>
    </div>
  );
}
