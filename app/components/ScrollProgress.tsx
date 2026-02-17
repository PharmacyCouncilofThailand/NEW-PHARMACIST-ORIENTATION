"use client";

import { useEffect, useRef, useCallback } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  const updateProgress = useCallback(() => {
    if (!barRef.current) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    barRef.current.style.width = `${progress}%`;
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateProgress]);

  return <div ref={barRef} className="scroll-progress" style={{ width: "0%" }} />;
}
