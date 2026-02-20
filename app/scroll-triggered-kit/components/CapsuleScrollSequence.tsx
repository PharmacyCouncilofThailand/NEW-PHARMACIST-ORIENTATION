"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useImageSequence } from "../hooks/useImageSequence";
import { useLenis } from "./ui/SmoothScroll";
import LogoMarquee from "./LogoMarquee";

/* ===========================
   Configuration
   =========================== */
const TOTAL_FRAMES = 76;
const FRAME_PREFIX = "/frames/ezgif-frame-";
const FRAME_EXTENSION = ".jpg";

/** Generate the path for a given frame index (0-based) */
function getFramePath(index: number): string {
    const num = String(index + 1).padStart(3, "0");
    return `${FRAME_PREFIX}${num}${FRAME_EXTENSION}`;
}

/* ===========================
   Text Overlay Section
   =========================== */
interface TextOverlayProps {
    children: React.ReactNode;
    opacity: MotionValue<number>;
    align?: "center" | "left" | "right";
    className?: string;
}


function TextOverlay({ children, opacity, align = "center", className = "" }: TextOverlayProps) {
    const alignClass =
        align === "left"
            ? "items-start text-left pl-[8%] md:pl-[12%]"
            : align === "right"
                ? "items-end text-right pr-[8%] md:pr-[12%]"
                : "items-center text-center";

    return (
        <motion.div
            style={{ opacity }}
            className={`absolute inset-0 z-10 flex flex-col justify-center ${alignClass} pointer-events-none ${className}`}
        >
            {children}
        </motion.div>
    );
}

/* ===========================
   Main Component
   =========================== */
export default function CapsuleScrollSequence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentFrameRef = useRef(0);
    const rafRef = useRef<number>(0);

    const { images, isLoading, loadProgress } = useImageSequence({
        totalFrames: TOTAL_FRAMES,
        framePrefix: FRAME_PREFIX,
        frameExtension: FRAME_EXTENSION,
    });

    const lenis = useLenis();
    const hasAutoScrolled = useRef(false);

    /* ----- Scroll tracking ----- */
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    /* ----- Text overlay opacities ----- */
    // Hero (0% – 20%)
    const heroOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18, 0.25], [0, 1, 1, 0]);
    // Feature 1 (25% – 45%)
    const feature1Opacity = useTransform(scrollYProgress, [0.22, 0.30, 0.40, 0.48], [0, 1, 1, 0]);
    // Feature 2 (50% – 70%)
    const feature2Opacity = useTransform(scrollYProgress, [0.48, 0.55, 0.65, 0.72], [0, 1, 1, 0]);
    // CTA (78% – 100%)
    const ctaOpacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 1]);

    // Marquee (Visible at start, fades out by 20%)
    const marqueeOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

    /* ----- Draw frame to canvas ----- */
    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const img = images[frameIndex];

        if (!canvas || !ctx || !img) return;

        // Match canvas internal resolution to display size
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const w = rect.width * dpr;
        const h = rect.height * dpr;

        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }

        ctx.clearRect(0, 0, w, h);

        // "cover" fit — fill container, crop excess
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = w / h;

        let drawW: number, drawH: number, drawX: number, drawY: number;

        if (imgAspect > canvasAspect) {
            // Image is wider than canvas -> match height, crop width
            drawH = h;
            drawW = h * imgAspect;
            drawX = (w - drawW) / 2;
            drawY = 0;
        } else {
            // Image is taller (or same) -> match width, crop height
            drawW = w;
            drawH = w / imgAspect;
            drawX = 0;
            drawY = (h - drawH) / 2;
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
        const unsubscribe = scrollYProgress.on("change", (v) => {
            const frameIndex = Math.min(
                TOTAL_FRAMES - 1,
                Math.floor(v * TOTAL_FRAMES)
            );

            if (frameIndex !== currentFrameRef.current) {
                currentFrameRef.current = frameIndex;
                cancelAnimationFrame(rafRef.current);
                rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
            }
        });

        return () => unsubscribe();
    }, [scrollYProgress, drawFrame]);

    /* ----- Auto-scroll to #welcome on completion ----- */
    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            // Trigger when scroll is almost at the end (99%) and haven't triggered yet
            if (latest > 0.99 && !hasAutoScrolled.current && lenis) {
                hasAutoScrolled.current = true;

                // Notify Navbar to stay visible
                window.dispatchEvent(new CustomEvent("capsule-auto-scroll-start"));

                // Stronger pull: lock scroll during animation, slightly faster duration
                lenis.scrollTo("#welcome", {
                    duration: 1.2,
                    lock: true,
                    force: true, // Force scroll even if user is interacting
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo out for snappy feel
                    onComplete: () => {
                        window.dispatchEvent(new CustomEvent("capsule-auto-scroll-end"));
                    }
                });
            }
            // Reset trigger when scrolling back up
            else if (latest < 0.9) {
                hasAutoScrolled.current = false;
            }
        });

        return () => unsubscribe();
    }, [scrollYProgress, lenis]);

    /* ----- Handle resize ----- */
    useEffect(() => {
        const handleResize = () => {
            drawFrame(currentFrameRef.current);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [drawFrame]);




    return (
        <>
            {/* ===== Loading Screen ===== */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#D4D0CA] gap-6">
                    <div className="loader-ring" />
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-sm font-medium tracking-widest uppercase text-black/50 loader-pulse">
                            Loading Experience
                        </p>
                        <p className="text-xs text-black/30 tabular-nums">
                            {loadProgress}%
                        </p>
                    </div>
                </div>
            )}

            {/* ===== Scroll Container ===== */}
            <div ref={containerRef} className="relative h-[600vh]">
                {/* Sticky Canvas */}
                <canvas
                    ref={canvasRef}
                    className="sticky top-0 h-screen w-full"
                    style={{ background: "#D4D0CA" }}
                />

                {/* ----- Marquee (Always visible at start, fades out) ----- */}
                <motion.div
                    style={{ opacity: marqueeOpacity }}
                    className="absolute top-[40vh] left-0 right-0 z-20 flex justify-center pointer-events-none"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                        className="text-[12vw] md:text-[8vw] font-bold tracking-tighter text-black/60 leading-none select-none"
                    >
                        PHARMACY
                    </motion.h2>
                </motion.div>

                <motion.div
                    style={{ opacity: marqueeOpacity }}
                    className="absolute top-[70vh] left-0 right-0 z-20 pointer-events-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
                    >
                        <LogoMarquee />
                    </motion.div>
                </motion.div>

                {/* ----- Hero Headline (0%) ----- */}
                <TextOverlay opacity={heroOpacity}>
                    <div className="max-w-3xl mx-auto px-6">
                        <motion.p
                            className="text-xs md:text-sm font-medium tracking-[0.3em] uppercase text-black/35 mb-4"
                            style={{ opacity: heroOpacity }}
                        >
                            Introducing
                        </motion.p>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black/85 leading-[0.95]">
                            The Future
                            <br />
                            <span className="text-black/50">of Wellness</span>
                        </h1>
                        <motion.div
                            className="mt-6 md:mt-8 w-12 h-[1px] bg-black/15 mx-auto"
                            style={{ opacity: heroOpacity }}
                        />
                        <motion.p
                            className="mt-4 text-sm md:text-base text-black/35 max-w-md mx-auto"
                            style={{ opacity: heroOpacity }}
                        >
                            Scroll to explore
                        </motion.p>
                    </div>
                </TextOverlay>

                {/* ----- Feature 1 (30%) ----- */}
                <TextOverlay opacity={feature1Opacity} align="left">
                    <div className="max-w-lg">
                        <p className="text-xs font-medium tracking-[0.25em] uppercase text-black/35 mb-3">
                            01 — Engineering
                        </p>
                        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-black/85 leading-[1.05]">
                            Precision
                            <br />
                            Engineered
                        </h2>
                        <p className="mt-4 text-sm md:text-base text-black/45 max-w-sm leading-relaxed">
                            Every capsule is crafted with pharmaceutical-grade precision,
                            ensuring optimal bioavailability and consistent delivery.
                        </p>
                    </div>
                </TextOverlay>

                {/* ----- Feature 2 (60%) ----- */}
                <TextOverlay opacity={feature2Opacity} align="right">
                    <div className="max-w-lg">
                        <p className="text-xs font-medium tracking-[0.25em] uppercase text-black/35 mb-3">
                            02 — Purity
                        </p>
                        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-black/85 leading-[1.05]">
                            Pure
                            <br />
                            Inside
                        </h2>
                        <p className="mt-4 text-sm md:text-base text-black/45 max-w-sm leading-relaxed ml-auto">
                            Clean ingredients. Zero fillers. What&apos;s inside matters —
                            and we made sure every molecule counts.
                        </p>
                    </div>
                </TextOverlay>

                {/* ----- CTA (90%) ----- */}
                <TextOverlay opacity={ctaOpacity}>
                    <div className="max-w-2xl mx-auto px-6 flex flex-col items-center">
                        <p className="text-xs font-medium tracking-[0.25em] uppercase text-black/35 mb-3">
                            03 — Experience
                        </p>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-black/85 leading-[0.95]">
                            Experience
                            <br />
                            Capsule
                        </h2>
                        <p className="mt-4 text-sm md:text-base text-black/45 max-w-md text-center leading-relaxed">
                            The next generation of wellness, designed for those who demand more.
                        </p>
                        <button className="mt-8 px-8 py-3 bg-black/8 hover:bg-black/15 border border-black/15 hover:border-black/25 rounded-full text-sm font-medium tracking-wide text-black/80 transition-all duration-300 backdrop-blur-sm cursor-pointer">
                            Get Early Access
                        </button>
                    </div>
                </TextOverlay>
            </div>
        </>
    );
}
