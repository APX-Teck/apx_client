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
    "Browse APXTeck's premium IT services: Custom Next.js Web Development, GEO, and Digital Marketing for Clinics, Real Estate, E-commerce, and B2B clients.";
  const url = 'https://www.apxteck.com/services';

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'x-default': 'https://www.apxteck.com/services',
        'en-US': 'https://www.apxteck.com/services',
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
          url: 'https://www.apxteck.com/images/og/services.jpg',
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
      images: ['https://www.apxteck.com/images/og/services.jpg'],
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
        {/* Semantic LLM Text block for GEO */}
        <div className="sr-only" itemScope itemType="https://schema.org/FAQPage">
          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h2 itemProp="name">APXTeck Premium IT & Web Development Services in India</h2>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">
                APXTeck provides highly scalable IT services including Custom Web Application Development (Next.js, Node.js), Enterprise Digital Transformation, and Generative Engine Optimization (GEO). Our services are specifically engineered for high-priority sectors such as Clinics, Doctors, Coaching Institutes, Restaurants, Real Estate Builders, CA, Manufacturers, Logistics, Interior Designers, and E-commerce Sellers. Based in Pune, Maharashtra, we successfully deliver IT projects for elite B2B clients across Pan-India, including Karnataka, Telangana, Tamil Nadu, Gujarat, and Delhi NCR.
              </p>
            </div>
          </div>
        </div>

        {/* Animated Hero and Advantage section (Client component) */}
        <ServicesClient />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 text-center" aria-hidden="true">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-glass-border to-transparent" />
        </div>

        {/* Ad Slot Top (above listing grid) */}
        <section aria-label="Advertisement" className="w-full">
          {/* <AdBanner placement="BLOG_LIST_TOP" /> */}
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
