import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdBanner } from "@/components/ui/AdBanner";
import { ServicesListingSection } from "@/components/sections/ServicesListingSection";
import { api } from "@/lib/axios";
import { Service } from "@/app/types/service.types";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "IT Services for SMBs — APXTECK",
  description: "Browse APXTeck's premium IT services: Next.js Web Development, UI/UX Design, SEO Optimization, and Digital Marketing tailored to scale Indian SMBs.",
  openGraph: {
    title: "IT Services for SMBs — APXTECK",
    description: "Browse APXTeck's premium IT services: Next.js Web Development, UI/UX Design, SEO Optimization, and Digital Marketing tailored to scale Indian SMBs.",
    url: "https://apxteck.com/services",
    siteName: "APXTeck",
    type: "website",
  },
};

// Next.js static slug path generator
export async function generateStaticParams() {
  try {
    const services = await api.fetchServices();
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [
      { slug: "web-development" },
      { slug: "seo-optimization" },
      { slug: "ui-ux-design" },
      { slug: "digital-marketing" },
    ];
  }
}

export default async function ServicesListingPage() {
  // Fetch services serverside to inject structured service schema
  let services: Service[] = [];
  try {
    services = await api.fetchServices();
  } catch (err) {
    console.error("Failed to load services in server page", err);
  }

  const jsonLdServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": services.length,
    "itemListElement": services.map((s, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": s.name,
        "description": s.description,
        "provider": {
          "@type": "LocalBusiness",
          "name": "APXTeck"
        },
        "offers": s.price ? {
          "@type": "Offer",
          "price": s.price.replace(/[^0-9]/g, ""),
          "priceCurrency": "INR"
        } : undefined
      }
    }))
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdServiceSchema) }}
      />

      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        
        {/* Page Hero */}
        <section className="relative py-20 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-background -z-10" />
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-4">
            <div className="flex justify-center items-center gap-2 text-xs text-foreground/50 font-medium">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground/80">Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Our Services</h1>
            <p className="text-foreground/75 max-w-2xl mx-auto text-base">
              Explore our range of high-performance design, system architecture, and optimization services crafted for Indian SMBs.
            </p>
          </div>
        </section>

        {/* Ad Slot Top (above listing grid) */}
        <AdBanner placement="BLOG_LIST_TOP" />

        {/* Dynamic Service Grid Section */}
        <ServicesListingSection initialServices={services} />

      </main>

      <Footer />
    </div>
  );
}
