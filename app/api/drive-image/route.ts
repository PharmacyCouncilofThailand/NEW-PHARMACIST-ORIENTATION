import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return new NextResponse("Missing id", { status: 400 });
  }

  // Try lh3 first (fastest), then fall back to uc download
  const urls = [
    `https://lh3.googleusercontent.com/d/${id}=s1200`,
    `https://drive.google.com/uc?id=${id}&export=download`,
  ];

  let response: Response | null = null;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        },
        redirect: "follow",
      });
      if (res.ok && res.headers.get("content-type")?.startsWith("image/")) {
        response = res;
        break;
      }
    } catch {
      // Try next URL
    }
  }

  if (!response) {
    return new NextResponse("Image not found or not accessible", {
      status: 404,
    });
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const buffer = await response.arrayBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
