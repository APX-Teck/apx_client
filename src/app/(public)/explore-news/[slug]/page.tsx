import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogPostDetailClient } from "@/components/sections/BlogPostDetailClient";
import { api } from "@/lib/axios";
import { BlogPost, BlogComment } from "@/app/types/blog.types";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await api.fetchBlogs();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [
      { slug: "future-web-development-2026" },
      { slug: "nextjs-animations-framer-motion" },
      { slug: "seo-evolution-ai-search-engines" },
    ];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blogs = await api.fetchBlogs();
    const post = blogs.find((b) => b.slug === slug);
    if (!post) return { title: "Blog Not Found" };

    return {
      title: `${post.title} — APXTECK`,
      description: post.excerpt || `Read our technical article: ${post.title}`,
      openGraph: {
        title: `${post.title} — APXTECK`,
        description: post.excerpt || `Read our technical article: ${post.title}`,
        url: `https://apxteck.com/explore-news/${slug}`,
        siteName: "APXTeck",
        type: "article",
        publishedTime: post.publishedAt || undefined,
        images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
      },
      alternates: {
        canonical: `https://apxteck.com/explore-news/${slug}`,
      },
    };
  } catch {
    return {
      title: "Blog Details — APXTeck",
    };
  }
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;

  let blogs: BlogPost[] = [];
  try {
    blogs = await api.fetchBlogs();
  } catch (err) {
    console.error("Failed to load server blogs", err);
  }

  const post = blogs.find((b) => b.slug === slug);
  if (!post) {
    notFound();
  }

  // Load related posts (same category tag, exclude current)
  const categoryTag = post.tags[0] || "";
  const relatedPosts = blogs
    .filter((b) => b.slug !== post.slug && b.tags.includes(categoryTag))
    .slice(0, 3);

  // Load comments
  let comments: BlogComment[] = [];
  try {
    comments = await api.fetchBlogComments(post.slug);
  } catch {}

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.coverImageUrl,
    "datePublished": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author?.fullName || "APXTeck Lead"
    },
    "publisher": {
      "@type": "Organization",
      "name": "APXTeck"
    }
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <BlogPostDetailClient
          post={post}
          relatedPosts={relatedPosts}
          initialComments={comments}
        />
      </main>

      <Footer />
    </div>
  );
}
