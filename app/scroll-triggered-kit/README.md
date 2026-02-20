# 🎬 Scroll-Triggered Background Kit

ชุดโค้ดสำหรับทำ **scroll-triggered image sequence animation** — พื้นหลังที่เปลี่ยนตาม scroll พร้อม text overlay ที่ fade in/out

## 📁 โครงสร้างไฟล์

```
scroll-triggered-kit/
├── components/
│   ├── CapsuleScrollSequence.tsx   ← คอมโพเนนต์หลัก (scroll → frame sync)
│   ├── LogoMarquee.tsx             ← แถบโลโก้วิ่ง (optional)
│   └── ui/
│       └── SmoothScroll.tsx        ← Lenis smooth scroll provider
├── hooks/
│   ├── useImageSequence.ts         ← โหลด image sequence
│   └── useScrollAnimation.ts       ← IntersectionObserver helper
├── data/
│   └── logos.ts                    ← ข้อมูลโลโก้ SVG (optional)
├── styles/
│   └── scroll-triggered.css        ← CSS ที่จำเป็น (loader, marquee, scrollbar)
└── README.md                       ← ไฟล์นี้
```

## 📦 Dependencies ที่ต้องติดตั้ง

```bash
npm install framer-motion gsap lenis
```

## 🚀 วิธีใช้งาน

### 1. คัดลอกไฟล์

คัดลอกไฟล์จากโฟลเดอร์นี้ไปไว้ในโปรเจคใหม่:

- `components/` → `src/components/`
- `hooks/` → `src/hooks/`
- `data/` → `src/data/` (ถ้าใช้ LogoMarquee)
- `styles/scroll-triggered.css` → import เข้า globals.css

### 2. เตรียมรูป frames

สร้างโฟลเดอร์ `public/frames/` แล้ววางรูป sequence:

```
public/frames/
├── ezgif-frame-001.jpg
├── ezgif-frame-002.jpg
├── ...
└── ezgif-frame-076.jpg
```

### 3. ครอบด้วย SmoothScroll Provider

ใน `layout.tsx` (Next.js) หรือ App component:

```tsx
import SmoothScroll from "@/components/ui/SmoothScroll";

export default function Layout({ children }) {
  return (
    <SmoothScroll>
      {children}
    </SmoothScroll>
  );
}
```

### 4. ใช้งาน Component

```tsx
import CapsuleScrollSequence from "@/components/CapsuleScrollSequence";

export default function Home() {
  return (
    <main>
      <CapsuleScrollSequence />
      {/* ส่วนอื่นๆ ของเว็บ */}
    </main>
  );
}
```

## ⚙️ ปรับแต่ง

### เปลี่ยนจำนวน frames
แก้ `TOTAL_FRAMES` ใน `CapsuleScrollSequence.tsx` (บรรทัด 12)

### เปลี่ยน path รูป
แก้ `FRAME_PREFIX` และ `FRAME_EXTENSION` (บรรทัด 13-14)

### เปลี่ยนข้อความ overlay
แก้ส่วน `<TextOverlay>` ใน return JSX

### ปรับ timing ข้อความ fade in/out
แก้ค่า `useTransform` (บรรทัด 76-86):
```tsx
// [scroll_start_fade_in, fully_visible_start, fully_visible_end, scroll_start_fade_out]
const heroOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18, 0.25], [0, 1, 1, 0]);
```

### ปิด auto-scroll
ลบ useEffect ที่เกี่ยวกับ `hasAutoScrolled` (บรรทัด 157-185)

### ปิด LogoMarquee
ลบ import และส่วน `<LogoMarquee />` ใน JSX
