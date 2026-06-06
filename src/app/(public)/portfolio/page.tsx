import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PortfolioListingSection } from "@/components/sections/PortfolioListingSection";
import { api } from "@/lib/axios";
import { Portfolio } from "@/app/types/portfolio.types";
import Link from "next/link";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Case Studies & Work Portfolio — APXTECK",
  description: "Browse APXTeck's portfolio. Discover our case studies on web application engineering, user experience design, and digital marketing results.",
  openGraph: {
    title: "Case Studies & Work Portfolio — APXTECK",
    description: "Browse APXTeck's portfolio. Discover our case studies on web application engineering, user experience design, and digital marketing results.",
    url: "https://apxteck.com/portfolio",
    siteName: "APXTeck",
    type: "website",
  },
  alternates: {
    canonical: "https://apxteck.com/portfolio",
  },
};

export default async function PortfolioListingPage() {
  let portfolios: Portfolio[] = [];
  try {
    const data = await api.fetchPortfolios();
    portfolios = data.filter((p) => p.isPublished);
  } catch (err) {
    console.error("Failed to load portfolio listing data", err);
  }

  const jsonLdPortfolioList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": portfolios.length,
    "itemListElement": portfolios.map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "name": p.title,
        "headline": p.title,
        "description": p.problem || p.results,
        "url": `https://apxteck.com/portfolio/${p.slug}`
      }
    }))
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPortfolioList) }}
      />

      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        
        {/* Page Hero */}
        <section className="relative py-16 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-background -z-10" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-4">
            <div className="flex justify-center items-center gap-2 text-xs text-foreground/50 font-medium">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground/80">Portfolio</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Case Studies & Portfolios</h1>
            <p className="text-foreground/75 max-w-2xl mx-auto text-base">
              A detailed look at challenging problems we solved, technical architectures we deployed, and direct business metrics.
            </p>
          </div>
        </section>

        {/* Client side listing list with tabs */}
        <PortfolioListingSection initialPortfolios={portfolios} />

      </main>

      <Footer />
    </div>
  );
}
