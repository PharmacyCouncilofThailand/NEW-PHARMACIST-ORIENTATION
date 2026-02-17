import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import WelcomeSection from "./components/WelcomeSection";
import AgendaSection from "./components/AgendaSection";
import MemoriesSection from "./components/MemoriesSection";
import Footer from "./components/Footer";
import StickySubnav from "./components/StickySubnav";

export default function Home() {
  return (
    <>
      <Navbar />
      <StickySubnav />
      <main>
        <HeroSection />
        <WelcomeSection />
        <AgendaSection />
        <MemoriesSection />
      </main>
      <Footer />
    </>
  );
}

