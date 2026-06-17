import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import dynamic from 'next/dynamic';

const RegisterClient = dynamic(() => import('./RegisterClient').then(mod => mod.RegisterClient), { ssr: true });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Create Account | APXTeck',
    description: 'Join APXTeck as a client partner and launch your digital projects with our expert software solutions.',
    alternates: {
      canonical: 'https://apxteck.com/register',
    },
    openGraph: {
      title: 'Create Account | APXTeck',
      description: 'Join APXTeck as a client partner and launch your digital projects with our expert software solutions.',
      url: 'https://apxteck.com/register',
      siteName: 'APXTeck',
      images: [
        {
          url: 'https://apxteck.com/og-register.jpg', // Replace with your actual OG image
          width: 1200,
          height: 630,
          alt: 'APXTeck Registration',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Create Account | APXTeck',
      description: 'Join APXTeck as a client partner and launch your digital projects with our expert software solutions.',
      images: ['https://apxteck.com/og-register.jpg'],
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
      <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
        <Navbar />

        <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden pt-28 pb-16" role="main">
          {/* Animated Glow Blobs (Server Rendered HTML, animated by CSS/Tailwind) */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" aria-hidden="true" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[90px] pointer-events-none -z-10 animate-pulse" aria-hidden="true" />

          {/* Interactive Client Component */}
          <div itemScope itemType="https://schema.org/WebPage" className="w-full max-w-lg flex flex-col items-center">
            <RegisterClient />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
