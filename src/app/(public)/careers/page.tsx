import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// UI
import { MouseSpotlight } from '@/components/ui/MouseSpotlight';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

// JSON-LD
import { jsonLdBreadcrumb, jsonLdCareersPage, jsonLdJobPostings } from './constants';

// Sections
import { CareersHero } from '@/components/sections/careers/CareersHero';
import { CareersWhyJoinUs } from '@/components/sections/careers/CareersWhyJoinUs';
import { CareersJobList } from '@/components/sections/careers/CareersJobList';
import { CareersApplicationSection } from '@/components/sections/careers/CareersApplicationSection';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Careers at APXTeck | Join Our Elite Engineering Team',
    description:
      'Explore exciting career opportunities at APXTeck. We are hiring Next.js developers, backend engineers, and SEO specialists to build the future of software.',
    alternates: {
      canonical: 'https://apxteck.com/careers',
      languages: {
        'en-US': 'https://apxteck.com/careers',
        'en-IN': 'https://apxteck.com/en-in/careers',
      },
    },
    openGraph: {
      title: 'Careers at APXTeck | Join Our Elite Engineering Team',
      description:
        'Explore exciting career opportunities at APXTeck. We are hiring Next.js developers, backend engineers, and SEO specialists to build the future of software.',
      url: 'https://apxteck.com/careers',
      siteName: 'APX - Advanced Precision & Excellence',
      images: [
        {
          url: 'https://apxteck.com/og-careers.jpg',
          width: 1200,
          height: 630,
          alt: 'Join APXTeck Team',
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Careers at APXTeck | Join Our Elite Engineering Team',
      description:
        'Explore exciting career opportunities at APXTeck. We are hiring Next.js developers, backend engineers, and SEO specialists.',
      images: ['https://apxteck.com/twitter-careers.jpg'],
      creator: '@apxteck',
      site: '@apxteck',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-dvh selection:bg-accent/30 bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
      {/* JSON-LD Schema Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCareersPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {jsonLdJobPostings.map((job, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(job) }}
        />
      ))}

      <Navbar />

      <main className="flex-1 pt-20 md:pt-24 pb-safe relative overflow-x-hidden w-full" role="main">
        <article itemScope itemType="https://schema.org/WebPage" className="w-full flex flex-col">
          <MouseSpotlight />
          <FloatingWhatsApp phoneNumber="919405282582" />

          {/* Page Sections */}
          <CareersHero />
          <CareersWhyJoinUs />
          <CareersJobList />
          <CareersApplicationSection />

        </article>
      </main>

      <Footer />
    </div>
  );
}
