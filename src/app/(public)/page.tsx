import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/HeroSection';
import { MouseSpotlight } from '@/components/ui/MouseSpotlight';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const TechStackMarquee = dynamic(() => import('@/components/sections/TechStackMarquee').then(mod => mod.TechStackMarquee), { ssr: true });
const ServicesSection = dynamic(() => import('@/components/sections/ServicesSection').then(mod => mod.ServicesSection), { ssr: true });
const WhyChooseUsSection = dynamic(() => import('@/components/sections/WhyChooseUsSection').then(mod => mod.WhyChooseUsSection), { ssr: true });
const ProcessSection = dynamic(() => import('@/components/sections/ProcessSection').then(mod => mod.ProcessSection), { ssr: true });
const StatsSection = dynamic(() => import('@/components/sections/StatsSection').then(mod => mod.StatsSection), { ssr: true });
const AdBanner = dynamic(() => import('@/components/ui/AdBanner').then(mod => mod.AdBanner), { ssr: true });
const PortfolioSection = dynamic(() => import('@/components/sections/PortfolioSection').then(mod => mod.PortfolioSection), { ssr: true });
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection').then(mod => mod.TestimonialsSection), { ssr: true });
const BlogPreviewSection = dynamic(() => import('@/components/sections/BlogPreviewSection').then(mod => mod.BlogPreviewSection), { ssr: true });
const FaqSection = dynamic(() => import('@/components/sections/FaqSection').then(mod => mod.FaqSection), { ssr: true });
const ContactCTASection = dynamic(() => import('@/components/sections/ContactCTASection').then(mod => mod.ContactCTASection), { ssr: true });

// Config page for Incremental Static Regeneration (ISR)
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'APXTECK — IT Services for Indian SMBs',
    description:
      'APXTeck provides premium IT services, Next.js web development, custom UI/UX, and search engine optimization custom tailored to scale Indian SMBs.',
    openGraph: {
      title: 'APXTECK — IT Services for Indian SMBs',
      description:
        'APXTeck provides premium IT services, Next.js web development, custom UI/UX, and search engine optimization custom tailored to scale Indian SMBs.',
      url: 'https://apxteck.com',
      siteName: 'APXTeck',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80',
          width: 1200,
          height: 630,
          alt: 'APXTECK - IT Services for Indian SMBs',
        },
      ],
      type: 'website',
    },
    alternates: {
      canonical: 'https://apxteck.com',
    },
  };
}

export default function Home() {
  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'APXTeck',
    url: 'https://apxteck.com',
    logo: 'https://apxteck.com/APXTeck.png',
    sameAs: ['https://twitter.com/apxteck', 'https://linkedin.com/company/apxteck'],
  };

  const jsonLdLocalBiz = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'APXTeck',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3',
    telephone: '+919405282582',
    email: 'info@apxteck.com',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Flat No. 24, 3rd Floor, Balaji Residency Dighe, Manaji Nagar, Narhe',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      postalCode: '411041',
      addressCountry: 'IN',
    },
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
      <MouseSpotlight />
      <FloatingWhatsApp phoneNumber="919405282582" />

      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBiz) }}
      />

      <Navbar />

      <main className="flex-1" role="main" itemScope itemType="https://schema.org/WebPage">
        <HeroSection />

        <TechStackMarquee />

        <ServicesSection />

        <WhyChooseUsSection />

        <ProcessSection />

        <StatsSection 
          stats={{
            clientsServed: 250,
            projectsCompleted: 340,
            satisfactionRate: 98,
            supportActive: '24/7'
          }} 
        />
        {/* Ad Placement Top */}
        <AdBanner placement="BLOG_LIST_TOP" />

        <PortfolioSection />

        <TestimonialsSection />

        {/* Ad Placement Mid */}
        <AdBanner placement="BLOG_LIST_MID" />

        <BlogPreviewSection />

        <FaqSection />

        <ContactCTASection />
      </main>

      <Footer />
    </div>
  );
}
