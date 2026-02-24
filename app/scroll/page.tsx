"use client";

import PharmacyScrollSequence from "../components/scroll/PharmacyScrollSequence";
import Link from "next/link";

export default function ScrollPage() {
  return (
    <main className="relative min-h-screen bg-slate-950">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link 
          href="/"
          className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          กลับหน้าหลัก
        </Link>
      </div>
      
      <PharmacyScrollSequence />
    </main>
  );
}
