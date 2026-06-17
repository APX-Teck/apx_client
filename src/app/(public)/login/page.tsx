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
    title: 'Sign In | APXTeck',
    description: 'Log in to your APXTeck account to access your dashboard and manage your services.',
    alternates: {
      canonical: 'https://www.apxteck.com/login',
    },
    openGraph: {
      title: 'Sign In | APXTeck',
      description: 'Log in to your APXTeck account to access your dashboard and manage your services.',
      url: 'https://www.apxteck.com/login',
      siteName: 'APXTeck',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'APXTeck Login',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sign In | APXTeck',
      description: 'Log in to your APXTeck account to access your dashboard and manage your services.',
      images: ['/og-image.png'],
    },
  };
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-accent/20 selection:text-accent transition-colors duration-300">
      <Navbar />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden pt-28 pb-16" aria-labelledby="login-heading" role="main">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-accent/10 blur-[120px] dark:bg-accent/5"></div>
          <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-500/5"></div>
        </div>
        
        <div itemScope itemType="https://schema.org/WebPage" className="w-full max-w-md relative z-10 flex flex-col items-center">
          <Suspense fallback={<LoginSkeleton />}>
            <LoginClient />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
