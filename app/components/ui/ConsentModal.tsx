"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export default function ConsentModal({ isOpen, onAccept, onClose }: ConsentModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  // Lock body scroll while modal is open so the page behind cannot steal wheel events
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Manually handle wheel events on the scroll container so framer-motion transforms
  // cannot intercept them (non-passive so we can preventDefault to stop propagation)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isOpen) return;
    const onWheel = (e: WheelEvent) => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;
      el.scrollTop += e.deltaY;
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
      // Reset scroll & progress immediately
      if (progressRef.current) progressRef.current.style.width = "0%";
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
          // Check if content is already fully visible
          if (scrollRef.current.scrollHeight <= scrollRef.current.clientHeight + 5) {
            setHasScrolledToBottom(true);
            if (progressRef.current) progressRef.current.style.width = "100%";
          }
        }
      }, 50);
    }
  }, [isOpen]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    
    // Calculate progress mathematically safely without breaking on NaN
    const scrollMax = el.scrollHeight - el.clientHeight;
    const rawProgress = scrollMax > 0 ? el.scrollTop / scrollMax : 1;
    const progress = Math.min(Math.max(rawProgress, 0), 1);
    
    // Use manual DOM manipulation to avoid React re-rendering during active smooth scrolling!
    // This immediately stops layout freezing/hanging on mobile Safari.
    if (progressRef.current) {
      progressRef.current.style.width = `${progress * 100}%`;
    }
    
    // Only update React state when user reaches bottom
    if (!hasScrolledToBottom && (progress >= 0.98 || scrollMax <= 5)) {
      setHasScrolledToBottom(true);
    }
  };

  const notoStyle = { fontFamily: "var(--font-noto-thai), 'Noto Sans Thai', sans-serif" };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 pb-12 sm:pb-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-[540px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border border-white/60 dark:border-slate-700/50 overflow-clip flex flex-col max-h-[85svh]"
          >
            {/* Header Area */}
            <div className="shrink-0 px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-slate-100 dark:border-slate-800/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 blur-2xl rounded-full pointer-events-none" />
              
              <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-50 dark:from-violet-900/40 dark:to-indigo-900/20 flex items-center justify-center shrink-0 shadow-inner border border-violet-200/50 dark:border-violet-700/30">
                    <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 style={notoStyle} className="text-lg sm:text-[20px] font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                      ข้อตกลงและเงื่อนไข
                    </h2>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      กรุณาอ่านให้ครบก่อนเริ่มกดยืนยัน
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                  aria-label="ปิด"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Enhanced Progress Bar - Native width animation handled by ref */}
              <div className="mt-5 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div
                  ref={progressRef}
                  className="h-full bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 rounded-full transition-none will-change-[width]"
                  style={{ width: "0%" }}
                />
              </div>
            </div>

            {/* Robust Scrollable Content completely managed by flex box */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 min-h-0 w-full overflow-y-auto px-6 sm:px-8 py-6 space-y-7 text-[14px] sm:text-[14.5px] text-slate-600 dark:text-slate-300 leading-relaxed pointer-events-auto shadow-inner"
              style={{
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
              }}
            >
              {[
                {
                  id: 1,
                  title: "การเก็บรวบรวมข้อมูลส่วนบุคคล",
                  body: <>สภาเภสัชกรรมแห่งประเทศไทย ("สภาฯ") ดำเนินการเก็บรวบรวมข้อมูลส่วนบุคคลของท่าน ประกอบด้วย ชื่อ-สกุล เลขใบอนุญาตประกอบวิชาชีพ อีเมล เบอร์โทรศัพท์ และสถานที่ทำงาน เพื่อนำไปใช้ร่วมงาน <strong className="font-bold text-violet-700 dark:text-violet-400">ปฐมนิเทศเภสัชกรใหม่ ประจำปี 2569</strong></>
                },
                {
                  id: 2,
                  title: "วัตถุประสงค์การใช้ข้อมูล",
                  list: [
                    "เพื่อยืนยันตัวตนและสิทธิ์การเข้าร่วมงาน",
                    "เพื่อออกบัตร E-Ticket ให้แก่ผู้ลงทะเบียน",
                    "เพื่อประมวลผลสถิติผู้เข้าร่วม แยกตามสถาบัน",
                    "เพื่อติดต่อสื่อสารข้อมูลสำคัญผ่านทางอีเมล",
                    "เพื่อปฏิบัติตามกฎหมายและข้อบังคับที่เกี่ยวข้อง"
                  ],
                  iconColor: "text-emerald-500"
                },
                {
                  id: 3,
                  title: "การเปิดเผยข้อมูล",
                  body: "สภาฯ จะไม่นำข้อมูลส่วนบุคคลของท่านไปเปิดเผยแก่บุคคลภายนอก เว้นแต่: (ก) ได้รับความยินยอมโดยตรงจากท่าน (ข) เป็นไปตามกฎหมายระบุไว้ หรือ (ค) เพื่อผลประโยชน์อันเป็นสาระสำคัญของท่านเอง"
                },
                {
                  id: 4,
                  title: "ระยะเวลาการเก็บรักษาข้อมูล",
                  body: <>เราจะจัดเก็บรักษาข้อมูลของท่านไว้อย่างปลอดภัยและทำลายเมื่อหมดความจำเป็น โดยมีระยะเวลาจัดเก็บสูงสุดไม่เกิน <strong className="font-bold text-slate-900 dark:text-white">3 ปี</strong> นับจากวันที่ลงทะเบียนสำเร็จ</>
                },
                {   
                  id: 5,
                  title: "สิทธิ์ของเจ้าของข้อมูล",
                  list: [
                    "สิทธิ์ในการเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคล",
                    "สิทธิ์ในการแก้ไขข้อมูลที่ไม่ถูกต้องให้เป็นปัจจุบัน",
                    "สิทธิ์ในการลบหรือทำลายข้อมูล (Right to Erasure)",
                    "สิทธิ์ในการถอนความยินยอมได้ทุกเมื่อในระบบ",
                  ],
                  iconSvg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
                  iconColor: "text-blue-500"
                },
                {
                  id: 6,
                  title: "ช่องทางติดต่อ",
                  body: <>หากมีข้อสงสัยเกี่ยวกับนโยบายคุ้มครองข้อมูลส่วนบุคคล ติดต่อ: <strong className="font-bold text-violet-700 dark:text-violet-400">สำนักงานเลขาธิการสภาเภสัชกรรม</strong> อาคารมหิตลาธิเบศร ชั้น 8 กระทรวงสาธารณสุข จ.นนทบุรี</>
                }
              ].map((section) => (
                <section key={section.id}>
                  <h3 style={notoStyle} className="text-[15px] sm:text-[16px] font-black text-slate-900 dark:text-white mb-2.5 flex items-center gap-3">
                    <span className="flex items-center justify-center w-[26px] h-[26px] rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-[12px] font-black tracking-tighter shadow-md shadow-violet-500/20 shrink-0">
                      {section.id}
                    </span>
                    {section.title}
                  </h3>
                  {section.body && <p className="pl-[38px]">{section.body}</p>}
                  {section.list && (
                    <ul className="pl-[38px] space-y-2 mt-1">
                      {section.list.map((item, i) => (
                         <li key={i} className="flex items-start gap-2.5">
                           <svg className={`w-4 h-4 shrink-0 mt-[3px] ${section.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             {section.iconSvg ? section.iconSvg : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />}
                           </svg>
                           <span className="leading-snug">{item}</span>
                         </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {/* End Spacer */}
              <div className="mt-8 mb-2 p-5 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/10 dark:to-indigo-900/10 border border-violet-100/80 dark:border-violet-800/30 rounded-2xl flex items-center justify-center text-center">
                <p style={notoStyle} className="text-[14px] font-bold text-violet-800 dark:text-violet-300">
                  <span className="text-lg mr-1 tracking-tighter">🔒</span> การกดยืนยัน ถือว่าท่านได้อ่านและยอมรับ<br className="hidden sm:block"/>ข้อตกลงนโยบายความเป็นส่วนตัวทั้งหมด
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="shrink-0 px-6 sm:px-8 py-5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3 sm:gap-4 flex-col sm:flex-row shadow-[0_-10px_30px_rgba(0,0,0,0.02)] relative z-20 pointer-events-auto">
              <button
                onClick={onClose}
                style={notoStyle}
                className="flex-1 py-3 px-4 rounded-xl text-[14.5px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all order-2 sm:order-1"
              >
                ปิดหน้าต่าง
              </button>
              
              <div className="flex-1 order-1 sm:order-2 group relative h-[46px] rounded-xl overflow-hidden">
                <button
                  onClick={() => { onAccept(); onClose(); }}
                  disabled={!hasScrolledToBottom}
                  style={notoStyle}
                  className="absolute inset-0 w-full h-full flex items-center justify-center rounded-xl text-[14.5px] font-bold text-white transition-all duration-300
                    bg-gradient-to-r from-violet-600 to-blue-600 dark:from-violet-500 dark:to-blue-500
                    disabled:opacity-0 disabled:pointer-events-none disabled:translate-y-4"
                >
                  <span className="flex items-center gap-1.5 shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    ยอมรับและยืนยัน
                  </span>
                </button>
                
                {/* Disabled State visible only when not scrolled to bottom */}
                <button
                  disabled
                  style={notoStyle}
                  className={`absolute inset-0 w-full h-full flex items-center justify-center rounded-xl text-[14px] font-bold text-slate-500 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-all duration-300 ${hasScrolledToBottom ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                >
                  <svg className="w-4 h-4 mr-1.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  เลื่อนอ่านจนครบก่อน
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
