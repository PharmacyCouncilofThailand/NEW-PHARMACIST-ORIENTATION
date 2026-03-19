import MaskScrollSection from "../components/sections/MaskScrollSection";
import FloatingLangToggle from "../components/ui/FloatingLangToggle";

export const metadata = {
  title: "Mask Scroll — New Pharmacist Orientation 2026",
};

export default function MaskScrollPage() {
  return (
    <main>
      <FloatingLangToggle />
      <MaskScrollSection />
    </main>
  );
}
