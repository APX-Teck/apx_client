import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
const TechStackMarquee = dynamic(
  () => import('@/components/sections/TechStackMarquee').then((mod) => mod.TechStackMarquee),
  { ssr: true }
);
import { api } from '@/lib/axios';
import { Portfolio } from '@/app/types/portfolio.types';
import {
  generatePortfolioItemListSchema,
  portfolioBreadcrumbSchema,
  portfolioCollectionPageSchema,
} from './constants';

// Dynamically import client components to reduce initial server payload and improve Core Web Vitals
const PortfolioClient = dynamic(
  () => import('./PortfolioClient').then((mod) => mod.PortfolioClient),
  {
    ssr: true, // Keep SSR enabled for SEO
  }
);

const PortfolioListingSection = dynamic(
  () =>
    import('@/components/sections/PortfolioListingSection').then(
      (mod) => mod.PortfolioListingSection
    ),
  {
    ssr: true,
  }
);

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Case Studies & Work Portfolio | APX - Advanced Precision & Excellence',
    description:
      "Browse APXTeck's portfolio. Discover our case studies on web application engineering, user experience design, and digital marketing results.",
    alternates: {
      canonical: 'https://apxteck.com/portfolio',
      languages: {
        'en-US': 'https://apxteck.com/portfolio',
        'en-IN': 'https://apxteck.com/en-in/portfolio',
      },
    },
    openGraph: {
      title: 'Case Studies & Work Portfolio | APX - Advanced Precision & Excellence',
      description:
        "Browse APXTeck's portfolio. Discover our case studies on web application engineering, user experience design, and digital marketing results.",
      url: 'https://apxteck.com/portfolio',
      siteName: 'APX - Advanced Precision & Excellence',
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: 'https://apxteck.com/images/og/portfolio.jpg',
          width: 1200,
          height: 630,
          alt: 'APXTeck Portfolio Case Studies',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@apxteck',
      creator: '@apxteck',
      title: 'Case Studies & Work Portfolio | APX - Advanced Precision & Excellence',
      description:
        "Browse APXTeck's portfolio. Discover our case studies on web application engineering, user experience design, and digital marketing results.",
      images: ['https://apxteck.com/images/og/portfolio.jpg'],
    },
  };
}

export default async function PortfolioListingPage() {
  let portfolios: Portfolio[] = [];
  try {
    const data = await api.fetchPortfolios();
    portfolios = data || [];
  } catch (err) {
    console.error('Failed to load portfolio listing data', err);
  }

  // Schema Generation
  const jsonLdItemList = generatePortfolioItemListSchema(portfolios);
  const jsonLdBreadcrumb = portfolioBreadcrumbSchema;
  const jsonLdCollectionPage = portfolioCollectionPageSchema;

  return (
    <div className="flex flex-col min-h-dvh selection:bg-accent/30 bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCollectionPage) }}
      />

      <Navbar />

      <main
        className="flex-1 pt-24 pb-20 overflow-x-hidden w-full pt-safe pb-safe"
        role="main"
        itemScope
        itemType="https://schema.org/CollectionPage"
      >
        <article className="w-full">
          {/* Animated Hero and Philosophy section (Client component) */}
          <PortfolioClient />

          <div
            className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12 text-center w-full"
            aria-hidden="true"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-glass-border to-transparent" />
          </div>

          {/* Client side listing list with tabs */}
          <section aria-label="Portfolio Case Studies Listing" className="w-full px-4 sm:px-0">
            <PortfolioListingSection initialPortfolios={portfolios} />
          </section>

          {/* Tech Stack Marquee at the bottom */}
          <aside className="mt-12 sm:mt-20 w-full" aria-label="Our Technology Stack">
            <TechStackMarquee />
          </aside>
        </article>
      </main>

      <Footer />
    </div>
  );
}
