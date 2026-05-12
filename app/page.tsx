import Navbar from "./components/layout/Navbar";
import HeroSection from "./components/sections/HeroSection";
import StatsSection from "./components/sections/StatsSection";
import StickySubnav from "./components/layout/StickySubnav";
import LazyHomeSection from "./components/layout/LazyHomeSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <StickySubnav />
      <main>
        <HeroSection />
        <StatsSection />
        <LazyHomeSection section="welcome" minHeight={820} />
        <LazyHomeSection section="speakers" minHeight={760} />
        <LazyHomeSection section="universityStats" minHeight={700} />
        <LazyHomeSection section="maskScroll" minHeight="100vh" className="hidden md:block" />
        <LazyHomeSection section="agenda" minHeight={900} />
        <LazyHomeSection section="location" minHeight={680} />
        <LazyHomeSection section="memories" minHeight={700} />
        <LazyHomeSection section="jobPosters" minHeight={760} />
        <LazyHomeSection section="sponsors" minHeight={420} />
      </main>
      <LazyHomeSection section="footer" minHeight={320} />
    </>
  );
}
