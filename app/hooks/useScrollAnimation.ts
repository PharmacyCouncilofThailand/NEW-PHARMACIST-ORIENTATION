"use client";

import { useRef } from "react";
import { useInView, type UseInViewOptions } from "framer-motion";

/* ===========================
   Scroll Animation Hook
   ===========================
   Returns a ref and a boolean `isInView`.
   Attach `ref` to any element, then use
   `isInView` to conditionally apply classes
   or trigger Framer Motion animations.
   =========================== */

interface ScrollAnimationOptions {
    /** Trigger once or every time element comes into view */
    once?: boolean;
    /** IntersectionObserver margin, e.g. "-100px" */
    margin?: UseInViewOptions["margin"];
    /** Threshold (0-1) of visibility to trigger */
    amount?: UseInViewOptions["amount"];
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
    const { once = true, margin = "-80px", amount = 0.2 } = options;

    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once, margin, amount });

    return { ref, isInView };
}
