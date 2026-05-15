import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

const VISITOR_COOKIE = "pharma_visitor_counted_date";
const STATS_CACHE_MS = 30 * 1000;
const WRITE_FLUSH_MS = 5 * 1000;
const WRITE_BATCH_SIZE = 25;

type VisitorStats = {
  today: number;
  threeDay: number;
};

let statsCache: { expiresAt: number; value: VisitorStats } | null = null;
const pendingIncrements = new Map<string, number>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushPromise: Promise<void> | null = null;

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

function secondsUntilNextBangkokDay() {
  const bangkokNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  const nextDay = new Date(bangkokNow);
  nextDay.setHours(24, 0, 0, 0);
  return Math.max(60, Math.ceil((nextDay.getTime() - bangkokNow.getTime()) / 1000));
}

function getPendingCount(date: string) {
  return pendingIncrements.get(date) ?? 0;
}

function getTotalPendingCount() {
  let total = 0;
  pendingIncrements.forEach((count) => {
    total += count;
  });
  return total;
}

function withVisitorCookie(response: NextResponse, today: string) {
  response.cookies.set(VISITOR_COOKIE, today, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: secondsUntilNextBangkokDay(),
  });
  return response;
}

function jsonStats(stats: VisitorStats, init?: ResponseInit & { counted?: boolean }) {
  const { counted, ...responseInit } = init ?? {};
  return NextResponse.json(
    counted === undefined ? stats : { ...stats, counted },
    responseInit
  );
}

async function getBaseVisitorStats(): Promise<VisitorStats> {
  const now = Date.now();
  if (statsCache && statsCache.expiresAt > now) {
    return statsCache.value;
  }

  const today = formatDate(new Date());
  const threeDays = getThreeDaysStrings();

  let value: VisitorStats;

  try {
    const results = await prisma.dailyVisitor.findMany({
      where: {
        date: { in: threeDays },
      },
    });

    const todayCount = results.find((r: { date: string }) => r.date === today)?.count ?? 0;
    const threeDayCount = results.reduce((acc: number, curr: { count: number }) => acc + curr.count, 0);
    value = { today: todayCount, threeDay: threeDayCount };
  } catch (err) {
    console.error("getBaseVisitorStats error:", err);
    value = { today: 0, threeDay: 0 };
  }

  statsCache = { value, expiresAt: now + STATS_CACHE_MS };
  return value;
}

async function getVisitorStatsWithPending(): Promise<VisitorStats> {
  const base = await getBaseVisitorStats();
  const today = formatDate(new Date());
  const threeDays = getThreeDaysStrings();
  const pendingToday = getPendingCount(today);
  const pendingThreeDay = threeDays.reduce((total, date) => total + getPendingCount(date), 0);

  return {
    today: base.today + pendingToday,
    threeDay: base.threeDay + pendingThreeDay,
  };
}

async function flushPendingVisitors() {
  if (flushPromise) return flushPromise;

  const entries = Array.from(pendingIncrements.entries()).filter(([, count]) => count > 0);
  if (entries.length === 0) return;

  entries.forEach(([date]) => pendingIncrements.delete(date));

  flushPromise = Promise.all(
    entries.map(([date, count]) =>
      prisma.dailyVisitor.upsert({
        where: { date },
        update: { count: { increment: count } },
        create: { date, count },
      })
    )
  )
    .then(() => {
      statsCache = null;
    })
    .catch((err) => {
      entries.forEach(([date, count]) => {
        pendingIncrements.set(date, getPendingCount(date) + count);
      });
      console.error("flushPendingVisitors error:", err);
    })
    .finally(() => {
      flushPromise = null;
    });

  return flushPromise;
}

function scheduleVisitorFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushPendingVisitors();
  }, WRITE_FLUSH_MS);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    if (all) {
      const records = await prisma.dailyVisitor.findMany({
        orderBy: { date: "asc" },
      });
      return NextResponse.json({ records });
    }

    const stats = await getVisitorStatsWithPending();
    return jsonStats(stats, {
      headers: {
        "Cache-Control": "public, max-age=30, s-maxage=30, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    console.error("GET /api/visitors error:", err);
    return NextResponse.json({ error: "Failed to fetch visitor stats" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const today = formatDate(new Date());
    const countedDate = request.cookies.get(VISITOR_COOKIE)?.value;

    if (countedDate === today) {
      const stats = await getVisitorStatsWithPending();
      const response = jsonStats(stats, {
        counted: false,
        headers: { "Cache-Control": "private, no-store" },
      });
      return withVisitorCookie(response, today);
    }

    pendingIncrements.set(today, getPendingCount(today) + 1);

    if (getTotalPendingCount() >= WRITE_BATCH_SIZE) {
      await flushPendingVisitors();
    } else {
      scheduleVisitorFlush();
    }

    const stats = await getVisitorStatsWithPending();
    const response = jsonStats(stats, {
      counted: true,
      headers: { "Cache-Control": "private, no-store" },
    });

    return withVisitorCookie(response, today);
  } catch (err) {
    console.error("POST /api/visitors error:", err);
    return NextResponse.json({ error: "Failed to update visitor stats" }, { status: 500 });
  }
}
