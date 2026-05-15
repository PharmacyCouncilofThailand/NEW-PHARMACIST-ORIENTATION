"use client";

import { useEffect, createContext, useContext, useState } from "react";
import type Lenis from "lenis";

export const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
    return useContext(LenisContext);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let cancelled = false;
        let cleanup: (() => void) | undefined;
        let idleId: number | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const initSmoothScroll = async () => {
            const [{ default: Lenis }, gsapModule, scrollTriggerModule] = await Promise.all([
                import("lenis"),
                import("gsap"),
                import("gsap/ScrollTrigger"),
            ]);

            if (cancelled) return;

            const gsap = gsapModule.gsap ?? gsapModule.default;
            const { ScrollTrigger } = scrollTriggerModule;
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                touchMultiplier: 2,
            });

            if (cancelled) {
                lenis.destroy();
                return;
            }

            setLenisInstance(lenis);
            window.scrollTo(0, 0);

            if ("scrollRestoration" in history) {
                history.scrollRestoration = "manual";
            }

            lenis.scrollTo(0, { immediate: true });
            gsap.registerPlugin(ScrollTrigger);
            lenis.on("scroll", ScrollTrigger.update);

            const update = (time: number) => {
                lenis.raf(time * 1000);
            };

            gsap.ticker.add(update);
            gsap.ticker.lagSmoothing(0);

            cleanup = () => {
                gsap.ticker.remove(update);
                lenis.destroy();
            };
        };

        if ("requestIdleCallback" in window) {
            idleId = window.requestIdleCallback(initSmoothScroll, { timeout: 1200 });
        } else {
            timeoutId = setTimeout(initSmoothScroll, 250);
        }

        return () => {
            cancelled = true;
            if (idleId !== undefined && "cancelIdleCallback" in window) {
                window.cancelIdleCallback(idleId);
            }
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
            cleanup?.();
        };
    }, []);

    return (
        <LenisContext.Provider value={lenisInstance}>
            {children}
        </LenisContext.Provider>
    );
}
