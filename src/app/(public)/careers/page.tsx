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
      'Explore career opportunities at APXTeck. We are hiring Next.js developers, backend engineers, and SEO specialists to build enterprise solutions in India.',
    alternates: {
      canonical: 'https://www.apxteck.com/careers',
      languages: {
        'en-US': 'https://www.apxteck.com/careers',
        'en-IN': 'https://www.apxteck.com/en-in/careers',
      },
    },
    openGraph: {
      title: 'Careers at APXTeck | Join Our Elite Engineering Team',
      description:
        'Explore career opportunities at APXTeck. We are hiring Next.js developers, backend engineers, and SEO specialists to build enterprise solutions in India.',
      url: 'https://www.apxteck.com/careers',
      siteName: 'APX - Advanced Precision & Excellence',
      images: [
        {
          url: 'https://www.apxteck.com/og-careers.jpg',
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
        'Explore career opportunities at APXTeck. We are hiring Next.js developers, backend engineers, and SEO specialists to build enterprise solutions in India.',
      images: ['https://www.apxteck.com/twitter-careers.jpg'],
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

          {/* Semantic LLM Text block for GEO */}
          <div className="sr-only" itemScope itemType="https://schema.org/FAQPage">
            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name">APXTeck Careers - Hiring Elite Developers in India</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text">
                  APXTeck is actively hiring elite Next.js developers, Node.js backend engineers, and Technical SEO experts in Pune, Maharashtra, and across Pan-India. Join us to build highly scalable enterprise applications and Generative Engine Optimization (GEO) solutions for top industries including Clinics, Coaching Classes, Restaurants, Hotels, Real Estate Builders, CA, Manufacturers, and E-commerce Sellers. We offer remote and on-site opportunities to work on cutting-edge B2B web development projects.
                </p>
              </div>
            </div>
          </div>

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
