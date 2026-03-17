"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YOUTUBE_VIDEO_ID = "ua8DyttaTrc";

export default function MaskScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initPlayer = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.mute();
            event.target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      if (!document.getElementById("yt-api-script")) {
        const tag = document.createElement("script");
        tag.id = "yt-api-script";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      try {
        playerRef.current?.destroy();
      } catch (_) {}
    };
  }, []);

  // Intersection observer: pause/play when out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!playerRef.current) return;
          if (entry.isIntersecting) {
            playerRef.current.playVideo();
            setIsPlaying(true);
          } else {
            playerRef.current.pauseVideo();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    const target = containerRef.current;
    if (target) observer.observe(target);
    return () => { if (target) observer.unobserve(target); };
  }, []);

  // GSAP scroll animation
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true }); // Prevent jumping on mobile when toolbar hides

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
            playerRef.current?.playVideo();
            setIsPlaying(true);
          },
          onLeave: () => {
            playerRef.current?.pauseVideo();
            setIsPlaying(false);
          },
          onEnterBack: () => {
            playerRef.current?.playVideo();
            setIsPlaying(true);
          },
          onLeaveBack: () => {
            playerRef.current?.pauseVideo();
            setIsPlaying(false);
          },
        },
      });

      tl.to({}, { duration: 0.2 });
      tl.to(headingRef.current, {
        scale: 300,
        ease: "power2.in",
        duration: 2,
      });
      tl.to(maskRef.current, {
        opacity: 0,
        duration: 0.3,
      }, "-=0.3");
      tl.to({}, { duration: 2.5 });

      // Refresh ScrollTrigger after a slight delay to ensure all DOM elements and images are settled
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleSound = () => {
    if (!playerRef.current) return;
    if (isSoundOn) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
    }
    setIsSoundOn(!isSoundOn);
  };

  return (
    <section
      className="hidden md:block relative w-full bg-white z-50 overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      <div
        ref={containerRef}
        style={{ height: "100vh", width: "100%", position: "relative", overflow: "hidden" }}
      >
        {/* YouTube IFrame background */}
        <div
          ref={iframeContainerRef}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* Oversized iframe to cover black bars */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "177.78vh", // 16:9 ratio based on height
              minWidth: "100%",
              height: "56.25vw", // 16:9 ratio based on width
              minHeight: "100%",
            }}
          >
            <div id="yt-player" style={{ width: "100%", height: "100%" }} />
          </div>
        </div>

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
            2569
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
            gap: "1rem",
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
