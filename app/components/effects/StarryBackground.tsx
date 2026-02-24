"use client";

import { useEffect, useRef } from "react";

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particleCount = Math.min(Math.floor(width / 18), 80);
    const particles = new Float64Array(particleCount * 5);

    for (let i = 0; i < particleCount; i++) {
      const base = i * 5;
      particles[base] = Math.random() * width;
      particles[base + 1] = Math.random() * height;
      particles[base + 2] = (Math.random() - 0.5) * 0.3;
      particles[base + 3] = (Math.random() - 0.5) * 0.3;
      particles[base + 4] = Math.random() * 2 + 0.5;
    }

    const CONNECTION_DIST = 120;
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;

    let animationId: number;
    let isVisible = true;

    // Use Page Visibility API to pause animation when tab is hidden
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        animationId = requestAnimationFrame(draw);
      }
    };

    const draw = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // Consistent violet-blue theme colors
      ctx.fillStyle = "rgba(124, 58, 237, 0.35)";
      ctx.strokeStyle = "rgba(37, 99, 235, 0.12)";

      for (let i = 0; i < particleCount; i++) {
        const base = i * 5;
        let x = particles[base];
        let y = particles[base + 1];

        x += particles[base + 2];
        y += particles[base + 3];

        if (x < 0 || x > width) particles[base + 2] *= -1;
        if (y < 0 || y > height) particles[base + 3] *= -1;

        particles[base] = x;
        particles[base + 1] = y;

        ctx.beginPath();
        ctx.arc(x, y, particles[base + 4], 0, Math.PI * 2);
        ctx.fill();

        // Only draw connections for nearby particles (spatial locality optimization)
        for (let j = i + 1; j < particleCount; j++) {
          const base2 = j * 5;
          const dx = x - particles[base2];
          // Early exit: if dx alone exceeds threshold, skip
          if (dx > CONNECTION_DIST || dx < -CONNECTION_DIST) continue;
          const dy = y - particles[base2 + 1];
          if (dy > CONNECTION_DIST || dy < -CONNECTION_DIST) continue;

          const distSq = dx * dx + dy * dy;

          if (distSq < CONNECTION_DIST_SQ) {
            const dist = Math.sqrt(distSq);
            ctx.lineWidth = 1 - dist / CONNECTION_DIST;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(particles[base2], particles[base2 + 1]);
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(draw);
    };

    // Debounced resize handler
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 200);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleResize, { passive: true });
    draw();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none opacity-50"
    />
  );
}
