import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactCTASection } from "@/components/sections/ContactCTASection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <TestimonialsSection />
        <BlogPreviewSection />
        <FaqSection />
        <ContactCTASection />
      </main>

      <Footer />
    </div>
  );
}
