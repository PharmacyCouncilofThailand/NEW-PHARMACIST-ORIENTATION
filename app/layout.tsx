import type { Metadata } from "next";
import { Noto_Sans_Thai, Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "./components/CustomCursor";
import StarryBackground from "./components/StarryBackground";
import ScrollProgress from "./components/ScrollProgress";
import { Providers } from "./providers";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "New Pharmacist Orientation 2026",
  description: "Welcome to the Pharmacy Family — Your first step into the profession.",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${notoSansThai.variable} ${inter.variable} font-sans antialiased text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-violet-200 selection:text-violet-900`}
      >
        <Providers>
          <CustomCursor />
          <ScrollProgress />
          
          {/* Cinematic Backgrounds */}
          <div className="bg-noise" />
          <StarryBackground />
          
          {/* Space Ambience - Shooting Stars Container (Purple/Blue Tone) */}
          <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
            <div className="shooting-star" style={{ top: '10%', left: '80%', animationDelay: '0s' }} />
            <div className="shooting-star" style={{ top: '20%', left: '20%', animationDelay: '5s' }} />
            <div className="shooting-star" style={{ top: '40%', left: '60%', animationDelay: '12s' }} />
          </div>

          {children}
        </Providers>
      </body>
    </html>
  );
}
