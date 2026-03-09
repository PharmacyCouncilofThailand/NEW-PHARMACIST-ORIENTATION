"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import s from "./admin.module.css";

/* ─── Constants ─── */
const ADMIN_TOKEN_KEY   = "pharma-admin-token";
const ADMIN_TOKEN_VALUE = "admin_authenticated_2026";
const REFRESH_INTERVAL  = 30_000; // 30 sec

/* ─── Types ─── */
interface DailyRecord {
  id:    number;
  date:  string;
  count: number;
}

interface Stats {
  today:     number;
  threeDay:  number;
  total:     number;
  peakDay:   string;
  peakCount: number;
  records:   DailyRecord[];
}

/* ─── Utils ─── */
function formatDateTH(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("th-TH", {
    year: "numeric", month: "short", day: "numeric", weekday: "short",
  });
}

function getTodayStr(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

function computeStats(records: DailyRecord[], summary: { today: number; threeDay: number }): Stats {
  const total    = records.reduce((a, r) => a + r.count, 0);
  const peak     = records.reduce(
    (best, r) => (r.count > best.count ? r : best),
    { date: "-", count: 0 } as { date: string; count: number }
  );
  return {
    today:     summary.today    ?? 0,
    threeDay:  summary.threeDay ?? 0,
    total,
    peakDay:   peak.date,
    peakCount: peak.count,
    records,
  };
}

/* ─── Icons ─── */
const IconRefresh = ({ spinning }: { spinning: boolean }) => (
  <svg
    width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"
    className={spinning ? s.spinning : undefined}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
      d="M4 4v5h5M20 20v-5h-5M4.07 15A9 9 0 1020 9" />
  </svg>
);

const IconTrash = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const IconLogout = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const IconBack = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
  </svg>
);

/* ─── Page ─── */
export default function AdminVisitorsPage() {
  const router         = useRouter();
  const [auth, setAuth]         = useState<boolean | null>(null); // null = checking
  const [stats, setStats]       = useState<Stats | null>(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetting, setResetting]   = useState(false);
  const [toast, setToast]           = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Auth check — runs once on mount */
  useEffect(() => {
    const ok = sessionStorage.getItem(ADMIN_TOKEN_KEY) === ADMIN_TOKEN_VALUE;
    if (!ok) {
      router.replace("/admin/login");
    } else {
      setAuth(true);
    }
  }, [router]);

  /* Logout */
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    router.push("/admin/login");
  }, [router]);

  /* Fetch data */
  const fetchData = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else        setRefreshing(true);

    try {
      const [summaryRes, allRes] = await Promise.all([
        fetch("/api/visitors"),
        fetch("/api/visitors?all=true"),
      ]);

      if (!summaryRes.ok || !allRes.ok) throw new Error("API error");

      const [summary, { records }] = await Promise.all([
        summaryRes.json() as Promise<{ today: number; threeDay: number }>,
        allRes.json()     as Promise<{ records: DailyRecord[] }>,
      ]);

      setStats(computeStats(records, summary));
    } catch (err) {
      console.error("[AdminDashboard] fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /* Initial load + auto-refresh — only after auth confirmed */
  useEffect(() => {
    if (auth !== true) return;
    fetchData();
    const t = setInterval(() => fetchData(true), REFRESH_INTERVAL);
    return () => clearInterval(t);
  }, [auth, fetchData]);

  /* Reset */
  const handleReset = useCallback(async () => {
    setResetting(true);
    try {
      const res = await fetch("/api/visitors/reset", { method: "DELETE" });
      if (!res.ok) throw new Error("Reset failed");
      setShowConfirm(false);
      await fetchData(true);
      showToast("✅ รีเซ็ตยอดผู้เข้าชมเรียบร้อย");
    } catch {
      showToast("❌ เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
    } finally {
      setResetting(false);
    }
  }, [fetchData]);

  /* Toast helper */
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  /* Chart data (last 14 days) */
  const chartRecords = stats ? stats.records.slice(-14) : [];
  const maxCount     = chartRecords.length
    ? Math.max(...chartRecords.map((r) => r.count), 1)
    : 1;
  const todayStr = getTodayStr();

  /* ─── Auth-checking / loading states ──── */
  if (auth === null || (auth && loading)) {
    return (
      <div className={s.root}>
        <div className={s.loading}>
          <div className={s.loadingRing} />
          <span>{auth === null ? "กำลังตรวจสอบสิทธิ์..." : "กำลังโหลด..."}</span>
        </div>
      </div>
    );
  }

  /* ─── Stat card config ─────────────────── */
  const statCards = [
    {
      icon: "📅",
      label: "วันนี้",
      value: (stats?.today ?? 0).toLocaleString(),
      sub: "ผู้เข้าชม",
      accent: "linear-gradient(90deg, #10b981, #059669)",
      iconBg: "rgba(16,185,129,0.15)",
    },
    {
      icon: "📊",
      label: "3 วันล่าสุด",
      value: (stats?.threeDay ?? 0).toLocaleString(),
      sub: "ผู้เข้าชม",
      accent: "linear-gradient(90deg, #7c3aed, #4f46e5)",
      iconBg: "rgba(124,58,237,0.15)",
    },
    {
      icon: "🌐",
      label: "ยอดรวมทั้งหมด",
      value: (stats?.total ?? 0).toLocaleString(),
      sub: "ตลอดการใช้งาน",
      accent: "linear-gradient(90deg, #2563eb, #1d4ed8)",
      iconBg: "rgba(37,99,235,0.15)",
    },
    {
      icon: "🏆",
      label: "วันที่เยอะที่สุด",
      value: (stats?.peakCount ?? 0).toLocaleString(),
      sub: stats?.peakDay && stats.peakDay !== "-"
        ? formatDateTH(stats.peakDay)
        : "ยังไม่มีข้อมูล",
      accent: "linear-gradient(90deg, #f59e0b, #d97706)",
      iconBg: "rgba(245,158,11,0.15)",
    },
  ];

  return (
    <div className={s.root}>
      <div className={s.container}>

        {/* ── Header ── */}
        <div className={s.header}>
          <div className={s.headerLeft}>
            <Link href="/" className={s.backBtn} title="กลับหน้าหลัก" aria-label="กลับหน้าหลัก">
              <IconBack />
            </Link>
            <div className={s.titleBlock}>
              <div className={s.eyebrow}>
                <span className={s.liveDot} />
                Live Analytics
              </div>
              <h1 className={s.title}>ผู้เข้าชมเว็บไซต์</h1>
              <p className={s.subtitle}>อัปเดตอัตโนมัติทุก 30 วินาที</p>
            </div>
          </div>

          <div className={s.headerRight}>
            <button
              className={s.refreshBtn}
              onClick={() => fetchData(true)}
              disabled={refreshing}
              aria-label="รีเฟรชข้อมูล"
            >
              <IconRefresh spinning={refreshing} />
              รีเฟรช
            </button>

            <button
              className={s.resetBtn}
              onClick={() => setShowConfirm(true)}
              aria-label="รีเซ็ตข้อมูลทั้งหมด"
            >
              <IconTrash />
              รีเซ็ต
            </button>

            <button
              className={s.refreshBtn}
              onClick={handleLogout}
              style={{ color: "#f87171", borderColor: "rgba(248,113,113,0.2)" }}
              aria-label="ออกจากระบบ"
            >
              <IconLogout />
              ออกจากระบบ
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className={s.statsGrid}>
          {statCards.map((c) => (
            <div
              key={c.label}
              className={s.statCard}
              style={{ "--card-accent": c.accent, "--icon-bg": c.iconBg } as React.CSSProperties}
            >
              <div className={s.statIcon}>{c.icon}</div>
              <div className={s.statLabel}>{c.label}</div>
              <div className={s.statValue}>{c.value}</div>
              <div className={s.statSub}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Bar Chart ── */}
        <div className={s.chartCard}>
          <div className={s.chartHeader}>
            <div>
              <div className={s.chartTitle}>กราฟผู้เข้าชมรายวัน</div>
              <div className={s.chartSub}>แสดงย้อนหลัง 14 วันล่าสุด</div>
            </div>
          </div>

          {chartRecords.length === 0 ? (
            <div className={s.emptyChart}>
              <span style={{ fontSize: 32 }}>📭</span>
              ยังไม่มีข้อมูลผู้เข้าชม
            </div>
          ) : (
            <div className={s.chartScroll}>
              <div className={s.chartBars}>
                {chartRecords.map((r) => {
                  const heightPct = Math.max((r.count / maxCount) * 100, 2);
                  const isToday   = r.date === todayStr;
                  return (
                    <div
                      key={r.date}
                      className={s.barCol}
                      title={`${r.date}: ${r.count.toLocaleString()} คน`}
                    >
                      <div className={s.barCount}>
                        {r.count > 0 ? r.count.toLocaleString() : ""}
                      </div>
                      <div className={s.barWrap}>
                        <div
                          className={`${s.bar} ${isToday ? s.barToday : ""}`}
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <div className={s.barDate}>{r.date.slice(5)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div className={s.tableCard}>
          <div className={s.tableHeader}>
            <div className={s.tableTitle}>
              ข้อมูลผู้เข้าชมรายวัน ({stats?.records.length ?? 0} วัน)
            </div>
          </div>
          <div className={s.tableScroll}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>จำนวนผู้เข้าชม</th>
                  <th>เปรียบเทียบวันก่อน</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.records.length ?? 0) === 0 ? (
                  <tr className={s.emptyRow}>
                    <td colSpan={3}>ยังไม่มีข้อมูล</td>
                  </tr>
                ) : (
                  [...(stats?.records ?? [])].reverse().map((r, i, arr) => {
                    const prev    = arr[i + 1];
                    const diff    = prev ? r.count - prev.count : null;
                    const isToday = r.date === todayStr;
                    return (
                      <tr key={r.date} className={isToday ? s.todayRow : undefined}>
                        <td className={s.dateCell}>
                          {formatDateTH(r.date)}
                          {isToday && <span className={s.todayBadge}>วันนี้</span>}
                        </td>
                        <td className={s.countCell}>{r.count.toLocaleString()}</td>
                        <td>
                          {diff !== null ? (
                            <span style={{
                              color: diff >= 0 ? "#10b981" : "#f87171",
                              fontSize: 12,
                              fontWeight: 600,
                            }}>
                              {diff >= 0 ? "▲" : "▼"} {Math.abs(diff).toLocaleString()}
                            </span>
                          ) : (
                            <span style={{ color: "#334155", fontSize: 12 }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── Confirm Modal ── */}
      {showConfirm && (
        <div
          className={s.overlay}
          onClick={() => !resetting && setShowConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalIcon}>🗑️</div>
            <h2 id="modal-title" className={s.modalTitle}>รีเซ็ตข้อมูลทั้งหมด?</h2>
            <p className={s.modalDesc}>
              การกระทำนี้จะลบข้อมูลผู้เข้าชมทั้งหมดออกจากฐานข้อมูลอย่างถาวร
              และไม่สามารถเรียกคืนได้
            </p>
            <div className={s.modalBtns}>
              <button
                className={s.cancelBtn}
                onClick={() => setShowConfirm(false)}
                disabled={resetting}
              >
                ยกเลิก
              </button>
              <button
                className={s.confirmBtn}
                onClick={handleReset}
                disabled={resetting}
              >
                {resetting ? "กำลังลบ..." : "ยืนยัน รีเซ็ต"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <div className={s.toast} role="status">{toast}</div>}
    </div>
  );
}
