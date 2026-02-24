import Navbar from "./components/layout/Navbar";
import HeroSection from "./components/sections/HeroSection";
import WelcomeSection from "./components/sections/WelcomeSection";
import AgendaSection from "./components/sections/AgendaSection";
import MemoriesSection from "./components/sections/MemoriesSection";
import Footer from "./components/layout/Footer";
import StickySubnav from "./components/layout/StickySubnav";

export default function Home() {
  return (
    <>
      <Navbar />
      <StickySubnav />
      <main>
        <HeroSection />
        <div id="welcome">
          <WelcomeSection />
        </div>
        <AgendaSection />
        <MemoriesSection />
      </main>
      <Footer />
    </>
  );
}


