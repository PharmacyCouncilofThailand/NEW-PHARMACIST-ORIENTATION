"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type AnimationVariant = "fade-up" | "blur" | "scale" | "slide-left" | "slide-right";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: AnimationVariant;
  duration?: number;
}

// Shared IntersectionObserver — single instance for all ScrollReveal components
let sharedObserver: IntersectionObserver | null = null;
const observerCallbacks = new Map<Element, () => void>();

function getSharedObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const callback = observerCallbacks.get(entry.target);
            if (callback) {
              callback();
              observerCallbacks.delete(entry.target);
              sharedObserver?.unobserve(entry.target);
            }
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
  }
  return sharedObserver;
}

// Variant styles: [hidden, visible]
const variantStyles: Record<AnimationVariant, { hidden: string; visible: string }> = {
  "fade-up": {
    hidden: "opacity-0 translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  blur: {
    hidden: "opacity-0 translate-y-6 blur-[12px] scale-[0.96]",
    visible: "opacity-100 translate-y-0 blur-0 scale-100",
  },
  scale: {
    hidden: "opacity-0 scale-[0.9]",
    visible: "opacity-100 scale-100",
  },
  "slide-left": {
    hidden: "opacity-0 -translate-x-10",
    visible: "opacity-100 translate-x-0",
  },
  "slide-right": {
    hidden: "opacity-0 translate-x-10",
    visible: "opacity-100 translate-x-0",
  },
};

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
  variant = "fade-up",
  duration = 700,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const styles = variantStyles[variant];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = getSharedObserver();

    observerCallbacks.set(el, () => setVisible(true));
    observer.observe(el);

    return () => {
      observerCallbacks.delete(el);
      observer.unobserve(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${className} ${
        visible ? styles.visible : styles.hidden
      }`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}
