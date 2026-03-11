"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import s from "./login.module.css";

const ADMIN_PASS = "123456";
const ADMIN_TOKEN_KEY = "pharma-admin-token";
const ADMIN_TOKEN_VALUE = "admin_authenticated_2026";

/* ─── Icons (memoized inline) ─── */
const IconLock = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconEyeOpen = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const IconEyeClosed = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const IconArrow = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

/* ─── Page ─── */
export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword]   = useState("");
  const [showPw,   setShowPw]     = useState(false);
  const [focused,  setFocused]    = useState(false);
  const [loading,  setLoading]    = useState(false);
  const [error,    setError]      = useState("");
  const [shake,    setShake]      = useState(false);

  // If session already valid → redirect immediately
  useEffect(() => {
    if (localStorage.getItem(ADMIN_TOKEN_KEY) === ADMIN_TOKEN_VALUE) {
      router.replace("/admin/visitors");
    }
  }, [router]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || loading) return;

    setLoading(true);
    setError("");

    try {
      // Small delay to feel intentional
      await new Promise((r) => setTimeout(r, 500));

      if (password === ADMIN_PASS) {
        localStorage.setItem(ADMIN_TOKEN_KEY, ADMIN_TOKEN_VALUE);
        router.push("/admin/visitors");
        // Don't reset loading — page is navigating away
      } else {
        setError("รหัสผ่านไม่ถูกต้อง");
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setLoading(false);
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      setLoading(false);
    }
  }, [password, loading, router]);

  return (
    <div className={s.root}>
      {/* Background */}
      <div className={s.bg} />
      <div className={s.dots} />
      <div className={s.orb1} />
      <div className={s.orb2} />

      {/* Card */}
      <div className={`${s.card} ${shake ? s.cardShake : ""}`}>

        {/* Logo */}
        <div className={s.logoRow}>
          <Link href="/" className={s.logoLink}>
            <Image
              src="/logo สภาเภสัชกรรม.jpg"
              alt="Pharmacy Council Logo"
              width={40}
              height={40}
              className={s.logoImg}
              quality={90}
              priority
            />
            <div>
              <div className={s.logoText}>สภาเภสัชกรรม</div>
              <div className={s.logoSub}>แห่งประเทศไทย</div>
            </div>
          </Link>
        </div>

        {/* Header */}
        <div className={s.head}>
          <div className={s.badge}>
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 4a2 2 0 110 4 2 2 0 010-4zm0 10c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" />
            </svg>
            Admin Portal
          </div>
          <h1 className={s.title}>เข้าสู่ระบบ Admin</h1>
          <p className={s.subtitle}>กรุณากรอกรหัสผ่าน Admin เพื่อดำเนินการต่อ</p>
        </div>

        <div className={s.divider} />

        {/* Error */}
        {error && (
          <div className={s.error} role="alert">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z" />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className={`${s.inputWrap} ${focused ? s.inputWrapFocused : ""}`}>
            <span className={`${s.icon} ${focused || password ? s.iconLit : ""}`} aria-hidden="true">
              <IconLock />
            </span>
            <div className={s.fieldInner}>
              <label
                className={`${s.label} ${focused || password ? s.labelUp : ""}`}
                htmlFor="admin-pw"
              >
                Admin Password
              </label>
              <input
                id="admin-pw"
                className={s.input}
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoComplete="current-password"
                aria-describedby={error ? "admin-error" : undefined}
              />
            </div>
            <button
              type="button"
              className={s.eyeBtn}
              tabIndex={-1}
              onClick={() => setShowPw((p) => !p)}
              aria-label={showPw ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            >
              {showPw ? <IconEyeClosed /> : <IconEyeOpen />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className={s.btn}
            aria-busy={loading}
          >
            {!loading && <div className={s.btnShine} aria-hidden="true" />}
            <div className={s.btnContent}>
              {loading ? (
                <>
                  <svg className={s.spinner} width="18" height="18" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                    <path fill="currentColor" opacity="0.75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  กำลังตรวจสอบ...
                </>
              ) : (
                <>
                  เข้าสู่ระบบ Admin
                  <IconArrow />
                </>
              )}
            </div>
          </button>
        </form>

        {/* Back */}
        <div className={s.backRow}>
          <Link href="/login" className={s.backLink}>
            ← กลับหน้า Login ปกติ
          </Link>
        </div>
      </div>
    </div>
  );
}
