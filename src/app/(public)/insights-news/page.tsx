import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdBanner } from '@/components/ui/AdBanner';
import { AvailableAdSlots } from '@/components/ui/AvailableAdSlots';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { jsonLdBlog, jsonLdBreadcrumb } from './constants';
import { BlogSectionLoader } from './components/BlogSectionLoader';
import { BlogSectionSkeleton } from './components/BlogSectionSkeleton';

const ExploreNewsClient = dynamic(
  () => import('./ExploreNewsClient').then((mod) => mod.ExploreNewsClient),
  { ssr: true }
);
const TechStackMarquee = dynamic(
  () => import('@/components/sections/TechStackMarquee').then((mod) => mod.TechStackMarquee),
  { ssr: true }
);

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'IT Insights & News | APX - Advanced Precision & Excellence Blog & Tutorials',
    description:
      "Stay updated with APXTeck's technical news, Next.js optimization guides, UI/UX trends, and SEO tutorials built for Indian business owners and startups.",
    keywords: [
      'IT insights',
      'Next.js tutorials',
      'SEO guides',
      'UI/UX trends',
      'APXTeck blog',
      'tech news India',
      'web development blog',
    ],
    authors: [{ name: 'APXTeck', url: 'https://apxteck.com' }],
    creator: 'APXTeck',
    publisher: 'APXTeck',
    openGraph: {
      title: 'IT Insights & News | APX - Advanced Precision & Excellence Blog & Tutorials',
      description:
        "Stay updated with APXTeck's technical news, Next.js optimization guides, UI/UX trends, and SEO tutorials built for Indian business owners and startups.",
      url: 'https://apxteck.com/insights-news',
      siteName: 'APX - Advanced Precision & Excellence',
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: 'https://apxteck.com/images/og/blog-insights.jpg',
          width: 1200,
          height: 630,
          alt: 'APXTeck IT Insights & News - Next.js, SEO, and UI/UX',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'IT Insights & News | APX - Advanced Precision & Excellence Blog',
      description:
        "Stay updated with APXTeck's technical news, Next.js optimization guides, and UI/UX trends.",
      creator: '@apxteck',
      site: '@apxteck',
      images: ['https://apxteck.com/images/og/blog-insights.jpg'],
    },
    alternates: {
      canonical: 'https://apxteck.com/insights-news',
      languages: {
        'en-US': 'https://apxteck.com/insights-news',
        'en-IN': 'https://apxteck.com/en-in/insights-news',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function BlogListingPage() {
  return (
    <div className="flex flex-col min-h-dvh selection:bg-accent/30 bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBlog) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <header className="notranslate" translate="no">
        <Navbar />
      </header>
      <div className="notranslate" translate="no" aria-label="Language Switcher">
        <LanguageSwitcher />
      </div>

      <main
        className="flex-1 pt-24 pb-20 overflow-x-hidden w-full pt-safe pb-safe"
        id="main-content"
        role="main"
        itemScope
        itemType="https://schema.org/Blog"
      >
        {/* Animated Hero and Knowledge Hub Focus (Client component) */}
        <article className="notranslate w-full" translate="no">
          <ExploreNewsClient />
        </article>

        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 text-center notranslate w-full"
          translate="no"
          aria-hidden="true"
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-glass-border to-transparent" />
        </div>

        {/* Ad Slot Top and Pricing (Stacked Horizontally) */}
        <aside
          className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 md:mb-12 flex flex-col items-center gap-6 md:gap-8 notranslate w-full"
          translate="no"
          aria-label="Top Advertisement"
        >
          <div className="w-full max-w-full overflow-hidden flex justify-center bg-foreground/[0.02] border border-glass-border rounded-2xl md:rounded-3xl p-4">
            <AdBanner placement="BLOG_LIST_TOP" />
          </div>
          <div className="w-full">
            <AvailableAdSlots layout="horizontal" />
          </div>
        </aside>

        {/* Client Side Blog Grid with debounced filters and pagination */}
        {/* (This component internally renders BLOG_LIST_MID ads) */}
        {/* WE WANT THIS TO BE TRANSLATABLE (partially) */}
        <section aria-label="Blog Posts List" className="w-full px-4 sm:px-0">
          <Suspense fallback={<BlogSectionSkeleton />}>
            <BlogSectionLoader />
          </Suspense>
        </section>

        {/* Ad Slot Bottom (After Blog list, before Marquee) */}
        <aside
          className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 md:mt-16 mb-8 flex justify-center notranslate w-full"
          translate="no"
          aria-label="Bottom Advertisement"
        >
          <AdBanner placement="BLOG_LIST_MID" />
        </aside>

        {/* Tech Stack Marquee at the bottom */}
        <section
          className="mt-8 md:mt-12 notranslate w-full"
          translate="no"
          aria-label="Our Technology Stack"
        >
          <TechStackMarquee />
        </section>
      </main>

      <footer className="notranslate w-full" translate="no">
        <Footer />
      </footer>
    </div>
  );
}
