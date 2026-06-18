import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import { AdBanner } from '@/components/ui/AdBanner';
import { api } from '@/lib/axios';
import { Service } from '@/app/types/service.types';

const ServicesClient = dynamic(() => import('./ServicesClient').then((mod) => mod.ServicesClient), {
  ssr: true,
});
const ServicesListingSection = dynamic(
  () =>
    import('@/components/sections/ServicesListingSection').then(
      (mod) => mod.ServicesListingSection
    ),
  { ssr: true }
);
const TechStackMarquee = dynamic(
  () => import('@/components/sections/TechStackMarquee').then((mod) => mod.TechStackMarquee),
  { ssr: true }
);

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const title = 'IT Services for SMBs | APX - Advanced Precision & Excellence';
  const description =
    "Browse APXTeck's premium IT services: Next.js Web Development, UI/UX Design, SEO Optimization, and Digital Marketing tailored to scale Indian SMBs.";
  const url = 'https://apxteck.com/services';

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en-US': url,
        'en-IN': url.replace('apxteck.com', 'apxteck.com/en-in'),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'APX - Advanced Precision & Excellence',
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: 'https://apxteck.com/images/og/services.jpg',
          width: 1200,
          height: 630,
          alt: 'APX - Advanced Precision & Excellence IT Services',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@apxteck',
      site: '@apxteck',
      title,
      description,
      images: ['https://apxteck.com/images/og/services.jpg'],
    },
  };
}

// Next.js static slug path generator
export async function generateStaticParams() {
  try {
    const services = await api.fetchServices();
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [
      { slug: 'web-development' },
      { slug: 'seo-optimization' },
      { slug: 'ui-ux-design' },
      { slug: 'digital-marketing' },
    ];
  }
}

import { getServicesPageSchema } from './constants';

export default async function ServicesListingPage() {
  // Fetch services serverside to inject structured service schema
  let services: Service[] = [];
  try {
    services = await api.fetchServices();
  } catch (err) {
    console.error('Failed to load services in server page', err);
  }

  const jsonLdServiceSchema = getServicesPageSchema(services);

  return (
    <div className="flex flex-col min-h-dvh selection:bg-accent/30 bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdServiceSchema) }}
      />

      <Navbar />

      <main
        className="flex-1 pt-safe pb-safe pt-20 sm:pt-24 pb-16 sm:pb-20 overflow-x-hidden w-full"
        role="main"
        aria-label="Main Services Content"
        itemScope
        itemType="https://schema.org/WebPage"
      >
        {/* Animated Hero and Advantage section (Client component) */}
        <ServicesClient />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 text-center" aria-hidden="true">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-glass-border to-transparent" />
        </div>

        {/* Ad Slot Top (above listing grid) */}
        <section aria-label="Advertisement" className="w-full">
          <AdBanner placement="BLOG_LIST_TOP" />
        </section>

        {/* Dynamic Service Grid Section (Client component but data passed from server) */}
        <ServicesListingSection initialServices={services} />

        {/* Tech Stack Marquee at the bottom */}
        <section aria-label="Technologies we use" className="mt-16 sm:mt-20">
          <TechStackMarquee />
        </section>
      </main>

      <Footer />
    </div>
  );
}
