"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "../contexts/LangContext";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/");
    }, 1500);
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
      <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-violet-400/15 blur-[120px] rounded-full animate-float pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-blue-400/15 blur-[120px] rounded-full animate-float-slow pointer-events-none" />

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

          {/* Main Card */}
          <div className="glass-card rounded-[2rem] p-10 animate-fade-slide" style={{ animationDelay: '100ms' }}>
            
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">{t("login.welcome")}</h1>
              <p className="text-slate-400 text-[15px]">{t("login.subtitle")}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <label
                  className={`absolute left-4 transition-all duration-300 pointer-events-none z-10 ${
                    focusedField === 'email' || email
                      ? 'top-2 text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400'
                      : 'top-1/2 -translate-y-1/2 text-sm text-slate-400'
                  }`}
                >
                  {t("login.email")}
                </label>
                <input
                  type="email"
                  required
                  className={`w-full px-4 pt-7 pb-3 rounded-2xl border-2 outline-none transition-all duration-300 font-medium text-slate-700 dark:text-white bg-white/60 dark:bg-white/5 backdrop-blur-sm ${
                    focusedField === 'email'
                      ? 'border-violet-400 shadow-[0_0_0_4px_rgba(124,58,237,0.08)]'
                      : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <label
                  className={`absolute left-4 transition-all duration-300 pointer-events-none z-10 ${
                    focusedField === 'password' || password
                      ? 'top-2 text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400'
                      : 'top-1/2 -translate-y-1/2 text-sm text-slate-400'
                  }`}
                >
                  {t("login.password")}
                </label>
                <input
                  type="password"
                  required
                  className={`w-full px-4 pt-7 pb-3 rounded-2xl border-2 outline-none transition-all duration-300 font-medium text-slate-700 dark:text-white bg-white/60 dark:bg-white/5 backdrop-blur-sm ${
                    focusedField === 'password'
                      ? 'border-violet-400 shadow-[0_0_0_4px_rgba(124,58,237,0.08)]'
                      : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <a href="#" className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-violet-500 hover:text-violet-700 transition-colors">
                  {t("login.forgot")}
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full py-4 rounded-2xl text-white font-bold text-[15px] shadow-lg transition-all duration-300 overflow-hidden mt-2
                  ${isLoading
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:shadow-[0_10px_40px_-10px_rgba(124,58,237,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-md'
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t("login.signingIn")}
                    </>
                  ) : (
                    <>
                      {t("login.signIn")}
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </span>
                {!isLoading && <div className="absolute inset-0 animate-shimmer pointer-events-none" />}
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8 animate-fade-slide" style={{ animationDelay: '200ms' }}>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-700" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{t("login.or")}</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-700" />
          </div>

          {/* Register Link */}
          <div className="animate-fade-slide" style={{ animationDelay: '300ms' }}>
            <Link
              href="/register"
              className="group block w-full glass-card rounded-2xl p-5 text-center hover:shadow-lg hover:shadow-violet-100/50 dark:hover:shadow-violet-900/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("login.noAccount")}{" "}
                <span className="font-bold text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                  {t("login.createAccount")}
                </span>
              </p>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
