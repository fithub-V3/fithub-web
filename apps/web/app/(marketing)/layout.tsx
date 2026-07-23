import Navbar from "@/components/marketing/Navbar";
import HeroBanner from "@/components/marketing/HeroBanner";
import MarketingCards from "@/components/marketing/MarketingCards";
import "@/styles/marketing/navbar.scss";
import "@/styles/marketing/hero-banner.scss";
import "@/styles/marketing/marketing-cards.scss";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <HeroBanner />
      <MarketingCards />
    </>
  );
}
