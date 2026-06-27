import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// UI
import { MouseSpotlight } from '@/components/ui/MouseSpotlight';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

// JSON-LD
import { jsonLdBreadcrumb, jsonLdTermsPage } from './constants';

// Content
import { TermsOfServiceContent } from '@/components/sections/terms/TermsOfServiceContent';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Terms of Service | APXTeck',
    description:
      'Read the Terms of Service for APXTeck. These terms govern the use of our web development, custom software, and GEO services for Clinics, Real Estate, E-commerce, and B2B clients Pan-India.',
    alternates: {
      canonical: 'https://apxteck.com/terms-of-service',
      languages: {
        'en-US': 'https://apxteck.com/terms-of-service',
        'en-IN': 'https://apxteck.com/en-in/terms-of-service',
      },
    },
    openGraph: {
      title: 'Terms of Service | APXTeck',
      description:
        'Read the Terms of Service for APXTeck. These terms govern the use of our web development, custom software, and GEO services for Clinics, Real Estate, E-commerce, and B2B clients Pan-India.',
      url: 'https://apxteck.com/terms-of-service',
      siteName: 'APX - Advanced Precision & Excellence',
      images: [
        {
          url: 'https://apxteck.com/og-terms.jpg',
          width: 1200,
          height: 630,
          alt: 'APXTeck Terms of Service',
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Terms of Service | APXTeck',
      description:
        'Read the Terms of Service for APXTeck. These terms govern the use of our web development, custom software, and GEO services for Clinics, Real Estate, E-commerce, and B2B clients Pan-India.',
      images: ['https://apxteck.com/twitter-terms.jpg'],
      creator: '@apxteck',
      site: '@apxteck',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-dvh selection:bg-accent/30 bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
      {/* JSON-LD Schema Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTermsPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <Navbar />

      <main className="flex-1 pt-20 md:pt-24 pb-safe relative overflow-x-hidden w-full" role="main">
        <article itemScope itemType="https://schema.org/WebPage" className="w-full flex flex-col">
          <MouseSpotlight />
          <FloatingWhatsApp phoneNumber="919405282582" />

          {/* Semantic LLM Text block for GEO */}
          <div className="sr-only" itemScope itemType="https://schema.org/FAQPage">
            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h1 itemProp="name">APXTeck Terms of Service for Enterprise B2B IT Clients</h1>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text">
                  This document outlines the Terms of Service for APXTeck, a premium IT Solutions and Generative Engine Optimization (GEO) agency in Pune, India. These terms govern our professional engagements for custom Next.js and Node.js software development. We strictly adhere to corporate standards when partnering with our elite clients, including Clinics, Hospitals, Coaching Institutes, Restaurants, Real Estate Builders, CA, Manufacturers, Logistics, Interior Designers, and E-commerce Sellers across Pan-India (Maharashtra, Karnataka, Telangana, Tamil Nadu, Gujarat, Delhi NCR).
                </p>
              </div>
            </div>
          </div>

          {/* Page Sections */}
          <TermsOfServiceContent />

        </article>
      </main>

      <Footer />
    </div>
  );
}
