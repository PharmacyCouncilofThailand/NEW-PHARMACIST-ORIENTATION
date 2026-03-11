import Navbar from "./components/layout/Navbar";
import MaskScrollVideo from "./components/sections/MaskScrollVideo";
import HeroSection from "./components/sections/HeroSection";
import WelcomeSection from "./components/sections/WelcomeSection";
import SpeakerSection from "./components/sections/SpeakerSection";
import AgendaSection from "./components/sections/AgendaSection";
import MemoriesSection from "./components/sections/MemoriesSection";
import JobPostersSection from "./components/sections/JobPostersSection";
import SponsorSection from "./components/sections/SponsorSection";
import Footer from "./components/layout/Footer";
import StickySubnav from "./components/layout/StickySubnav";

export default function Home() {
  return (
    <>
      <Navbar />
      <StickySubnav />
      <main>
        <MaskScrollVideo />
        <HeroSection />
        <div id="welcome">
          <WelcomeSection />
        </div>
        <SpeakerSection />
        <AgendaSection />
        <MemoriesSection />
        <JobPostersSection />
        <SponsorSection />
      </main>
      <Footer />
    </>
  );
}


