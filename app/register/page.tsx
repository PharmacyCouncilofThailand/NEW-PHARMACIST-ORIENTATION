"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../contexts/AuthContext";
import { useLang } from "../contexts/LangContext";
import FloatingLangToggle from "../components/ui/FloatingLangToggle";
import ConsentModal from "../components/ui/ConsentModal";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { t, lang } = useLang();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    licenseId: "",
    email: "",
    university: "",
    phone: "",
    password: "",
    confirmPassword: "",
    consent: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUniOpen, setIsUniOpen] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const UNI_OPTIONS = [
    "จุฬาลงกรณ์มหาวิทยาลัย", "มหาวิทยาลัยมหิดล", "มหาวิทยาลัยเชียงใหม่",
    "มหาวิทยาลัยสงขลานครินทร์", "มหาวิทยาลัยขอนแก่น", "มหาวิทยาลัยศิลปากร",
    "มหาวิทยาลัยนเรศวร", "มหาวิทยาลัยศรีนครินทรวิโรฒ", "มหาวิทยาลัยมหาสารคาม",
    "มหาวิทยาลัยอุบลราชธานี", "มหาวิทยาลัยพะเยา", "มหาวิทยาลัยรังสิต",
    "มหาวิทยาลัยหัวเฉียวเฉลิมพระเกียรติ", "มหาวิทยาลัยสยาม", "มหาวิทยาลัยพายัพ",
    "มหาวิทยาลัยวลัยลักษณ์", "มหาวิทยาลัยบูรพา", "มหาวิทยาลัยอีสเทิร์นเอเชีย",
    "มหาวิทยาลัยธรรมศาสตร์", "มหาวิทยาลัยเวสเทิร์น", "สถาบันวิทยาการประกอบการแห่งอโยธยา",
    "สถาบันพระบรมราชชนก", "วิทยาลัยนครราชสีมา", "มหาวิทยาลัยเกษตรศาสตร์",
    "มหาวิทยาลัยปทุมธานี"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match"); return;
    }
    if (!formData.consent) {
      setError("Please accept the terms and conditions"); return;
    }
    if (!recaptchaToken) {
      setError(lang === "TH" ? "กรุณายืนยันว่าคุณไม่ใช่บอท" : "Please verify that you are not a robot"); return;
    }
    setLoading(true); setError("");
    try {
      const eventCode = process.env.NEXT_PUBLIC_EVENT_CODE || "";
      const ok = await register({ ...formData, recaptchaToken, ...(eventCode && { eventCode }) });
      if (ok) {
        router.push("/");
      } else {
        setError("Registration failed");
        setLoading(false);
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  };

  return (
    <div className="min-h-[100svh] relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#fdfdfd] overflow-x-hidden">
      <FloatingLangToggle />
      
      {/* Decorative Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[100px]" />
        {/* Subtle Dots Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.06)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_30%,transparent_100%)]" />
      </div>

      <div className="max-w-2xl w-full relative z-10">
        
        {/* Main Card */}
        <div className="bg-white/80 md:backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] rounded-[2rem] p-5 sm:p-8 relative">
          
          {/* Card Top Glow - Wrapped and clipped accurately */}
          <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-blue-500 to-indigo-500 opacity-80" />
          </div>

          <div className="mb-5 flex flex-col items-center relative">
            <Link href="/" className="absolute left-0 top-1 text-slate-400 hover:text-violet-600 transition-colors group flex items-center justify-center w-8 h-8 rounded-full hover:bg-violet-50">
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            
            <div className="w-14 h-14 flex items-center justify-center mb-3 shrink-0">
              <Image src="/logo สภาเภสัชกรรม.jpg" alt="Pharmacy Council of Thailand" width={56} height={56} className="object-contain w-full h-full" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t("register.createAccount")}</h2>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-[13px] font-semibold p-4 border border-red-100 bg-red-50/50 rounded-xl mb-6 animate-[fadeIn_0.3s_ease]">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {error}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1 ml-1">{t("register.firstName")} <span className="text-red-500">*</span></label>
                <input name="firstName" required value={formData.firstName} onChange={handleChange} placeholder={t("register.firstName")} className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-xl px-4 py-2 text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all font-medium" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1 ml-1">{t("register.lastName")} <span className="text-red-500">*</span></label>
                <input name="lastName" required value={formData.lastName} onChange={handleChange} placeholder={t("register.lastName")} className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-xl px-4 py-2 text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1 ml-1">{t("nav.license")} <span className="text-red-500">*</span></label>
                <input name="licenseId" required value={formData.licenseId} onChange={handleChange} placeholder={t("nav.licenseId")} className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-xl px-4 py-2 text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all font-medium" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1 ml-1">{t("register.phone")}</label>
                <div className="flex w-full border-2 border-slate-100 bg-slate-50/50 rounded-xl overflow-hidden focus-within:border-violet-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-500/10 transition-all relative">
                  <div className="absolute left-4 top-[50%] -translate-y-[50%]">
                    <span className="text-[17px] leading-none opacity-80 flex items-center pointer-events-none">🇹🇭</span>
                  </div>
                  <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder={t("register.phone")} className="flex-1 pl-12 pr-4 py-2 text-[14px] font-medium text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent w-full" />
                </div>
              </div>
            </div>

            <div>
              <div className="relative z-[100]">
                <label className="block text-[13px] font-bold text-slate-700 mb-1 ml-1">{t("register.university")} <span className="text-red-500">*</span></label>
                
                <div 
                  className={`relative w-full border-2 bg-slate-50/50 rounded-xl px-4 py-2 text-[14px] font-medium cursor-pointer transition-all flex items-center justify-between
                    ${isUniOpen ? 'border-violet-500 bg-white ring-4 ring-violet-500/10' : 'border-slate-100 hover:border-slate-200'}
                    ${!formData.university ? 'text-slate-400' : 'text-slate-900'}
                  `}
                  onClick={() => setIsUniOpen(!isUniOpen)}
                >
                  <span className="truncate">{formData.university || t("register.selectUniversity")}</span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isUniOpen ? 'rotate-180 text-violet-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Custom Dropdown Panel */}
                {isUniOpen && (
                  <>
                    {/* Invisible overlay to close dropdown on outside click */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsUniOpen(false)} />
                    
                    <div 
                      className="absolute z-[999] left-0 right-0 mt-2 bg-white border border-slate-100 shadow-[0_12px_45px_-12px_rgba(0,0,0,0.15)] rounded-xl opacity-0 animate-[dropIn_0.2s_ease_both] origin-top"
                    >
                      <ul 
                        className="max-h-[260px] overflow-y-auto py-1 m-0 list-none rounded-xl relative pointer-events-auto"
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
                      >
                        {UNI_OPTIONS.map((uni) => (
                          <li
                            key={uni}
                            className={`px-4 py-2.5 text-[14px] font-medium cursor-pointer transition-colors flex items-center justify-between
                              ${formData.university === uni ? 'bg-violet-50 text-violet-700' : 'text-slate-700 hover:bg-slate-50'}
                            `}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, university: uni }));
                              setIsUniOpen(false);
                            }}
                          >
                            <span className="truncate pr-2">{uni}</span>
                            {formData.university === uni && (
                              <svg className="w-5 h-5 text-violet-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Dropdown Animation Keyframes */}
                    <style dangerouslySetInnerHTML={{__html: `
                      @keyframes dropIn {
                        from { opacity: 0; transform: translateY(-8px) scale(0.98); }
                        to   { opacity: 1; transform: translateY(0) scale(1); }
                      }
                    `}} />
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1 ml-1">{t("register.email")} <span className="text-red-500">*</span></label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="email@example.com" className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-xl px-4 py-2 text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all font-medium" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1 ml-1">{t("register.password")} <span className="text-red-500">*</span></label>
                <input name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-xl px-4 py-2 text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all font-medium" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1 ml-1">{t("register.confirmPassword")} <span className="text-red-500">*</span></label>
                <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-xl px-4 py-2 text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all font-medium" />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-start gap-3">
                {/* Checkbox toggle — clicking also opens modal if unchecked */}
                <div
                  className="relative flex items-center justify-center mt-0.5 shrink-0 cursor-pointer"
                  onClick={() => {
                    if (!formData.consent) setIsConsentOpen(true);
                    else setFormData(prev => ({ ...prev, consent: false }));
                  }}
                >
                  <div className={`w-5 h-5 border-2 rounded-[6px] transition-all
                    ${formData.consent
                      ? 'bg-violet-500 border-violet-500'
                      : 'bg-slate-50 border-slate-300 hover:border-violet-400'
                    }`}
                  />
                  {formData.consent && (
                    <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {/* Label — clicking opens the modal */}
                <button
                  type="button"
                  onClick={() => setIsConsentOpen(true)}
                  className="text-left text-[13.5px] font-medium leading-snug transition-colors"
                >
                  <span className={formData.consent ? 'text-slate-700' : 'text-slate-600 hover:text-violet-700'}>
                    {t("register.consent")}{" "}
                    <span className="underline underline-offset-2 text-violet-600 font-semibold">
                      (คลิกอ่านข้อตกลง)
                    </span>
                  </span>{" "}
                  <span className="text-red-500">*</span>
                </button>
              </div>
            </div>

            {/* Consent Modal */}
            <ConsentModal
              isOpen={isConsentOpen}
              onClose={() => setIsConsentOpen(false)}
              onAccept={() => setFormData(prev => ({ ...prev, consent: true }))}
            />

            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                onChange={(token) => { setRecaptchaToken(token); if (token) setError(""); }}
                theme="light"
                hl="en"
              />
            </div>

            <div className="pt-4 relative">
              <button type="submit" disabled={loading} className="group w-full flex justify-center py-3 px-4 rounded-xl text-[15px] font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-[0_4px_14px_0_rgba(124,58,237,0.39)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                       <svg className="animate-spin h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t("register.creating")}
                    </>
                  ) : (
                    t("register.createAccount")
                  )}
                </span>
                <div className="absolute inset-0 h-full w-full bg-[linear-gradient(wrap_0deg,transparent,rgba(255,255,255,0.1))] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
            
            <div className="text-center mt-4 pt-4 border-t border-slate-100">
              <span className="text-[14px] text-slate-500 font-medium">{t("register.alreadyAccount")} </span>
              <Link href="/login" className="text-[14px] font-bold text-violet-600 hover:text-blue-600 transition-colors">{t("register.signIn")}</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
