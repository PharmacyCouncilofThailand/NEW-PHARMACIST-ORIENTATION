"use client";

import { useAuth } from "../contexts/AuthContext";
import { useLang } from "../contexts/LangContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function MyTicketPage() {
  const { user, isLoggedIn } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    // Small delay to allow auth state to resolve initially
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        router.push("/login?redirect=/my-ticket");
      } else {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [isLoggedIn, router]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-600/30 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-slate-600 dark:text-slate-400 font-medium animate-pulse">
            {t("ticket.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return null; // Will redirect via useEffect
  }

  // Generate a pseudo-QR code or placeholder data for demonstration
  return (
    <div className="min-h-[100dvh] w-full overflow-y-auto flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 pt-24 pb-12 md:pt-16 md:pb-0">
      <div className="w-full max-w-2xl px-4 md:px-8">
        <div className="mb-4 text-center animate-fade-in-up md:mt-0 mt-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            {t("ticket.title")}
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
            {t("ticket.subtitle")}
          </p>
        </div>

        {/* Ticket Card */}
        <div className="relative group perspective-1000 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl shadow-violet-900/10 dark:shadow-black/50 border border-slate-200 dark:border-slate-800 transition-transform duration-500 hover:rotate-x-1 hover:rotate-y-1">
            
            {/* Header / Brand Area */}
            <div className="relative h-28 bg-gradient-to-br from-violet-600 via-violet-700 to-blue-800 p-5 flex items-start justify-between overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl mix-blend-overlay"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white leading-tight uppercase tracking-tight">
                    {t("hero.mainTitle1")} {t("hero.mainTitle2")}
                  </h2>
                  <p className="text-violet-200 text-xs md:text-sm mt-0.5 font-medium">{t("ticket.eventName")}</p>
                </div>
                
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold w-fit mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  {t("ticket.confirmed")}
                </div>
              </div>

              <div className="relative z-10 bg-white/95 p-1.5 rounded-2xl shadow-lg shrink-0 w-12 h-12 flex items-center justify-center">
                 <Image src="/logo สภาเภสัชกรรม.jpg" alt="Logo" width={40} height={40} className="rounded-xl" />
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-5 md:p-6 bg-white dark:bg-slate-900 relative">
              {/* Perforated lines simulation */}
              <div className="absolute left-0 top-0 w-full h-0 border-t-2 border-dashed border-slate-200 dark:border-slate-800"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Details */}
                <div className="md:col-span-2 flex flex-col gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-0.5 uppercase">
                      {user.name || t("ticket.attendee")}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {user.email}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">{t("nav.licenseId")}</p>
                      <p className="font-mono text-sm font-bold text-slate-800 dark:text-white">
                        {user.licenseId || t("ticket.notProvided")}
                      </p>
                    </div>
                    
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">{t("ticket.passType")}</p>
                      <p className="font-bold text-violet-600 dark:text-violet-400">
                        {t("ticket.generalAccess")}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">{t("ticket.date")}</p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {t("ticket.eventDate")}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">{t("ticket.time")}</p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {t("ticket.eventTime")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* QR Code Area */}
                <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                  <div className="w-32 h-32 md:w-36 md:h-36 bg-white p-2 rounded-2xl border-4 border-slate-100 dark:border-slate-800 shadow-sm relative group-hover:scale-105 transition-transform duration-500">
                     {/* Mock QR image */}
                    <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                       <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-contain bg-center bg-no-repeat invert" />
                       <div className="absolute inset-0 bg-gradient-to-t from-violet-600/30 to-blue-500/30" />
                       <span className="relative z-10 text-[8px] md:text-[10px] text-white/50 tracking-widest uppercase font-mono mt-8">{t("ticket.scanMe")}</span>
                    </div>
                  </div>
                  
                  <p className="font-mono text-xs text-slate-400 dark:text-slate-500 mt-4 tracking-widest">
                    {t("ticket.id")} {user.id ? String(user.id).substring(0, 8).toUpperCase() : "TKT-" + Math.floor(Math.random() * 90000 + 10000)}
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Footer */}
            <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-3 flex items-center justify-between text-[11px] md:text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t("ticket.moph")}
              </span>
              <span>{t("ticket.valid")}</span>
            </div>
            
             {/* Left/Right Cutouts */}
             <div className="absolute top-28 -left-4 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-20"></div>
             <div className="absolute top-28 -right-4 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 z-20"></div>

          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-center gap-3 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
           <button className="px-5 py-2.5 text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t("ticket.download")}
           </button>
           <button 
             onClick={() => router.push("/")}
             className="px-5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 text-slate-700 dark:text-slate-200 font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2"
           >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
             {t("live.back")}
           </button>
        </div>

      </div>
    </div>
  );
}
