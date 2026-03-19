"use client";

import { useLang } from "../contexts/LangContext";
import FloatingLangToggle from "../components/ui/FloatingLangToggle";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const { lang } = useLang();
  const isEN = lang === "EN";

  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-4 md:px-8">
      <FloatingLangToggle />
      
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
        
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors mb-6 group">
            <svg className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            {isEN ? "Back to Home" : "กลับสู่หน้าหลัก"}
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {isEN ? "Privacy Policy" : "นโยบายความเป็นส่วนตัว"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {isEN ? "Last updated: May 2026" : "อัปเดตล่าสุด: พฤษภาคม 2569"}
          </p>
        </div>

        <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-[15px] md:text-base">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {isEN ? "1. Introduction" : "1. บทนำ"}
            </h2>
            <p>
              {isEN
                ? "The Pharmacy Council of Thailand respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website."
                : "สภาเภสัชกรรมเคารพในความเป็นส่วนตัวของคุณ และมุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลของคุณ นโยบายความเป็นส่วนตัวนี้จะแจ้งให้คุณทราบถึงวิธีที่เราดูแลข้อมูลส่วนบุคคลของคุณเมื่อคุณเยี่ยมชมเว็บไซต์ของเรา"}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {isEN ? "2. The Data We Collect About You" : "2. ข้อมูลที่เรารวบรวมเกี่ยวกับคุณ"}
            </h2>
            <p className="mb-2">
              {isEN 
                ? "We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:" 
                : "เราอาจเก็บรวบรวม ใช้ จัดเก็บ และถ่ายโอนข้อมูลส่วนบุคคลประเภทต่างๆ เกี่ยวกับคุณ ซึ่งเราได้จัดกลุ่มไว้ดังนี้:"}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>{isEN ? "Identity Data: First name, last name, username or similar identifier." : "ข้อมูลประจำตัว: ชื่อ นามสกุล ชื่อผู้ใช้ หรือตัวระบุที่คล้ายกัน"}</li>
              <li>{isEN ? "Contact Data: Email address and telephone numbers." : "ข้อมูลการติดต่อ: ที่อยู่อีเมลและหมายเลขโทรศัพท์"}</li>
              <li>{isEN ? "Professional Data: Pharmacy License ID, University, Organization." : "ข้อมูลทางวิชาชีพ: เลขที่ใบอนุญาตประกอบวิชาชีพเภสัชกรรม มหาวิทยาลัย องค์กร"}</li>
              <li>{isEN ? "Technical Data: Internet protocol (IP) address, your login data, browser type and version." : "ข้อมูลทางเทคนิค: ที่อยู่อินเทอร์เน็ตโปรโตคอล (IP), ข้อมูลการเข้าสู่ระบบของคุณ, ประเภทและเวอร์ชันของเบราว์เซอร์"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {isEN ? "3. How We Use Your Personal Data" : "3. วิธีที่เราใช้ข้อมูลส่วนบุคคลของคุณ"}
            </h2>
            <p>
              {isEN
                ? "We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to register you as a new attendee, to manage our relationship with you, and to administer and protect our organization and this website."
                : "เราจะใช้ข้อมูลส่วนบุคคลของคุณเมื่อกฎหมายอนุญาตเท่านั้น โดยส่วนใหญ่ เราจะใช้ข้อมูลส่วนบุคคลของคุณเพื่อลงทะเบียนคุณในฐานะผู้เข้าร่วมงานใหม่ เพื่อจัดการความสัมพันธ์ของเรากับคุณ และเพื่อบริหารจัดการและปกป้ององค์กรและเว็บไซต์นี้ของเรา"}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {isEN ? "4. Cookies" : "4. คุกกี้ (Cookies)"}
            </h2>
            <p>
              {isEN
                ? "You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly."
                : "คุณสามารถตั้งค่าเบราว์เซอร์ของคุณให้ปฏิเสธคุกกี้เบราว์เซอร์ทั้งหมดหรือบางส่วน หรือเพื่อแจ้งเตือนคุณเมื่อเว็บไซต์ตั้งค่าหรือเข้าถึงคุกกี้ หากคุณปิดการใช้งานหรือปฏิเสธคุกกี้ โปรดทราบว่าบางส่วนของเว็บไซต์นี้อาจไม่สามารถเข้าถึงได้หรือทำงานได้ไม่เต็มรูปแบบ"}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {isEN ? "5. Your Legal Rights" : "5. สิทธิตามกฎหมายของคุณ"}
            </h2>
            <p>
              {isEN
                ? "Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent."
                : "ภายใต้สถานการณ์บางอย่าง คุณมีสิทธิ์ภายใต้กฎหมายคุ้มครองข้อมูลที่เกี่ยวข้องกับข้อมูลส่วนบุคคลของคุณ รวมถึงสิทธิ์ในการขอเข้าถึง แก้ไข ลบ จำกัด ถ่ายโอน คัดค้านการประมวลผล เพื่อความสามารถในการถ่ายโอนข้อมูล และ (ในกรณีที่พื้นฐานทางกฎหมายของการประมวลผลคือความยินยอม) เพื่อถอนความยินยอม"}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
