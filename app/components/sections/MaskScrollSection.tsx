"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MaskScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: "+=1500",
        },
      });

      // 1. หน่วงเวลาให้เห็นข้อความชัดเจนก่อนเริ่มซูม
      tl.to({}, { duration: 0.2 });

      // 2. ซูมทะลุข้อความ (Zoom in) จนเห็นวิดีโอเต็มจอ
      tl.to(headingRef.current, {
        scale: 300,
        ease: "power2.in", // ให้เริ่มซูมช้าๆ แล้วค่อยๆ เร็วขึ้น
        duration: 2, // เพิ่ม duration การซูมให้ค่อยเป็นค่อยไปมากขึ้น (ถ้าต้องการ)
      });

      // 3. ให้หน้ากากสีขาวจางหายไป (Fade out) ตอนจบปุ๊บ เพื่อลบขอบขาว
      tl.to(maskRef.current, {
        opacity: 0,
        duration: 0.3, // ทำให้จางช้าลงอีกนิดเพื่อให้เนียนขึ้น
      }, "-=0.3");

      // 4. ล็อคหน้าจอให้ดูวิดีโอเต็มๆ ก่อนที่จะเลื่อนหน้าลงไป section ถัดไป
      tl.to({}, { duration: 2.5 }); // หน่วงเวลาล็อคให้อยู่นานขึ้น ตัวเลขเยอะ=ล็อคนานขึ้น

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="hidden md:block relative w-full bg-white z-50 overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      <div
        ref={containerRef}
        style={{ height: "100vh", width: "100%", position: "relative", overflow: "hidden" }}
      >
      {/* Background video — fixed inside this container so it doesn't bleed globally */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <source
          src="https://videos.pexels.com/video-files/19026925/19026925-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* White mask layer with blended text */}
      <div
        ref={maskRef}
        style={{
          position: "relative",
          zIndex: 1,
          height: "100vh",
          width: "100%",
          background: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mixBlendMode: "screen",
        }}
      >
        <h2
          ref={headingRef}
          style={{
            fontFamily: "var(--font-kanit), 'Kanit', sans-serif",
            fontSize: "10vw",
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.2,
            color: "#000",
          }}
        >
          แนะนำอาชีพ
          <br />
          เภสัชกรใหม่
          <br />
          2026
        </h2>
      </div>
      </div>
    </section>
  );
}
