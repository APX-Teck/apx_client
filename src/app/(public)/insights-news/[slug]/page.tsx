import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlogPostDetailClient } from '@/components/sections/BlogPostDetailClient';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { api } from '@/lib/axios';
import { BlogPost, BlogComment } from '@/app/types/blog.types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await api.fetchBlogs();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [
      { slug: 'future-web-development-2026' },
      { slug: 'nextjs-animations-framer-motion' },
      { slug: 'seo-evolution-ai-search-engines' },
    ];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await api.fetchBlogBySlug(slug);
    if (!post) return { title: 'Blog Not Found' };

    const fallbackDescription = `Read our latest deep dive into ${post.title}. Discover expert insights on web development, SEO strategies, and technical architectures for your next IT project.`;
    const description = post.excerpt || fallbackDescription;

    return {
      title: `${post.title} | APXTeck`,
      description: description,
      openGraph: {
        title: `${post.title} | APXTeck`,
        description: description,
        url: `https://apxteck.com/insights-news/${slug}`,
        siteName: 'APXTeck',
        type: 'article',
        locale: 'en_IN',
        publishedTime: post.publishedAt || undefined,
        images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${post.title} | APXTeck`,
        description: description,
        creator: '@apxteck',
        site: '@apxteck',
        images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
      },
      alternates: {
        canonical: `https://apxteck.com/insights-news/${slug}`,
        languages: {
          'en-US': `https://apxteck.com/insights-news/${slug}`,
          'en-IN': `https://apxteck.com/en-in/insights-news/${slug}`,
        },
      },
    };
  } catch {
    return {
      title: 'Blog Details | APXTeck',
    };
  }
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;

  let blogs: BlogPost[] = [];
  try {
    blogs = await api.fetchBlogs();
  } catch (err) {
    console.error('Failed to load server blogs', err);
  }

  const post = await api.fetchBlogBySlug(slug);
  if (!post) {
    notFound();
  }

  // Load related posts (same category tag, exclude current)
  const categoryTag = post.tags?.[0] || '';
  const relatedPosts = blogs
    .filter((b) => b.slug !== post.slug && b.tags?.includes(categoryTag))
    .slice(0, 3);

  // Load comments
  let comments: BlogComment[] = [];
  try {
    comments = await api.fetchBlogComments(post.slug);
  } catch {}

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `https://apxteck.com/insights-news/${post.slug}/#article`,
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author?.fullName || 'APXTeck Lead',
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://apxteck.com/#localbusiness',
      name: 'APXTeck',
      logo: {
        '@type': 'ImageObject',
        url: 'https://apxteck.com/logo.png',
      },
    },
    isPartOf: {
      '@id': 'https://apxteck.com/#website',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://apxteck.com/insights-news/${post.slug}`,
    },
  };

  return (
    <div className="flex flex-col min-h-dvh selection:bg-accent/30 bg-background text-foreground transition-colors duration-300 w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      <div className="notranslate" translate="no">
        <Navbar />
      </div>
      <div className="notranslate" translate="no">
        <LanguageSwitcher />
      </div>

      <main className="flex-1 pt-20 sm:pt-24 pb-20 pt-safe pb-safe w-full overflow-x-hidden">
        <BlogPostDetailClient post={post} relatedPosts={relatedPosts} initialComments={comments} />
      </main>

      <div className="notranslate w-full" translate="no">
        <Footer />
      </div>
    </div>
  );
}
