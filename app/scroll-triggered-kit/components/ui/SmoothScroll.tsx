"use client";

import { useEffect, useRef, createContext, useContext, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
    return useContext(LenisContext);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            touchMultiplier: 2,
        });

        setLenisInstance(lenis);

        // Force scroll to top on refresh
        if (typeof window !== "undefined") {
            window.scrollTo(0, 0); // Native browser scroll
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
            lenis.scrollTo(0, { immediate: true }); // Lenis scroll
        }

        // Sync Lenis scroll with GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        lenis.on("scroll", ScrollTrigger.update);

        // Add Lenis to GSAP ticker
        const update = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
            lenis.destroy();
        };
    }, []);

    return (
        <LenisContext.Provider value={lenisInstance}>
            {children}
        </LenisContext.Provider>
    );
}
