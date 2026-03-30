"use client";

import { useState, useCallback, Suspense, memo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "../contexts/LangContext";
import { useAuth } from "../contexts/AuthContext";
import FloatingLangToggle from "../components/ui/FloatingLangToggle";
import s from "./login.module.css";

/* ═══════════════════════════════════════════
   ICON COMPONENTS (memoized)
═══════════════════════════════════════════ */
const IconMail = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
));
IconMail.displayName = "IconMail";

const IconLock = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
  </svg>
));
IconLock.displayName = "IconLock";

const IconEyeOpen = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
));
IconEyeOpen.displayName = "IconEyeOpen";

const IconEyeClosed = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
  </svg>
));
IconEyeClosed.displayName = "IconEyeClosed";

const IconArrowRight = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
  </svg>
));
IconArrowRight.displayName = "IconArrowRight";

/* ═══════════════════════════════════════════
   MAIN PAGE (Suspense wrapper for useSearchParams)
═══════════════════════════════════════════ */
export default function LoginPage() {
  return (
    <Suspense fallback={<div className={s.root}><div className={s.bg} /></div>}>
      <FloatingLangToggle />
      <LoginContent />
    </Suspense>
  );
}

/* ═══════════════════════════════════════════
   LOGIN CONTENT
═══════════════════════════════════════════ */
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useLang();
  const { login } = useAuth();

  /* ── State ── */
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [focused, setFocused]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  /* ── Handlers ── */
  const handleFocus = useCallback((name: string) => setFocused(name), []);
  const handleBlur  = useCallback(() => setFocused(null), []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setError(lang === "TH" ? "กรุณายืนยันว่าคุณไม่ใช่บอท" : "Please verify that you are not a robot");
      return;
    }

    setError("");
    setLoading(true);
    const ok = await login(email, password, recaptchaToken);
    if (ok) {
      const from = searchParams.get("from") || "/";
      router.push(from);
    } else {
      setError(t("login.error"));
      setLoading(false);
      // Reset reCAPTCHA on failure
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  }, [email, password, login, searchParams, router, lang, recaptchaToken, t]);

  /* ═════════════════════════════════
     RENDER
  ═════════════════════════════════ */
  return (
    <div className={s.root}>
      {/* Background layers */}
      <div className={s.bg} />
      <div className={s.dots} />
      <div className={s.orb1} />
      <div className={s.orb2} />

      <div className={s.card}>
        {/* ── Logo row ── */}
        <div className={s.top}>
          <Link href="/" className={s.logoWrap}>
            <Image src="/logo สภาเภสัชกรรม.jpg" alt="Logo" width={40} height={40} className={s.logoImg} quality={100} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className={s.logoText}>
                {t("nav.brand")}
              </div>
              <div className={s.logoSub}>
                The Pharmacy Council of Thailand
              </div>
            </div>
          </Link>
        </div>

        {/* ── Header ── */}
        <div className={s.head}>
          <div className={s.eyebrow}>
            <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="4"/>
            </svg>
            {t("nav.signIn")}
          </div>
          <h1>{t("login.welcome")}</h1>
          <p>{t("login.subtitle")}</p>
        </div>

        <div className={s.divider} />

        {/* ── Error ── */}
        {error && (
          <div className={s.error}>
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z"/>
            </svg>
            {error}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className={s.formAnim}>
          <div className={s.stepCol}>

            {/* Email */}
            <div className={s.field}>
              <div className={`${s.inputWrap} ${focused === "email" ? s.inputWrapFocused : ""}`}>
                <span className={`${s.icon} ${focused === "email" || email ? s.iconLit : ""}`}>
                  <IconMail />
                </span>
                <div className={s.fieldInner}>
                  <label className={`${s.label} ${focused === "email" || email ? s.labelUp : ""}`}>
                    {t("login.email")}
                  </label>
                  <input
                    className={s.input}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className={s.field}>
              <div className={`${s.inputWrap} ${focused === "password" ? s.inputWrapFocused : ""}`}>
                <span className={`${s.icon} ${focused === "password" || password ? s.iconLit : ""}`}>
                  <IconLock />
                </span>
                <div className={s.fieldInner}>
                  <label className={`${s.label} ${focused === "password" || password ? s.labelUp : ""}`}>
                    {t("login.password")}
                  </label>
                  <input
                    className={s.input}
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    onFocus={() => handleFocus("password")}
                    onBlur={handleBlur}
                  />
                </div>
                <div className={s.right} style={{ display: "flex", alignItems: "center", gap: ".25rem" }}>
                  <button
                    type="button"
                    className={s.eye}
                    tabIndex={-1}
                    onClick={() => setShowPw(p => !p)}
                  >
                    {showPw ? <IconEyeClosed /> : <IconEyeOpen />}
                  </button>
                  <a href="#" className={s.forgotLink}>{t("login.forgot")}</a>
                </div>
              </div>
            </div>

          </div>

          <div className={`${s.field} mt-6 mb-4 flex justify-center w-full`}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"} // using a dummy key if not provided for dev
              onChange={(token) => {
                setRecaptchaToken(token);
                if (token) setError("");
              }}
              theme="light"
              hl="en"
            />
          </div>

          {/* ── Submit button ── */}
          <button type="submit" disabled={loading} className={s.btn}>
            {!loading && <div className={s.btnShine} />}
            <div className={s.btnContent}>
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  {t("login.signingIn")}
                </>
              ) : (
                <>
                  {t("login.signIn")}
                  <IconArrowRight />
                </>
              )}
            </div>
          </button>
        </form>

        {/* ── Register link ── */}
        <div className={s.registerRow}>
          <span>{t("login.noAccount")}</span>
          <Link href="/register">{t("login.createAccount")}</Link>
        </div>

      </div>
    </div>
  );
}
