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
  "nav.speakers": { TH: "วิทยากร", EN: "Speakers" },
  "nav.gallery": { TH: "ภาพบรรยากาศ", EN: "Gallery" },
  "nav.career": { TH: "โอกาสทางวิชาชีพ", EN: "Career" },
  "nav.sponsors": { TH: "ผู้สนับสนุน", EN: "Sponsors" },
  "nav.signIn": { TH: "เข้าสู่ระบบ", EN: "Sign In" },
  "nav.signUp": { TH: "ลงทะเบียน", EN: "Register" },
  "nav.signOut": { TH: "ออกจากระบบ", EN: "Sign Out" },
  "nav.license": { TH: "ใบอนุญาตประกอบวิชาชีพ", EN: "License" },
  "nav.licenseId": { TH: "เลขที่ใบอนุญาต", EN: "License No." },
  "nav.phone": { TH: "เบอร์โทรศัพท์", EN: "Phone" },
  "nav.myTicket": { TH: "บัตรเข้างาน", EN: "My Ticket" },
  "nav.live": { TH: "รับชมไลฟ์สด", EN: "Watch Live Event" },

  // Hero
  "hero.subtitle1": { TH: "ขอต้อนรับเภสัชกรใหม่เข้าสู่", EN: "Warmly welcoming new pharmacists to the" },
  "hero.future": { TH: "เส้นทางวิชาชีพ", EN: "professional world" },
  "hero.subtitle2": {
    TH: "อย่างเต็มภาคภูมิ",
    EN: "fully.",
  },
  "hero.subtitle3": {
    TH: "แล้วพบกันใน",
    EN: "See you at the",
  },
  "hero.journey": { TH: "งานปฐมนิเทศเภสัชกรใหม่ ประจำปี 2569", EN: "New Pharmacist Orientation 2026" },
  "hero.subtitle4": { TH: "เพื่อเริ่มต้นเส้นทางสายวิชาชีพร่วมกัน", EN: "to start our journey together." },
  "hero.register": { TH: "ลงทะเบียนเข้าร่วมงาน", EN: "Register Now" },
  "hero.registered": { TH: "คุณลงทะเบียนเข้าร่วมงานแล้ว", EN: "You are registered" },
  "hero.loginHintPrefix": { TH: "🎉 เปิดลงทะเบียนแล้ววันนี้! ลงทะเบียนเพื่อรับชม", EN: "🎉 Registration is now OPEN! Sign up to watch" },
  "hero.loginHintLive": { TH: "ไลฟ์สด", EN: "Live Stream" },
  "hero.loginHintAnd": { TH: " และ ", EN: " & " },
  "hero.loginHintVideo": { TH: "วิดีโอไฮไลท์ย้อนหลัง", EN: "On-demand Highlights" },
  "hero.explore": { TH: "สำรวจเส้นทาง", EN: "Explore Path" },
  "hero.eventDate": { TH: "วันอาทิตย์ที่ 17 พฤษภาคม 2569", EN: "Sunday, May 17, 2026" },
  "hero.year": { TH: "ห้องสิริวัฒนภักดี ชั้น 3 อาคารมหิตลาธิเบศร กระทรวงสาธารณสุข", EN: "Siriwattana Phakdee Room, 3rd Fl, Mahitalathibet Building, Ministry of Public Health" },

  // Welcome Section
  "welcome.badge": { TH: "สารจากนายกสภาเภสัชกรรม", EN: "Welcome message from the Executives" },
  "welcome.title1": { TH: "สารจาก", EN: "Welcome message from" },
  "welcome.title2": { TH: "คณะผู้บริหาร", EN: "the Executives" },
  "welcome.eventDate": { TH: "วันอาทิตย์ที่ 17 พฤษภาคม 2569 เวลา 10.00 - 16.00 น.", EN: "Sunday, May 17, 2026 | 10:00 AM - 4:00 PM" },
  "welcome.location": { TH: "ห้องสิริวัฒนภักดี ชั้น 3 อาคารมหิตลาธิเบศร กระทรวงสาธารณสุข จ.นนทบุรี", EN: "Siriwattana Phakdee Room, 3rd Fl, Mahitalathibet Building, Ministry of Public Health" },
  "welcome.message": {
    TH: "สภาเภสัชกรรม ยินดีกับเภสัชกรใหม่ที่สอบผ่าน และขอต้อนรับเภสัชกรใหม่ทุกท่าน ก้าวเข้าสู่การประกอบวิชาชีพเภสัชกรรมอย่างเต็มภาคภูมิ การเดินในสายงานอาชีพเพิ่งเริ่มต้น องค์ความรู้จะเกิดขึ้นใหม่ตลอดเวลา การศึกษาอย่างต่อเนื่อง เพื่อช่วยสั่งสมประสบการณ์ สร้างทักษะเพิ่มความแข็งแกร่งให้ทุกท่านและวิชาชีพพวกเรา มาร่วมแบ่งปัน บอกเล่าเรื่องราวดี ๆ ให้กันฟัง ในงานปฐมนิเทศเภสัชกรใหม่ ปี 2569 นี้กันนะครับ",
    EN: "The Pharmacy Council congratulates all new pharmacists who have passed their exams and warmly welcomes you to the profession with pride. Your professional journey has just begun. New knowledge emerges constantly; continuous education will help accumulate experience and strengthen skills for both you and our profession. Let's join, share, and tell good stories to each other at this New Pharmacist Orientation 2026."
  },
  "welcome.presidentName": { TH: "ภก.ปรีชา พันธุ์ติเวช", EN: "Pharmacist Preecha Bhandtivej" },
  "welcome.presidentPosition": { TH: "นายกสภาเภสัชกรรม", EN: "President of the Pharmacy Council" },

  "welcome.p2Name": { TH: "รศ.ภญ.สุณี เลิศสินอุดม", EN: "Associate Professor Sunee Lertsinudom" },
  "welcome.p2Position": { TH: "เลขาธิการ\nสภาเภสัชกรรม", EN: "Secretary-General\nof the Pharmacy Council" },
  "welcome.p2Message": { TH: "สภาเภสัชกรรมขอแสดงความยินดีกับเภสัชกรใหม่ทุกท่านที่สอบผ่าน และกำลังก้าวเข้าสู่การประกอบวิชาชีพเภสัชกรรมอย่างเต็มภาคภูมิ เส้นทางวิชาชีพนี้เป็นการเรียนรู้และพัฒนาตนเองอย่างต่อเนื่อง เพื่อสร้างความเข้มแข็งให้กับทั้งตัวท่านและวิชาชีพเภสัชกรรม ขอเชิญชวนเภสัชกรใหม่ทุกท่านมาร่วมแบ่งปันประสบการณ์และแรงบันดาลใจ ในงานปฐมนิเทศเภสัชกรใหม่ ปี 2569 นี้", EN: "The Pharmacy Council congratulates all new pharmacists who have passed their exams and are proudly stepping into the pharmacy profession. This career path is about continuous learning and self-development, building strength for both yourself and the pharmacy profession. We invite all new pharmacists to come share experiences and inspiration at this New Pharmacist Orientation 2026." },

  "welcome.p3Name": { TH: "ดร.ภก.นพดล อัจจิมาธีระ", EN: "Pharm. Dr. Noppadon Adjimatera" },
  "welcome.p3Position": { TH: "อุปนายก\nสภาเภสัชกรรม คนที่2", EN: "Second\nVice President" },
  "welcome.p3Message": { TH: "ขอแสดงความยินดีกับเภสัชกรใหม่ทุกท่านที่ก้าวผ่านอีกหนึ่งก้าวสำคัญของชีวิต และกำลังก้าวเข้าสู่เส้นทางวิชาชีพเภสัชกรรม ซึ่งเป็นวิชาชีพที่มีบทบาทสำคัญต่อสุขภาพของประชาชนและระบบสาธารณสุขของประเทศ ขอให้ทุกท่านใช้ความรู้ ความสามารถ และจิตวิญญาณของความเป็นเภสัชกรในการพัฒนาตนเองและวิชาชีพ พร้อมทั้งร่วมพบปะแลกเปลี่ยนประสบการณ์กันในงานปฐมนิเทศเภสัชกรใหม่ ปี 2569 นี้", EN: "Congratulations to all new pharmacists who have crossed another major milestone and are entering the pharmacy profession, which plays a critical role in public health and the national healthcare system. I encourage all of you to use your knowledge, abilities, and the spirit of a pharmacist to develop yourselves and the profession, and to exchange experiences at this New Pharmacist Orientation 2026." },

  // Welcome Cards

  // Countdown Section
  "countdown.days": { TH: "วัน", EN: "Days" },
  "countdown.hours": { TH: "ชั่วโมง", EN: "Hours" },
  "countdown.minutes": { TH: "นาที", EN: "Minutes" },
  "countdown.seconds": { TH: "วินาที", EN: "Seconds" },
  "countdown.eventDay": { TH: "✨ วันงานมาถึงแล้ว!", EN: "✨ The day has arrived!" },
  "countdown.badge": { TH: "⏱️ นับถอยหลังสู่งาน", EN: "⏱️ Countdown to Event" },
  "countdown.titlePast": { TH: "ยินดีต้อนรับสู่งานปฐมนิเทศ!", EN: "Welcome to the Orientation!" },
  "countdown.title": { TH: "เตรียมพบกันในอีก", EN: "See you in..." },
  "countdown.cta": { TH: "ลงทะเบียนเข้าร่วมงาน", EN: "Register for the Event" },

  // Speaker Section
  "speaker.badge": { TH: "🎤 วิทยากร", EN: "🎤 Speakers" },
  "speaker.title1": { TH: "", EN: "" },
  "speaker.title2": { TH: "วิทยากร", EN: "Speakers" },
  "speaker.subtitle": { TH: "ผู้ทรงคุณวุฒิที่จะมาร่วมแบ่งปันประสบการณ์และแรงบันดาลใจ", EN: "Experts who will share their experiences and inspiration." },
  "speaker.clickHint": { TH: "คลิกเพื่อดูข้อมูล", EN: "Click to flip" },
  "speaker.back": { TH: "กลับหน้าบัตร", EN: "Back" },
  "speaker.note": { TH: "*รายนามวิทยากรอาจมีการเปลี่ยนแปลง", EN: "*Speaker list is subject to change" },

  "speaker.s1.name": { TH: "รศ.ภญ.สุณี เลิศสินอุดม", EN: "Assoc. Prof. Sunee Lertsinudom" },
  "speaker.s1.position": { TH: "เลขาธิการสภาเภสัชกรรม", EN: "Secretary-General of the Pharmacy Council" },
  "speaker.s1.topic": { TH: "สารจากเลขาธิการ", EN: "Message from Secretary-General" },
  "speaker.s1.desc": { TH: "กล่าวให้โอวาทและชี้แนะแนวทางการประกอบวิชาชีพเภสัชกรรม", EN: "Delivering advice and guidance on practicing pharmacy." },
  
  "speaker.s2.name": { TH: "ภญ.ชนากิต อิ่มบำรุง", EN: "Pharm. Chanakrit Imbamrung" },
  "speaker.s2.position": { TH: "เหรัญญิก สภาเภสัชกรรม", EN: "Treasurer, The Pharmacy Council of Thailand" },
  "speaker.s2.topic": { TH: "เภสัชกรชุมชน", EN: "Community Pharmacist" },
  "speaker.s2.desc": { TH: "ประสบการณ์การทำงานในร้านยาชุมชน สู่การพัฒนาวิชาชีพอย่างต่อเนื่อง", EN: "Experience in community pharmacy practice and continuous professional development." },

  "speaker.s3.name": { TH: "ภญ.ชนิตรา อินทร์ศิริ", EN: "Pharm. Chanitra Insiri" },
  "speaker.s3.position": { TH: "ศูนย์การแพทย์สมเด็จพระเทพฯ", EN: "HRH Princess Maha Chakri Sirindhorn Medical Center" },
  "speaker.s3.topic": { TH: "เภสัชกรโรงพยาบาล", EN: "Hospital Pharmacist" },
  "speaker.s3.desc": { TH: "บทบาทเภสัชกรในโรงพยาบาล สู่การดูแลผู้ป่วยอย่างครบวงจร", EN: "The role of hospital pharmacists in comprehensive patient care." },

  "speaker.s4.name": { TH: "วิทยากรรับเชิญ", EN: "Guest Speaker" },
  "speaker.s4.position": { TH: "ยังไม่ยืนยัน", EN: "TBC" },
  "speaker.s4.topic": { TH: "TBC", EN: "TBC" },
  "speaker.s4.desc": { TH: "รอการยืนยันจากวิทยากร", EN: "Speaker to be confirmed." },

  "speaker.s5.name": { TH: "ภก.อาทิตย์ สอดแสงอรุณงาม", EN: "Pharm. Athit Sotsaengarunngam" },
  "speaker.s5.position": { TH: "ผู้อำนวยการกองปฏิบัติการทะเบียน\nองค์การเภสัชกรรม", EN: "Director of Registration Operations Division, GPO" },
  "speaker.s5.topic": { TH: "เภสัชกรอุตสาหการ", EN: "Industrial Pharmacist" },
  "speaker.s5.desc": { TH: "ประสบการณ์การทำงานในองค์การเภสัชกรรมและงานขึ้นทะเบียน", EN: "Experience working in the Government Pharmaceutical Organization and drug registration." },

  "speaker.s6.name": { TH: "ภก.นิชนนท์ ชาวเรา", EN: "Pharm. Nichanon Chaorao" },
  "speaker.s6.position": { TH: "สสจ.สมุทรสงคราม", EN: "Samut Songkhram PHO" },
  "speaker.s6.topic": { TH: "เภสัชกรภาครัฐ", EN: "Public Sector Pharmacist" },
  "speaker.s6.desc": { TH: "ประสบการณ์การทำงานในสำนักงานสาธารณสุขจังหวัด", EN: "Experience working in the Provincial Health Office." },

  "speaker.s7.name": { TH: "ภญ.ภิญญาพัชร์ สุขมั่นคงเสมอ", EN: "Pharm. Pinyapat Sukmankongsamun" },
  "speaker.s7.position": { TH: "Associated Product Manager\nAbbott Laboratories", EN: "Associated Product Manager\nAbbott Laboratories" },
  "speaker.s7.topic": { TH: "เภสัชกรการตลาด", EN: "Pharmaceutical Marketing" },
  "speaker.s7.desc": { TH: "ประสบการณ์ด้านการตลาดและ Product Manager ในบริษัทยาชั้นนำ", EN: "Experience as an Associated Product Manager in a multinational pharmaceutical company." },

  "speaker.s8.name": { TH: "ภก.ณภัทร สัตยุตม์", EN: "Pharm. Napat Sattayut" },
  "speaker.s8.position": { TH: "Nudge Thailand", EN: "Bean, Nudge Thailand" },
  "speaker.s8.topic": { TH: "การดูแลจิตใจ", EN: "Mental Health & Well-being" },
  "speaker.s8.desc": { TH: "เทคนิคการดูแลสุขภาพจิตและป้องกันภาวะ Burn Out สำหรับเภสัชกร", EN: "Mental health tips and Burn Out prevention techniques for pharmacists." },

  "speaker.tag.president": { TH: "นายกสภาฯ", EN: "President" },
  "speaker.tag.pharmacy": { TH: "วิชาชีพเภสัชกรรม", EN: "Pharmacy" },
  "speaker.tag.ceremony": { TH: "พิธีการ", EN: "Ceremony" },
  "speaker.tag.pr": { TH: "ประชาสัมพันธ์", EN: "PR" },
  "speaker.tag.expert": { TH: "ผู้เชี่ยวชาญ", EN: "Expert" },
  "speaker.tag.insight": { TH: "ประสบการณ์", EN: "Experience" },

  // Agenda Section
  "agenda.title1": { TH: "กำหนดการ", EN: "Event " },
  "agenda.title2": { TH: "กิจกรรม", EN: "Agenda" },
  "agenda.subtitle1": { TH: "รายละเอียดกำหนดการตลอดกิจกรรม", EN: "Detailed activities throughout the 1-day orientation" },
  "agenda.subtitle2": { TH: "เพื่อเตรียมพร้อมสู่การปฏิบัติงานจริง", EN: "to prepare you for real-world practice." },
  "agenda.clickHint": { TH: "คลิกที่แต่ละรายการเพื่อดูรายละเอียด", EN: "Click each event to expand" },
  "agenda.sessions": { TH: "กิจกรรม", EN: "sessions" },
  "agenda.onDay": { TH: "ในวันที่", EN: "on Day" },
  "agenda.lectures": { TH: "บรรยาย", EN: "Lectures" },
  "agenda.workshops": { TH: "เวิร์กช็อป", EN: "Workshops" },
  "agenda.total": { TH: "รวม", EN: "Total" },
  "agenda.events": { TH: "กิจกรรม", EN: "Events" },
  "agenda.day": { TH: "วันที่", EN: "Day" },

  // Agenda Day themes
  "agenda.day1.theme": { TH: "ก้าวแรกสู่วิชาชีพ", EN: "First Step" },
  "agenda.day1.themeDesc": { TH: "ห้องสิริวัฒนภักดี ชั้น 3 อาคารมหิตลาธิเบศร กระทรวงสาธารณสุข จ.นนทบุรี", EN: "Siriwattana Phakdee Room, 3rd Fl, Mahitalathibet Building, Ministry of Public Health" },

  // Agenda Day dates
  "agenda.day1.date": { TH: "17 พ.ค. 2569", EN: "May 17, 2026" },

  // Agenda Badge labels
  "agenda.badge.registration": { TH: "ลงทะเบียน", EN: "Registration" },
  "agenda.badge.ceremony": { TH: "พิธีการ", EN: "Ceremony" },
  "agenda.badge.lecture": { TH: "บรรยาย", EN: "Lecture" },
  "agenda.badge.workshop": { TH: "Panel Discussion", EN: "Panel Discussion" },
  "agenda.badge.break": { TH: "พัก", EN: "Break" },

  "agenda.badge.summary": { TH: "สรุป", EN: "Summary" },
  "agenda.badge.activity": { TH: "กิจกรรม", EN: "Activity" },

  // Agenda - grouped session labels
  "agenda.group.opening.title": { TH: "พิธีเปิดและกล่าวต้อนรับ", EN: "Opening Ceremony & Welcome" },
  "agenda.group.opening.desc": { TH: "พิธีกรรมเปิดงาน รับของที่ระลึก กล่าวต้อนรับ และกล่าวโอวาทจากนายกสภาเภสัชกรรม", EN: "Event opening ceremony, welcome gifts, opening address, and remarks from the President of the Pharmacy Council." },
  "agenda.specialSession": { TH: "เซสชั่นพิเศษ", EN: "Special Session" },
  "agenda.scheduleLabel": { TH: "กำหนดการ", EN: "Schedule" },

  // Agenda Duration labels
  "agenda.dur.5min": { TH: "5 นาที", EN: "5 min" },
  "agenda.dur.30min": { TH: "30 นาที", EN: "30 min" },
  "agenda.dur.40min": { TH: "40 นาที", EN: "40 min" },
  "agenda.dur.60min": { TH: "60 นาที", EN: "60 min" },
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
  "agenda.d1e3.desc": { TH: "พิธีกรกล่าวต้อนรับผู้ร่วมงาน และแจ้งกำหนดการ", EN: "Welcome remarks and schedule explanation." },
  "agenda.d1e3.meta": { TH: "ภญ.โฉมคนางค์ ภูมิสายดร\n(ประชาสัมพันธ์และโฆษกสภาฯ)", EN: "Pharm. Chomkhanang Phumsaidorn\n(PR & Spokesperson)" },

  "agenda.d1e4.title": { TH: "พิธีเปิดและกล่าวให้โอวาท", EN: "Opening Ceremony & Address" },
  "agenda.d1e4.desc": { TH: "เนื่องในโอกาสเภสัชกรใหม่ก้าวเข้าสู่การประกอบวิชาชีพเภสัชกรรม", EN: "On the occasion of new pharmacists entering the pharmacy profession." },
  "agenda.d1e4.meta": { TH: "ภก.ปรีชา พันธุ์ติเวช\n(นายกสภาเภสัชกรรม)", EN: "Pharm. Preecha Bhandtivej\n(President)" },

  "agenda.d1e5.title": { TH: "พิธีมอบใบอนุญาตประกอบวิชาชีพเภสัชกรรม", EN: "Pharmacy License Granting Ceremony" },
"agenda.d1e5.desc": { TH: "การมอบใบอนุญาตประกอบวิชาชีพให้แก่เภสัชกรผู้สำเร็จการศึกษา", EN: "The granting of professional licenses to graduating pharmacists." },
  "agenda.d1e5.meta": { TH: "คณะผู้บริหารสภาเภสัชกรรม", EN: "Pharmacy Council Executives" },

  "agenda.d1evt.title": { TH: "VTR แนะนำกรรมการสภาเภสัชกรรม", EN: "VTR: Pharmacy Council Committee Introduction" },
  "agenda.d1evt.desc": { TH: "แนะนำกรรมการสภาเภสัชกรรมและบทบาทของแต่ละท่าน", EN: "Introduction to the Pharmacy Council committee members and their roles." },

  "agenda.d1e6.title": { TH: "สิทธิหน้าที่สมาชิก & บริการสำนักงาน", EN: "Member Rights & Office Services" },
  "agenda.d1e6.desc": { TH: "สิทธิหน้าที่ของสมาชิก การให้บริการสำนักงานเลขาฯ ระบบ E-service การศึกษาต่อเนื่อง ความก้าวหน้าสายงาน Telehealth และกฎหมายวิชาชีพ", EN: "Member rights and duties, secretariat services, E-service, continuing education, career progression, Telehealth, and professional law." },
  "agenda.d1e6.meta": { TH: "รศ.ภญ.สุณี เลิศสินอุดม\n(เลขาธิการสภาเภสัชกรรม)", EN: "Assoc. Prof. Sunee Lertsinudom\n(Secretary-General)" },

  "agenda.d1e7.title": { TH: "Panel Discussion: แลกเปลี่ยนประสบการณ์วิชาชีพ", EN: "Panel Discussion: Professional Experience Exchange" },
  "agenda.d1e7.desc": { TH: "แลกเปลี่ยนประสบการณ์วิชาชีพจากเภสัชกรหลากหลายสาขา ร้านยา โรงพยาบาล อุตสาหกรรม การตลาด และภาครัฐ", EN: "Professional experience sharing from pharmacists across community pharmacy, hospital, industry, marketing, and public sectors." },
  "agenda.d1e7.speakerLabel": { TH: "วิทยากร", EN: "Speakers" },
  "agenda.d1e7.speaker1": { TH: "ภญ.ชนากิต อิ่มบำรุง\n(เหรัญญิก สภาเภสัชกรรม)", EN: "Pharm. Chanakit Imbamrung\n(Treasurer, The Pharmacy Council of Thailand)" },
  "agenda.d1e7.speaker2": { TH: "ภญ.ชนิตรา อินทร์ศิริ\n(ศูนย์การแพทย์สมเด็จพระเทพฯ)", EN: "Pharm. Chanitra Insiri\n(HRH Princess Medical Center)" },
  "agenda.d1e7.speaker3": { TH: "ภก.อาทิตย์ สอดแสงอรุณงาม\n(ผู้อำนวยการกองปฏิบัติการทะเบียน องค์การเภสัชกรรม)", EN: "Pharm. Athit Sotsaengarunngam\n(Director of Registration Ops, GPO)" },
  "agenda.d1e7.speaker4": { TH: "ภก.นิชนนท์ ชาวเรา\n(สสจ.สมุทรสงคราม)", EN: "Pharm. Nichanon Chaorao\n(Samut Songkhram PHO)" },
  "agenda.d1e7.speaker5": { TH: "ภญ.ภิญญาพัชร์ สุขมั่นคงเสมอ\n(Associated Product Manager, Abbott Laboratories)", EN: "Pharm. Pinyapat Sukmankongsamun\n(Associated Product Manager, Abbott)" },
  "agenda.d1e7.mcLabel": { TH: "พิธีกร", EN: "MC" },
  "agenda.d1e7.mc": { TH: "ภก.พงษ์ศิวะ กู่นอก\n(ผู้ช่วยเลขาธิการสภาเภสัชกรรม)", EN: "Pharm. Phongsiva Kunok\n(Asst. Secretary-General)" },

  "agenda.d1e8.title": { TH: "ทำงานอย่างไรไม่ให้ Burn Out", EN: "How to Work Without Burning Out" },
  "agenda.d1e8.desc": { TH: "เทคนิคการดูแลสุขภาพจิตและป้องกันภาวะ Burn Out สำหรับเภสัชกรใหม่", EN: "Mental health tips and Burn Out prevention techniques for new pharmacists." },
  "agenda.d1e8.meta": { TH: "ภก.ณภัทร สัตยุตม์\n(Nudge Thailand)", EN: "Pharm. Napat Sattayut\n(Bean, Nudge Thailand)" },

  "agenda.d1e9.title": { TH: "Closing Activity & ลุ้นรางวัล", EN: "Closing Activity & Lucky Draw" },
  "agenda.d1e9.desc": { TH: "กิจกรรมร่วมสนุก ลุ้นรับของรางวัล และปิดงาน", EN: "Fun closing activities, lucky draw prizes, and event closing." },
  "agenda.d1e9.meta": { TH: "ทีมงานสภาเภสัชกรรม", EN: "Pharmacy Council Team" },

  // Location & Transportation Section
  "location.badge": { TH: "📍 การเดินทาง", EN: "📍 Venue & Transportation" },
  "location.title1": { TH: "สถานที่จัดงาน", EN: "Event " },
  "location.title2": { TH: "และการเดินทาง", EN: "Venue" },
  "location.desc": { TH: "ข้อมูลสถานที่และวิธีการเดินทางมายังกระทรวงสาธารณสุข เพื่อความสะดวกและรวดเร็ว", EN: "Venue information and how to get to the Ministry of Public Health conveniently." },
  "location.venue.title": { TH: "สภาเภสัชกรรม\nอาคารมหิตลาธิเบศร", EN: "Pharmacy Council of Thailand\nMahitalathibet Building" },
  "location.venue.desc": { TH: "ห้องสิริวัฒนภักดี ชั้น 3 กระทรวงสาธารณสุข จ.นนทบุรี", EN: "Siriwattana Phakdee Room, 3rd Fl, Ministry of Public Health, Nonthaburi" },
  "location.mrt.title": { TH: "รถไฟฟ้า MRT (สายสีม่วง)", EN: "MRT (Purple Line)" },
  "location.mrt.desc": { TH: "ลงสถานี 'กระทรวงสาธารณสุข' (ทางออก 2) ต่อวินมอเตอร์ไซค์หรือรถสองแถวเข้ามายังอาคาร", EN: "Alight at 'Ministry of Public Health' station (Exit 2), take a motorcycle taxi or minibus to the building." },
  "location.bus.title": { TH: "รถโดยสารประจำทาง", EN: "Public Bus" },
  "location.bus.desc": { TH: "สาย 32, 33, 63, 90, 97, 114 ลงป้ายหน้ากระทรวงสาธารณสุข หรือหน้า รพ.ศรีธัญญา", EN: "Bus no. 32, 33, 63, 90, 97, 114. Get off at the Ministry of Public Health or Srithanya Hospital." },
  "location.car.title": { TH: "รถยนต์ส่วนตัว", EN: "Private Car" },
  "location.car.desc": { TH: "สามารถจอดรถได้ที่ลานจอดรถรอบอาคารมหิตลาธิเบศรและบริเวณลานจอดรถใกล้เคียง", EN: "Parking is available around the Mahitalathibet Building and nearby parking lots." },
  "location.map.btn": { TH: "เปิด Google Maps", EN: "Open in Google Maps" },

  // Memories Section
  "memories.badge": { TH: " ภาพบรรยากาศ", EN: "Gallery" },
  "memories.title1": { TH: "ภาพแห่ง", EN: "Event " },
  "memories.title2": { TH: "ความประทับใจ", EN: "Gallery" },
  "memories.photo.title": { TH: "งานปฐมนิเทศเภสัชกรใหม่", EN: "New Pharmacist Orientation" },
  "memories.photo.desc": { TH: "ช่วงเวลาแห่งความทรงจำร่วมกัน", EN: "Memorable moments together" },

  // Job Posters Section
  "jobPosters.badge": { TH: "โปสเตอร์สมัครงาน", EN: "Job Fair Posters" },
  "jobPosters.title1": { TH: "โอกาส", EN: "Career " },
  "jobPosters.title2": { TH: "ทางวิชาชีพ", EN: "Opportunities" },
  "jobPosters.titleFull": { TH: "โอกาสทางวิชาชีพ", EN: "Career Opportunities" },
  "jobPosters.subtitle": { TH: "รวมโปสเตอร์รับสมัครงานจากหน่วยงานชั้นนำ คลิกที่ภาพเพื่อดูรายละเอียด", EN: "Job openings from leading organizations. Click any poster to view full details." },
  "jobPosters.count": { TH: "ประกาศ", EN: "Postings" },
  "jobPosters.hint": { TH: "คลิกที่ภาพเพื่อดูขนาดเต็ม", EN: "Click any poster to view full size" },
  "jobPosters.openDrive": { TH: "เปิดใน Google Drive", EN: "Open in Drive" },
  "jobPosters.close": { TH: "ปิด", EN: "Close" },

  // Sponsors
  "sponsor.title1": { TH: "ผู้สนับสนุน", EN: " " },
  "sponsor.subtitle": { 
    TH: "ขอขอบพระคุณผู้สนับสนุนทุกท่านที่ร่วมสนับสนุนการจัดงานปฐมนิเทศเภสัชกรใหม่ ประจำปี 2569 ", 
    EN: "Thank you to our sponsors for making the New Pharmacist Orientation 2026 possible." 
  },

  // Footer
  "footer.officialEN": { TH: "Pharmacy Council of Thailand", EN: "Pharmacy Council of Thailand" },
  "footer.officialTH": { TH: "สำนักงานสภาเภสัชกรรม", EN: "สำนักงานสภาเภสัชกรรม" },
  "footer.tagline": {
    TH: "หน่วยงานกำกับดูแลวิชาชีพเภสัชกรรมแห่งประเทศไทย",
    EN: "The regulatory body for the pharmacy profession in Thailand."
  },
  "footer.contact": { TH: "ติดต่อเรา", EN: "Contact" },

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
  "login.forgot": { TH: "ลืมรหัสผ่าน?", EN: "Forgot Password?" },
  "login.signingIn": { TH: "กำลังเข้าสู่ระบบ...", EN: "Signing in..." },
  "login.signIn": { TH: "เข้าสู่ระบบ", EN: "Sign In" },
  "login.or": { TH: "หรือ", EN: "or" },

  "login.createAccount": { TH: "ลงทะเบียนใหม่ →", EN: "Register now →" },

  // Register
  "register.step.personal": { TH: "ข้อมูลส่วนตัว", EN: "Personal" },
  "register.step.credentials": { TH: "ข้อมูลเข้าระบบ", EN: "Credentials" },
  "register.createAccount": { TH: "ลงทะเบียน", EN: "Register" },
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
  "register.licenseId": { TH: "เลขใบอนุญาตประกอบวิชาชีพ", EN: "License Number" },
  "register.phone": { TH: "เบอร์โทรศัพท์", EN: "Phone Number" },
  "register.email": { TH: "อีเมล", EN: "Email Address" },
  "register.password": { TH: "รหัสผ่าน", EN: "Password" },
  "register.confirmPassword": { TH: "ยืนยันรหัสผ่าน", EN: "Confirm Password" },
  "register.continue": { TH: "ถัดไป", EN: "Continue" },
  "register.creating": {
    TH: "กำลังลงทะเบียน...",
    EN: "Registering...",
  },
  "register.hasAccount": {
    TH: "มีบัญชีอยู่แล้ว?",
    EN: "Already have an account?",
  },
  "register.signIn": { TH: "เข้าสู่ระบบ", EN: "Sign In" },
  "register.thaiId": { TH: "เลขบัตรประชาชน 13 หลัก", EN: "Thai ID Card" },
  "register.thaiIdPlaceholder": { TH: "ตัวเลข 13 หลัก", EN: "13-digit number" },
  "register.licenseOptional": { TH: "(ไม่บังคับ)", EN: "(Optional)" },
  "register.organization": { TH: "องค์กร / สถานที่ทำงาน", EN: "Organization / Affiliation" },
  "register.organizationPlaceholder": { TH: "สถานที่ทำงานของคุณ", EN: "Your workplace" },
  "register.university": { TH: "มหาวิทยาลัย", EN: "University" },
  "register.selectUniversity": { TH: "เลือกสถาบัน", EN: "Select a university" },
  "register.alreadyAccount": { TH: "มีบัญชีอยู่แล้ว?", EN: "Already have an account?" },
  "register.consent": { TH: "ข้าพเจ้ายอมรับข้อตกลงและเงื่อนไข และยินยอมให้ประมวลผลข้อมูล", EN: "I agree to the terms and conditions and consent to data processing" },

  // Navbar extras
  "nav.materials": { TH: "เอกสารบรรยาย/คู่มือเภสัชกรใหม่(กำลังจัดทำ)", EN: "Lecture Materials/Manual (In Progress)" },
  "nav.photos": { TH: "ดาวน์โหลดภาพถ่ายบรรยากาศในงาน", EN: "Download Event Photos" },

  // Welcome Section extras
  "welcome.swipeHint": { TH: "เลื่อนดูรายถัดไป", EN: "Swipe to navigate" },

  // Banner
  "banner.new": { TH: "เปิดแล้ว", EN: "OPEN" },
  "banner.text": { TH: "เปิดรับลงทะเบียน", EN: "Registration for" },
  "banner.event": {
    TH: "ปฐมนิเทศเภสัชกร 2026",
    EN: "Pharmacy Orientation 2026",
  },
  "banner.open": { TH: "แล้ว!", EN: "is now OPEN!" },


  // Branding
  "nav.brand": { TH: "สภาเภสัชกรรม", EN: "Pharmacy Council" },
  "hero.mainTitle1": { TH: "ปฐมนิเทศ", EN: "NEW PHARMACIST" },
  "hero.mainTitle2": { TH: "เภสัชกรใหม่", EN: "ORIENTATION" },
  "footer.brandName": { TH: "ปฐมนิเทศเภสัชกรใหม่", EN: "New Pharmacist Orientation" },
  "footer.address": {
    TH: "สำนักงานเลขาธิการสภาเภสัชกรรม อาคารมหิตลาธิเบศร ชั้น 8 กระทรวงสาธารณสุข เลขที่ 88/19 หมู่ 4 ถนนติวานนท์ ตำบลตลาดขวัญ อำเภอเมือง จังหวัดนนทบุรี 11000",
    EN: "The Pharmacy Council of Thailand, Mahitalathibet Building, 8th Floor, Ministry of Public Health, 88/19 Moo 4, Tiwanon Road, Talat Khwan, Mueang Nonthaburi, Nonthaburi 11000"
  },


  // Registration CTA Section
  "regcta.badge": { TH: "ลงทะเบียน", EN: "Registration" },
  "regcta.title1": { TH: "พร้อมเริ่มต้น", EN: "Ready to Begin" },
  "regcta.title2": { TH: "ร่วมงานปฐมนิเทศ", EN: "Your Journey?" },
  "regcta.desc": {
    TH: "ลงทะเบียนเข้าร่วมงานปฐมนิเทศเภสัชกรใหม่ ปี 2569 เพื่อรับใบอนุญาต ร่วมกิจกรรม และพบปะกับเพื่อนร่วมวิชาชีพ",
    EN: "Register for the New Pharmacist Orientation 2026 to receive your license, join activities, and network with fellow professionals."
  },
  "regcta.btn": { TH: "ลงทะเบียนเข้าร่วมงาน", EN: "Register for Orientation" },
  "regcta.registered": { TH: "คุณลงทะเบียนเข้าร่วมงานแล้ว", EN: "You are registered" },
  "regcta.info1": { TH: "ฟรีสำหรับเภสัชกรใหม่", EN: "Free for New Pharmacists" },
  "regcta.info2": { TH: "ไม่มีค่าใช้จ่าย", EN: "No Registration Fee" },
  "regcta.info4": { TH: "17 พ.ค. 2569", EN: "May 17, 2026" },

  // Login/Register overrides
  "login.noAccount": {
    TH: "ยังไม่มีบัญชี?",
    EN: "New to Orientation?",
  },
  "login.adminDash": { TH: "แดชบอร์ดแอดมิน", EN: "Admin Dashboard" },
  "login.error": { TH: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", EN: "Invalid email or password" },
  "logo.council": { TH: "สภาเภสัชกรรม", EN: "Pharmacy Council" },
  "logo.thailand": { TH: "แห่งประเทศไทย", EN: "of Thailand" },

  // Scroll Sequence
  "scroll.loading": { TH: "กำลังโหลดประสบการณ์", EN: "Loading Experience" },
  "scroll.back": { TH: "กลับหน้าหลัก", EN: "Back to Home" },
  
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

  // My Ticket Page
  "ticket.loading": { TH: "กำลังโหลดตั๋วของคุณ...", EN: "Loading your ticket..." },
  "ticket.title": { TH: "ตั๋วอิเล็กทรอนิกส์", EN: "My E-Ticket" },
  "ticket.subtitle": { TH: "โปรดแสดงตั๋วนี้ที่จุดลงทะเบียน", EN: "Please show this digital ticket at the registration desk." },
  "ticket.eventName": { TH: "งานปฐมนิเทศเภสัชกรใหม่ ปี 2569", EN: "New Pharmacist Orientation 2026" },
  "ticket.confirmed": { TH: "ยืนยันการเข้าร่วม", EN: "Confirmed Guest" },
  "ticket.attendee": { TH: "ชื่อผู้เข้าร่วม", EN: "Attendee Name" },
  "ticket.passType": { TH: "ประเภทบัตร", EN: "Pass Type" },
  "ticket.generalAccess": { TH: "ผู้เข้าร่วมงานทั่วไป", EN: "General Access" },
  "ticket.date": { TH: "วันที่", EN: "Date" },
  "ticket.eventDate": { TH: "17 พ.ค. 2569", EN: "17 May 2026" },
  "ticket.time": { TH: "เวลา", EN: "Time" },
  "ticket.eventTime": { TH: "10:00 - 16:00 น.", EN: "10:00 - 16:00" },
  "ticket.scanMe": { TH: "สแกน QR Code", EN: "Scan Me" },
  "ticket.id": { TH: "รหัส:", EN: "ID:" },
  "ticket.valid": { TH: "ใช้สำหรับเข้างาน", EN: "Valid for Entry" },
  "ticket.moph": { TH: "ห้องสิริวัฒนภักดี ชั้น 3 อาคารมหิตลาธิเบศร กระทรวงสาธารณสุข", EN: "Siriwattana Phakdee Room, 3rd Fl, Mahitalathibet Building, Ministry of Public Health" },
  "ticket.download": { TH: "ดาวน์โหลด PDF", EN: "Download PDF" },
  "ticket.appleWallet": { TH: "เพิ่มลงใน Apple Wallet", EN: "Add to Apple Wallet" },
  "ticket.notProvided": { TH: "ไม่ระบุ", EN: "Not Provided" },

  // Live Stream Page
  "live.connecting": { TH: "กำลังเชื่อมต่อไลฟ์สด...", EN: "Connecting to stream..." },
  "live.secureConn": { TH: "กรุณารอสักครู่ ระบบกำลังทำการเชื่อมต่อ", EN: "Please wait while we establish a secure connection" },
  "live.badge": { TH: "ไลฟ์สด", EN: "Live" },
  "live.status": { TH: "เวทีหลัก • กำลังรับชม 1,245 คน", EN: "Main Stage • 1,245 watching" },
  "live.back": { TH: "กลับไปหน้าแรก", EN: "Back to Event" },
  "live.startingSoon": { TH: "ไลฟ์สดกำลังจะเริ่มเร็วๆ นี้", EN: "STREAM STARTING SOON" },
  "live.datetime": { TH: "17 พ.ค. 2569 • 10:00 น.", EN: "17 May 2026 • 10:00 AM BKK" },
  "live.tabChat": { TH: "แชทสด", EN: "Live Chat" },
  "live.tabQa": { TH: "ถาม-ตอบ", EN: "Q & A" },
  "live.tabPolls": { TH: "โพลล์", EN: "Polls" },
  "live.chatStart": { TH: "ไลฟ์เริ่มเวลา 10:00 น.", EN: "Stream starts at 10:00 AM" },
  "live.mod": { TH: "ผู้ดูแลระบบ", EN: "System Mod" },
  "live.admin": { TH: "แอดมิน", EN: "Admin" },
  "live.welcomeChat": { TH: "ยินดีต้อนรับสู่งานปฐมนิเทศเภสัชกรใหม่ 2569! โปรดสุภาพในการแชท", EN: "Welcome to the New Pharmacist Orientation 2026! Please be respectful in the chat." },
  "live.pharmacist": { TH: "เภสัชกร", EN: "Pharmacist" },
  
  "live.chatMsg1": { TH: "รอติดตามครับ/ค่ะ!", EN: "Can't wait!" },
  "live.chatMsg2": { TH: "มีสไลด์ให้ดาวน์โหลดไหมคะ?", EN: "Is the slide deck available?" },
  "live.chatMsg3": { TH: "สวัสดีจากเชียงใหม่ครับ", EN: "Hello from Chiang Mai" },
  "live.chatMsg4": { TH: "ตื่นเต้นกับกิจกรรมในงานมากครับ/ค่ะ!", EN: "Excited for the sessions!" },

  "live.noQuestions": { TH: "ยังไม่มีคำถาม", EN: "No questions asked yet" },
  "live.askQuestionInfo": { TH: "ส่งคำถามถึงวิทยากร คำถามโหวตสูงสุดจะถูกนำไปตอบในไลฟ์", EN: "Ask the speakers a question. Top voted questions will be answered live." },
  "live.active": { TH: "กำลังเปิดโหวต", EN: "Active" },
  "live.votes": { TH: "142 โหวต", EN: "142 votes" },
  
  "live.pollQ1": { TH: "คุณสนใจสายงานไหนเป็นพิเศษ?", EN: "What field are you most interested in pursuing?" },
  "live.pollOpt1": { TH: "ร้านยาชุมชน", EN: "Community Pharmacy" },
  "live.pollOpt2": { TH: "เภสัชกรโรงพยาบาล", EN: "Hospital Pharmacy" },
  "live.pollOpt3": { TH: "เภสัชกรรมอุตสาหการ", EN: "Industrial Pharmacy" },
  "live.pollOpt4": { TH: "การคุ้มครองผู้บริโภค / อย.", EN: "Regulatory Affairs" },
  
  "live.inputQA": { TH: "พิมพ์คำถามของคุณ...", EN: "Ask a question..." },
  "live.inputChat": { TH: "พิมพ์ข้อความของคุณ...", EN: "Say something..." },
  "live.viewOnly": { TH: "โหมดผู้ชม (ไม่สามารถส่งข้อความได้)", EN: "View Only Mode (Chat disabled)" },

  // Mask Scroll
  "mask.line1": { TH: "แนะนำอาชีพ", EN: "Career Orientation" },
  "mask.line2": { TH: "เภสัชกรใหม่", EN: "New Pharmacists" },
  "mask.line3": { TH: "2569", EN: "2026" },
  "mask.mute": { TH: "ปิดเสียง", EN: "Mute" },
  "mask.unmute": { TH: "เปิดเสียง", EN: "Unmute" },
  "mask.pause": { TH: "หยุด", EN: "Pause" },
  "mask.play": { TH: "เล่น", EN: "Play" },

  // University Stats
  "stats.title1": { TH: "จำนวน", EN: "Number of " },
  "stats.title2": { TH: "ผู้เข้าร่วมงาน", EN: "Registrants" },
  "stats.line": { TH: "กราฟเส้น", EN: "Line Chart" },
  "stats.bar": { TH: "กราฟแท่ง", EN: "Bar Chart" },
  "stats.scrollHint": { TH: "เลื่อนขวาเพื่อดูเพิ่มเติม", EN: "Scroll right for more" },
  "stats.institutions": { TH: "25 สถาบัน", EN: "25 Institutions" },
  "stats.sortDesc": { TH: "เรียงจากมากไปน้อย", EN: "High to Low" },
  "stats.totalRegistered": { TH: "ผู้เข้าร่วมงานทั้งหมด", EN: "Total Registered" },

  "uni.cu": { TH: "จุฬาลงกรณ์มหาวิทยาลัย", EN: "Chulalongkorn University" },
  "uni.mu": { TH: "มหาวิทยาลัยมหิดล", EN: "Mahidol University" },
  "uni.cmu": { TH: "มหาวิทยาลัยเชียงใหม่", EN: "Chiang Mai University" },
  "uni.psu": { TH: "มหาวิทยาลัยสงขลานครินทร์", EN: "Prince of Songkla University" },
  "uni.kku": { TH: "มหาวิทยาลัยขอนแก่น", EN: "Khon Kaen University" },
  "uni.su": { TH: "มหาวิทยาลัยศิลปากร", EN: "Silpakorn University" },
  "uni.nu": { TH: "มหาวิทยาลัยนเรศวร", EN: "Naresuan University" },
  "uni.swu": { TH: "มหาวิทยาลัยศรีนครินทรวิโรฒ", EN: "Srinakharinwirot University" },
  "uni.msu": { TH: "มหาวิทยาลัยมหาสารคาม", EN: "Mahasarakham University" },
  "uni.ubu": { TH: "มหาวิทยาลัยอุบลราชธานี", EN: "Ubon Ratchathani University" },
  "uni.up": { TH: "มหาวิทยาลัยพะเยา", EN: "University of Phayao" },
  "uni.rsu": { TH: "มหาวิทยาลัยรังสิต", EN: "Rangsit University" },
  "uni.hcu": { TH: "มหาวิทยาลัยหัวเฉียวเฉลิมพระเกียรติ", EN: "Huachiew Chalermprakiet University" },
  "uni.siam": { TH: "มหาวิทยาลัยสยาม", EN: "Siam University" },
  "uni.pyu": { TH: "มหาวิทยาลัยพายัพ", EN: "Payap University" },
  "uni.wu": { TH: "มหาวิทยาลัยวลัยลักษณ์", EN: "Walailak University" },
  "uni.buu": { TH: "มหาวิทยาลัยบูรพา", EN: "Burapha University" },
  "uni.eau": { TH: "มหาวิทยาลัยอีสเทิร์นเอเชีย", EN: "Eastern Asia University" },
  "uni.tu": { TH: "มหาวิทยาลัยธรรมศาสตร์", EN: "Thammasat University" },
  "uni.wtu": { TH: "มหาวิทยาลัยเวสเทิร์น", EN: "Western University" },
  "uni.iesa": { TH: "สถาบันวิทยาการประกอบการแห่งอโยธยา", EN: "Institute of Entrepreneurial Science Ayothaya" },
  "uni.pi": { TH: "สถาบันพระบรมราชชนก", EN: "Praboromarajchanok Institute" },
  "uni.nmc": { TH: "วิทยาลัยนครราชสีมา", EN: "Nakhon Ratchasima College" },
  "uni.ku": { TH: "มหาวิทยาลัยเกษตรศาสตร์", EN: "Kasetsart University" },
  "uni.ptu": { TH: "มหาวิทยาลัยปทุมธานี", EN: "Pathumthani University" },
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
