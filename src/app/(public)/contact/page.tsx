import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactPageSection } from "@/components/sections/ContactPageSection";
import { api } from "@/lib/axios";
import { Service } from "@/app/types/service.types";

export const metadata: Metadata = {
  title: "Contact APXTECK — Get in Touch",
  description: "Contact APXTeck for custom software, web design, mobile apps, and search engine optimization. Get a free consultation and project roadmap.",
  openGraph: {
    title: "Contact APXTECK — Get in Touch",
    description: "Contact APXTeck for custom software, web design, mobile apps, and search engine optimization. Get a free consultation and project roadmap.",
    url: "https://apxteck.com/contact",
    siteName: "APXTeck",
    type: "website",
  },
};

export default async function ContactPage() {
  let services: Service[] = [];
  try {
    services = await api.fetchServices();
  } catch (err) {
    console.error("Failed to load services for contact page", err);
  }

  const jsonLdContact = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact APXTeck",
    "description": "Get in touch with APXTeck for premium software development and SEO consultancies.",
    "url": "https://apxteck.com/contact",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "APXTeck",
      "image": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3",
      "telephone": "+919876543210",
      "email": "hello@apxteck.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Tech Park",
        "addressLocality": "Pune",
        "addressRegion": "Maharashtra",
        "postalCode": "411001",
        "addressCountry": "IN"
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdContact) }}
      />

      <Navbar />

      <main className="flex-1 pt-24">
        <ContactPageSection services={services} />
      </main>

      <Footer />
    </div>
  );
}
