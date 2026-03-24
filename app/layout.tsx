import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";


import ScrollProgress from "./components/scroll/ScrollProgress";
import { Providers } from "./providers";
import CookieConsent from "./components/ui/CookieConsent";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pharmacy-council.or.th"),
  title: "New Pharmacist Orientation | ปฐมนิเทศเภสัชกรใหม่",
  description: "Welcome to the Pharmacy Family — Your first step into the profession. งานปฐมนิเทศเภสัชกรใหม่ ก้าวแรกสู่วิชาชีพ",
  keywords: [
    "เภสัชกรใหม่",
    "ปฐมนิเทศเภสัชกร",
    "สภาเภสัชกรรม",
    "Pharmacist Orientation",
    "Pharmacy",
  ],
  authors: [{ name: "สภาเภสัชกรรม (Pharmacy Council of Thailand)" }],
  openGraph: {
    title: "New Pharmacist Orientation | ปฐมนิเทศเภสัชกรใหม่",
    description: "Welcome to the Pharmacy Family — Your first step into the profession. งานปฐมนิเทศเภสัชกรใหม่ ก้าวแรกสู่วิชาชีพ",
    url: "https://pharmacy-council.or.th", // สามารถเปลี่ยนเป็น URL จริงได้ภายหลัง
    siteName: "New Pharmacist Orientation",
    images: [
      {
        url: "/logo สภาเภสัชกรรม.jpg",
        width: 800,
        height: 600,
        alt: "Pharmacy Council of Thailand Logo",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
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
        className={`${notoSansThai.variable} font-sans antialiased text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-violet-200 selection:text-violet-900`}
      >
        <Providers>

          <ScrollProgress />
          <CookieConsent />

          {children}
        </Providers>
      </body>
    </html>
  );
}
