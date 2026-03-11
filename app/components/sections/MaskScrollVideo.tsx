"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "../../contexts/LangContext";

export default function MaskScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const { t } = useLang();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const matchMedia = gsap.matchMedia();

    matchMedia.add("(min-width: 300px)", () => {
      // Replicate the gsap.from behavior provided by the user
      const animation = gsap.from(textRef.current, {
        scale: 300,
        scrollTrigger: {
          trigger: containerRef.current,
          scrub: 1,
          pin: true,
          start: "top top",
          end: "+=1000",
        },
        ease: "none",
      });

      return () => {
        animation.kill();
      };
    });

    return () => matchMedia.revert();
  }, []);

  return (
    <>
      <div 
        ref={containerRef} 
        className="relative w-full overflow-hidden" 
        style={{ minHeight: "100vh" }}
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          // We don't use position: fixed like CSS provided, 
          // because it would stay below all other sections!
          // We can use fixed IF we manage z-index, but using absolute 
          // within the pinned container creates the same effect without bleeding.
          style={{ zIndex: -1 }}
        >
          <source src="https://videos.pexels.com/video-files/19026925/19026925-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>

        <div 
          className="absolute inset-0 flex justify-center items-center w-full"
          style={{ 
            backgroundColor: "#fff", 
            mixBlendMode: "screen",
            height: "100vh"
          }}
        >
          <h2 
            ref={textRef} 
            className="text-black text-center font-black leading-[1.2]"
            style={{ 
              fontSize: "10vw",
              minWidth: "100%", // ensure it scales perfectly from center
            }}
          >
            ปฐมนิเทศ<br />เภสัชกรใหม่<br />2569
          </h2>
        </div>
      </div>
    </>
  );
}
