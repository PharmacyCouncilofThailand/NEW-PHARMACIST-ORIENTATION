"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);

  useEffect(() => {
    // Check if touch device — skip cursor on mobile
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    // Optimized: Cache interactive check using a WeakSet so we don't
    // re-query the DOM for the same element repeatedly.
    const interactiveCache = new WeakSet<Element>();
    const nonInteractiveCache = new WeakSet<Element>();

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      let hovering: boolean;
      if (interactiveCache.has(target)) {
        hovering = true;
      } else if (nonInteractiveCache.has(target)) {
        hovering = false;
      } else {
        const interactive =
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button" ||
          target.classList.contains("cursor-pointer");

        hovering = !!interactive;

        // Cache the result
        if (hovering) {
          interactiveCache.add(target);
        } else {
          nonInteractiveCache.add(target);
        }
      }

      if (isHovering.current !== hovering) {
        isHovering.current = hovering;
        if (ringRef.current) {
          const size = hovering ? 48 : 32;
          ringRef.current.style.width = `${size}px`;
          ringRef.current.style.height = `${size}px`;
          ringRef.current.style.marginTop = `${-size / 2}px`;
          ringRef.current.style.marginLeft = `${-size / 2}px`;
          ringRef.current.style.background = hovering ? "rgba(124,58,237,0.08)" : "transparent";
          ringRef.current.style.borderColor = hovering ? "rgba(124,58,237,0.3)" : "rgba(124,58,237,0.4)";
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });

    let rafId: number;

    const loop = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-violet-600 rounded-full pointer-events-none z-[9999] will-change-transform hidden md:block"
        style={{ marginTop: -4, marginLeft: -4 }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border border-violet-500/40 rounded-full pointer-events-none z-[9998] will-change-transform hidden md:block"
        style={{
          marginTop: -16,
          marginLeft: -16,
          transition: "width 0.3s, height 0.3s, margin 0.3s, background 0.3s, border-color 0.3s",
        }}
      />
    </>
  );
}
