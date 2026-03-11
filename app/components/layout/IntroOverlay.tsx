"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function IntroOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const matchMedia = gsap.matchMedia();

    matchMedia.add("(min-width: 300px)", () => {
      // Trigger on the hero section
      const heroSection = document.getElementById("hero");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection ?? overlayRef.current,
          scrub: 1,
          start: "top top",
          end: "+=1200",
        },
      });

      tl.to(logoRef.current, { scale: 12, autoAlpha: 0, duration: 1, ease: "power2.in" }, 0)
        .to(overlayRef.current, { autoAlpha: 0, duration: 0.8 }, 0.2)
        .set(overlayRef.current, { display: "none" }, 1);

      return () => tl.kill();
    });

    return () => matchMedia.revert();
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex justify-center items-center bg-white z-[9999]"
    >
      <div ref={logoRef} className="will-change-transform">
        <Image
          src="/logo สภาเภสัชกรรม.jpg"
          alt="Logo"
          width={180}
          height={180}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
