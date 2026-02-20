"use client";

import { LOGOS } from "../data/logos";

export default function LogoMarquee() {
    return (
        <div
            className="relative w-full max-w-[900px] mx-auto overflow-hidden h-16 flex items-center pointer-events-auto"
            style={{
                maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
        >
            <div className="flex w-max animate-marquee items-center">
                {[0, 1, 2, 3].map((set) => (
                    <div key={set} className="flex items-center gap-16 shrink-0 px-8">
                        {LOGOS.map((logo) => (
                            <svg
                                key={`${set}-${logo.name}`}
                                xmlns="http://www.w3.org/2000/svg"
                                width={logo.width}
                                height={logo.height}
                                viewBox={`0 0 ${logo.width} ${logo.height}`}
                                fill="currentColor"
                                className="text-black/50 shrink-0 h-6 w-auto hover:text-black/100 transition-colors duration-300"
                                aria-label={logo.name}
                            >
                                <path d={logo.path} />
                            </svg>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
