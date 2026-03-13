"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MaskScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = isSoundOn;
      setIsSoundOn(!isSoundOn);
    }
  };

  useEffect(() => {
    // ใช้ IntersectionObserver ในการตรวจจับว่า section นี้อยู่ในหน้าจอหรือไม่
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              // ถ้าอยู่ในหน้าจอ ให้เล่นวิดีโอ
              videoRef.current.play().catch(() => {});
              setIsPlaying(true);
            } else {
              // ถ้าไม่อยู่ในหน้าจอ ให้หยุดวิดีโอ
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.1 } // ทำงานเมื่อเห็น section อย่างน้อย 10%
    );

    const target = containerRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

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
          onEnter: () => {
            videoRef.current?.play().catch(() => {});
            setIsPlaying(true);
          },
          onLeave: () => {
            videoRef.current?.pause();
            setIsPlaying(false);
          },
          onEnterBack: () => {
            videoRef.current?.play().catch(() => {});
            setIsPlaying(true);
          },
          onLeaveBack: () => {
            videoRef.current?.pause();
            setIsPlaying(false);
          },
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
        ref={videoRef}
        autoPlay
        loop
        muted={!isSoundOn}
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
          src="/Career.mp4"
          type="video/mp4"
        />
      </video>

      {/* Black mask layer with blended text */}
      <div
        ref={maskRef}
        style={{
          position: "relative",
          zIndex: 1,
          height: "100vh",
          width: "100%",
          background: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mixBlendMode: "multiply", 
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
            color: "#fff",
          }}
        >
          แนะนำอาชีพ
          <br />
          เภสัชกรใหม่
          <br />
          2026
        </h2>
      </div>

      {/* Media Controls */}
      <div 
        style={{ 
          position: "absolute", 
          bottom: "2rem", 
          right: "2rem", 
          zIndex: 20, 
          display: "flex", 
          gap: "1rem" 
        }}
      >
        <button 
          onClick={toggleSound}
          className="px-6 py-3 bg-black/60 hover:bg-black/80 text-white rounded-full border border-white/20 backdrop-blur-md transition-all font-medium flex items-center gap-2 shadow-lg"
        >
          {isSoundOn ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" /></svg>
              <span>ปิดเสียง</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
              <span>เปิดเสียง</span>
            </>
          )}
        </button>
        <button 
          onClick={togglePlay}
          className="px-6 py-3 bg-black/60 hover:bg-black/80 text-white rounded-full border border-white/20 backdrop-blur-md transition-all font-medium flex items-center gap-2 shadow-lg"
        >
          {isPlaying ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" /></svg>
              <span>หยุด</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
              <span>เล่น</span>
            </>
          )}
        </button>
      </div>

      </div>
    </section>
  );
}
