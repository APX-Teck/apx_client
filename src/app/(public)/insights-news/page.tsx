import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdBanner } from '@/components/ui/AdBanner';
import { BlogListingSection } from '@/components/sections/BlogListingSection';
import { TechStackMarquee } from '@/components/sections/TechStackMarquee';
import { api } from '@/lib/axios';
import { BlogPost } from '@/app/types/blog.types';
import { ExploreNewsClient } from './ExploreNewsClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'IT Insights & News — APXTECK Blog',
  description:
    "Stay updated with APXTeck's technical news, Next.js optimization guides, UI/UX trends, and SEO tutorials built for Indian business owners.",
  openGraph: {
    title: 'IT Insights & News — APXTECK Blog',
    description:
      "Stay updated with APXTeck's technical news, Next.js optimization guides, UI/UX trends, and SEO tutorials built for Indian business owners.",
    url: 'https://apxteck.com/insights-news',
    siteName: 'APXTeck',
    type: 'website',
  },
  alternates: {
    canonical: 'https://apxteck.com/insights-news',
  },
};

export default async function BlogListingPage() {
  let initialBlogs: BlogPost[] = [];
  try {
    initialBlogs = await api.fetchBlogs();
  } catch (err) {
    console.error('Failed to load blogs for serverside render', err);
  }

  const jsonLdBlog = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'APXTeck Blog',
    description: 'IT Insights and updates for growing Indian businesses.',
    url: 'https://apxteck.com/insights-news',
    publisher: {
      '@type': 'Organization',
      name: 'APXTeck',
    },
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBlog) }}
      />

      <Navbar />

      <main className="flex-1 pt-24 pb-20 overflow-hidden">
        
        {/* Animated Hero and Knowledge Hub Focus (Client component) */}
        <ExploreNewsClient />

        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-glass-border to-transparent" />
        </div>

        {/* Ad Slot Top (Centered before Blog list) */}
        <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-center">
          <AdBanner placement="BLOG_LIST_TOP" />
        </div>

        {/* Client Side Blog Grid with debounced filters and pagination */}
        {/* (This component internally renders BLOG_LIST_MID ads) */}
        <BlogListingSection initialBlogs={initialBlogs} />

        {/* Ad Slot Bottom (After Blog list, before Marquee) */}
        <div className="max-w-7xl mx-auto px-6 mt-16 mb-8 flex justify-center">
          <AdBanner placement="BLOG_LIST_MID" />
        </div>

        {/* Tech Stack Marquee at the bottom */}
        <div className="mt-12">
          <TechStackMarquee />
        </div>
      </main>

      <Footer />
    </div>
  );
}
