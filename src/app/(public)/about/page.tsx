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
      "Discover APXTeck's founding story, mission, and core values. Meet our elite in-house team of Next.js software engineers, designers, and SEO experts in Pune.",
    alternates: {
      canonical: 'https://apxteck.com/about',
      languages: {
        'en-US': 'https://apxteck.com/about',
        'en-IN': 'https://apxteck.com/en-in/about',
      },
    },
    openGraph: {
      title: 'About Our Story & Elite Team | APXTeck',
      description:
        "Discover APXTeck's founding story, mission, and core values. Meet our elite in-house team of Next.js software engineers, designers, and SEO experts in Pune.",
      url: 'https://apxteck.com/about',
      siteName: 'APX - Advanced Precision & Excellence',
      images: [
        {
          url: 'https://apxteck.com/og-about.jpg',
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
        "Discover APXTeck's founding story, mission, and core values. Meet our elite in-house team of Next.js software engineers, designers, and SEO experts in Pune.",
      images: ['https://apxteck.com/twitter-about.jpg'],
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
        '@id': 'https://apxteck.com/about/#webpage',
        url: 'https://apxteck.com/about',
        name: 'About Our Story & Elite Team | APXTeck',
        description:
          "Discover APXTeck's founding story, mission, and core values. Meet our elite in-house team of Next.js software engineers, designers, and SEO experts in Pune.",
        isPartOf: { '@id': 'https://apxteck.com/#website' },
        about: {
          '@id': 'https://apxteck.com/#organization',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://apxteck.com/#organization',
        name: 'APXTeck',
        url: 'https://apxteck.com',
        logo: 'https://apxteck.com/logo.png',
        image: 'https://apxteck.com/logo.png',
        description:
          'Elite web development, Next.js engineering, and technical SEO agency based in Pune, India.',
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
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi'],
        },
        sameAs: [
          'https://www.linkedin.com/company/apxteck',
          'https://twitter.com/apxteck',
          'https://www.facebook.com/apxteck',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://apxteck.com/about/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://apxteck.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About Us',
            item: 'https://apxteck.com/about',
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
          <AboutMissionVision />
          <AboutCulture />
          <AboutValues />

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
