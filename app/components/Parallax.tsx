"use client";

import { useEffect, useRef, ReactNode, useCallback } from "react";

interface ParallaxProps {
  children: ReactNode;
  speed?: number; // 0.1 = subtle, 0.5 = strong
  className?: string;
}

/**
 * Apple-style parallax — children move at a different scroll speed.
 * speed > 0 = moves slower (stays behind), speed < 0 = moves faster.
 */
export default function Parallax({
  children,
  speed = 0.15,
  className = "",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const scrollProgress = rect.top / window.innerHeight;
    const offset = scrollProgress * speed * 100;
    ref.current.style.transform = `translate3d(0, ${offset}px, 0)`;
  }, [speed]);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
