"use client";

import { useRef, useCallback, MouseEvent } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  border?: string;
  glow?: string;
  className?: string;
}

export default function SpotlightCard({
  children,
  border = "rgba(124, 58, 237, 0.3)",
  glow = "rgba(124, 58, 237, 0.06)",
  className = "",
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${glow}, transparent 40%)`;
    }
    if (borderRef.current) {
      borderRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${border}, transparent 40%)`;
    }
  }, [glow, border]);

  const handleMouseEnter = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = "1";
    if (borderRef.current) borderRef.current.style.opacity = "1";
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
    if (borderRef.current) borderRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
      <div
        ref={borderRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: 0,
          maskImage: "linear-gradient(#fff, #fff), linear-gradient(#fff, #fff)",
          maskComposite: "exclude",
          padding: "1px",
          WebkitMaskComposite: "xor",
          borderRadius: "inherit",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
