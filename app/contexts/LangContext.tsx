"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

type Lang = "TH" | "EN";

// ===== TRANSLATION DICTIONARY =====
// Defined outside component — never re-created
const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.home": { TH: "หน้าแรก", EN: "Home" },
  "nav.welcome": { TH: "ยินดีต้อนรับ", EN: "Welcome" },
  "nav.agenda": { TH: "กำหนดการ", EN: "Agenda" },
  "nav.gallery": { TH: "ภาพบรรยากาศ", EN: "Gallery" },
  "nav.signIn": { TH: "เข้าสู่ระบบ", EN: "Sign In" },
  "nav.signUp": { TH: "สมัครสมาชิก", EN: "Sign Up" },

  // Hero
  "hero.subtitle1": { TH: "ร่วมเป็นส่วนหนึ่งของ", EN: "Be part of the" },
  "hero.future": { TH: "อนาคต", EN: "future" },
  "hero.subtitle2": {
    TH: "ของการบริบาลทางเภสัชกรรม",
    EN: "of pharmaceutical care.",
  },
  "hero.subtitle3": {
    TH: "เริ่มต้นเส้นทาง",
    EN: "Start your sustainable and valuable",
  },
  "hero.journey": { TH: "วิชาชีพ", EN: "professional journey" },
  "hero.subtitle4": { TH: "ที่ยั่งยืนและมีคุณค่ากับเรา", EN: "with us." },
  "hero.register": { TH: "ลงทะเบียนเลย", EN: "Register Now" },

  // Welcome Section
  "welcome.badge": { TH: "✨ เริ่มต้นการเดินทาง", EN: "✨ Start Your Journey" },
  "welcome.title1": { TH: "ข้อความ", EN: "Welcome " },
  "welcome.title2": { TH: "ต้อนรับ", EN: "Message" },
  "welcome.desc1": {
    TH: "เตรียมพร้อมในทุกด้านของการทำงาน",
    EN: "Prepare for every aspect of working life.",
  },
  "welcome.desc2": {
    TH: "ด้วยโปรแกรมที่ออกแบบมาเฉพาะสำหรับคุณ",
    EN: "With a comprehensive program designed especially for you.",
  },

  // Welcome Cards
  "card.org.title": { TH: "องค์กร", EN: "Organization" },
  "card.org.desc": {
    TH: "ทำความรู้จักโครงสร้าง วิสัยทัศน์ พันธกิจ และค่านิยมหลักที่เรายึดมั่นร่วมกัน",
    EN: "Get to know our structure, vision, mission, and the core values we uphold together.",
  },
  "card.dispensing.title": { TH: "ระบบจ่ายยา", EN: "Dispensing System" },
  "card.dispensing.desc": {
    TH: "เข้าใจขั้นตอนการจ่ายยาผู้ป่วยใน/นอก เทคโนโลยีที่ใช้ และการจัดการคลังยาสมัยใหม่",
    EN: "Understand the workflow of IPD/OPD dispensing, technology usage, and modern inventory management.",
  },
  "card.culture.title": { TH: "วัฒนธรรมของเรา", EN: "Our Culture" },
  "card.culture.desc": {
    TH: "สัมผัสบรรยากาศการทำงานที่อบอุ่น การทำงานเป็นทีม และระบบพี่เลี้ยง",
    EN: "Experience the warm working atmosphere, teamwork, and brother-sister mentorship.",
  },
  "card.career.title": { TH: "เส้นทางอาชีพ", EN: "Career Path" },
  "card.career.desc": {
    TH: "แนวทางความก้าวหน้าในอาชีพ การศึกษาเพิ่มเติม และสาขาเฉพาะทางสำหรับเภสัชกร",
    EN: "Guidance on career advancement, further education, and specialized fields for pharmacists.",
  },
  "card.learnMore": { TH: "เรียนรู้เพิ่มเติม", EN: "Learn more" },

  // Agenda Section
  "agenda.badge": { TH: "📅 กำหนดการ", EN: "📅 Schedule" },
  "agenda.title1": { TH: "กำหนดการ", EN: "Event " },
  "agenda.title2": { TH: "กิจกรรม", EN: "Agenda" },
  "agenda.subtitle1": { TH: "รายละเอียดกิจกรรมตลอด 3 วัน", EN: "Detailed activities throughout the 3-day orientation" },
  "agenda.subtitle2": { TH: "เพื่อเตรียมพร้อมสู่การปฏิบัติงานจริง", EN: "to prepare you for real-world practice." },
  "agenda.clickHint": { TH: "คลิกที่แต่ละกิจกรรมเพื่อดูรายละเอียด", EN: "Click each event to expand" },
  "agenda.sessions": { TH: "กิจกรรม", EN: "sessions" },
  "agenda.onDay": { TH: "ในวันที่", EN: "on Day" },
  "agenda.lectures": { TH: "บรรยาย", EN: "Lectures" },
  "agenda.workshops": { TH: "เวิร์กช็อป", EN: "Workshops" },
  "agenda.total": { TH: "รวม", EN: "Total" },
  "agenda.events": { TH: "กิจกรรม", EN: "Events" },
  "agenda.day": { TH: "วันที่", EN: "Day" },

  // Agenda Day themes
  "agenda.day1.theme": { TH: "รากฐาน", EN: "Foundation" },
  "agenda.day1.themeDesc": { TH: "สร้างฐานวิชาชีพของคุณ", EN: "Building your professional base" },

  // Agenda Day dates
  "agenda.day1.date": { TH: "10 มี.ค. 2569", EN: "Mar 10, 2026" },

  // Agenda Badge labels
  "agenda.badge.registration": { TH: "ลงทะเบียน", EN: "Registration" },
  "agenda.badge.ceremony": { TH: "พิธี", EN: "Ceremony" },
  "agenda.badge.lecture": { TH: "บรรยาย", EN: "Lecture" },
  "agenda.badge.workshop": { TH: "เวิร์กช็อป", EN: "Workshop" },
  "agenda.badge.break": { TH: "พัก", EN: "Break" },
  "agenda.badge.lunch": { TH: "พักกลางวัน", EN: "Lunch" },
  "agenda.badge.summary": { TH: "สรุป", EN: "Summary" },
  "agenda.badge.activity": { TH: "กิจกรรม", EN: "Activity" },

  // Agenda Duration labels
  "agenda.dur.15min": { TH: "15 นาที", EN: "15 min" },
  "agenda.dur.30min": { TH: "30 นาที", EN: "30 min" },
  "agenda.dur.60min": { TH: "60 นาที", EN: "60 min" },
  "agenda.dur.75min": { TH: "75 นาที", EN: "75 min" },
  "agenda.dur.90min": { TH: "90 นาที", EN: "90 min" },
  "agenda.dur.105min": { TH: "105 นาที", EN: "105 min" },
  "agenda.dur.120min": { TH: "120 นาที", EN: "120 min" },

  // Day 1 Events
  "agenda.d1e1.title": { TH: "ลงทะเบียนและรับเอกสาร", EN: "Registration & Documents" },
  "agenda.d1e1.desc": { TH: "ลงทะเบียนเข้าร่วมงานและรับเอกสาร/อุปกรณ์ที่จำเป็น", EN: "Register for the event and collect necessary documents/equipment." },
  "agenda.d1e1.meta": { TH: "📍 ห้องประชุมใหญ่ ชั้น 1", EN: "📍 Main Conference Room, 1st Fl." },
  "agenda.d1e2.title": { TH: "พิธีเปิดและต้อนรับ", EN: "Opening Ceremony & Welcome" },
  "agenda.d1e2.desc": { TH: "กล่าวต้อนรับโดยผู้อำนวยการโรงพยาบาลและแนะนำทีมบริหารเภสัชกรรม", EN: "Welcome speech by Hospital Director and introduction of the Pharmacy Executive Team." },
  "agenda.d1e2.meta": { TH: "👤 ผู้อำนวยการ / หัวหน้ากลุ่มงานเภสัชกรรม", EN: "👤 Director / Head of Pharmacy" },
  "agenda.d1e3.title": { TH: "โครงสร้างองค์กรและระบบเภสัชกรรม", EN: "Organization Structure & Pharmacy Systems" },
  "agenda.d1e3.desc": { TH: "ภาพรวมโครงสร้างแผนกเภสัชกรรม ระบบกระจายยา การจัดซื้อ และการจัดการคลังยา", EN: "Overview of pharmacy department structure, drug distribution system, purchasing, and inventory management." },
  "agenda.d1e3.meta": { TH: "👤 หัวหน้ากลุ่มงานเภสัชกรรม", EN: "👤 Head of Pharmacy Service Group" },
  "agenda.d1e4.title": { TH: "พักเบรก", EN: "Coffee Break" },
  "agenda.d1e4.desc": { TH: "☕ เครื่องดื่มและอาหารว่าง", EN: "☕ Refreshments and snacks" },
  "agenda.d1e5.title": { TH: "ระบบ IT และซอฟต์แวร์เภสัชกรรม", EN: "IT Systems & Pharmacy Software" },
  "agenda.d1e5.desc": { TH: "แนะนำระบบสารสนเทศโรงพยาบาล (HIS) ระบบจ่ายยาอัตโนมัติ และซอฟต์แวร์ที่เกี่ยวข้อง", EN: "Introduction to Hospital Information System (HIS), Automated Dispensing System, and related software." },
  "agenda.d1e5.meta": { TH: "👤 ทีมเภสัชสารสนเทศ", EN: "👤 Pharmacy Informatics Team" },
  "agenda.d1e6.title": { TH: "พักกลางวัน", EN: "Lunch Break" },
  "agenda.d1e6.desc": { TH: "🍽️ รับประทานอาหารกลางวันกับทีม", EN: "🍽️ Lunch with the team" },
  "agenda.d1e7.title": { TH: "เวิร์กช็อป: ระบบจ่ายยาผู้ป่วยนอก", EN: "Workshop: OPD Dispensing System" },
  "agenda.d1e7.desc": { TH: "ฝึกปฏิบัติจริงที่เภสัชกรรมผู้ป่วยนอก: คัดกรอง ตรวจสอบ จ่ายยา และให้คำปรึกษา", EN: "Hands-on practice at OPD Pharmacy: Prescription screening, checking, dispensing, and counseling." },
  "agenda.d1e7.meta": { TH: "📍 เภสัชกรรมผู้ป่วยนอก", EN: "📍 OPD Pharmacy" },
  "agenda.d1e8.title": { TH: "ความปลอดภัยด้านยาและการรายงาน ADR", EN: "Drug Safety & ADR Reporting" },
  "agenda.d1e8.desc": { TH: "การป้องกันความคลาดเคลื่อนทางยา LASA ยาที่ต้องเฝ้าระวังสูง และระบบรายงาน ADR", EN: "Medication error prevention, LASA, High Alert Drugs, and ADR reporting systems." },
  "agenda.d1e8.meta": { TH: "👤 เภสัชกรข้อมูลยาและความปลอดภัย", EN: "👤 DI & Safety Pharmacist" },
  "agenda.d1e9.title": { TH: "สรุปและถาม-ตอบ", EN: "Summary & Q&A" },
  "agenda.d1e9.desc": { TH: "สรุปประจำวัน ถาม-ตอบ และนัดหมายวันถัดไป", EN: "Daily wrap-up, Q&A session, and next day's appointment." },

  // Memories Section
  "memories.badge": { TH: "📸 ภาพบรรยากาศ", EN: "📸 Gallery" },
  "memories.title1": { TH: "ภาพ", EN: "Cherished " },
  "memories.title2": { TH: "ความทรงจำ", EN: "Memories" },

  // Footer
  // Footer


  // Login
  "login.welcome": { TH: "ยินดีต้อนรับ", EN: "Welcome" },
  "login.subtitle": {
    TH: "เข้าสู่ระบบบัญชีของคุณ",
    EN: "Sign in to your account",
  },
  "login.email": { TH: "อีเมล", EN: "Email Address" },
  "login.password": { TH: "รหัสผ่าน", EN: "Password" },
  "login.forgot": { TH: "ลืม?", EN: "Forgot?" },
  "login.signingIn": { TH: "กำลังเข้าสู่ระบบ...", EN: "Signing in..." },
  "login.signIn": { TH: "เข้าสู่ระบบ", EN: "Sign In" },
  "login.or": { TH: "หรือ", EN: "or" },

  "login.createAccount": { TH: "สร้างบัญชีใหม่ →", EN: "Create an account →" },

  // Register
  "register.step.personal": { TH: "ข้อมูลส่วนตัว", EN: "Personal" },
  "register.step.credentials": { TH: "ข้อมูลเข้าระบบ", EN: "Credentials" },
  "register.createAccount": { TH: "สร้างบัญชี", EN: "Create Account" },
  "register.secureAccount": { TH: "ตั้งค่าบัญชี", EN: "Secure Your Account" },
  "register.personalInfo": {
    TH: "เริ่มต้นด้วยข้อมูลส่วนตัวของคุณ",
    EN: "Let's start with your personal info",
  },
  "register.credentialInfo": {
    TH: "ตั้งค่าข้อมูลสำหรับเข้าสู่ระบบ",
    EN: "Set up your login credentials",
  },
  "register.firstName": { TH: "ชื่อ", EN: "First Name" },
  "register.lastName": { TH: "นามสกุล", EN: "Last Name" },
  "register.email": { TH: "อีเมล", EN: "Email Address" },
  "register.password": { TH: "รหัสผ่าน", EN: "Password" },
  "register.confirmPassword": { TH: "ยืนยันรหัสผ่าน", EN: "Confirm Password" },
  "register.continue": { TH: "ถัดไป", EN: "Continue" },
  "register.creating": {
    TH: "กำลังสร้างบัญชี...",
    EN: "Creating account...",
  },
  "register.hasAccount": {
    TH: "มีบัญชีอยู่แล้ว?",
    EN: "Already have an account?",
  },
  "register.signIn": { TH: "เข้าสู่ระบบ →", EN: "Sign in →" },

  // Banner
  "banner.new": { TH: "ใหม่", EN: "New" },
  "banner.text": { TH: "เปิดรับลงทะเบียน", EN: "Registration for" },
  "banner.event": {
    TH: "ปฐมนิเทศเภสัชกร 2026",
    EN: "Pharmacy Orientation 2026",
  },
  "banner.open": { TH: "แล้ว!", EN: "is now OPEN!" },
  "banner.earlyBird": {
    TH: "รับส่วนลด Early Bird",
    EN: "Get Early Bird Discount",
  },

  // Branding
  "nav.brand": { TH: "ปฐมนิเทศเภสัชกรใหม่", EN: "New Pharmacist Orientation" },
  "hero.mainTitle1": { TH: "ปฐมนิเทศ", EN: "NEW PHARMACIST" },
  "hero.mainTitle2": { TH: "เภสัชกรใหม่", EN: "ORIENTATION" },
  "footer.brandName": { TH: "ปฐมนิเทศเภสัชกรใหม่", EN: "New Pharmacist Orientation" },
  "footer.address": {
    TH: "สำนักงานเลขาธิการสภาเภสัชกรรม อาคารมหิตลาธิเบศร ชั้น 8 กระทรวงสาธารณสุข เลขที่ 88/19 หมู่ 4 ถนนติวานนท์ ตำบลตลาดขวัญ อำเภอเมือง จังหวัดนนทบุรี 11000",
    EN: "The Pharmacy Council of Thailand, Mahitsalathibet Building, 8th Floor, Ministry of Public Health, 88/19 Moo 4, Tiwanon Road, Talat Khwan, Mueang Nonthaburi, Nonthaburi 11000"
  },


  // Login/Register overrides
  "login.noAccount": {
    TH: "ยังไม่มีบัญชี?",
    EN: "New to Orientation?",
  },
};

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "TH",
  toggleLang: () => {},
  t: (key: string) => key,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("TH");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pharma-lang") as Lang | null;
    if (saved) setLang(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("pharma-lang", lang);
  }, [lang, mounted]);

  // Memoize toggleLang to prevent new function reference every render
  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "TH" ? "EN" : "TH"));
  }, []);

  // Memoize `t` — only changes when `lang` changes
  const t = useCallback(
    (key: string): string => {
      return translations[key]?.[lang] || key;
    },
    [lang]
  );

  // Memoize context value to prevent re-renders of all consumers
  const value = useMemo<LangContextType>(
    () => ({ lang, toggleLang, t }),
    [lang, toggleLang, t]
  );

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
