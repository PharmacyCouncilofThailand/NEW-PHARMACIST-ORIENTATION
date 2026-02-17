"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "../contexts/LangContext";

const steps = [
  { id: 1, key: "register.step.personal" },
  { id: 2, key: "register.step.credentials" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Memoized — uses functional update to avoid formData in deps
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleNext = () => {
    if (step === 1 && formData.firstName && formData.lastName) {
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      handleNext();
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  const renderField = (name: string, labelKey: string, type: string = "text") => {
    const value = formData[name as keyof typeof formData];
    return (
      <div className="relative">
        <label
          className={`absolute left-4 transition-all duration-300 pointer-events-none z-10 ${
            focusedField === name || value
              ? "top-2 text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400"
              : "top-1/2 -translate-y-1/2 text-sm text-slate-400"
          }`}
        >
          {t(labelKey)}
        </label>
        <input
          type={type}
          name={name}
          required
          className={`w-full px-4 pt-7 pb-3 rounded-2xl border-2 outline-none transition-all duration-300 font-medium text-slate-700 dark:text-white bg-white/60 dark:bg-white/5 backdrop-blur-sm ${
            focusedField === name
              ? "border-violet-400 shadow-[0_0_0_4px_rgba(124,58,237,0.08)]"
              : "border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
          }`}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField(null)}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* ===== FULL-SCREEN BACKGROUND ===== */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-[#eef2ff] to-[#f0f9ff] dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#0f172a]" />
      <div className="absolute inset-0 aurora-bg opacity-30 pointer-events-none" />

      {/* Perspective Grid */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124, 58, 237, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          transform: "perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)",
          maskImage: "linear-gradient(to bottom, transparent 0%, white 40%, white 80%, transparent 100%)",
        }}
      />

      {/* Floating Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-violet-400/15 blur-[120px] rounded-full animate-float-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-blue-400/15 blur-[120px] rounded-full animate-float pointer-events-none" />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">

          {/* Logo */}
          <div className="text-center mb-10 animate-fade-slide">
            <Link href="/" className="inline-block group">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-white dark:border-slate-700 shadow-xl shadow-violet-200/30 dark:shadow-violet-900/30 flex items-center justify-center p-1.5 transition-transform group-hover:scale-110">
                <Image src="/logo.jpg" alt="Pharmacy Council" width={68} height={68} className="rounded-full object-cover" quality={100} />
              </div>
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-3 mb-8 animate-fade-slide" style={{ animationDelay: '50ms' }}>
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => s.id < step && setStep(s.id)}
                className="flex items-center gap-2"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    step >= s.id
                      ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md shadow-violet-200/50"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-400"
                  }`}
                >
                  {step > s.id ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.id
                  )}
                </div>
                <span className={`text-xs font-bold transition-colors ${step >= s.id ? "text-slate-700 dark:text-white" : "text-slate-400"}`}>
                  {t(s.key)}
                </span>
                {s.id < steps.length && (
                  <div className={`w-10 h-0.5 rounded-full transition-colors duration-500 ${step > s.id ? "bg-violet-400" : "bg-slate-200 dark:bg-slate-700"}`} />
                )}
              </button>
            ))}
          </div>

          {/* Main Card */}
          <div className="glass-card rounded-[2rem] p-10 animate-fade-slide" style={{ animationDelay: '100ms' }}>

            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">
                {step === 1 ? t("register.createAccount") : t("register.secureAccount")}
              </h1>
              <p className="text-slate-400 text-[15px]">
                {step === 1 ? t("register.personalInfo") : t("register.credentialInfo")}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 ? (
                <div className="space-y-5">
                  {renderField("firstName", "register.firstName")}
                  {renderField("lastName", "register.lastName")}
                </div>
              ) : (
                <div className="space-y-5">
                  {renderField("email", "register.email", "email")}
                  {renderField("password", "register.password", "password")}
                  {renderField("confirmPassword", "register.confirmPassword", "password")}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="w-14 h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-700 text-slate-400 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-slate-600 hover:text-slate-600 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative flex-1 py-4 rounded-2xl text-white font-bold text-[15px] shadow-lg transition-all duration-300 overflow-hidden
                    ${isLoading
                      ? "bg-slate-300 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-violet-600 to-blue-600 hover:shadow-[0_10px_40px_-10px_rgba(124,58,237,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
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
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    ) : (
                      <>
                        {t("register.createAccount")}
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </span>
                  {!isLoading && <div className="absolute inset-0 animate-shimmer pointer-events-none" />}
                </button>
              </div>
            </form>
          </div>

          {/* Login Link */}
          <div className="mt-8 animate-fade-slide" style={{ animationDelay: '200ms' }}>
            <Link
              href="/login"
              className="group block w-full glass-card rounded-2xl p-5 text-center hover:shadow-lg hover:shadow-violet-100/50 dark:hover:shadow-violet-900/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("register.hasAccount")}{" "}
                <span className="font-bold text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                  {t("register.signIn")}
                </span>
              </p>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
