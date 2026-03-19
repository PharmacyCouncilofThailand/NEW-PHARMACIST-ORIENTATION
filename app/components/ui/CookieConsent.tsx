"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "../../contexts/LangContext";

export default function CookieConsent() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show after 1.5s delay
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({ essential: true, analytics: true, ts: Date.now() }));
    setVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: Date.now() }));
    setVisible(false);
  };

  const savePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({ essential: true, analytics: analyticsEnabled, ts: Date.now() }));
    setVisible(false);
  };

  if (!visible) return null;

  const isEN = lang === "EN";

  return (
    <>
      {/* Backdrop blur overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[998] pointer-events-none" />

      {/* Cookie banner */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[999] p-4 sm:p-6"
        style={{ animation: "slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        <div className="max-w-4xl mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
          
          {/* Top gradient line */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-pink-500 to-blue-500" />

          <div className="p-5 sm:p-7">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center shrink-0 mt-0.5 p-1 border border-violet-100 dark:border-violet-800">
                <Image src="/logo สภาเภสัชกรรม.jpg" alt="Pharmacy Council Logo" width={40} height={40} className="object-contain" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isEN ? "We use cookies" : "เราใช้คุกกี้"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {isEN
                    ? "We use cookies to improve your experience on our website. Essential cookies are required for the site to function. You can choose to accept or decline analytics cookies."
                    : "เราใช้คุกกี้เพื่อพัฒนาประสบการณ์การใช้งานของคุณ คุกกี้ที่จำเป็นต้องใช้สำหรับการทำงานของเว็บไซต์ คุณสามารถเลือกยอมรับหรือปฏิเสธคุกกี้เพื่อการวิเคราะห์ได้"}
                </p>
              </div>
            </div>

            {/* Details toggle */}
            {showDetails && (
              <div className="mb-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
                {/* Essential */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {isEN ? "Essential Cookies" : "คุกกี้ที่จำเป็น"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {isEN ? "Required for site functionality. Cannot be disabled." : "จำเป็นสำหรับการทำงานของเว็บไซต์ ไม่สามารถปิดได้"}
                    </p>
                  </div>
                  <div className="w-11 h-6 bg-violet-500 rounded-full relative cursor-not-allowed opacity-70">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {isEN ? "Analytics Cookies" : "คุกกี้เพื่อการวิเคราะห์"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {isEN ? "Help us understand how visitors use the site." : "ช่วยให้เราเข้าใจวิธีที่ผู้เยี่ยมชมใช้เว็บไซต์"}
                    </p>
                  </div>
                  <button
                    onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                    className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${analyticsEnabled ? "bg-violet-500" : "bg-slate-300 dark:bg-slate-600"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${analyticsEnabled ? "right-1" : "left-1"}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={acceptAll}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-bold hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
              >
                {isEN ? "Accept All" : "ยอมรับทั้งหมด"}
              </button>

              {showDetails ? (
                <button
                  onClick={savePreferences}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
                >
                  {isEN ? "Save Preferences" : "บันทึกการตั้งค่า"}
                </button>
              ) : (
                <button
                  onClick={acceptEssential}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
                >
                  {isEN ? "Essential Only" : "เฉพาะที่จำเป็น"}
                </button>
              )}

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-violet-500 dark:text-violet-400 font-semibold hover:underline ml-auto"
              >
                {showDetails
                  ? (isEN ? "Hide details ↑" : "ซ่อนรายละเอียด ↑")
                  : (isEN ? "Manage preferences ↓" : "จัดการการตั้งค่า ↓")}
              </button>
            </div>

            {/* Policy link */}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
              {isEN ? "Learn more in our " : "อ่านข้อมูลเพิ่มเติมใน "}
              <Link href="/privacy-policy" className="underline hover:text-violet-500 transition-colors">
                {isEN ? "Privacy Policy" : "นโยบายความเป็นส่วนตัว"}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(2rem); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
