import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StatsSection } from '@/components/sections/StatsSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { Suspense } from 'react';
import { api } from '@/lib/axios';

import dynamic from 'next/dynamic';

// Extracted granular Client Components lazily loaded to reduce initial bundle size
const AboutHero = dynamic(() => import('./components/AboutHero').then((mod) => mod.AboutHero), {
  ssr: true,
});
const AboutStory = dynamic(() => import('./components/AboutStory').then((mod) => mod.AboutStory), {
  ssr: true,
});
const AboutMissionVision = dynamic(
  () => import('./components/AboutMissionVision').then((mod) => mod.AboutMissionVision),
  { ssr: true }
);
const AboutCulture = dynamic(
  () => import('./components/AboutCulture').then((mod) => mod.AboutCulture),
  { ssr: true }
);
const AboutValues = dynamic(
  () => import('./components/AboutValues').then((mod) => mod.AboutValues),
  { ssr: true }
);
const AboutCTA = dynamic(() => import('./components/AboutCTA').then((mod) => mod.AboutCTA), {
  ssr: true,
});
const AboutExpertise = dynamic(
  () => import('./components/AboutExpertise').then((mod) => mod.AboutExpertise),
  { ssr: true }
);
const LeadershipSection = dynamic(
  () => import('./components/LeadershipSection').then((mod) => mod.LeadershipSection),
  { ssr: true }
);

// UI Components
import { MouseSpotlight } from '@/components/ui/MouseSpotlight';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

async function TeamSectionLoader() {
  try {
    const team = await api.fetchTeamMembers();
    return <TeamSection team={team} />;
  } catch (err) {
    console.error('Failed to fetch team members', err);
    return null;
  }
}

async function StatsSectionLoader() {
  try {
    const stats = await api.fetchStats();
    return <StatsSection stats={stats} />;
  } catch (err) {
    console.error('Failed to fetch platform stats', err);
    return null;
  }
}

// Extreme Technical SEO & Dynamic Metadata Generation
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About Our Story & Elite Team | APXTeck',
    description:
      "Discover APXTeck's founding story, mission, and core values. We are an elite Next.js software engineering and Technical SEO agency serving Clinics, Real Estate, E-commerce, and B2B clients Pan-India.",
    alternates: {
      canonical: 'https://www.apxteck.com/about',
      languages: {
        'en-US': 'https://www.apxteck.com/about',
      },
    },
    openGraph: {
      title: 'About Our Story & Elite Team | APXTeck',
      description:
        "Discover APXTeck's founding story, mission, and core values. We are an elite Next.js software engineering and Technical SEO agency serving Clinics, Real Estate, E-commerce, and B2B clients Pan-India.",
      url: 'https://www.apxteck.com/about',
      siteName: 'APX - Advanced Precision & Excellence',
      images: [
        {
          url: 'https://www.apxteck.com/og-about.jpg',
          width: 1200,
          height: 630,
          alt: 'APXTeck Elite Engineering Team and Mission',
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About Our Story & Elite Team | APXTeck',
      description:
        "Discover APXTeck's founding story, mission, and core values. We are an elite Next.js software engineering and Technical SEO agency serving Clinics, Real Estate, E-commerce, and B2B clients Pan-India.",
      images: ['https://www.apxteck.com/twitter-about.jpg'],
      creator: '@apxteck',
      site: '@apxteck',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function AboutPage() {
  // Inject comprehensive JSON-LD Structured Data
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://www.apxteck.com/about/#webpage',
        url: 'https://www.apxteck.com/about',
        name: 'About Our Story & Elite Team | APXTeck',
        description: "Discover APXTeck's story & core values. Meet our elite team of Next.js software engineers, designers, and SEO experts in Pune.",
        isPartOf: { '@id': 'https://www.apxteck.com/#website' },
        about: {
          '@id': 'https://www.apxteck.com/#organization',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.apxteck.com/#organization',
        name: 'APXTeck',
        url: 'https://www.apxteck.com',
        logo: 'https://www.apxteck.com/logo.png',
        image: 'https://www.apxteck.com/logo.png',
        description:
          'APXTeck is an elite Next.js software development and Technical SEO agency serving Clinics, Restaurants, Real Estate Builders, CA, Manufacturers, E-commerce sellers, and Startups across India.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Pune IT Park',
          addressLocality: 'Pune',
          addressRegion: 'Maharashtra',
          postalCode: '411001',
          addressCountry: 'IN',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-9405282582',
          contactType: 'customer service',
          areaServed: ['India', 'Maharashtra', 'Karnataka', 'Delhi NCR', 'Gujarat', 'Tamil Nadu', 'Telangana'],
          availableLanguage: ['English', 'Hindi', 'Marathi'],
        },
        sameAs: [
          'https://www.linkedin.com/company/apxteck',
          'https://twitter.com/apxteck',
          'https://www.facebook.com/apxteck',
        ],
        knowsAbout: [
          'Enterprise Digital Transformation',
          'Software Development',
          'Generative Engine Optimization (GEO)',
          'Next.js',
          'Node.js',
          'B2B Software Solutions',
          'E-commerce Platforms'
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.apxteck.com/about/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.apxteck.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About Us',
            item: 'https://www.apxteck.com/about',
          },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-dvh selection:bg-accent/30 bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      <Navbar />

      <main className="flex-1 pt-20 md:pt-24 pb-safe relative overflow-x-hidden w-full" role="main">
        <article itemScope itemType="https://schema.org/AboutPage" className="w-full flex flex-col">
          <MouseSpotlight />
          <FloatingWhatsApp phoneNumber="919405282582" />

          {/* Separated components for granular client-side rendering */}
          <AboutHero />
          <AboutStory />
          <AboutExpertise />
          <AboutMissionVision />
          <AboutCulture />
          <AboutValues />
          <LeadershipSection />

          {/* Dynamic Sections (API Fetched with Streaming Suspense) */}
          <Suspense fallback={<div className="h-[500px] w-full animate-pulse bg-foreground/5" />}>
            <TeamSectionLoader />
          </Suspense>

          <Suspense fallback={<div className="h-[400px] w-full animate-pulse bg-foreground/5" />}>
            <StatsSectionLoader />
          </Suspense>

          <AboutCTA />
        </article>
      </main>

      <Footer />
    </div>
  );
}
