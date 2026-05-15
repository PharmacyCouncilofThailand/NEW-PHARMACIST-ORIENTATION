import type { NextConfig } from "next";

const publicAssetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/$/, "");
const nextAssetPrefix = process.env.NEXT_ASSET_PREFIX?.replace(/\/$/, "");
const publicAssetCdnUrl = publicAssetBaseUrl ? new URL(publicAssetBaseUrl) : null;
const nextAssetCdnUrl = nextAssetPrefix ? new URL(nextAssetPrefix) : null;
const cdnRemotePatterns = [publicAssetCdnUrl, nextAssetCdnUrl]
  .filter((url): url is URL => Boolean(url))
  .map((url) => ({
    protocol: url.protocol.replace(":", "") as "http" | "https",
    hostname: url.hostname,
    port: url.port,
    pathname: "/**",
  }));

const nextConfig: NextConfig = {
  /* config options here */
  assetPrefix: nextAssetPrefix || undefined,
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
      ...cdnRemotePatterns,
    ],
    formats: ["image/avif", "image/webp"], // Use modern formats
    qualities: [75, 100],
  },
};

export default nextConfig;
