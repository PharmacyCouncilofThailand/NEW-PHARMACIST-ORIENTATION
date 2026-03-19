"use client";

import { useLang } from "../../contexts/LangContext";

export default function FloatingLangToggle() {
  const { lang, toggleLang } = useLang();

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[900]">
      <button
        onClick={toggleLang}
        className="relative w-[72px] h-9 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-white/10 p-0.5 transition-colors hover:bg-white dark:hover:bg-slate-800 shadow-sm"
        title="Switch language"
      >
        <div
          className={`absolute top-0.5 w-[34px] h-8 rounded-full bg-white dark:bg-slate-700 shadow-md transition-all duration-300 ${
            lang === "EN" ? "left-[34px]" : "left-0.5"
          }`}
        />
        <div className="relative flex items-center h-full text-[11px] font-bold">
          <span
            className={`flex-1 text-center z-10 transition-colors ${
              lang === "TH" ? "text-violet-700 dark:text-violet-400" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            TH
          </span>
          <span
            className={`flex-1 text-center z-10 transition-colors ${
              lang === "EN" ? "text-violet-700 dark:text-violet-400" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            EN
          </span>
        </div>
      </button>
    </div>
  );
}
