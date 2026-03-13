"use client";

import { useRef, useEffect, useCallback, ReactNode } from "react";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useImageSequence } from "../../hooks/useImageSequence";
import { useLenis } from "../ui/SmoothScroll";
import { useLang } from "../../contexts/LangContext";

/* ===========================
   Configuration
   =========================== */
const TOTAL_FRAMES = 76;
const FRAME_PREFIX = "/frames/ezgif-frame-";
const FRAME_EXTENSION = ".jpg";

/* ===========================
   Text Overlay — sticky layer
   =========================== */
interface TextOverlayProps {
  children: ReactNode;
  opacity: MotionValue<number>;
  align?: "center" | "left" | "right";
}

function TextOverlay({ children, opacity, align = "center" }: TextOverlayProps) {
  const alignClass =
    align === "left"
      ? "items-start text-left pl-[8%] md:pl-[14%]"
      : align === "right"
      ? "items-end text-right pr-[8%] md:pr-[14%]"
      : "items-center text-center";

  return (
    <motion.div
      style={{ opacity }}
      className={`absolute inset-0 flex flex-col justify-center ${alignClass} pointer-events-none`}
    >
      {children}
    </motion.div>
  );
}

/* ===========================
   Badge
   =========================== */
function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block mb-3 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] font-bold tracking-[0.25em] uppercase text-white/60">
      {children}
    </span>
  );
}

/* ===========================
   Main Component
   =========================== */
export default function PharmacyScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const hasAutoScrolled = useRef(false);
  const { t } = useLang();

  const { images, isLoading, loadProgress } = useImageSequence({
    totalFrames: TOTAL_FRAMES,
    framePrefix: FRAME_PREFIX,
    frameExtension: FRAME_EXTENSION,
  });

  const lenis = useLenis();

  /* ----- Scroll tracking ----- */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* ----- Text overlay opacities (spread evenly across 0→1) ----- */
  // Intro:    0%  → fade in 0–10%, hold 10–20%, fade out 20–28%
  const introOpacity   = useTransform(scrollYProgress, [0, 0.08, 0.20, 0.28], [0, 1, 1, 0]);
  // Career 1: 28% → fade in 28–38%, hold 38–50%, fade out 50–58%
  const career1Opacity = useTransform(scrollYProgress, [0.28, 0.38, 0.50, 0.58], [0, 1, 1, 0]);
  // Career 2: 58% → fade in 58–68%, hold 68–78%, fade out 78–86%
  const career2Opacity = useTransform(scrollYProgress, [0.58, 0.68, 0.78, 0.86], [0, 1, 1, 0]);
  // CTA:      86% → fade in 86–93%, hold 93–100%
  const ctaOpacity     = useTransform(scrollYProgress, [0.86, 0.93, 1.0], [0, 1, 1]);

  /* ----- Draw frame to canvas ----- */
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = images[frameIndex];
    if (!canvas || !ctx || !img) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width * dpr;
    const h = rect.height * dpr;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.clearRect(0, 0, w, h);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = w / h;
    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgAspect > canvasAspect) {
      drawH = h; drawW = h * imgAspect;
      drawX = (w - drawW) / 2; drawY = 0;
    } else {
      drawW = w; drawH = w / imgAspect;
      drawX = 0; drawY = (h - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, [images]);

  /* ----- Draw first frame on load ----- */
  useEffect(() => {
    if (!isLoading && images.length > 0) {
      requestAnimationFrame(() => drawFrame(0));
    }
  }, [isLoading, images, drawFrame]);

  /* ----- Scroll → Frame sync ----- */
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v: number) => {
      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(v * TOTAL_FRAMES));
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, drawFrame]);

  /* ----- Auto-scroll to #welcome on completion ----- */
  /* ----- Auto-scroll to #welcome on completion ----- */
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest: number) => {
      // Trigger when near the end (0.95) to ensure it catches easily
      if (latest > 0.95 && !hasAutoScrolled.current) {
        hasAutoScrolled.current = true;
        
        // Use window.location for reliable hard navigation and scroll-to-anchor
        setTimeout(() => {
          window.location.href = "/#welcome";
        }, 500);
        
      } else if (latest < 0.9) {
        hasAutoScrolled.current = false;
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  /* ----- Handle resize ----- */
  useEffect(() => {
    const handleResize = () => drawFrame(currentFrameRef.current);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  return (
    <>
      {/* ===== Loading Screen ===== */}
      {isLoading && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950 gap-6">
          <div className="loader-ring" style={{ borderTopColor: "#7c3aed" }} />
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium tracking-widest uppercase text-white/40 loader-pulse">
              {t("scroll.loading")}
            </p>
            <p className="text-xs text-white/25 tabular-nums">{loadProgress}%</p>
          </div>
        </div>
      )}

      {/* ===== Scroll Container — 800vh gives enough room for all 4 overlays ===== */}
      <div ref={containerRef} className="relative h-[800vh]">

        {/* ── Sticky viewport: canvas + overlay + all text in ONE sticky layer ── */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            style={{ background: "#0f172a" }}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

          {/* ── All text overlays live here, inside the sticky div ── */}

            {/* Intro */}
            <TextOverlay opacity={introOpacity}>
            <div className="max-w-3xl mx-auto px-6">
              <Badge>{t("scroll.intro.badge")}</Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.95] drop-shadow-2xl">
                {t("scroll.intro.title1")}
                <br />
                <span className="text-white/50">{t("scroll.intro.title2")}</span>
              </h1>
              <div className="mt-6 w-12 h-px bg-white/20 mx-auto" />
              <p className="mt-4 text-sm md:text-base text-white/50 max-w-md mx-auto">
                {t("scroll.intro.desc")}
              </p>
            </div>
            </TextOverlay>

          {/* Career 1 – ร้านยา / โรงพยาบาล */}
          <TextOverlay opacity={career1Opacity} align="left">
            <div className="max-w-lg">
              <Badge>{t("scroll.career1.badge")}</Badge>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.05] drop-shadow-xl">
                {t("scroll.career1.title1")}
                <br />
                {t("scroll.career1.title2")}
              </h2>
              <p className="mt-4 text-sm md:text-base text-white/55 max-w-sm leading-relaxed">
                {t("scroll.career1.desc")}
              </p>
            </div>
          </TextOverlay>

          {/* Career 2 – อุตสาหกรรม / วิจัย */}
          <TextOverlay opacity={career2Opacity} align="right">
            <div className="max-w-lg">
              <Badge>{t("scroll.career2.badge")}</Badge>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.05] drop-shadow-xl">
                {t("scroll.career2.title1")}
                <br />
                {t("scroll.career2.title2")}
              </h2>
              <p className="mt-4 text-sm md:text-base text-white/55 max-w-sm leading-relaxed ml-auto">
                {t("scroll.career2.desc")}
              </p>
            </div>
          </TextOverlay>

          {/* CTA – ยินดีต้อนรับ */}
          <TextOverlay opacity={ctaOpacity}>
            <div className="max-w-2xl mx-auto px-6 flex flex-col items-center">
              <Badge>{t("scroll.cta.badge")}</Badge>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[0.95] drop-shadow-2xl">
                {t("scroll.cta.title1")}
                <br />
                <span className="text-white/50">{t("scroll.cta.title2")}</span>
              </h2>
              <p className="mt-4 text-sm md:text-base text-white/50 max-w-md text-center leading-relaxed">
                {t("scroll.cta.desc")}
              </p>
              <div className="mt-8 flex items-center gap-2 text-white/30 text-xs tracking-widest animate-bounce">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
                {t("scroll.cta.scrollHint")}
              </div>
            </div>
          </TextOverlay>

        </div>
        {/* end sticky viewport */}

      </div>
    </>
  );
}
