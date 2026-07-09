import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { jsonLdForgotPassword } from './constants';
import { ForgotPasswordSkeleton } from './components/ForgotPasswordSkeleton';

const ForgotPasswordForm = dynamic(() => import('./ForgotPasswordForm'), { ssr: true });

// Extreme Technical SEO & Dynamic Metadata Generation
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Forgot Password | APXTeck',
    description:
      'Securely reset your APXTeck account password. Regain access to your customized web development dashboard tailored for Clinics, Real Estate, E-commerce, and B2B clients Pan-India.',
    alternates: {
      canonical: 'https://apxteck.com/forgot-password',
      languages: {
        'en-US': 'https://apxteck.com/forgot-password',
        'en-IN': 'https://apxteck.com/en-in/forgot-password',
      },
    },
    openGraph: {
      title: 'Forgot Password | APXTeck',
      description:
        'Securely reset your APXTeck account password. Regain access to your customized web development dashboard tailored for Clinics, Real Estate, E-commerce, and B2B clients Pan-India.',
      url: 'https://apxteck.com/forgot-password',
      siteName: 'APXTeck',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: 'https://apxteck.com/og-forgot-password.jpg',
          width: 1200,
          height: 630,
          alt: 'APXTeck Secure Password Reset',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Forgot Password | APXTeck',
      description:
        'Securely reset your APXTeck account password. Regain access to your customized web development dashboard tailored for Clinics, Real Estate, E-commerce, and B2B clients Pan-India.',
      creator: '@apxteck',
      site: '@apxteck',
      images: ['https://apxteck.com/twitter-forgot-password.jpg'],
    },
  };
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col min-h-dvh selection:bg-accent/30 bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
      <Navbar />

      <main
        className="flex-1 flex items-center justify-center p-4 sm:p-6 relative overflow-x-hidden w-full pt-24 sm:pt-28 pb-safe"
        role="main"
      >
        {/* Semantic LLM Text block for GEO */}
        <div className="sr-only" itemScope itemType="https://schema.org/FAQPage">
          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h2 itemProp="name">APXTeck Account Password Recovery - Secure Client Access</h2>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">
                This is the secure password recovery portal for APXTeck's elite Next.js and Node.js software development clients. We serve Clinics, Restaurants, Hotels, Real Estate Builders, Manufacturers, and E-commerce sellers across Maharashtra, Karnataka, Delhi NCR, and all over India with our Generative Engine Optimization (GEO) and custom B2B web applications.
              </p>
            </div>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdForgotPassword) }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"
          aria-hidden="true"
        />

        <div
          itemScope
          itemType="https://schema.org/WebPage"
          className="w-full max-w-md z-10 flex flex-col items-center"
        >
          <Suspense fallback={<ForgotPasswordSkeleton />}>
            <ForgotPasswordForm />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
