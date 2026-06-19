import { Metadata } from 'next';
import { Loader2, ShieldCheck } from 'lucide-react';
import GoogleAuthClient from './GoogleAuthClient';

// 1. Extreme Technical SEO & Dynamic Metadata Generation
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Google Authentication Success | APXTeck',
    description:
      'Successfully authenticated with Google. We are securely setting up your session and redirecting you to your personalized APXTeck web development dashboard.',
    robots: {
      index: false, // We do not index auth redirect pages
      follow: false,
    },
    alternates: {
      canonical: 'https://apxteck.com/auth/google/success',
      languages: {
        'en-US': 'https://apxteck.com/auth/google/success',
        'en-IN': 'https://apxteck.com/en-in/auth/google/success',
      },
    },
    openGraph: {
      title: 'Google Authentication Success | APXTeck',
      description:
        'Successfully authenticated with Google. We are securely setting up your session and redirecting you to your personalized APXTeck web development dashboard.',
      url: 'https://apxteck.com/auth/google/success',
      siteName: 'APXTeck',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: 'https://apxteck.com/og-google-auth.jpg',
          width: 1200,
          height: 630,
          alt: 'APXTeck Google Authentication Success',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Google Authentication Success | APXTeck',
      description:
        'Successfully authenticated with Google. We are securely setting up your session and redirecting you to your personalized APXTeck web development dashboard.',
      creator: '@apxteck',
      site: '@apxteck',
      images: ['https://apxteck.com/twitter-google-auth.jpg'],
    },
  };
}

// 2. Modular Architecture & Blazing Fast Rendering (Server Component Default)
export default function GoogleAuthSuccessPage() {
  // Inject accurate JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Google Authentication Success - APXTeck Secure Login',
    description:
      'Authentication redirect page for APXTeck. Securely processing your Google login to access premium IT and web development services.',
    url: 'https://apxteck.com/auth/google/success',
    publisher: {
      '@type': 'Organization',
      name: 'APXTeck',
      logo: 'https://apxteck.com/logo.png',
      url: 'https://apxteck.com',
    },
    isPartOf: { '@id': 'https://apxteck.com/#website' },
  };

  return (
    // Semantic HTML5: <main>
    <main
      className="flex flex-col min-h-dvh w-full overflow-hidden items-center justify-center bg-[#F8F9FA] dark:bg-[#0a0a0a] relative pt-safe pb-safe"
      role="main"
      aria-label="Google Authentication Success"
    >
      {/* Background Gradients globally for authentication section */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-indigo-500/10 blur-[100px] dark:bg-indigo-500/20 mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[4000ms]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-cyan-500/10 blur-[100px] dark:bg-cyan-500/20 mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[5000ms] delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-purple-500/10 blur-[100px] dark:bg-purple-500/20 mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[6000ms] delay-1000"></div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Semantic HTML5: <article> for the independent piece of UI */}
      <article
        className="relative z-10 flex flex-col items-center gap-6 p-8 sm:p-10 rounded-[2.5rem] bg-white/60 dark:bg-[#111111]/60 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.3)] max-w-md w-full mx-4 text-center overflow-hidden"
        itemScope
        itemType="https://schema.org/WebPage"
        aria-live="polite"
        aria-busy="true"
      >
        {/* Subtle top glare */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/20 to-transparent"></div>
        
        <div className="relative mt-2">
          <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/30 blur-xl rounded-full"></div>
          <div className="relative flex items-center justify-center w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-xl border border-white/20 z-10">
             <ShieldCheck className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          
          {/* Circular progress loader around the icon */}
          <svg className="absolute -inset-5 w-[120px] h-[120px] text-indigo-500/60 dark:text-indigo-400/60 animate-[spin_3s_linear_infinite] z-0" viewBox="0 0 100 100">
             <circle className="opacity-20" cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2.5" fill="none" />
             <circle className="opacity-80" cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2.5" fill="none" strokeDasharray="80 220" strokeLinecap="round" />
          </svg>
        </div>

        {/* Proper heading hierarchy (H1) */}
        <header className="flex flex-col gap-3 mt-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Authentication Successful
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-[15px] font-medium leading-relaxed max-w-[280px] mx-auto">
            Securely setting up your session. You will be redirected momentarily...
          </p>
        </header>
        
        <div className="flex items-center gap-2 mt-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20">
            <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Processing</span>
        </div>
      </article>

      {/* Logical Client Component extracted to minimize client bundle */}
      <GoogleAuthClient />
    </main>
  );
}
