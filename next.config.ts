import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: process.cwd(),
  },
  reactCompiler: true, // Optimizes React rendering (moved to top-level in Next.js 16)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"], // Use modern formats
    qualities: [75, 100],
  },
};

export default nextConfig;
