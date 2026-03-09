import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

function formatDate(date: Date): string {
  // Use Asia/Bangkok time to ensure local day boundaries
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" }); // Formats as YYYY-MM-DD
}

function getThreeDaysStrings() {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getTime());
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    if (all) {
      const records = await prisma.dailyVisitor.findMany({
        orderBy: { date: "asc" },
      });
      return NextResponse.json({ records });
    }

    const today = formatDate(new Date());
    const threeDays = getThreeDaysStrings();

    const todayRecord = await prisma.dailyVisitor.findUnique({
      where: { date: today },
    });

    const results = await prisma.dailyVisitor.findMany({
      where: {
        date: { in: threeDays },
      },
    });

    const todayCount = todayRecord?.count || 0;
    const threeDayCount = results.reduce((acc: number, curr: { count: number }) => acc + curr.count, 0);

    return NextResponse.json({ today: todayCount, threeDay: threeDayCount });
  } catch (err) {
    console.error("GET /api/visitors error:", err);
    return NextResponse.json({ error: "Failed to fetch visitor stats" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const today = formatDate(new Date());
    const threeDays = getThreeDaysStrings();

    const record = await prisma.dailyVisitor.upsert({
      where: { date: today },
      update: { count: { increment: 1 } },
      create: { date: today, count: 1 },
    });

    const results = await prisma.dailyVisitor.findMany({
      where: {
        date: { in: threeDays },
      },
    });

    const otherDaysCount = results
      .filter((r: { date: string }) => r.date !== today)
      .reduce((acc: number, curr: { count: number }) => acc + curr.count, 0);

    const threeDayCount = record.count + otherDaysCount;

    return NextResponse.json({ today: record.count, threeDay: threeDayCount });
  } catch (err) {
    console.error("POST /api/visitors error:", err);
    return NextResponse.json({ error: "Failed to update visitor stats" }, { status: 500 });
  }
}
