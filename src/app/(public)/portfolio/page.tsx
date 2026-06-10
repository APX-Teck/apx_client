import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PortfolioListingSection } from '@/components/sections/PortfolioListingSection';
import { TechStackMarquee } from '@/components/sections/TechStackMarquee';
import { api } from '@/lib/axios';
import { Portfolio } from '@/app/types/portfolio.types';
import { PortfolioClient } from './PortfolioClient';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Case Studies & Work Portfolio — APXTECK',
  description:
    "Browse APXTeck's portfolio. Discover our case studies on web application engineering, user experience design, and digital marketing results.",
  openGraph: {
    title: 'Case Studies & Work Portfolio — APXTECK',
    description:
      "Browse APXTeck's portfolio. Discover our case studies on web application engineering, user experience design, and digital marketing results.",
    url: 'https://apxteck.com/portfolio',
    siteName: 'APXTeck',
    type: 'website',
  },
  alternates: {
    canonical: 'https://apxteck.com/portfolio',
  },
};

export default async function PortfolioListingPage() {
  let portfolios: Portfolio[] = [];
  try {
    const data = await api.fetchPortfolios();
    portfolios = data || [];
  } catch (err) {
    console.error('Failed to load portfolio listing data', err);
  }

  const jsonLdPortfolioList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: portfolios.length,
    itemListElement: portfolios.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.title,
        headline: p.title,
        description: p.problem || p.results,
        url: `https://apxteck.com/portfolio/${p.slug}`,
      },
    })),
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPortfolioList) }}
      />

      <Navbar />

      <main className="flex-1 pt-24 pb-20 overflow-hidden">
        
        {/* Animated Hero and Philosophy section (Client component) */}
        <PortfolioClient />

        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-glass-border to-transparent" />
        </div>

        {/* Client side listing list with tabs */}
        <PortfolioListingSection initialPortfolios={portfolios} />

        {/* Tech Stack Marquee at the bottom */}
        <div className="mt-20">
          <TechStackMarquee />
        </div>
      </main>

      <Footer />
    </div>
  );
}
