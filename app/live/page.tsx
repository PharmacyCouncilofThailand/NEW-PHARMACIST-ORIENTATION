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
          
           {/* Mock Video Player Placeholder */}
          <div className="w-full max-w-[1200px] mx-auto aspect-video relative group rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10 pointer-events-none transition-opacity duration-300 opacity-100 group-hover:opacity-100" />
              
              {/* Background gradient simulating a stream */}
              <div className="absolute inset-0 bg-slate-900 overflow-hidden flex items-center justify-center">
                 <div className="absolute w-[150%] h-[150%] -top-[25%] -left-[25%] opacity-30 animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#4c1d95_25%,#000000_50%,#1e3a8a_75%,#000000_100%)] blur-[100px]" />
                 
                 <div className="z-10 text-center px-4 animate-fade-in-up flex flex-col items-center">
                    <div className="relative w-32 h-40 md:w-36 md:h-44 mb-8 sm:mb-10">
                       <Image 
                          src="/logo สภาเภสัชกรรม.jpg" 
                          alt="Logo" 
                          fill 
                          className="object-contain drop-shadow-2xl" 
                       />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-3 mt-4">{t("live.startingSoon")}</h2>
                    <p className="text-slate-400 font-medium text-lg">{t("live.datetime")}</p>
                 </div>
              </div>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 z-20 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-1 bg-white/20 rounded-full cursor-pointer overflow-hidden group/seek relative">
                      <div className="h-full bg-rose-500 w-1/3"></div>
                      <div className="absolute top-0 bottom-0 left-1/3 w-3 h-3 -mt-1 bg-white rounded-full opacity-0 group-hover/seek:opacity-100 transform -translate-x-1.5 transition-opacity" />
                  </div>
                  
                  <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-4 lg:gap-6">
                         <button className="hover:text-rose-400 transition-colors">
                            <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                         </button>
                         <div className="flex items-center gap-2 group/vol">
                             <button className="hover:text-slate-300 transition-colors">
                                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                             </button>
                             <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300">
                                <div className="w-20 h-1 bg-white/20 rounded-full ml-2">
                                   <div className="w-2/3 h-full bg-white rounded-full"></div>
                                </div>
                             </div>
                         </div>
                         <span className="text-sm font-mono tracking-wider opacity-80 hidden sm:block">01:24:19 <span className="text-rose-500">• LIVE</span></span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                         <button className="hover:text-slate-300 transition-colors">
                            <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                         </button>
                         <button className="hover:text-slate-300 transition-colors">
                            <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                         </button>
                      </div>
                  </div>
              </div>
          </div>
        </div>


      </div>
    </div>
  );
}
