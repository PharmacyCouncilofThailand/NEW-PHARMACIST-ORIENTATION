import { NextRequest, NextResponse } from "next/server";

const FOLDER_ID = "1gJjFcxpIeWZuw4T_3ocSzen1IL3WFvMX";
const API_KEY = process.env.GOOGLE_DRIVE_API_KEY || "";

export async function GET(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_DRIVE_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name,mimeType)&orderBy=createdTime&key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 60 } }); // cache 60s
    if (!res.ok) {
      const err = await res.text();
      console.error("Drive API error:", err);
      return NextResponse.json({ error: "Drive API error", detail: err }, { status: 500 });
    }
    const data = await res.json();
    const files = (data.files || []).map((f: { id: string; name: string }) => ({
      id: f.id,
      name: f.name,
    }));
    return NextResponse.json({ files }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" }
    });
  } catch (err) {
    console.error("drive-folder error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
