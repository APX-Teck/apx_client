import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// UI
import { MouseSpotlight } from '@/components/ui/MouseSpotlight';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

// JSON-LD
import { jsonLdBreadcrumb, jsonLdPrivacyPage } from './constants';

// Content
import { PrivacyPolicyContent } from '@/components/sections/privacy/PrivacyPolicyContent';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy | APXTeck',
    description:
      'Learn how APXTeck collects, uses, and protects your personal data. Read our comprehensive Privacy Policy.',
    alternates: {
      canonical: 'https://apxteck.com/privacy-policy',
      languages: {
        'en-US': 'https://apxteck.com/privacy-policy',
        'en-IN': 'https://apxteck.com/en-in/privacy-policy',
      },
    },
    openGraph: {
      title: 'Privacy Policy | APXTeck',
      description:
        'Learn how APXTeck collects, uses, and protects your personal data. Read our comprehensive Privacy Policy.',
      url: 'https://apxteck.com/privacy-policy',
      siteName: 'APX - Advanced Precision & Excellence',
      images: [
        {
          url: 'https://apxteck.com/og-privacy.jpg',
          width: 1200,
          height: 630,
          alt: 'APXTeck Privacy Policy',
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Privacy Policy | APXTeck',
      description:
        'Learn how APXTeck collects, uses, and protects your personal data. Read our comprehensive Privacy Policy.',
      images: ['https://apxteck.com/twitter-privacy.jpg'],
      creator: '@apxteck',
      site: '@apxteck',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-dvh selection:bg-accent/30 bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
      {/* JSON-LD Schema Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPrivacyPage) }}
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

          {/* Page Sections */}
          <PrivacyPolicyContent />

        </article>
      </main>

      <Footer />
    </div>
  );
}
