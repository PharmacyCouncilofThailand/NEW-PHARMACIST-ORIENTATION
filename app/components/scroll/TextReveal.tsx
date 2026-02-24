"use client";

import { useEffect, useRef, useState, useMemo } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  staggerMs?: number;
}

// Shared IntersectionObserver for TextReveal components
let sharedTextObserver: IntersectionObserver | null = null;
const textObserverCallbacks = new Map<Element, () => void>();

function getSharedTextObserver(): IntersectionObserver {
  if (!sharedTextObserver) {
    sharedTextObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const callback = textObserverCallbacks.get(entry.target);
            if (callback) {
              callback();
              textObserverCallbacks.delete(entry.target);
              sharedTextObserver?.unobserve(entry.target);
            }
          }
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -60px 0px" }
    );
  }
  return sharedTextObserver;
}

/**
 * Apple-style word-by-word text reveal on scroll.
 * Each word fades in from blur with a stagger delay.
 */
export default function TextReveal({
  text,
  className = "",
  staggerMs = 80,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const words = useMemo(() => text.split(" "), [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = getSharedTextObserver();
    
    textObserverCallbacks.set(el, () => setVisible(true));
    observer.observe(el);

    return () => {
      textObserverCallbacks.delete(el);
      observer.unobserve(el);
    };
  }, []);

  return (
    <span ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="text-reveal-word"
          style={{
            transitionDelay: visible ? `${i * staggerMs}ms` : "0ms",
            opacity: visible ? 1 : 0,
            filter: visible ? "blur(0px)" : "blur(8px)",
            transform: visible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {word}{i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
