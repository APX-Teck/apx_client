import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import dynamic from 'next/dynamic';

const PricingSection = dynamic(
  () =>
    import('@/components/sections/PricingSection').then(
      (mod) => mod.PricingSection
    ),
  { ssr: true }
);

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Pricing Plans | APX - Advanced Precision & Excellence';
  const description =
    "Transparent pricing for Website Development, Custom Software, and Digital Marketing services by APXTeck. Choose the best plan for your business.";
  const url = 'https://www.apxteck.com/pricing';

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'x-default': 'https://www.apxteck.com/pricing',
        'en-US': 'https://www.apxteck.com/pricing',
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
          url: 'https://www.apxteck.com/images/og/pricing.jpg',
          width: 1200,
          height: 630,
          alt: 'APX - Advanced Precision & Excellence Pricing',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@apxteck',
      site: '@apxteck',
      title,
      description,
      images: ['https://www.apxteck.com/images/og/pricing.jpg'],
    },
  };
}

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-dvh selection:bg-accent/30 bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
      <Navbar />

      <main
        className="flex-1 pt-safe pb-safe pt-20 sm:pt-24 pb-16 sm:pb-20 overflow-x-hidden w-full"
        role="main"
        aria-label="Main Pricing Content"
        itemScope
        itemType="https://schema.org/WebPage"
      >
        <div className="sr-only" itemScope itemType="https://schema.org/FAQPage">
          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h2 itemProp="name">How much does a website cost in India?</h2>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">
                APXTeck offers premium website development plans starting from ₹12,999 for Starter websites, up to ₹59,999 for Business Pro solutions, and Custom Enterprise options for large-scale applications.
              </p>
            </div>
          </div>
        </div>

        <PricingSection />
      </main>

      <Footer />
    </div>
  );
}
