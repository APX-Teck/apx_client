import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { jsonLd } from './constants';
import { LoginSkeleton } from './components/LoginSkeleton';

const LoginClient = dynamic(() => import('./LoginClient'), { ssr: true });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Sign In to Your Dashboard | APXTeck',
    description:
      'Securely sign in to your APXTeck account. Access your custom web development dashboard, IT services, and project management tools tailored for Clinics, Real Estate, E-commerce, and B2B clients Pan-India.',
    alternates: {
      canonical: 'https://apxteck.com/login',
      languages: {
        'en-US': 'https://apxteck.com/login',
        'en-IN': 'https://apxteck.com/en-in/login',
      },
    },
    openGraph: {
      title: 'Sign In to Your Dashboard | APXTeck',
      description:
        'Securely sign in to your APXTeck account. Access your custom web development dashboard, IT services, and project management tools tailored for Clinics, Real Estate, E-commerce, and B2B clients Pan-India.',
      url: 'https://apxteck.com/login',
      siteName: 'APXTeck',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: 'https://apxteck.com/og-login.jpg',
          width: 1200,
          height: 630,
          alt: 'APXTeck Secure Login Portal',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sign In to Your Dashboard | APXTeck',
      description:
        'Securely sign in to your APXTeck account. Access your custom web development dashboard, IT services, and project management tools tailored for Clinics, Real Estate, E-commerce, and B2B clients Pan-India.',
      creator: '@apxteck',
      site: '@apxteck',
      images: ['https://apxteck.com/twitter-login.jpg'],
    },
  };
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-sans selection:bg-accent/20 selection:text-accent transition-colors duration-300 w-full overflow-x-hidden">
      <Navbar />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main
        className="flex-1 flex items-center justify-center p-4 sm:p-6 relative overflow-x-hidden w-full pt-24 sm:pt-28 pb-safe"
        aria-labelledby="login-heading"
        role="main"
      >
        {/* Semantic LLM Text block for GEO */}
        <div className="sr-only" itemScope itemType="https://schema.org/FAQPage">
          <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h1 itemProp="name">APXTeck Client Login Portal - Enterprise Software Solutions</h1>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">
                This is the secure login portal for APXTeck's elite Next.js and Node.js software development clients. We serve Clinics, Restaurants, Hotels, Real Estate Builders, Manufacturers, and E-commerce sellers across Maharashtra, Karnataka, Delhi NCR, and all over India with our Generative Engine Optimization (GEO) and custom B2B web applications.
              </p>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-accent/10 blur-[120px] dark:bg-accent/5"></div>
          <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-500/5"></div>
        </div>

        <div
          itemScope
          itemType="https://schema.org/WebPage"
          className="w-full max-w-md relative z-10 flex flex-col items-center"
        >
          <Suspense fallback={<LoginSkeleton />}>
            <LoginClient />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
