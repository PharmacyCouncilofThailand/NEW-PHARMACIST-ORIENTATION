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
  "nav.signOut": { TH: "ออกจากระบบ", EN: "Sign Out" },
  "nav.license": { TH: "ใบอนุญาต", EN: "License" },
  "nav.examId": { TH: "เลขที่นั่งสอบ", EN: "Exam Seat No." },
  "nav.phone": { TH: "เบอร์โทร", EN: "Phone" },

  // Hero
  "hero.subtitle1": { TH: "ยินดีต้อนรับ เภสัชกรใหม่ สู่", EN: "Warmly welcoming new pharmacists to the" },
  "hero.future": { TH: "โลกวิชาชีพ", EN: "professional world" },
  "hero.subtitle2": {
    TH: "อย่างเต็มตัว",
    EN: "fully.",
  },
  "hero.subtitle3": {
    TH: "แล้วมาพบกันใน",
    EN: "See you at the",
  },
  "hero.journey": { TH: "งานปฐมนิเทศเภสัชกรใหม่ปี 2569", EN: "New Pharmacist Orientation 2026" },
  "hero.subtitle4": { TH: "เพื่อเริ่มต้นการเดินทางไปด้วยกัน", EN: "to start our journey together." },
  "hero.register": { TH: "ลงทะเบียนเลย", EN: "Register Now" },
  "hero.explore": { TH: "สำรวจเส้นทาง", EN: "Explore Path" },

  // Welcome Section
  "welcome.badge": { TH: "✨ สารจากนายกสภาเภสัชกรรม", EN: "✨ Message from the President" },
  "welcome.title1": { TH: "งานปฐมนิเทศ", EN: "New Pharmacist" },
  "welcome.title2": { TH: "เภสัชกรใหม่ ปี 2569", EN: "Orientation 2026" },
  "welcome.eventDate": { TH: "วันเสาร์ที่ 17 พฤษภาคม 2569 เวลา 10.00 - 16.00 น.", EN: "Saturday, May 17, 2026 | 10:00 AM - 4:00 PM" },
  "welcome.location": { TH: "ห้องสิริวัฒนภักดี ชั้น 3 อาคารมหิตลาธิเบศร กระทรวงสาธารณสุข จ.นนทบุรี", EN: "Siriwattana Phakdee Room, 3rd Fl, Mahitsalathibet Bldg, MOPH" },
  "welcome.message": {
    TH: "สภาเภสัชกรรม ยินดีกับเภสัชกรใหม่ที่สอบผ่าน และขอต้อนรับเภสัชกรใหม่ทุกท่าน ก้าวเข้าสู่การประกอบวิชาชีพเภสัชกรรมอย่างเต็มภาคภูมิ การเดินในสายงานอาชีพเพิ่งเริ่มต้น องค์ความรู้จะเกิดขึ้นใหม่ตลอดเวลา การศึกษาอย่างต่อเนื่อง เพื่อช่วยสั่งสมประสบการณ์ สร้างทักษะเพิ่มความแข็งแกร่งให้ทุกท่านและวิชาชีพพวกเรา มาร่วมแบ่งปัน บอกเล่าเรื่องราวดี ๆ ให้กันฟัง ในงานปฐมนิเทศเภสัชกรใหม่ ปี 2569 นี้กันนะครับ",
    EN: "The Pharmacy Council congratulates all new pharmacists who have passed their exams and warmly welcomes you to the profession with pride. Your professional journey has just begun. New knowledge emerges constantly; continuous education will help accumulate experience and strengthen skills for both you and our profession. Let's join, share, and tell good stories to each other at this New Pharmacist Orientation 2026."
  },
  "welcome.presidentName": { TH: "(เภสัชกรปรีชา พันธุ์ติเวช)", EN: "(Pharmacist Preecha Bhandtivej)" },
  "welcome.presidentPosition": { TH: "นายกสภาเภสัชกรรม", EN: "President of the Pharmacy Council" },

  // Welcome Cards


  // Agenda Section
  "agenda.badge": { TH: " กำหนดการ", EN: " Schedule" },
  "agenda.title1": { TH: "กำหนดการ", EN: "Event " },
  "agenda.title2": { TH: "กิจกรรม", EN: "Agenda" },
  "agenda.subtitle1": { TH: "รายละเอียดกิจกรรมตลอด 1 วัน", EN: "Detailed activities throughout the 1-day orientation" },
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
  "agenda.day1.theme": { TH: "ก้าวแรกสู่วิชาชีพ", EN: "First Step" },
  "agenda.day1.themeDesc": { TH: "เริ่มต้นเส้นทางเภสัชกรอย่างมั่นใจ", EN: "Start your journey with confidence" },

  // Agenda Day dates
  "agenda.day1.date": { TH: "17 พ.ค. 2569", EN: "May 17, 2026" },

  // Agenda Badge labels
  "agenda.badge.registration": { TH: "ลงทะเบียน", EN: "Registration" },
  "agenda.badge.ceremony": { TH: "พิธีการ", EN: "Ceremony" },
  "agenda.badge.lecture": { TH: "บรรยาย", EN: "Lecture" },
  "agenda.badge.workshop": { TH: "เวิร์กช็อป", EN: "Workshop" },
  "agenda.badge.break": { TH: "พัก", EN: "Break" },

  "agenda.badge.summary": { TH: "สรุป", EN: "Summary" },
  "agenda.badge.activity": { TH: "กิจกรรม", EN: "Activity" },

  // Agenda Duration labels
  "agenda.dur.5min": { TH: "5 นาที", EN: " min" },
  "agenda.dur.30min": { TH: "30 นาที", EN: "30 min" },
  "agenda.dur.40min": { TH: "40 นาที", EN: "40 min" },

  "agenda.dur.130min": { TH: "130 นาที", EN: "130 min" },
  "agenda.dur.150min": { TH: "150 นาที", EN: "2.5 hrs" },

  // Day 1 Events
  "agenda.d1e1.title": { TH: "Pharmacy Job Fair 2026", EN: "Pharmacy Job Fair 2026" },
  "agenda.d1e1.desc": { TH: "เปิดโลกทัศน์เส้นทางอาชีพและโอกาสงานเภสัชกรรมหลากหลายสาขา", EN: "Explore career paths and job opportunities in various pharmacy fields." },
  "agenda.d1e1.meta": { TH: "บูธหน่วยงานและบริษัทชั้นนำ", EN: "Leading Organizations & Companies" },

  "agenda.d1e2.title": { TH: "ลงทะเบียนและรับของที่ระลึก", EN: "Registration & Welcome Gifts" },
  "agenda.d1e2.desc": { TH: "ลงทะเบียนและรับของที่ระลึกจากสภาเภสัชกรรม", EN: "Register and receive souvenirs from the Pharmacy Council." },
  "agenda.d1e2.meta": { TH: "ทีมงานสภาเภสัชกรรม", EN: "Pharmacy Council Team" },

  "agenda.d1e3.title": { TH: "กล่าวต้อนรับ", EN: "Opening Remarks" },
  "agenda.d1e3.desc": { TH: "กล่าวต้อนรับผู้ร่วมงานและชี้แจงกำหนดการ", EN: "Welcome remarks and schedule explanation." },
  "agenda.d1e3.meta": { TH: "ภญ.โฉมคนางค์ ภูมิสายดร (ประชาสัมพันธ์และโฆษกสภาฯ)", EN: "Pharm. Chomkhanang Phumsaidorn (PR & Spokesperson)" },

  "agenda.d1e4.title": { TH: "กล่าวเปิดงานและให้โอวาท", EN: "Opening Ceremony & Advice" },
  "agenda.d1e4.desc": { TH: "กล่าวให้โอวาทแก่น้องเภสัชกรใหม่ในการก้าวเข้าสู่วิชาชีพ", EN: "Address and advice for new pharmacists entering the profession." },
  "agenda.d1e4.meta": { TH: "ภก.ปรีชา พันธุ์ติเวช (นายกสภาเภสัชกรรม)", EN: "Pharm. Preecha Bhandtivej (President)" },

  "agenda.d1e5.title": { TH: "พิธีมอบใบอนุญาต", EN: "Professional License Ceremony" },
  "agenda.d1e5.desc": { TH: "พิธีมอบใบอนุญาตเป็นผู้ประกอบวิชาชีพเภสัชกรรม", EN: "Professional Pharmacy License Presentation Ceremony." },
  "agenda.d1e5.meta": { TH: "คณะผู้บริหารสภาเภสัชกรรม", EN: "Pharmacy Council Executives" },

  "agenda.d1e6.title": { TH: "Expert Insight Session", EN: "Expert Insight Session" },
  "agenda.d1e6.desc": { TH: "การบรรยายพิเศษจากผู้เชี่ยวชาญ", EN: "Special lecture from experts." },
  "agenda.d1e6.meta": { TH: "วิทยากรรับเชิญพิเศษ", EN: "Special Guest Speaker" },

  "agenda.d1e7.title": { TH: "ปิดงาน", EN: "Closing Session" },
  "agenda.d1e7.desc": { TH: "สรุปภาพรวมกิจกรรมและปิดงาน", EN: "Event wrap-up and closing." },
  "agenda.d1e7.meta": { TH: "ทีมงานสภาเภสัชกรรม", EN: "Pharmacy Council Team" },

  // Memories Section
  "memories.badge": { TH: " ภาพบรรยากาศ", EN: "Gallery" },
  "memories.title1": { TH: "ภาพ", EN: "Cherished " },
  "memories.title2": { TH: "ความทรงจำ", EN: "Memories" },

  // Footer
  // Footer


  // Visitor Counter
  "visitor.label": { TH: "จำนวนผู้เยี่ยมชมเว็บไซต์", EN: "Website Visitors" },
  "visitor.today": { TH: "วันนี้", EN: "Today" },
  "visitor.threeDay": { TH: "3 วันล่าสุด", EN: "Last 3 Days" },

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
  "register.examId": { TH: "เลขประจำตัวผู้เข้าสอบ", EN: "Exam Candidate ID" },
  "register.phone": { TH: "เบอร์โทรศัพท์", EN: "Phone Number" },
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
  // Scroll Sequence
  "scroll.loading": { TH: "กำลังโหลดประสบการณ์", EN: "Loading Experience" },
  
  // Intro
  "scroll.intro.badge": { TH: "เภสัชกรรม 2569", EN: "Pharmacy 2026" },
  "scroll.intro.title1": { TH: "จบเภสัช", EN: "Graduated" },
  "scroll.intro.title2": { TH: "แล้วไปไหน?", EN: "What's Next?" },
  "scroll.intro.desc": { TH: "Scroll เพื่อสำรวจเส้นทางอาชีพ", EN: "Scroll to explore career paths" },

  // Career 1
  "scroll.career1.badge": { TH: "01 — บริการผู้ป่วย", EN: "01 — Patient Care" },
  "scroll.career1.title1": { TH: "เภสัชกร", EN: "Pharmacist" },
  "scroll.career1.title2": { TH: "ร้านยา & โรงพยาบาล", EN: "Pharmacy & Hospital" },
  "scroll.career1.desc": { 
    TH: "ดูแลผู้ป่วยโดยตรง จ่ายยา ให้คำปรึกษา และเป็นด่านแรกด้านสุขภาพของชุมชน ทั้งในโรงพยาบาลรัฐ เอกชน และร้านยาชุมชน", 
    EN: "Direct patient care, dispensing, counseling, and being the first line of community health in public/private hospitals and community pharmacies." 
  },

  // Career 2
  "scroll.career2.badge": { TH: "02 — อุตสาหกรรม & วิจัย", EN: "02 — Industry & Research" },
  "scroll.career2.title1": { TH: "นักวิจัย", EN: "Researcher" },
  "scroll.career2.title2": { TH: "& อุตสาหกรรมยา", EN: "& Pharma Industry" },
  "scroll.career2.desc": { 
    TH: "พัฒนายาและผลิตภัณฑ์สุขภาพ ทำงานใน บริษัทยาข้ามชาติ สถาบันวิจัย หรือ หน่วยงานกำกับดูแลยา (อย.)", 
    EN: "Developing drugs and health products in multinational companies, research institutes, or regulatory agencies (FDA)." 
  },

  // CTA
  "scroll.cta.badge": { TH: "03 — เส้นทางของคุณ", EN: "03 — Your Path" },
  "scroll.cta.title1": { TH: "ยินดีต้อนรับ", EN: "Welcome" },
  "scroll.cta.title2": { TH: "สู่วิชาชีพ", EN: "to the Profession" },
  "scroll.cta.desc": { 
    TH: "ไม่ว่าจะเลือกเส้นทางใด คุณคือกำลังสำคัญ ของระบบสาธารณสุขไทย", 
    EN: "Whichever path you choose, you are a vital force in Thailand's public health system." 
  },
  "scroll.cta.scrollHint": { TH: "เลื่อนลงต่อ", EN: "Keep Scrolling" },
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
