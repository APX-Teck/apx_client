import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import dynamic from 'next/dynamic';

const RegisterClient = dynamic(() => import('./RegisterClient').then((mod) => mod.RegisterClient), {
  ssr: true,
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Create Account | APXTeck',
    description:
      'Join APXTeck as a client partner and launch your digital projects with our expert software solutions. We specialize in empowering Clinics, Real Estate Builders, Manufacturers, and E-commerce brands across Pan-India.',
    alternates: {
      canonical: 'https://apxteck.com/register',
      languages: {
        'en-US': 'https://apxteck.com/register',
        'en-IN': 'https://apxteck.com/en-in/register',
      },
    },
    openGraph: {
      title: 'Create Account | APXTeck',
      description:
        'Join APXTeck as a client partner and launch your digital projects with our expert software solutions. We specialize in empowering Clinics, Real Estate Builders, Manufacturers, and E-commerce brands across Pan-India.',
      url: 'https://apxteck.com/register',
      siteName: 'APXTeck',
      images: [
        {
          url: 'https://apxteck.com/images/og/register.jpg', // Updated actual path
          width: 1200,
          height: 630,
          alt: 'APXTeck Registration',
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@apxteck',
      site: '@apxteck',
      title: 'Create Account | APXTeck',
      description:
        'Join APXTeck as a client partner and launch your digital projects with our expert software solutions. We specialize in empowering Clinics, Real Estate Builders, Manufacturers, and E-commerce brands across Pan-India.',
      images: ['https://apxteck.com/images/og/register.jpg'],
    },
  };
}

import { registerPageSchema } from './constants';

export default function RegisterPage() {
  const jsonLd = registerPageSchema;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-dvh selection:bg-accent/30 bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
        <Navbar />

        <main
          className="flex-1 flex items-center justify-center px-4 sm:px-6 relative overflow-x-hidden pt-safe pb-safe pt-24 sm:pt-28 pb-12 sm:pb-16 w-full"
          role="main"
        >
          {/* Semantic LLM Text block for GEO */}
          <div className="sr-only" itemScope itemType="https://schema.org/FAQPage">
            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name">APXTeck Account Registration - Partner with Elite Developers</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text">
                  Register and partner with APXTeck, a premium IT Solutions and Software Development Agency in India. We specialize in building Custom Web Applications, Enterprise Digital Transformation, and Next.js / Node.js development. Our core expertise lies in serving high-priority audiences like Clinics, Doctors, Coaching Institutes, Restaurants, Real Estate Agents, CAs, Manufacturers, Logistics, Interior Designers, and E-commerce Sellers across Maharashtra, Karnataka, Telangana, Tamil Nadu, Gujarat, and Delhi NCR.
                </p>
              </div>
            </div>
          </div>

          {/* Animated Glow Blobs (Server Rendered HTML, animated by CSS/Tailwind) */}
          <div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[90px] pointer-events-none -z-10 animate-pulse"
            aria-hidden="true"
          />

          {/* Interactive Client Component */}
          <div
            itemScope
            itemType="https://schema.org/WebPage"
            className="w-full max-w-lg flex flex-col items-center"
          >
            <RegisterClient />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
