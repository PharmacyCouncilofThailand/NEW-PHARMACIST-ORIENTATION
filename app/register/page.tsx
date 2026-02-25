"use client";

import { useState, useCallback, useEffect, useMemo, useRef, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";
import { useLang } from "../contexts/LangContext";
import s from "./register.module.css";

/* ═══════════════════════════════════════════
   CONSTANTS (outside component – never re-created)
═══════════════════════════════════════════ */
const UNIVERSITIES = {
  TH: [
    "จุฬาลงกรณ์มหาวิทยาลัย", "มหาวิทยาลัยมหิดล", "มหาวิทยาลัยเชียงใหม่",
    "มหาวิทยาลัยสงขลานครินทร์", "มหาวิทยาลัยขอนแก่น", "มหาวิทยาลัยศิลปากร",
    "มหาวิทยาลัยนเรศวร", "มหาวิทยาลัยศรีนครินทรวิโรฒ", "มหาวิทยาลัยมหาสารคาม",
    "มหาวิทยาลัยอุบลราชธานี", "มหาวิทยาลัยพะเยา", "มหาวิทยาลัยรังสิต",
    "มหาวิทยาลัยหัวเฉียวเฉลิมพระเกียรติ", "มหาวิทยาลัยสยาม", "มหาวิทยาลัยพายัพ",
    "มหาวิทยาลัยวลัยลักษณ์", "มหาวิทยาลัยบูรพา", "มหาวิทยาลัยอีสเทิร์นเอเชีย",
    "มหาวิทยาลัยธรรมศาสตร์", "มหาวิทยาลัยเวสเทิร์น",
    "สถาบันวิทยาการประกอบการแห่งอโยธยา", "สถาบันพระบรมราชชนก",
    "วิทยาลัยนครราชสีมา", "มหาวิทยาลัยเกษตรศาสตร์", "มหาวิทยาลัยปทุมธานี",
  ],
  EN: [
    "Chulalongkorn University", "Mahidol University", "Chiang Mai University",
    "Prince of Songkla University", "Khon Kaen University", "Silpakorn University",
    "Naresuan University", "Srinakharinwirot University", "Mahasarakham University",
    "Ubon Ratchathani University", "University of Phayao", "Rangsit University",
    "Huachiew Chalermprakiet University", "Siam University", "Payap University",
    "Walailak University", "Burapha University", "Eastern Asia University",
    "Thammasat University", "Western University",
    "Institute of Business Technology and Ayothaya", "Praboromarajchanok Institute",
    "Nakhon Ratchasima College", "Kasetsart University", "Pathumthani University",
  ],
} as const;

const STEP_COUNT = 2;

const STRENGTH_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"] as const;
const STRENGTH_LABELS = {
  TH: ["อ่อนมาก", "อ่อน", "ปานกลาง", "แข็งแรง"],
  EN: ["Weak", "Fair", "Good", "Strong"],
} as const;

const INITIAL_FORM = {
  firstName: "", lastName: "", licenseId: "", phone: "",
  email: "", password: "", confirmPassword: "",
} as const;

type FormData = { [K in keyof typeof INITIAL_FORM]: string };

/* ═══════════════════════════════════════════
   PURE HELPERS (referentially stable)
═══════════════════════════════════════════ */
function getPasswordStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

/* ═══════════════════════════════════════════
   ICON COMPONENTS (memoized – no re-render)
═══════════════════════════════════════════ */
const IconUser = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
));
IconUser.displayName = "IconUser";

const IconDoc = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
));
IconDoc.displayName = "IconDoc";

const IconUni = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
));
IconUni.displayName = "IconUni";

const IconPhone = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
));
IconPhone.displayName = "IconPhone";

const IconMail = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
));
IconMail.displayName = "IconMail";

const IconLock = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
));
IconLock.displayName = "IconLock";

const IconShield = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
));
IconShield.displayName = "IconShield";

const IconEyeOpen = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
));
IconEyeOpen.displayName = "IconEyeOpen";

const IconEyeClosed = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
));
IconEyeClosed.displayName = "IconEyeClosed";

const IconCheck = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
));
IconCheck.displayName = "IconCheck";

const IconChevron = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
  </svg>
));
IconChevron.displayName = "IconChevron";

const IconSearch = memo(() => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
));
IconSearch.displayName = "IconSearch";

const IconArrowRight = memo(() => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
));
IconArrowRight.displayName = "IconArrowRight";

const IconArrowLeft = memo(() => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
));
IconArrowLeft.displayName = "IconArrowLeft";

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════ */

/** Reusable floating-label input field */
interface FloatFieldProps {
  name: keyof FormData;
  label: string;
  icon: React.ReactNode;
  value: string;
  type?: string;
  autoComplete?: string;
  focused: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (name: string) => void;
  onBlur: () => void;
  rightSlot?: React.ReactNode;
}

const FloatField = memo<FloatFieldProps>(({
  name, label, icon, value, type = "text", autoComplete = "off",
  focused, onChange, onFocus, onBlur, rightSlot,
}) => {
  const isUp = focused === name || !!value;
  return (
    <div className={s.field}>
      <div className={`${s.inputWrap} ${focused === name ? s.inputWrapFocused : ""}`}>
        <span className={`${s.icon} ${isUp ? s.iconLit : ""}`}>{icon}</span>
        <div className={s.fieldInner}>
          <label className={`${s.label} ${isUp ? s.labelUp : ""}`}>{label}</label>
          <input
            className={s.input}
            name={name}
            type={type}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
            onFocus={() => onFocus(name)}
            onBlur={onBlur}
          />
        </div>
        {rightSlot && <div className={s.right}>{rightSlot}</div>}
      </div>
    </div>
  );
});
FloatField.displayName = "FloatField";

/** Password strength indicator */
const PasswordStrength = memo<{ strength: number; lang: string }>(({ strength, lang }) => (
  <div className={s.strength}>
    {[0, 1, 2, 3].map(i => (
      <div key={i} className={s.strBar}>
        <div
          className={s.strFill}
          style={{
            width: strength > i ? "100%" : "0%",
            background: STRENGTH_COLORS[strength - 1] || "#e2e8f0",
          }}
        />
      </div>
    ))}
    <span className={s.strLabel} style={{ color: STRENGTH_COLORS[strength - 1] }}>
      {lang === "TH"
        ? STRENGTH_LABELS.TH[strength - 1]
        : STRENGTH_LABELS.EN[strength - 1]}
    </span>
  </div>
));
PasswordStrength.displayName = "PasswordStrength";

/** Password match feedback */
const MatchFeedback = memo<{ match: boolean; lang: string }>(({ match, lang }) => (
  <div className={s.matchFeedback} style={{ color: match ? "#10b981" : "#ef4444" }}>
    {match ? (
      <>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
        {lang === "TH" ? "รหัสผ่านตรงกัน" : "Passwords match"}
      </>
    ) : (
      <>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
        {lang === "TH" ? "รหัสผ่านไม่ตรงกัน" : "Passwords do not match"}
      </>
    )}
  </div>
));
MatchFeedback.displayName = "MatchFeedback";

/* ═══════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════ */
export default function RegisterPage() {
  const router = useRouter();
  const { t, lang } = useLang();
  const { register } = useAuth();

  /* ── State (grouped logically) ── */
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({ ...INITIAL_FORM });
  const [university, setUni] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [uniOpen, setUniOpen] = useState(false);
  const [uniQuery, setUniQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);


  /* ── Derived values (memoized) ── */
  const uniList = useMemo(() => UNIVERSITIES[lang] ?? UNIVERSITIES.EN, [lang]);
  const pwStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);
  const pwMatch = formData.password === formData.confirmPassword;

  /* ── Handlers (stable via useCallback) ── */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  }, []);

  const handleFocus = useCallback((name: string) => setFocused(name), []);
  const handleBlur = useCallback(() => setFocused(null), []);

  const selectUni = useCallback((val: string) => {
    setUni(val);
    setUniOpen(false);
    setUniQuery("");
    setError("");
  }, []);

  const toggleUni = useCallback(() => {
    setUniOpen(prev => {
      if (!prev) setTimeout(() => searchRef.current?.focus(), 60);
      return !prev;
    });
    setUniQuery("");
  }, []);

  const filteredUni = useMemo(() => {
    if (!uniQuery.trim()) return uniList;
    const q = uniQuery.toLowerCase();
    return uniList.filter(u => u.toLowerCase().includes(q));
  }, [uniList, uniQuery]);

  /* close dropdown on outside click / Escape */
  useEffect(() => {
    if (!uniOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUniOpen(false);
        setUniQuery("");
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setUniOpen(false); setUniQuery(""); }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [uniOpen]);

  const goNext = useCallback(() => {
    const { firstName, lastName, licenseId, phone } = formData;
    if (!firstName || !lastName || !licenseId || !phone || !university) {
      setError(lang === "TH" ? "กรุณากรอกข้อมูลให้ครบทุกช่อง" : "Please fill in all fields");
      return;
    }
    setError("");
    setStep(2);
  }, [formData, university, lang]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { goNext(); return; }

    if (!pwMatch) {
      setError(lang === "TH" ? "รหัสผ่านไม่ตรงกัน" : "Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError(lang === "TH" ? "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" : "Minimum 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const ok = await register({ ...formData, university });
      if (ok) {
        setDone(true);
        setTimeout(() => router.push("/"), 1800);
      } else {
        setError(lang === "TH" ? "ไม่สามารถสมัครได้ กรุณาลองใหม่" : "Registration failed");
        setLoading(false);
      }
    } catch {
      setError(lang === "TH" ? "เกิดข้อผิดพลาด" : "An error occurred");
      setLoading(false);
    }
  }, [step, goNext, pwMatch, formData, university, lang, register, router]);

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
        {done ? (
          /* ── Success state ── */
          <div className={s.success}>
            <div className={s.successRing}>
              <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2>{lang === "TH" ? "สมัครสำเร็จ! 🎉" : "Registration Complete! 🎉"}</h2>
            <p>{lang === "TH" ? "กำลังพาคุณไปหน้าหลัก..." : "Redirecting to home..."}</p>
          </div>
        ) : (
          <>
            {/* ── Logo row ── */}
            <div className={s.top}>
              <Link href="/" className={s.logoWrap}>
                <Image src="/logo.jpg" alt="Logo" width={40} height={40} className={s.logoImg} quality={100} />
                <div>
                  <div className={s.logoText}>
                    {lang === "TH" ? "สภาเภสัชกรรม" : "Pharmacy Council"}
                  </div>
                  <div className={s.logoSub}>
                    {lang === "TH" ? "แห่งประเทศไทย" : "of Thailand"}
                  </div>
                </div>
              </Link>
            </div>

            {/* ── Header ── */}
            <div className={s.head}>
              <div className={s.eyebrow}>
                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="4" />
                </svg>
                {lang === "TH"
                  ? `ขั้นตอนที่ ${step} จาก ${STEP_COUNT}`
                  : `Step ${step} of ${STEP_COUNT}`}
              </div>
              <h1>
                {step === 1
                  ? (lang === "TH" ? "ข้อมูลส่วนตัว" : "Personal Info")
                  : (lang === "TH" ? "ตั้งค่าบัญชี" : "Account Setup")}
              </h1>
              <p>
                {step === 1
                  ? (lang === "TH" ? "กรุณากรอกชื่อ เลขใบอนุญาต และมหาวิทยาลัยของคุณ" : "Enter your name, license number, and university")
                  : (lang === "TH" ? "สร้างอีเมลและรหัสผ่านเพื่อเข้าใช้งาน" : "Set up your login email and password")}
              </p>
            </div>

            <div className={s.divider} />

            {/* ── Error ── */}
            {error && (
              <div className={s.error}>
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
                {error}
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className={s.formAnim} key={step}>
              {step === 1 ? (
                <div className={s.stepCol}>

                  {/* Name row */}
                  <div className={s.grid2}>
                    {(["firstName", "lastName"] as const).map(name => (
                      <FloatField
                        key={name}
                        name={name}
                        label={t(`register.${name}`)}
                        icon={<IconUser />}
                        value={formData[name]}
                        focused={focused}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    ))}
                  </div>

                  {/* License */}
                  <FloatField
                    name="licenseId"
                    label={t("register.licenseId")}
                    icon={<IconDoc />}
                    value={formData.licenseId}
                    focused={focused}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />

                  {/* University — custom dropdown */}
                  <div className={s.field} ref={dropdownRef}>
                    <div
                      className={`${s.inputWrap} ${uniOpen ? s.inputWrapFocused : ""}`}
                      onClick={toggleUni}
                      style={{ cursor: "pointer" }}
                    >
                      <span className={`${s.icon} ${university ? s.iconLit : ""}`}>
                        <IconUni />
                      </span>
                      <div className={s.fieldInner}>
                        <label className={`${s.label} ${university ? s.labelUp : ""}`}>
                          {lang === "TH" ? "มหาวิทยาลัย / สถาบัน" : "University / Institution"}
                        </label>
                        <div className={`${s.uniTrigger} ${!university ? s.uniTriggerPlaceholder : ""}`}>
                          {university || "\u00A0"}
                        </div>
                      </div>
                      <span className={`${s.uniChevron} ${uniOpen ? s.uniChevronOpen : ""}`}>
                        <IconChevron />
                      </span>
                    </div>

                    {uniOpen && (
                      <div className={s.uniPanel}>
                        {/* Search */}
                        <div className={s.uniSearch}>
                          <span className={s.uniSearchIcon}><IconSearch /></span>
                          <input
                            ref={searchRef}
                            className={s.uniSearchInput}
                            type="text"
                            placeholder={lang === "TH" ? "ค้นหามหาวิทยาลัย..." : "Search university..."}
                            value={uniQuery}
                            onChange={e => setUniQuery(e.target.value)}
                            onClick={e => e.stopPropagation()}
                          />
                        </div>

                        {/* Options */}
                        <div className={s.uniList} data-lenis-prevent>
                          {filteredUni.length > 0 ? (
                            filteredUni.map((u, i) => {
                              const isActive = u === university;
                              return (
                                <button
                                  key={i}
                                  type="button"
                                  className={`${s.uniOption} ${isActive ? s.uniOptionActive : ""}`}
                                  onClick={e => { e.stopPropagation(); selectUni(u); }}
                                >
                                  <span className={`${s.uniCheckmark} ${isActive ? s.uniCheckmarkActive : ""}`}>
                                    {isActive && (
                                      <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#fff">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </span>
                                  <span className={s.uniOptionLabel}>{u}</span>
                                </button>
                              );
                            })
                          ) : (
                            <div className={s.uniNoResults}>
                              {lang === "TH" ? "ไม่พบผลลัพธ์" : "No results found"}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <FloatField
                    name="phone"
                    label={t("register.phone")}
                    icon={<IconPhone />}
                    type="tel"
                    value={formData.phone}
                    focused={focused}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              ) : (
                /* ── Step 2: Account ── */
                <div className={s.stepCol}>

                  {/* Email */}
                  <FloatField
                    name="email"
                    label={t("register.email")}
                    icon={<IconMail />}
                    type="email"
                    value={formData.email}
                    focused={focused}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />

                  {/* Password */}
                  <FloatField
                    name="password"
                    label={t("register.password")}
                    icon={<IconLock />}
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    focused={focused}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    rightSlot={
                      <button type="button" className={s.eye} tabIndex={-1} onClick={() => setShowPw(p => !p)}>
                        {showPw ? <IconEyeClosed /> : <IconEyeOpen />}
                      </button>
                    }
                  />
                  {formData.password && <PasswordStrength strength={pwStrength} lang={lang} />}

                  {/* Confirm Password */}
                  <FloatField
                    name="confirmPassword"
                    label={t("register.confirmPassword")}
                    icon={<IconShield />}
                    type={showCpw ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    focused={focused}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    rightSlot={
                      <button type="button" className={s.eye} tabIndex={-1} onClick={() => setShowCpw(p => !p)}>
                        {showCpw ? <IconEyeClosed /> : <IconEyeOpen />}
                      </button>
                    }
                  />
                  {formData.confirmPassword && formData.password && (
                    <MatchFeedback match={pwMatch} lang={lang} />
                  )}
                </div>
              )}

              {/* ── Action buttons ── */}
              <div className={s.actionRow}>
                {step > 1 && (
                  <button
                    type="button"
                    className={s.btnBack}
                    onClick={() => { setStep(1); setError(""); }}
                  >
                    <IconArrowLeft />
                  </button>
                )}
                <button type="submit" disabled={loading} className={s.btn} style={{ flex: 1 }}>
                  {!loading && <div className={s.btnShine} />}
                  <div className={s.btnContent}>
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t("register.creating")}
                      </>
                    ) : step === 1 ? (
                      <>
                        {t("register.continue")}
                        <IconArrowRight />
                      </>
                    ) : (
                      <>
                        {lang === "TH" ? "สร้างบัญชี" : "Create Account"}
                        <IconCheck />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>

            {/* ── Login link ── */}
            <div className={s.loginRow}>
              <span>{t("register.hasAccount")}</span>
              <Link href="/login">{t("register.signIn")}</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
