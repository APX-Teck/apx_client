import { Metadata } from 'next';
import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import { VerifyEmailSkeleton } from './components/VerifyEmailSkeleton';

const VerifyEmailClient = dynamic(() => import('./VerifyEmailClient'), { ssr: true });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Verify Your Email | APXTeck',
    description: 'Securely verify your email address to unlock full access to APXTeck services. Completing verification ensures top-level security for your account.',
    robots: {
      index: false,
      follow: false, // Usually verification endpoints shouldn't be crawled by search engines.
    },
    alternates: {
      canonical: 'https://apxteck.com/verify-email',
    },
    openGraph: {
      title: 'Verify Your Email | APXTeck',
      description: 'Securely verify your email address to unlock full access to APXTeck services.',
      url: 'https://apxteck.com/verify-email',
      siteName: 'APXTeck',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Verify Your Email | APXTeck',
      description: 'Securely verify your email address to unlock full access to APXTeck.',
    },
  };
}

export default function VerifyEmailPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Verify Your Email - APXTeck',
    description: 'Email verification page for APXTeck to secure user accounts.',
    url: 'https://apxteck.com/verify-email',
    publisher: {
      '@type': 'Organization',
      name: 'APXTeck',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
        <Navbar />

        <main 
          className="flex-1 flex items-center justify-center p-6 relative overflow-hidden pt-28 pb-16"
          role="main"
          aria-labelledby="verify-email-heading"
        >
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" 
            aria-hidden="true" 
          />

          <div itemScope itemType="https://schema.org/WebPage" className="w-full max-w-md flex flex-col items-center">
            <Suspense fallback={<VerifyEmailSkeleton />}>
              <VerifyEmailClient />
            </Suspense>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
