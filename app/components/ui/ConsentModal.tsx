"use client";

import { useRef, useState, useEffect } from "react";

interface ConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export default function ConsentModal({ isOpen, onAccept, onClose }: ConsentModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
      setScrollProgress(0);
      // Reset scroll position when modal opens
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      }, 50);
    }
  }, [isOpen]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
    setScrollProgress(Math.min(progress, 1));
    if (progress >= 0.97) setHasScrolledToBottom(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 md:bg-black/50 md:backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-[1.75rem] shadow-2xl overflow-hidden flex flex-col max-h-[90svh] animate-[modalIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]">

        {/* Header */}
        <div className="shrink-0 px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-[16px] font-black text-slate-900 leading-tight">
                  ข้อตกลงและเงื่อนไข
                </h2>
                <p className="text-[12px] text-slate-500 mt-0.5 font-medium">
                  กรุณาอ่านให้ครบก่อนยืนยัน
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="ปิด"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 text-right font-medium">
            {hasScrolledToBottom ? "✅ อ่านครบแล้ว" : `เลื่อนอ่านจนครบ (${Math.round(scrollProgress * 100)}%)`}
          </p>
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-[13.5px] text-slate-700 leading-relaxed"
        >
          <section>
            <h3 className="text-[14px] font-black text-slate-900 mb-2 flex items-center gap-2">
              <span className="inline-block w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-[11px] font-black flex items-center justify-center shrink-0">1</span>
              การเก็บรวบรวมข้อมูลส่วนบุคคล
            </h3>
            <p className="text-slate-600">
              สภาเภสัชกรรมแห่งประเทศไทย ("สภาฯ") ดำเนินการเก็บรวบรวมข้อมูลส่วนบุคคลของท่าน ได้แก่ ชื่อ-นามสกุล เลขบัตรประชาชน เลขใบอนุญาตประกอบวิชาชีพ อีเมล เบอร์โทรศัพท์ มหาวิทยาลัย/สถาบัน และองค์กร/สถานที่ทำงาน เพื่อวัตถุประสงค์ในการลงทะเบียนเข้าร่วมงาน<strong className="text-slate-800"> ปฐมนิเทศเภสัชกรใหม่ ประจำปี 2569</strong>
            </p>
          </section>

          <section>
            <h3 className="text-[14px] font-black text-slate-900 mb-2 flex items-center gap-2">
              <span className="inline-block w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-[11px] font-black flex items-center justify-center shrink-0">2</span>
              วัตถุประสงค์การใช้ข้อมูล
            </h3>
            <ul className="space-y-1.5 text-slate-600">
              {[
                "เพื่อยืนยันตัวตนและสิทธิ์การเข้าร่วมงาน",
                "เพื่อออกบัตรอิเล็กทรอนิกส์ (E-Ticket) ให้แก่ผู้ลงทะเบียน",
                "เพื่อประมวลผลสถิติจำนวนผู้เข้าร่วม แยกตามสถาบันการศึกษา",
                "เพื่อการสื่อสารด้านงานกิจกรรมผ่านทางอีเมล",
                "เพื่อการปฏิบัติตามกฎหมายและข้อบังคับที่เกี่ยวข้อง",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[14px] font-black text-slate-900 mb-2 flex items-center gap-2">
              <span className="inline-block w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-[11px] font-black flex items-center justify-center shrink-0">3</span>
              การเปิดเผยข้อมูล
            </h3>
            <p className="text-slate-600">
              สภาฯ จะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านแก่บุคคลภายนอก เว้นแต่ในกรณีต่อไปนี้: (ก) ได้รับความยินยอมจากท่าน (ข) เป็นไปตามที่กฎหมายกำหนด (ค) เพื่อผลประโยชน์สำคัญของท่านหรือผู้อื่น
            </p>
          </section>

          <section>
            <h3 className="text-[14px] font-black text-slate-900 mb-2 flex items-center gap-2">
              <span className="inline-block w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-[11px] font-black flex items-center justify-center shrink-0">4</span>
              ระยะเวลาการเก็บรักษาข้อมูล
            </h3>
            <p className="text-slate-600">
              สภาฯ จะเก็บรักษาข้อมูลส่วนบุคคลของท่านตราบเท่าที่จำเป็นเพื่อวัตถุประสงค์ที่กำหนด หรือตามที่กฎหมายกำหนด ทั้งนี้ไม่เกิน <strong className="text-slate-800">3 ปี</strong> นับจากวันที่ลงทะเบียน
            </p>
          </section>

          <section>
            <h3 className="text-[14px] font-black text-slate-900 mb-2 flex items-center gap-2">
              <span className="inline-block w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-[11px] font-black flex items-center justify-center shrink-0">5</span>
              สิทธิ์ของเจ้าของข้อมูล
            </h3>
            <ul className="space-y-1.5 text-slate-600">
              {[
                "สิทธิ์ในการเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคล",
                "สิทธิ์ในการแก้ไขข้อมูลที่ไม่ถูกต้อง",
                "สิทธิ์ในการลบหรือทำลายข้อมูล (Right to Erasure)",
                "สิทธิ์ในการถอนความยินยอมได้ทุกเมื่อ",
                "สิทธิ์ในการร้องเรียนต่อหน่วยงานกำกับดูแล",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[14px] font-black text-slate-900 mb-2 flex items-center gap-2">
              <span className="inline-block w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-[11px] font-black flex items-center justify-center shrink-0">6</span>
              ความปลอดภัยของข้อมูล
            </h3>
            <p className="text-slate-600">
              สภาฯ ได้จัดให้มีมาตรการรักษาความมั่นคงปลอดภัยที่เหมาะสมเพื่อป้องกันการสูญหาย เข้าถึง ใช้ เปลี่ยนแปลง หรือเปิดเผยข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต
            </p>
          </section>

          <section>
            <h3 className="text-[14px] font-black text-slate-900 mb-2 flex items-center gap-2">
              <span className="inline-block w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-[11px] font-black flex items-center justify-center shrink-0">7</span>
              ช่องทางติดต่อ
            </h3>
            <p className="text-slate-600">
              หากท่านมีข้อสงสัยหรือต้องการใช้สิทธิ์ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 กรุณาติดต่อ:{" "}
              <strong className="text-violet-700">สำนักงานเลขาธิการสภาเภสัชกรรม</strong>{" "}
              อาคารมหิตลาธิเบศร ชั้น 8 กระทรวงสาธารณสุข จ.นนทบุรี 11000
            </p>
          </section>

          {/* End Spacer with reminder */}
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-center">
            <p className="text-[13px] font-bold text-violet-700">
              🔒 การกดยืนยัน ถือว่าท่านได้อ่านและยอมรับ<br />ข้อตกลงและนโยบายทั้งหมดข้างต้น
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-[14px] font-bold text-slate-600 bg-white border-2 border-slate-100 hover:border-slate-200 hover:text-slate-800 transition-all"
          >
            ปิด
          </button>
          <button
            onClick={() => { onAccept(); onClose(); }}
            disabled={!hasScrolledToBottom}
            className="flex-1 py-2.5 px-4 rounded-xl text-[14px] font-bold text-white
              bg-gradient-to-r from-violet-600 to-blue-600
              shadow-[0_4px_14px_0_rgba(124,58,237,0.3)]
              hover:from-violet-500 hover:to-blue-500
              hover:shadow-[0_6px_20px_rgba(124,58,237,0.25)]
              hover:-translate-y-0.5
              transition-all duration-200
              disabled:opacity-40 disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-none"
          >
            {hasScrolledToBottom ? "✓ ยอมรับและยืนยัน" : "เลื่อนอ่านจนครบก่อน"}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />
    </div>
  );
}
