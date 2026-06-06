import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdBanner } from "@/components/ui/AdBanner";
import { BlogListingSection } from "@/components/sections/BlogListingSection";
import { api } from "@/lib/axios";
import { BlogPost } from "@/app/types/blog.types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "IT Insights & News — APXTECK Blog",
  description: "Stay updated with APXTeck's technical news, Next.js optimization guides, UI/UX trends, and SEO tutorials built for Indian business owners.",
  openGraph: {
    title: "IT Insights & News — APXTECK Blog",
    description: "Stay updated with APXTeck's technical news, Next.js optimization guides, UI/UX trends, and SEO tutorials built for Indian business owners.",
    url: "https://apxteck.com/explore-news",
    siteName: "APXTeck",
    type: "website",
  },
  alternates: {
    canonical: "https://apxteck.com/explore-news",
  },
};

export default async function BlogListingPage() {
  let initialBlogs: BlogPost[] = [];
  try {
    initialBlogs = await api.fetchBlogs();
  } catch (err) {
    console.error("Failed to load blogs for serverside render", err);
  }

  const jsonLdBlog = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "APXTeck Blog",
    "description": "IT Insights and updates for growing Indian businesses.",
    "url": "https://apxteck.com/explore-news",
    "publisher": {
      "@type": "Organization",
      "name": "APXTeck"
    }
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBlog) }}
      />

      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        
        {/* Page Hero */}
        <section className="relative py-16 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-background -z-10" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-4">
            <div className="flex justify-center items-center gap-2 text-xs text-foreground/50 font-medium">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground/80">Explore News</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Explore News & Insights</h1>
            <p className="text-foreground/70 max-w-2xl mx-auto text-base">
              Articles and guidelines to help you build modern designs, scale system code, and rank high.
            </p>
          </div>
        </section>

        {/* Ad Slot Top */}
        <AdBanner placement="BLOG_LIST_TOP" />

        {/* Client Side Blog Grid with debounced filters and pagination */}
        <BlogListingSection initialBlogs={initialBlogs} />

      </main>

      <Footer />
    </div>
  );
}

import Link from "next/link";
