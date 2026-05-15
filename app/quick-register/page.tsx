"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import Image from "next/image";

const ACCP_API_URL =
  process.env.NEXT_PUBLIC_ACCP_API_URL || "http://localhost:3002";
const EVENT_CODE =
  process.env.NEXT_PUBLIC_ORIENTATION_EVENT_CODE || "NPHA-2026";

type AttendeeType = "parent" | "student";

const ATTENDEE_TYPE_LABEL: Record<AttendeeType, string> = {
  parent: "ผู้ปกครอง",
  student: "นักเรียน / นักศึกษา",
};

const ATTENDEE_OPTIONS: {
  value: AttendeeType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "parent",
    label: "ผู้ปกครอง",
    description: "พ่อ แม่ หรือผู้ดูแล",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 3a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    value: "student",
    label: "นักเรียน / นักศึกษา",
    description: "ผู้กำลังศึกษาในสถาบัน",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
];

type Result = {
  regCode: string;
  eventName: string;
  ticketName: string;
  firstName: string;
  lastName: string;
  email: string;
  attendeeType: AttendeeType;
};

export default function QuickRegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [attendeeType, setAttendeeType] = useState<AttendeeType | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click / Escape
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [dropdownOpen]);

  const selectedOption = ATTENDEE_OPTIONS.find((o) => o.value === attendeeType);

  // Generate QR when result arrives
  useEffect(() => {
    if (!result?.regCode) return;
    QRCode.toDataURL(result.regCode, {
      width: 320,
      margin: 2,
      color: { dark: "#1e293b", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch((e) => console.error("[quick-register] qr error", e));
  }, [result?.regCode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim().toLowerCase();
    if (!fn || !ln || !em || !attendeeType) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${ACCP_API_URL}/api/registrations/quick`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fn,
          lastName: ln,
          email: em,
          eventCode: EVENT_CODE,
          attendeeType,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        const code = data?.code as string | undefined;
        const friendly =
          code === "EMAIL_ALREADY_REGISTERED"
            ? "อีเมลนี้ถูกลงทะเบียนแล้ว กรุณาเข้าสู่ระบบ"
            : code === "EVENT_NOT_FOUND"
            ? "ไม่พบ Event นี้"
            : code === "EVENT_NOT_AVAILABLE"
            ? "Event ยังไม่เปิดให้ลงทะเบียน"
            : code === "NOT_FREE_TICKET"
            ? "ไม่มีบัตรลงทะเบียนฟรีสำหรับงานนี้"
            : code === "SALE_NOT_STARTED"
            ? "ยังไม่ถึงเวลาเปิดลงทะเบียน"
            : code === "SALE_ENDED"
            ? "หมดเวลาลงทะเบียนแล้ว"
            : code === "SOLD_OUT"
            ? "ที่นั่งเต็มแล้ว"
            : data?.error || "ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่";
        setError(friendly);
        return;
      }

      setResult(data.data as Result);
    } catch (err) {
      console.error("[quick-register] submit error", err);
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex mb-3 items-center justify-center">
            <Image
              src="/logo-pharmacy.png"
              alt="Logo"
              width={270}
              height={270}
              priority
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            ลงทะเบียนด่วน
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            กรอกข้อมูลเพื่อรับ QR Code สำหรับเข้างาน
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-violet-900/5 dark:shadow-black/40 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
          {!result ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="attendeeType-trigger"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                >
                  ประเภทผู้เข้าร่วม
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    id="attendeeType-trigger"
                    type="button"
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                    className={`w-full px-3 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-left flex items-center justify-between gap-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                      dropdownOpen
                        ? "border-violet-500 shadow-md shadow-violet-900/5"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    {selectedOption ? (
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span className="w-8 h-8 shrink-0 rounded-lg bg-linear-to-br from-violet-500 to-blue-600 text-white flex items-center justify-center shadow-sm">
                          {selectedOption.icon}
                        </span>
                        <span className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-900 dark:text-white truncate">
                            {selectedOption.label}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {selectedOption.description}
                          </span>
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2.5 text-slate-400 dark:text-slate-500">
                        <span className="w-8 h-8 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                          </svg>
                        </span>
                        <span>-- เลือกประเภท --</span>
                      </span>
                    )}
                    <svg
                      className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div
                      role="listbox"
                      className="absolute z-20 top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-900/10 dark:shadow-black/40 border border-slate-200 dark:border-slate-700 overflow-hidden origin-top animate-fade-slide"
                    >
                      {ATTENDEE_OPTIONS.map((opt) => {
                        const isSelected = opt.value === attendeeType;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setAttendeeType(opt.value);
                              setDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2.5 flex items-center gap-2.5 text-left transition group ${
                              isSelected
                                ? "bg-violet-50 dark:bg-violet-900/30"
                                : "hover:bg-slate-50 dark:hover:bg-slate-700/60"
                            }`}
                          >
                            <span
                              className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center shadow-sm transition ${
                                isSelected
                                  ? "bg-linear-to-br from-violet-500 to-blue-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-linear-to-br group-hover:from-violet-500 group-hover:to-blue-600 group-hover:text-white"
                              }`}
                            >
                              {opt.icon}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block font-semibold text-sm text-slate-900 dark:text-white truncate">
                                {opt.label}
                              </span>
                              <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {opt.description}
                              </span>
                            </span>
                            {isSelected && (
                              <svg
                                className="w-5 h-5 shrink-0 text-violet-600 dark:text-violet-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                >
                  ชื่อ
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  maxLength={100}
                  autoComplete="given-name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition"
                  placeholder="ชื่อจริง"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                >
                  นามสกุล
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  maxLength={100}
                  autoComplete="family-name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition"
                  placeholder="นามสกุล"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                  autoComplete="email"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition"
                  placeholder="you@example.com"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 px-5 py-3 bg-linear-to-br from-violet-600 to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-violet-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    กำลังลงทะเบียน...
                  </>
                ) : (
                  "ลงทะเบียนและรับ QR Code"
                )}
              </button>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-1">
                เมื่อกดลงทะเบียน ถือว่ายอมรับเงื่อนไขการเก็บข้อมูลส่วนบุคคล
              </p>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-4 animate-fade-in-up">
              <div className="w-full text-center">
                <p className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                  ลงทะเบียนสำเร็จ
                </p>
                <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {result.firstName} {result.lastName}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {result.email}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {result.eventName} · {result.ticketName}
                </p>
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
                  {ATTENDEE_TYPE_LABEL[result.attendeeType]}
                </span>
              </div>

              <div className="w-56 h-56 bg-white p-3 rounded-2xl border-4 border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center overflow-hidden">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-6 h-6 border-2 border-violet-400/40 border-t-violet-500 rounded-full animate-spin" />
                )}
              </div>

              <p className="font-mono text-xs text-slate-500 dark:text-slate-400 tracking-widest text-center">
                {result.regCode}
              </p>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-1">
                กรุณาบันทึก QR Code ไว้สำหรับแสดงตอนเช็คอินหน้างาน
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
