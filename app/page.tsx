import Navbar from "./components/layout/Navbar";
import HeroSection from "./components/sections/HeroSection";
import StatsSection from "./components/sections/StatsSection";
import WelcomeSection from "./components/sections/WelcomeSection";
import MaskScrollSection from "./components/sections/MaskScrollSection";
import SpeakerSection from "./components/sections/SpeakerSection";
import UniversityStatsSection from "./components/sections/UniversityStatsSection";
import AgendaSection from "./components/sections/AgendaSection";
import LocationSection from "./components/sections/LocationSection";
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
        <HeroSection />
        <StatsSection />
        <WelcomeSection />
        <SpeakerSection />
        <UniversityStatsSection />
        <MaskScrollSection />
        <AgendaSection />
        <LocationSection />
        <MemoriesSection />
        <JobPostersSection />
        <SponsorSection />
      </main>
      <Footer />
    </>
  );
}
