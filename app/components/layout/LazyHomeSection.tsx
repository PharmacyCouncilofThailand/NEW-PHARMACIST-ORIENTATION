"use client";

import dynamic from "next/dynamic";
import { ComponentType, useEffect, useRef, useState } from "react";

type SectionKey =
  | "welcome"
  | "speakers"
  | "universityStats"
  | "maskScroll"
  | "agenda"
  | "location"
  | "memories"
  | "jobPosters"
  | "sponsors"
  | "footer";

type LazyHomeSectionProps = {
  section: SectionKey;
  minHeight?: number | string;
  rootMargin?: string;
  className?: string;
};

const sections: Record<SectionKey, ComponentType> = {
  welcome: dynamic(() => import("../sections/WelcomeSection"), { ssr: false }),
  speakers: dynamic(() => import("../sections/SpeakerSection"), { ssr: false }),
  universityStats: dynamic(() => import("../sections/UniversityStatsSection"), { ssr: false }),
  maskScroll: dynamic(() => import("../sections/MaskScrollSection"), { ssr: false }),
  agenda: dynamic(() => import("../sections/AgendaSection"), { ssr: false }),
  location: dynamic(() => import("../sections/LocationSection"), { ssr: false }),
  memories: dynamic(() => import("../sections/MemoriesSection"), { ssr: false }),
  jobPosters: dynamic(() => import("../sections/JobPostersSection"), { ssr: false }),
  sponsors: dynamic(() => import("../sections/SponsorSection"), { ssr: false }),
  footer: dynamic(() => import("./Footer"), { ssr: false }),
};

export default function LazyHomeSection({
  section,
  minHeight = 480,
  rootMargin = "700px 0px",
  className,
}: LazyHomeSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const Component = sections[section];

  useEffect(() => {
    if (shouldRender) return;

    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  if (shouldRender) {
    return <Component />;
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ minHeight }}
    />
  );
}
