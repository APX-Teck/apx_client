import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactCTASection } from "@/components/sections/ContactCTASection";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30">
      <Navbar />
      <main className="flex-1 pt-20">
        <ContactCTASection />
      </main>
      <Footer />
    </div>
  );
}
