import type { Metadata } from "next";
import { Noto_Sans_Thai, Inter, Kanit } from "next/font/google";
import "./globals.css";
import CustomCursor from "./components/effects/CustomCursor";

import ScrollProgress from "./components/scroll/ScrollProgress";
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

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "New Pharmacist Orientation 2026",
  description: "Welcome to the Pharmacy Family — Your first step into the profession.",
  icons: {
    icon: "/logo สภาเภสัชกรรม.jpg",
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
        className={`${notoSansThai.variable} ${inter.variable} ${kanit.variable} font-sans antialiased text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-violet-200 selection:text-violet-900`}
      >
        <Providers>
          <CustomCursor />
          <ScrollProgress />
          


          {children}
        </Providers>
      </body>
    </html>
  );
}
